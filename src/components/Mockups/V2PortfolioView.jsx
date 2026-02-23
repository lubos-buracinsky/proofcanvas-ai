import { scoreTone, barTone, formatDate, CitationLinks } from './mockupUtils'

/* ─── API Integration Preview ─── */
function ApiPreview({ snapshot }) {
  const requestBody = {
    company_name: 'Komfi',
    deck_url: 'https://notion.so/komfi/...',
    source_mode: 'core',
    options: {
      include_risk_decomposition: true,
      include_validation_sprint: true,
      include_ai_lever_analysis: true,
    },
  }

  const responseBody = {
    deal_id: snapshot.apiProjection?.deal_id,
    status: 'completed',
    proofscore: snapshot.apiProjection?.proofscore,
    evidence_gap_index: snapshot.apiProjection?.evidence_gap_index,
    risk_ledger: snapshot.apiProjection?.risk_ledger,
    validation_72h: snapshot.apiProjection?.validation_72h,
    generated_at: snapshot.generatedAt,
    version: snapshot.versionTag,
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">API Integration</p>
        <h3 className="mt-1 font-serif text-2xl text-black">Endpoint Documentation</h3>

        <div className="mt-5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">POST</span>
            <code className="text-sm font-medium text-[#111827]">/api/v2/deals/analyze</code>
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">
            Submit a deal for AI-powered analysis. Returns structured risk decomposition, validation sprint, and ProofScore.
          </p>

          <div className="mt-4 flex items-center gap-4 text-[10px] text-[#9ca3af]">
            <span className="rounded border border-[#e5e7eb] px-2 py-0.5">Auth: Bearer token</span>
            <span className="rounded border border-[#e5e7eb] px-2 py-0.5">Rate limit: 100 req/hr</span>
            <span className="rounded border border-[#e5e7eb] px-2 py-0.5">Timeout: 120s</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Request</p>
            <pre className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#111827] p-4 text-xs leading-relaxed text-emerald-400">
              {JSON.stringify(requestBody, null, 2)}
            </pre>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Response</p>
            <pre className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#111827] p-4 text-xs leading-relaxed text-amber-400">
              {JSON.stringify(responseBody, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Portfolio Roll-up Dashboard ─── */
function PortfolioDashboard({ snapshot, sourceMap }) {
  const comparisonRows = snapshot.portfolioDashboard?.historicalComparison || []
  const riskDistribution = snapshot.portfolioDashboard?.riskDistribution || []

  const avgProofScore = comparisonRows.length
    ? Math.round(comparisonRows.reduce((sum, r) => sum + r.proofScore, 0) / comparisonRows.length)
    : 0
  const avgEvidenceGap = comparisonRows.length
    ? Math.round(comparisonRows.reduce((sum, r) => sum + r.evidenceGap, 0) / comparisonRows.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Portfolio health summary */}
      <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Portfolio Health</p>
        <h3 className="mt-1 font-serif text-2xl text-black">Komfi Product Lines</h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-black p-4 text-center text-white">
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/70">Avg ProofScore</p>
            <p className="mt-1 text-3xl font-bold">{avgProofScore}</p>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">Avg Evidence Gap</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{avgEvidenceGap}%</p>
          </div>
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">Active Deals</p>
            <p className="mt-1 text-3xl font-bold text-[#111827]">{comparisonRows.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Multi-deal comparison */}
        <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Deal Comparison</p>
          <h4 className="mt-1 font-serif text-xl text-black">Product Line Analysis</h4>
          <div className="mt-4 space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.deal} className="rounded-xl border border-[#e5e7eb] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{row.deal}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{row.recommendation}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${scoreTone(row.proofScore)}`}>{row.proofScore}</p>
                    <p className="text-[10px] text-[#9ca3af]">ProofScore</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex-1">
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Evidence Gap</span>
                      <span>{row.evidenceGap}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${row.evidenceGap}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9ca3af]">Conf {row.confidence}%</span>
                </div>
                <CitationLinks citations={row.citations} sourceMap={sourceMap} />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio risk distribution */}
        <div className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Risk Distribution</p>
          <h4 className="mt-1 font-serif text-xl text-black">Portfolio Risk Allocation</h4>
          <div className="mt-4 space-y-3">
            {riskDistribution.map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#111827]">{bar.label}</span>
                  <span className="font-semibold text-[#374151]">{bar.value}%</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div className="h-full rounded-full bg-black transition-all" style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Provenance */}
          <div className="mt-6 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
            <p className="text-xs font-semibold text-[#111827]">Snapshot Provenance</p>
            <p className="mt-1 text-[11px] text-[#6b7280]">
              {snapshot.sourceSummary?.totalSources || 0} Notion sources | stale: {snapshot.sourceSummary?.staleSources || 0} | avg confidence: {snapshot.sourceSummary?.averageBaseConfidence || 0}%
            </p>
            <p className="mt-1 text-[11px] text-[#6b7280]">Generated {formatDate(snapshot.generatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main V2 view ─── */
export default function V2PortfolioView({ snapshot, sourceMap }) {
  return (
    <div className="flex flex-col gap-8">
      <ApiPreview snapshot={snapshot} />
      <PortfolioDashboard snapshot={snapshot} sourceMap={sourceMap} />
    </div>
  )
}
