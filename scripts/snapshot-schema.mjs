export const SNAPSHOT_STALE_DAYS = 14

const VALID_LEDGER_STATUS = new Set(['In validation', 'Risky', 'Planned', 'Validated'])
const VALID_TRIGGER_STATUS = new Set(['tracking', 'ready', 'blocked'])
const VALID_TONE = new Set(['positive', 'neutral', 'negative'])

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function clampNumber(value, min, max, fallback = min) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  if (n < min) return min
  if (n > max) return max
  return n
}

export function normalizePercentageRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []
  const positives = rows.map((row) => ({
    ...row,
    value: Math.max(0, Number(row.value) || 0),
  }))
  const sum = positives.reduce((acc, row) => acc + row.value, 0)
  if (sum <= 0) {
    const equal = Math.floor(100 / positives.length)
    return positives.map((row, index) => ({
      ...row,
      value: index === positives.length - 1 ? 100 - equal * (positives.length - 1) : equal,
    }))
  }
  const normalized = positives.map((row) => ({
    ...row,
    value: Math.round((row.value / sum) * 100),
  }))
  const normalizedSum = normalized.reduce((acc, row) => acc + row.value, 0)
  const delta = 100 - normalizedSum
  if (delta !== 0 && normalized.length > 0) {
    normalized[0].value += delta
  }
  return normalized
}

export function validateSnapshot(snapshot, sourceIds = []) {
  const errors = []
  const sourceIdSet = new Set(sourceIds)

  if (!isObject(snapshot)) {
    return { valid: false, errors: ['Snapshot must be an object.'] }
  }

  const requiredTopLevel = [
    'versionTag',
    'generatedAt',
    'snapshotDaysValid',
    'companyProfile',
    'proofScore',
    'evidenceGapIndex',
    'riskDecomposition',
    'hypothesisLedger',
    'validation72h',
    'aiLeverAnalysis',
    'expansionTriggers',
    'portfolioDashboard',
    'vcMemo',
    'apiProjection',
  ]

  for (const key of requiredTopLevel) {
    if (!(key in snapshot)) {
      errors.push(`Missing required top-level field: ${key}`)
    }
  }

  if (!isString(snapshot.versionTag)) {
    errors.push('versionTag must be a non-empty string.')
  }

  if (!isString(snapshot.generatedAt) || Number.isNaN(Date.parse(snapshot.generatedAt))) {
    errors.push('generatedAt must be a valid ISO date string.')
  }

  if (!isNumber(snapshot.snapshotDaysValid)) {
    errors.push('snapshotDaysValid must be a number.')
  }

  if (!isObject(snapshot.companyProfile)) {
    errors.push('companyProfile must be an object.')
  }

  if (!isObject(snapshot.proofScore) || !isNumber(snapshot.proofScore.score)) {
    errors.push('proofScore.score must be a number.')
  }

  if (!isObject(snapshot.evidenceGapIndex) || !isNumber(snapshot.evidenceGapIndex.percent)) {
    errors.push('evidenceGapIndex.percent must be a number.')
  }

  if (!Array.isArray(snapshot.riskDecomposition) || snapshot.riskDecomposition.length === 0) {
    errors.push('riskDecomposition must be a non-empty array.')
  } else {
    snapshot.riskDecomposition.forEach((row, idx) => {
      if (!isString(row.category)) errors.push(`riskDecomposition[${idx}].category must be a string.`)
      if (!isNumber(row.score)) errors.push(`riskDecomposition[${idx}].score must be a number.`)
      if (!isNumber(row.confidence)) errors.push(`riskDecomposition[${idx}].confidence must be a number.`)
      if (!Array.isArray(row.citations) || row.citations.length === 0) {
        errors.push(`riskDecomposition[${idx}].citations must be a non-empty array.`)
      }
    })
  }

  if (!Array.isArray(snapshot.hypothesisLedger) || snapshot.hypothesisLedger.length === 0) {
    errors.push('hypothesisLedger must be a non-empty array.')
  } else {
    snapshot.hypothesisLedger.forEach((row, idx) => {
      if (!isString(row.claim)) errors.push(`hypothesisLedger[${idx}].claim must be a string.`)
      if (!isString(row.test)) errors.push(`hypothesisLedger[${idx}].test must be a string.`)
      if (!isString(row.signal)) errors.push(`hypothesisLedger[${idx}].signal must be a string.`)
      if (!isString(row.owner)) errors.push(`hypothesisLedger[${idx}].owner must be a string.`)
      if (!VALID_LEDGER_STATUS.has(row.status)) {
        errors.push(`hypothesisLedger[${idx}].status must be one of: ${Array.from(VALID_LEDGER_STATUS).join(', ')}`)
      }
    })
  }

  if (!Array.isArray(snapshot.validation72h) || snapshot.validation72h.length === 0) {
    errors.push('validation72h must be a non-empty array.')
  }

  if (!Array.isArray(snapshot.aiLeverAnalysis) || snapshot.aiLeverAnalysis.length === 0) {
    errors.push('aiLeverAnalysis must be a non-empty array.')
  } else {
    snapshot.aiLeverAnalysis.forEach((row, idx) => {
      if (!VALID_TONE.has(row.tone)) {
        errors.push(`aiLeverAnalysis[${idx}].tone must be one of: ${Array.from(VALID_TONE).join(', ')}`)
      }
    })
  }

  if (!Array.isArray(snapshot.expansionTriggers) || snapshot.expansionTriggers.length === 0) {
    errors.push('expansionTriggers must be a non-empty array.')
  } else {
    snapshot.expansionTriggers.forEach((row, idx) => {
      if (!VALID_TRIGGER_STATUS.has(row.status)) {
        errors.push(`expansionTriggers[${idx}].status must be one of: ${Array.from(VALID_TRIGGER_STATUS).join(', ')}`)
      }
    })
  }

  if (!isObject(snapshot.portfolioDashboard)) {
    errors.push('portfolioDashboard must be an object.')
  } else {
    if (!Array.isArray(snapshot.portfolioDashboard.riskDistribution) || snapshot.portfolioDashboard.riskDistribution.length === 0) {
      errors.push('portfolioDashboard.riskDistribution must be a non-empty array.')
    }
    if (!Array.isArray(snapshot.portfolioDashboard.historicalComparison) || snapshot.portfolioDashboard.historicalComparison.length === 0) {
      errors.push('portfolioDashboard.historicalComparison must be a non-empty array.')
    }
  }

  if (!isObject(snapshot.vcMemo) || !isString(snapshot.vcMemo.title)) {
    errors.push('vcMemo.title must be a non-empty string.')
  }

  if (!isObject(snapshot.apiProjection)) {
    errors.push('apiProjection must be an object.')
  }

  if (sourceIdSet.size > 0) {
    const citationPaths = [
      ...(snapshot.riskDecomposition || []).map((row, idx) => ({ citations: row.citations, path: `riskDecomposition[${idx}]` })),
      ...(snapshot.hypothesisLedger || []).map((row, idx) => ({ citations: row.citations, path: `hypothesisLedger[${idx}]` })),
      ...(snapshot.validation72h || []).map((row, idx) => ({ citations: row.citations, path: `validation72h[${idx}]` })),
      ...(snapshot.aiLeverAnalysis || []).map((row, idx) => ({ citations: row.citations, path: `aiLeverAnalysis[${idx}]` })),
      ...(snapshot.expansionTriggers || []).map((row, idx) => ({ citations: row.citations, path: `expansionTriggers[${idx}]` })),
      ...(snapshot.portfolioDashboard?.historicalComparison || []).map((row, idx) => ({ citations: row.citations, path: `portfolioDashboard.historicalComparison[${idx}]` })),
      { citations: snapshot.proofScore?.citations, path: 'proofScore' },
      { citations: snapshot.evidenceGapIndex?.citations, path: 'evidenceGapIndex' },
      { citations: snapshot.vcMemo?.citations, path: 'vcMemo' },
    ]

    citationPaths.forEach(({ citations, path }) => {
      if (!Array.isArray(citations) || citations.length === 0) {
        errors.push(`${path}.citations must be a non-empty array.`)
        return
      }
      citations.forEach((id) => {
        if (!sourceIdSet.has(id)) {
          errors.push(`${path}.citations contains unknown source id: ${id}`)
        }
      })
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
