import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { Client as NotionClient } from '@notionhq/client'
import Anthropic from '@anthropic-ai/sdk'
import { SNAPSHOT_STALE_DAYS, clampNumber, normalizePercentageRows, validateSnapshot } from './snapshot-schema.mjs'

const ROOT = process.cwd()
const CONFIG_PATH = path.join(ROOT, 'config', 'komfi-notion-sources.json')
const OUTPUT_SNAPSHOT_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.generated.json')
const OUTPUT_SOURCES_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.sources.json')
const OUTPUT_META_PATH = path.join(ROOT, 'src', 'data', 'komfiSnapshot.meta.json')

function fail(message) {
  throw new Error(message)
}

function getEnv(name) {
  const value = process.env[name]
  if (!value || !value.trim()) {
    fail(`Missing required env var: ${name}`)
  }
  return value.trim()
}

function getRichText(blockData) {
  if (!blockData || !Array.isArray(blockData.rich_text)) return ''
  return blockData.rich_text.map((part) => part?.plain_text || '').join('').trim()
}

function blockLine(block) {
  const type = block.type
  const data = block[type]

  if (type === 'table_row') {
    const cells = (data?.cells || []).map((cell) => cell.map((part) => part?.plain_text || '').join('').trim())
    const text = cells.filter(Boolean).join(' | ').trim()
    return text ? `- ${text}` : ''
  }

  const text = getRichText(data)
  if (!text) {
    if (type === 'child_page' && data?.title) return `# ${data.title}`
    if (type === 'child_database' && data?.title) return `# ${data.title}`
    return ''
  }

  if (type === 'heading_1') return `# ${text}`
  if (type === 'heading_2') return `## ${text}`
  if (type === 'heading_3') return `### ${text}`
  if (type === 'bulleted_list_item') return `- ${text}`
  if (type === 'numbered_list_item') return `1. ${text}`
  if (type === 'to_do') return `- [ ] ${text}`
  if (type === 'quote') return `> ${text}`
  if (type === 'callout') return `Callout: ${text}`
  if (type === 'code') return `Code: ${text}`
  return text
}

async function readChildrenRecursive(notion, blockId, depth = 0, maxDepth = 6) {
  const lines = []
  let cursor

  do {
    const resp = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of resp.results) {
      const line = blockLine(block)
      if (line) lines.push(line)

      if (block.has_children && depth < maxDepth) {
        const nested = await readChildrenRecursive(notion, block.id, depth + 1, maxDepth)
        if (nested) lines.push(nested)
      }
    }

    cursor = resp.has_more ? resp.next_cursor : undefined
  } while (cursor)

  return lines.join('\n').trim()
}

function extractTitle(page, fallback) {
  const props = page?.properties || {}
  for (const value of Object.values(props)) {
    if (value?.type === 'title') {
      const title = (value.title || []).map((part) => part?.plain_text || '').join('').trim()
      if (title) return title
    }
  }
  return fallback
}

function extractFreshness(page, propertyName) {
  const prop = page?.properties?.[propertyName]
  if (!prop) return 'unknown'

  if (prop.type === 'select') return prop.select?.name?.toLowerCase() || 'unknown'
  if (prop.type === 'status') return prop.status?.name?.toLowerCase() || 'unknown'
  if (prop.type === 'rich_text') return (prop.rich_text || []).map((part) => part?.plain_text || '').join('').toLowerCase() || 'unknown'
  if (prop.type === 'formula') {
    const formula = prop.formula
    if (!formula) return 'unknown'
    if (formula.type === 'string') return (formula.string || '').toLowerCase() || 'unknown'
  }

  return 'unknown'
}

function freshnessToScore(freshness) {
  const value = (freshness || '').toLowerCase()
  if (value.includes('verified')) return 90
  if (value.includes('aktivní') || value.includes('active')) return 82
  if (value.includes('expired') || value.includes('stale')) return 46
  return 64
}

function ageToScore(lastEdited) {
  const ts = Date.parse(lastEdited)
  if (Number.isNaN(ts)) return 55
  const ageDays = Math.max(0, (Date.now() - ts) / (1000 * 60 * 60 * 24))
  if (ageDays <= 7) return 92
  if (ageDays <= 30) return 82
  if (ageDays <= 90) return 70
  if (ageDays <= 180) return 58
  return 46
}

function baseConfidence(source) {
  const freshnessScore = freshnessToScore(source.freshness)
  const ageScore = ageToScore(source.lastEdited)
  return Math.round(freshnessScore * 0.58 + ageScore * 0.42)
}

function extractFacts(source) {
  const lines = source.content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 28)

  const facts = []
  for (const line of lines) {
    if (!/[0-9]/.test(line) && !/(cíl|target|expanze|priorit|pilot|retence|členství|trh)/i.test(line)) {
      continue
    }

    facts.push({
      id: `${source.id}-f${facts.length + 1}`,
      sourceId: source.id,
      claim: line.slice(0, 400),
      hasNumericSignal: /[0-9]/.test(line),
    })

    if (facts.length >= 25) break
  }

  return facts
}

function normalizeCitations(citations, validSourceIds, fallbackId) {
  const set = new Set(
    (Array.isArray(citations) ? citations : [])
      .filter((id) => typeof id === 'string' && validSourceIds.includes(id))
      .map((id) => id.trim())
  )

  if (set.size === 0) set.add(fallbackId)
  return Array.from(set).slice(0, 3)
}

function citationsConfidence(citations, sourceMap, fallback = 62) {
  const vals = (citations || [])
    .map((id) => sourceMap.get(id)?.baseConfidence)
    .filter((value) => Number.isFinite(value))

  if (!vals.length) return fallback
  return Math.round(vals.reduce((acc, value) => acc + value, 0) / vals.length)
}

function normalizeLedgerStatus(status) {
  const s = String(status || '').trim().toLowerCase()
  if (s.includes('valid')) return 'Validated'
  if (s.includes('risk')) return 'Risky'
  if (s.includes('plan')) return 'Planned'
  if (s.includes('progress') || s.includes('valida')) return 'In validation'
  return 'Planned'
}

function normalizeTriggerStatus(status) {
  const s = String(status || '').trim().toLowerCase()
  if (s.includes('ready') || s.includes('done')) return 'ready'
  if (s.includes('block')) return 'blocked'
  return 'tracking'
}

function normalizeTone(tone) {
  const s = String(tone || '').trim().toLowerCase()
  if (s.includes('neg')) return 'negative'
  if (s.includes('neu')) return 'neutral'
  return 'positive'
}

function parseJsonStrict(text) {
  if (!text || !text.trim()) fail('AI response is empty.')

  try {
    return JSON.parse(text)
  } catch {
    // Continue.
  }

  const fenced = text.match(/```json\s*([\s\S]*?)```/i)
  if (fenced) {
    try {
      return JSON.parse(fenced[1])
    } catch {
      // Continue.
    }
  }

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) {
    const candidate = text.slice(start, end + 1)
    return JSON.parse(candidate)
  }

  fail('Unable to parse AI response as JSON.')
}

function buildPrompt(payload) {
  return `Analyze Komfi startup documents and produce a venture-style intelligence snapshot.

Rules:
- Use ONLY the provided Notion-derived payload.
- Do not invent external data.
- Every claim row must include citations with existing source IDs.
- Return strict JSON only (no markdown).
- Scores are 0-100 integers.
- Risk categories MUST be exactly: Demand Risk, Monetization Risk, Distribution Risk, Execution Risk, AI Fragility Risk, Regulatory Risk.

Target JSON shape:
{
  "companyProfile": {"name":"Komfi","thesis":"...","strategicGoal":"..."},
  "proofScore": {"score": 0, "summary":"...", "citations":["source-id"]},
  "evidenceGapIndex": {"percent": 0, "summary":"...", "citations":["source-id"]},
  "riskDecomposition": [{"category":"Demand Risk","score":0,"note":"...","citations":["source-id"]}],
  "hypothesisLedger": [{"claim":"...","test":"...","signal":"...","owner":"...","status":"In validation|Risky|Planned|Validated","citations":["source-id"]}],
  "validation72h": [{"title":"Asset|Traffic|Threshold|Decision","detail":"...","citations":["source-id"]}],
  "aiLeverAnalysis": [{"label":"...","value":"...","tone":"positive|neutral|negative","citations":["source-id"]}],
  "expansionTriggers": [{"trigger":"...","status":"tracking|ready|blocked","citations":["source-id"]}],
  "portfolioDashboard": {
    "riskDistribution": [{"label":"Demand","value":0}],
    "historicalComparison": [{"deal":"...","proofScore":0,"evidenceGap":0,"recommendation":"...","citations":["source-id"]}]
  },
  "vcMemo": {"title":"...","recommendation":"...","bullets":["..."],"citations":["source-id"]},
  "apiProjection": {
    "deal_id":"komfi_preview_001",
    "proofscore":0,
    "evidence_gap_index":0,
    "risk_ledger":{"demand":0,"monetization":0,"distribution":0},
    "validation_72h":{"asset":"...","threshold":"...","decision":"..."}
  }
}

Input payload JSON:
${JSON.stringify(payload)}`
}

async function run() {
  const notionApiKey = getEnv('NOTION_API_KEY')
  const anthropicApiKey = getEnv('ANTHROPIC_API_KEY')

  const configRaw = await fs.readFile(CONFIG_PATH, 'utf8')
  const config = JSON.parse(configRaw)

  if (!Array.isArray(config.sources) || config.sources.length === 0) {
    fail('No sources configured in config/komfi-notion-sources.json')
  }

  const notion = new NotionClient({ auth: notionApiKey })
  const anthropic = new Anthropic({ apiKey: anthropicApiKey })

  const sourceRecords = await Promise.all(
    config.sources.map(async (sourceDef) => {
      const page = await notion.pages.retrieve({ page_id: sourceDef.pageId })
      const title = extractTitle(page, sourceDef.title)
      const freshness = extractFreshness(page, config.freshnessProperty)
      const content = await readChildrenRecursive(notion, sourceDef.pageId)

      return {
        id: sourceDef.id,
        pageId: sourceDef.pageId,
        title,
        url: sourceDef.url,
        mode: config.mode,
        freshness,
        lastEdited: page.last_edited_time,
        content: content.slice(0, 18000),
      }
    })
  )

  const sourcesWithConfidence = sourceRecords.map((source) => ({
    ...source,
    baseConfidence: baseConfidence(source),
  }))

  const facts = sourcesWithConfidence.flatMap((source) => extractFacts(source))

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceMode: config.mode,
    sourceCount: sourcesWithConfidence.length,
    sources: sourcesWithConfidence.map((source) => ({
      id: source.id,
      title: source.title,
      url: source.url,
      freshness: source.freshness,
      lastEdited: source.lastEdited,
      baseConfidence: source.baseConfidence,
      contentExcerpt: source.content.slice(0, 7000),
      topFacts: facts
        .filter((fact) => fact.sourceId === source.id)
        .slice(0, 10)
        .map((fact) => fact.claim),
    })),
  }

  const prompt = buildPrompt(payload)
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'
  const aiResponse = await anthropic.messages.create({
    model,
    max_tokens: 4200,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = aiResponse.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')

  const parsed = parseJsonStrict(rawText)

  const validSourceIds = sourcesWithConfidence.map((source) => source.id)
  const fallbackSourceId = validSourceIds[0]
  const sourceMap = new Map(sourcesWithConfidence.map((source) => [source.id, source]))

  const riskRows = (Array.isArray(parsed.riskDecomposition) ? parsed.riskDecomposition : []).slice(0, 6)
  const normalizedRiskRows = riskRows.map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      category: String(row.category || '').trim(),
      score: Math.round(clampNumber(row.score, 0, 100, 50)),
      confidence: citationsConfidence(citations, sourceMap),
      note: String(row.note || '').trim() || 'No detail provided.',
      citations,
    }
  })
  if (!normalizedRiskRows.length) {
    const fallbackCategories = [
      'Demand Risk',
      'Monetization Risk',
      'Distribution Risk',
      'Execution Risk',
      'AI Fragility Risk',
      'Regulatory Risk',
    ]
    for (const category of fallbackCategories) {
      normalizedRiskRows.push({
        category,
        score: 50,
        confidence: citationsConfidence([fallbackSourceId], sourceMap),
        note: 'Fallback row generated because AI output was incomplete.',
        citations: [fallbackSourceId],
      })
    }
  }

  const normalizedLedger = (Array.isArray(parsed.hypothesisLedger) ? parsed.hypothesisLedger : []).slice(0, 6).map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      claim: String(row.claim || '').trim(),
      test: String(row.test || '').trim(),
      signal: String(row.signal || '').trim(),
      owner: String(row.owner || '').trim() || 'Komfi team',
      status: normalizeLedgerStatus(row.status),
      confidence: citationsConfidence(citations, sourceMap),
      citations,
    }
  })
  if (!normalizedLedger.length) {
    normalizedLedger.push({
      claim: 'Core growth assumptions are not yet fully evidenced.',
      test: 'Run pilot-level validation loops with explicit conversion checkpoints.',
      signal: 'Sustained conversion and retention in two consecutive cohorts.',
      owner: 'Komfi team',
      status: 'Planned',
      confidence: citationsConfidence([fallbackSourceId], sourceMap),
      citations: [fallbackSourceId],
    })
  }

  const normalized72h = (Array.isArray(parsed.validation72h) ? parsed.validation72h : []).slice(0, 4).map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      title: String(row.title || '').trim(),
      detail: String(row.detail || '').trim(),
      confidence: citationsConfidence(citations, sourceMap),
      citations,
    }
  })
  if (!normalized72h.length) {
    normalized72h.push(
      {
        title: 'Asset',
        detail: 'Pilot readiness brief with quantified assumptions.',
        confidence: citationsConfidence([fallbackSourceId], sourceMap),
        citations: [fallbackSourceId],
      },
      {
        title: 'Traffic',
        detail: 'Targeted outreach to highest-priority prospects.',
        confidence: citationsConfidence([fallbackSourceId], sourceMap),
        citations: [fallbackSourceId],
      },
      {
        title: 'Threshold',
        detail: 'Minimum qualified response benchmark to continue.',
        confidence: citationsConfidence([fallbackSourceId], sourceMap),
        citations: [fallbackSourceId],
      },
      {
        title: 'Decision',
        detail: 'Scale or iterate based on measured signal quality.',
        confidence: citationsConfidence([fallbackSourceId], sourceMap),
        citations: [fallbackSourceId],
      }
    )
  }

  const normalizedAiLever = (Array.isArray(parsed.aiLeverAnalysis) ? parsed.aiLeverAnalysis : []).slice(0, 6).map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      label: String(row.label || '').trim(),
      value: String(row.value || '').trim(),
      tone: normalizeTone(row.tone),
      confidence: citationsConfidence(citations, sourceMap),
      citations,
    }
  })
  if (!normalizedAiLever.length) {
    normalizedAiLever.push({
      label: 'AI leverage',
      value: 'Potential efficiency gain identified; validation required.',
      tone: 'neutral',
      confidence: citationsConfidence([fallbackSourceId], sourceMap),
      citations: [fallbackSourceId],
    })
  }

  const normalizedTriggers = (Array.isArray(parsed.expansionTriggers) ? parsed.expansionTriggers : []).slice(0, 6).map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      trigger: String(row.trigger || '').trim(),
      status: normalizeTriggerStatus(row.status),
      confidence: citationsConfidence(citations, sourceMap),
      citations,
    }
  })
  if (!normalizedTriggers.length) {
    normalizedTriggers.push({
      trigger: 'Primary growth trigger under monitoring',
      status: 'tracking',
      confidence: citationsConfidence([fallbackSourceId], sourceMap),
      citations: [fallbackSourceId],
    })
  }

  const riskDistributionRaw = (parsed.portfolioDashboard?.riskDistribution || []).map((row) => ({
    label: String(row.label || '').trim(),
    value: Number(row.value) || 0,
  }))

  const normalizedRiskDistribution = normalizePercentageRows(riskDistributionRaw).map((row) => ({
    ...row,
    value: Math.round(clampNumber(row.value, 0, 100, 0)),
  }))
  if (!normalizedRiskDistribution.length) {
    for (const row of normalizePercentageRows(
      normalizedRiskRows.map((risk) => ({
        label: risk.category.replace(' Risk', ''),
        value: 1,
      }))
    )) {
      normalizedRiskDistribution.push(row)
    }
  }

  const normalizedComparison = (parsed.portfolioDashboard?.historicalComparison || []).slice(0, 6).map((row) => {
    const citations = normalizeCitations(row.citations, validSourceIds, fallbackSourceId)
    return {
      deal: String(row.deal || '').trim(),
      proofScore: Math.round(clampNumber(row.proofScore, 0, 100, 50)),
      evidenceGap: Math.round(clampNumber(row.evidenceGap, 0, 100, 50)),
      recommendation: String(row.recommendation || '').trim() || 'No recommendation provided.',
      confidence: citationsConfidence(citations, sourceMap),
      citations,
    }
  })
  if (!normalizedComparison.length) {
    normalizedComparison.push({
      deal: 'Komfi / current snapshot',
      proofScore: 50,
      evidenceGap: 50,
      recommendation: 'Collect more evidence before scaling this stream.',
      confidence: citationsConfidence([fallbackSourceId], sourceMap),
      citations: [fallbackSourceId],
    })
  }

  const proofCitations = normalizeCitations(parsed.proofScore?.citations, validSourceIds, fallbackSourceId)
  const evidenceCitations = normalizeCitations(parsed.evidenceGapIndex?.citations, validSourceIds, fallbackSourceId)
  const memoCitations = normalizeCitations(parsed.vcMemo?.citations, validSourceIds, fallbackSourceId)

  const snapshot = {
    versionTag: 'v0.9 Preview',
    generatedAt: new Date().toISOString(),
    snapshotDaysValid: SNAPSHOT_STALE_DAYS,
    sourceMode: config.mode,
    companyProfile: {
      name: String(parsed.companyProfile?.name || 'Komfi').trim(),
      thesis: String(parsed.companyProfile?.thesis || '').trim(),
      strategicGoal: String(parsed.companyProfile?.strategicGoal || '').trim(),
    },
    proofScore: {
      score: Math.round(clampNumber(parsed.proofScore?.score, 0, 100, 50)),
      confidence: citationsConfidence(proofCitations, sourceMap),
      summary: String(parsed.proofScore?.summary || '').trim(),
      citations: proofCitations,
    },
    evidenceGapIndex: {
      percent: Math.round(clampNumber(parsed.evidenceGapIndex?.percent, 0, 100, 50)),
      confidence: citationsConfidence(evidenceCitations, sourceMap),
      summary: String(parsed.evidenceGapIndex?.summary || '').trim(),
      citations: evidenceCitations,
    },
    riskDecomposition: normalizedRiskRows,
    hypothesisLedger: normalizedLedger,
    validation72h: normalized72h,
    aiLeverAnalysis: normalizedAiLever,
    expansionTriggers: normalizedTriggers,
    portfolioDashboard: {
      riskDistribution: normalizedRiskDistribution,
      historicalComparison: normalizedComparison,
    },
    vcMemo: {
      title: String(parsed.vcMemo?.title || '').trim(),
      recommendation: String(parsed.vcMemo?.recommendation || '').trim(),
      bullets: Array.isArray(parsed.vcMemo?.bullets)
        ? parsed.vcMemo.bullets.map((bullet) => String(bullet || '').trim()).filter(Boolean).slice(0, 8)
        : [],
      confidence: citationsConfidence(memoCitations, sourceMap),
      citations: memoCitations,
    },
    apiProjection: {
      deal_id: String(parsed.apiProjection?.deal_id || 'komfi_preview_001').trim(),
      proofscore: Math.round(clampNumber(parsed.apiProjection?.proofscore, 0, 100, 50)),
      evidence_gap_index: Math.round(clampNumber(parsed.apiProjection?.evidence_gap_index, 0, 100, 50)),
      risk_ledger: {
        demand: Number(parsed.apiProjection?.risk_ledger?.demand) || 0,
        monetization: Number(parsed.apiProjection?.risk_ledger?.monetization) || 0,
        distribution: Number(parsed.apiProjection?.risk_ledger?.distribution) || 0,
      },
      validation_72h: {
        asset: String(parsed.apiProjection?.validation_72h?.asset || '').trim(),
        threshold: String(parsed.apiProjection?.validation_72h?.threshold || '').trim(),
        decision: String(parsed.apiProjection?.validation_72h?.decision || '').trim(),
      },
    },
    sourceSummary: {
      totalSources: sourcesWithConfidence.length,
      staleSources: sourcesWithConfidence.filter((source) => source.freshness.includes('expired') || source.freshness.includes('stale')).length,
      averageBaseConfidence: Math.round(
        sourcesWithConfidence.reduce((acc, source) => acc + source.baseConfidence, 0) / Math.max(1, sourcesWithConfidence.length)
      ),
    },
  }

  const schemaResult = validateSnapshot(snapshot, validSourceIds)
  if (!schemaResult.valid) {
    fail(`Snapshot schema validation failed:\n${schemaResult.errors.join('\n')}`)
  }

  const sourcesPayload = {
    generatedAt: snapshot.generatedAt,
    sourceMode: config.mode,
    sources: sourcesWithConfidence.map((source) => ({
      id: source.id,
      pageId: source.pageId,
      title: source.title,
      url: source.url,
      freshness: source.freshness,
      lastEdited: source.lastEdited,
      baseConfidence: source.baseConfidence,
      excerpt: source.content.slice(0, 450),
    })),
    facts: facts.slice(0, 120),
  }

  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(snapshot))
    .update(JSON.stringify(sourcesPayload))
    .digest('hex')

  const meta = {
    generatedAt: snapshot.generatedAt,
    versionTag: snapshot.versionTag,
    sourceMode: config.mode,
    sourceCount: sourcesWithConfidence.length,
    staleAfterDays: SNAPSHOT_STALE_DAYS,
    checksum,
  }

  await fs.mkdir(path.dirname(OUTPUT_SNAPSHOT_PATH), { recursive: true })
  await fs.writeFile(OUTPUT_SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  await fs.writeFile(OUTPUT_SOURCES_PATH, `${JSON.stringify(sourcesPayload, null, 2)}\n`, 'utf8')
  await fs.writeFile(OUTPUT_META_PATH, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')

  console.log(`Komfi snapshot generated successfully.`)
  console.log(`Sources: ${sourcesWithConfidence.length}`)
  console.log(`Snapshot: ${OUTPUT_SNAPSHOT_PATH}`)
  console.log(`Sources: ${OUTPUT_SOURCES_PATH}`)
  console.log(`Meta: ${OUTPUT_META_PATH}`)
}

run().catch((err) => {
  console.error('Failed to generate Komfi snapshot:')
  console.error(err.message)
  process.exit(1)
})
