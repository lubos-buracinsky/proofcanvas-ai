import { useState, useEffect } from 'react'
import { BLOCKS } from '../../utils/canvasHelpers'
import { komfiCanvasBlocks, komfiCompanyMeta, komfiCompanyProfile, komfiStrategyTimeline, canvasConfidence } from '../../data/komfiCanvasData'
import { chipClasses, scoreTone, barTone, formatDate, CitationLinks } from './mockupUtils'

function useBreakpoint() {
  const [bp, setBp] = useState('lg')
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp(w < 640 ? 'sm' : w < 1024 ? 'md' : 'lg')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

const BLOCK_LABELS = {
  problem: 'Problem',
  'existing-alternatives': 'Existing Alternatives',
  solution: 'Solution',
  'key-metrics': 'Key Metrics',
  'unique-value': 'Unique Value Proposition',
  'unfair-advantage': 'Unfair Advantage',
  channels: 'Channels',
  'customer-segments': 'Customer Segments',
  'early-adopters': 'Early Adopters',
  'cost-structure': 'Cost Structure',
  'revenue-streams': 'Revenue Streams',
  'ai-lever': 'AI Lever Analysis',
  'expansion-triggers': 'Expansion Triggers',
  'evidence-gap': 'Evidence Gap Index',
}

const SUB_TABS = [
  { id: 'canvas', label: 'Business Canvas' },
  { id: 'analysis', label: 'Analysis' },
]

const TABLET_POSITIONS = {
  problem: { gridColumn: '1 / 3', gridRow: '1 / 2' },
  'customer-segments': { gridColumn: '3 / 5', gridRow: '1 / 2' },
  solution: { gridColumn: '1 / 3', gridRow: '2 / 3' },
  channels: { gridColumn: '3 / 5', gridRow: '2 / 3' },
  'unique-value': { gridColumn: '1 / 3', gridRow: '3 / 4' },
  'unfair-advantage': { gridColumn: '3 / 5', gridRow: '3 / 4' },
  'key-metrics': { gridColumn: '1 / 3', gridRow: '4 / 5' },
  'cost-structure': { gridColumn: '3 / 5', gridRow: '4 / 5' },
  'revenue-streams': { gridColumn: '1 / 5', gridRow: '5 / 6' },
  'ai-lever': { gridColumn: '1 / 3', gridRow: '6 / 7' },
  'expansion-triggers': { gridColumn: '3 / 5', gridRow: '6 / 7' },
  'evidence-gap': { gridColumn: '1 / 5', gridRow: '7 / 8' },
}

// ProofLoop proprietary blocks (below the standard canvas)
const PROOFLOOP_BLOCKS = [
  { id: 'ai-lever', color: '#0ea5e9', gridColumn: '1 / 4', gridRow: '4 / 5' },
  { id: 'expansion-triggers', color: '#a855f7', gridColumn: '4 / 8', gridRow: '4 / 5' },
  { id: 'evidence-gap', color: '#f43f5e', gridColumn: '8 / 11', gridRow: '4 / 5' },
]

/* ─── Company Summary ─── */
function CompanySummary() {
  const p = komfiCompanyProfile
  return (
    <div className="mb-6 rounded-2xl border border-[#d1d5db] bg-white p-5 shadow-sm">
      {/* Top row: logo + name + scores */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">K</div>
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">{komfiCompanyMeta.name}</h3>
            <p className="max-w-md text-[11px] leading-relaxed text-[#6b7280]">{komfiCompanyMeta.thesis}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">ProofScore</p>
            <p className={`text-xl font-bold ${scoreTone(komfiCompanyMeta.proofScore)}`}>{komfiCompanyMeta.proofScore}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b7280]">Evidence Gap</p>
            <p className="text-xl font-bold text-amber-600">{komfiCompanyMeta.evidenceGap}%</p>
          </div>
        </div>
      </div>

      {/* VC params grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[#e5e7eb] pt-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['Stage', p.stage],
          ['Funding', p.funding],
          ['Founded', p.founded],
          ['Location', p.location],
          ['Team', p.teamSize],
          ['Model', p.model],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#9ca3af]">{label}</p>
            <p className="text-xs font-medium text-[#111827]">{value}</p>
          </div>
        ))}
      </div>

      {/* Market */}
      <div className="mt-4 border-t border-[#e5e7eb] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">Market / TAM</p>
        <p className="mt-1 text-xs text-[#374151]">{p.tam}</p>
      </div>

      {/* Team — inside the same card */}
      <div className="mt-4 border-t border-[#e5e7eb] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">Core Team · {p.teamSize}</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {p.team.map((m) => (
            <details key={m.name} className="group rounded-xl border border-[#e5e7eb] bg-[#fafafa] transition-colors open:bg-white open:shadow-sm">
              <summary className="flex cursor-pointer items-start gap-3 p-3 [&::-webkit-details-marker]:hidden">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: m.color, color: m.textColor }}
                >
                  {m.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#111827]">{m.name}</p>
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#9ca3af] hover:text-[#6b7280]"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-[10px] font-medium text-[#6b7280]">{m.role}</p>
                  <p className="mt-1 text-[10px] leading-snug text-[#4b5563]">{m.bio}</p>
                </div>
                <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-[#d1d5db] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-[#e5e7eb] px-3 pb-3 pt-2">
                <p className="text-[10px] leading-relaxed text-[#374151]">{m.bioFull}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Canvas sub-tab ─── */
function BusinessCanvas() {
  const bp = useBreakpoint()

  const gridStyle =
    bp === 'sm'
      ? { gridTemplateColumns: '1fr', gridTemplateRows: 'auto' }
      : bp === 'md'
        ? { gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto' }
        : {
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'minmax(120px, 1fr) minmax(120px, 1fr) minmax(90px, auto) minmax(100px, auto)',
          }

  function CanvasCard({ id, color, pos, isProofLoop }) {
    const items = komfiCanvasBlocks[id] || []
    const conf = canvasConfidence[id]
    const label = BLOCK_LABELS[id] || id

    // Check if this block has a subsection (standard lean canvas blocks)
    const parentBlock = BLOCKS.find((b) => b.id === id)
    const subItems = parentBlock?.subsection ? komfiCanvasBlocks[parentBlock.subsection.id] || [] : []

    return (
      <div
        className="relative rounded-lg border border-[#e5e7eb] bg-white p-2.5"
        style={{ ...pos, borderTopWidth: '3px', borderTopColor: color }}
      >
        <div className="flex items-start justify-between gap-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
            {isProofLoop && <span className="mr-1 text-[8px] font-bold text-[#9ca3af]">PL</span>}
            {label}
          </p>
          {conf && (
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${conf >= 70 ? 'bg-emerald-100 text-emerald-700' : conf >= 55 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
              {conf}%
            </span>
          )}
        </div>
        <ul className="mt-1.5 space-y-0.5">
          {items.map((item) => (
            <li key={item} className="text-[10px] leading-snug text-[#374151]">• {item}</li>
          ))}
        </ul>
        {subItems.length > 0 && (
          <div className="mt-2 border-t border-dashed border-[#e5e7eb] pt-1.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af]">
              {BLOCK_LABELS[parentBlock.subsection.id] || parentBlock.subsection.id}
            </p>
            <ul className="mt-0.5 space-y-0.5">
              {subItems.map((item) => (
                <li key={item} className="text-[10px] leading-snug text-[#6b7280]">• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <CompanySummary />

      {/* Lean Canvas grid */}
      <div className="grid gap-1.5" style={gridStyle}>
        {BLOCKS.map((block) => {
          const pos =
            bp === 'sm'
              ? { gridColumn: '1 / -1', gridRow: 'auto' }
              : bp === 'md'
                ? TABLET_POSITIONS[block.id] || { gridColumn: 'auto', gridRow: 'auto' }
                : { gridColumn: block.gridColumn, gridRow: block.gridRow }

          return <CanvasCard key={block.id} id={block.id} color={block.color} pos={pos} />
        })}

        {/* ProofLoop proprietary blocks (row 4) */}
        {PROOFLOOP_BLOCKS.map((block) => {
          const pos =
            bp === 'sm'
              ? { gridColumn: '1 / -1', gridRow: 'auto' }
              : bp === 'md'
                ? TABLET_POSITIONS[block.id] || { gridColumn: '1 / 5', gridRow: 'auto' }
                : { gridColumn: block.gridColumn, gridRow: block.gridRow }

          return <CanvasCard key={block.id} id={block.id} color={block.color} pos={pos} isProofLoop />
        })}
      </div>

      {/* ProofLoop label */}
      <p className="mt-2 text-right text-[9px] uppercase tracking-[0.14em] text-[#9ca3af]">
        PL = ProofLoop proprietary dimensions
      </p>

      {/* Strategy timeline */}
      <div className="mt-6 rounded-xl border border-[#d1d5db] bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Strategy Timeline</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          {komfiStrategyTimeline.map((step, idx) => (
            <div key={step.act} className="relative flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step.status === 'active'
                      ? 'bg-black text-white'
                      : step.status === 'next'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">{step.act}</p>
                  <p className="text-sm font-semibold text-[#111827]">{step.title}</p>
                </div>
              </div>
              <p className="mt-2 pl-10 text-xs text-[#6b7280]">{step.description}</p>
              {idx < komfiStrategyTimeline.length - 1 && (
                <div className="absolute left-4 top-9 hidden h-full w-px border-l border-dashed border-[#d1d5db] sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Analysis sub-tab ─── */
function AnalysisView({ snapshot, sourceMap }) {
  const riskRows = snapshot.riskDecomposition || []
  const ledgerRows = snapshot.hypothesisLedger || []
  const sprintSteps = snapshot.validation72h || []
  const aiLeverRows = snapshot.aiLeverAnalysis || []
  const expansionRows = snapshot.expansionTriggers || []
  const criticalRisks = riskRows.filter((r) => (r.score || 0) < 60).length

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Summary Metrics ── */}
      <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Confidence Overview</p>
        <h4 className="mt-1 font-serif text-2xl text-black">Summary Metrics</h4>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4b5563]">
          {snapshot.proofScore?.summary}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-black p-4 text-center text-white">
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/70">ProofScore</p>
            <p className="mt-1 text-3xl font-bold">{snapshot.proofScore?.score}</p>
            <p className="text-[10px] text-white/60">Confidence {snapshot.proofScore?.confidence}%</p>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">Evidence Gap</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{snapshot.evidenceGapIndex?.percent}%</p>
            <p className="text-[10px] text-[#9ca3af]">Confidence {snapshot.evidenceGapIndex?.confidence}%</p>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">Critical Risks</p>
            <p className={`mt-1 text-3xl font-bold ${criticalRisks > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{criticalRisks}</p>
            <p className="text-[10px] text-[#9ca3af]">of {riskRows.length} dimensions</p>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">Recommendation</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-[#111827]">{snapshot.vcMemo?.recommendation?.split(':')[0] || 'Proceed'}</p>
          </div>
        </div>

        <CitationLinks citations={snapshot.proofScore?.citations} sourceMap={sourceMap} />
      </article>

      {/* ── 2. Risk Dimensions (expandable) ── */}
      <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Risk Decomposition</p>
        <h4 className="mt-1 font-serif text-2xl text-black">6 Risk Dimensions</h4>
        <p className="mt-2 text-sm text-[#4b5563]">
          Each dimension is scored 0–100 based on evidence strength. Expand any dimension to see the detailed assessment, confidence level, and source citations.
        </p>

        <div className="mt-5 space-y-3">
          {riskRows.map((row) => (
            <details key={row.category} className="group rounded-xl border border-[#e5e7eb] transition-colors open:border-[#d1d5db] open:shadow-sm">
              <summary className="flex cursor-pointer items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${barTone(row.score)}`}>
                  {row.score}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#111827]">{row.category}</p>
                    <span className="text-[10px] text-[#9ca3af]">Conf {row.confidence}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div className={`h-full rounded-full ${barTone(row.score)}`} style={{ width: `${row.score}%` }} />
                  </div>
                </div>
                <svg className="h-4 w-4 shrink-0 text-[#9ca3af] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-[#e5e7eb] px-4 pb-4 pt-3">
                <p className="text-sm leading-relaxed text-[#374151]">{row.note}</p>
                <CitationLinks citations={row.citations} sourceMap={sourceMap} />
              </div>
            </details>
          ))}
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ── 3. Hypothesis Tracker (expandable) ── */}
        <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Hypothesis Tracker</p>
          <h4 className="mt-1 font-serif text-xl text-black">Validation Status</h4>
          <p className="mt-2 text-sm text-[#4b5563]">
            Core claims that need to hold true for the business to succeed. Each hypothesis has a defined test method and success signal.
          </p>
          <div className="mt-4 space-y-2">
            {ledgerRows.map((row) => (
              <details key={row.claim} className="group rounded-xl border border-[#e5e7eb] transition-colors open:border-[#d1d5db] open:shadow-sm">
                <summary className="flex cursor-pointer items-start justify-between gap-2 p-3 [&::-webkit-details-marker]:hidden">
                  <div className="flex-1">
                    <p className="text-xs font-medium leading-snug text-[#111827]">{row.claim}</p>
                    <p className="mt-1 text-[10px] text-[#9ca3af]">{row.owner} · Conf {row.confidence}%</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${chipClasses(row.status)}`}>
                      {row.status}
                    </span>
                    <svg className="h-3.5 w-3.5 text-[#9ca3af] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="space-y-2 border-t border-[#e5e7eb] px-3 pb-3 pt-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">Test method</p>
                    <p className="mt-0.5 text-xs text-[#374151]">{row.test}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280]">Success signal</p>
                    <p className="mt-0.5 text-xs text-[#374151]">{row.signal}</p>
                  </div>
                  <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                </div>
              </details>
            ))}
          </div>
        </article>

        {/* ── 4. Validation Sprint ── */}
        <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Validation Sprint</p>
          <h4 className="mt-1 font-serif text-xl text-black">72-Hour Sprint Design</h4>
          <p className="mt-2 text-sm text-[#4b5563]">
            A rapid validation sequence to test the most critical assumptions before committing further resources. Each step builds on the previous one.
          </p>
          <div className="mt-4 space-y-4">
            {sprintSteps.map((step, idx) => (
              <div key={`${step.title}-${idx}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {idx + 1}
                  </div>
                  {idx < sprintSteps.length - 1 && <div className="mt-1 flex-1 w-px border-l border-dashed border-[#d1d5db]" />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-semibold text-[#111827]">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4b5563]">{step.detail}</p>
                  <p className="mt-1.5 text-[10px] text-[#9ca3af]">Confidence {step.confidence}%</p>
                  <CitationLinks citations={step.citations} sourceMap={sourceMap} />
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* ── 5. AI Lever Assessment (expandable) ── */}
        <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">AI Lever Assessment</p>
          <h4 className="mt-1 font-serif text-xl text-black">AI Integration Points</h4>
          <p className="mt-2 text-sm text-[#4b5563]">
            Where AI can accelerate or derisk the business. Positive levers boost efficiency; neutral items require careful governance.
          </p>
          <div className="mt-4 space-y-2">
            {aiLeverRows.map((row) => (
              <details key={row.label} className="group rounded-xl border border-[#e5e7eb] transition-colors open:border-[#d1d5db] open:shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        row.tone === 'positive' ? 'bg-emerald-500' : row.tone === 'negative' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                    <p className="text-xs font-medium text-[#111827]">{row.label}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold ${row.tone === 'positive' ? 'text-emerald-700' : row.tone === 'negative' ? 'text-rose-700' : 'text-amber-700'}`}>
                      {row.tone}
                    </span>
                    <svg className="h-3.5 w-3.5 text-[#9ca3af] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="border-t border-[#e5e7eb] px-3 pb-3 pt-2">
                  <p className="text-xs leading-relaxed text-[#374151]">{row.value}</p>
                  <p className="mt-1.5 text-[10px] text-[#9ca3af]">Confidence {row.confidence}%</p>
                  <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                </div>
              </details>
            ))}
          </div>
        </article>

        {/* ── 6. Expansion Triggers ── */}
        <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Expansion Triggers</p>
          <h4 className="mt-1 font-serif text-xl text-black">Checkpoint Board</h4>
          <p className="mt-2 text-sm text-[#4b5563]">
            Key milestones that gate the transition to the next growth phase. Blocked triggers need resolution before scaling.
          </p>
          <div className="mt-4 space-y-2">
            {expansionRows.map((row) => (
              <div key={row.trigger} className="rounded-lg border border-[#e5e7eb] p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${
                      row.status === 'ready' ? 'bg-emerald-500' : row.status === 'blocked' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    <p className="text-xs font-medium text-[#111827]">{row.trigger}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${chipClasses(row.status)}`}>
                    {row.status}
                  </span>
                </div>
                <p className="mt-1.5 pl-4 text-[10px] text-[#9ca3af]">Confidence {row.confidence}%</p>
                <CitationLinks citations={row.citations} sourceMap={sourceMap} />
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

/* ─── Main V1 view ─── */
export default function V1DashboardView({ snapshot, sourceMap }) {
  const [subTab, setSubTab] = useState('canvas')

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab bar */}
      <div className="flex gap-1 border-b border-[#e5e7eb]">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
              subTab === tab.id
                ? 'border-b-2 border-black text-black'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'canvas' && <BusinessCanvas />}
      {subTab === 'analysis' && <AnalysisView snapshot={snapshot} sourceMap={sourceMap} />}
    </div>
  )
}
