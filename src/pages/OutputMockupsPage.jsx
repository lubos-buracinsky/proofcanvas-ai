import snapshot from '../data/komfiSnapshot.generated.json'
import sourceManifest from '../data/komfiSnapshot.sources.json'

const scopeBands = [
  {
    phase: 'v0 (Now)',
    headline: 'Concierge Deal Intelligence Sprint',
    items: [
      'Structured risk decomposition',
      'Hypothesis ledger',
      '72h validation sprint design',
      'AI lever + expansion trigger analysis',
      'Evidence Gap Index + VC memo',
    ],
  },
  {
    phase: 'v1 (3 months)',
    headline: 'Internal Dashboard',
    items: [
      'Risk type distribution',
      'Confidence scoring',
      'Historical deal comparison',
      'Structured PDF automation',
    ],
  },
  {
    phase: 'v2 (6-9 months)',
    headline: 'Integration API + Portfolio Layer',
    items: [
      'Deck ingest endpoint',
      'Risk JSON output',
      'Evidence-weight model',
      'Portfolio roll-up dashboard',
    ],
  },
]

function chipClasses(status) {
  if (status === 'ready') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (status === 'blocked') return 'bg-rose-100 text-rose-700 border-rose-200'
  if (status === 'tracking') return 'bg-amber-100 text-amber-700 border-amber-200'
  if (status === 'Risky') return 'bg-rose-100 text-rose-700 border-rose-200'
  if (status === 'In validation') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (status === 'Validated') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  return 'bg-neutral-100 text-neutral-700 border-neutral-200'
}

function scoreTone(score) {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 55) return 'text-amber-600'
  return 'text-rose-600'
}

function barTone(score) {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 55) return 'bg-amber-500'
  return 'bg-rose-500'
}

function formatDate(iso) {
  if (!iso) return 'Unknown'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function ageDays(iso) {
  const ts = Date.parse(iso)
  if (Number.isNaN(ts)) return Number.POSITIVE_INFINITY
  return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
}

function CitationLinks({ citations, sourceMap }) {
  const linked = (Array.isArray(citations) ? citations : [])
    .map((id) => sourceMap.get(id))
    .filter(Boolean)

  if (!linked.length) return null

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {linked.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-[11px] font-medium text-[#4b5563] transition hover:bg-[#f9fafb]"
          title={`${source.title} | Updated ${formatDate(source.lastEdited)}`}
        >
          {source.title}
        </a>
      ))}
    </div>
  )
}

export default function OutputMockupsPage() {
  const sourceMap = new Map((sourceManifest.sources || []).map((source) => [source.id, source]))

  const riskRows = snapshot.riskDecomposition || []
  const ledgerRows = snapshot.hypothesisLedger || []
  const sprintSteps = snapshot.validation72h || []
  const aiLeverRows = snapshot.aiLeverAnalysis || []
  const expansionRows = snapshot.expansionTriggers || []
  const dashboardBars = snapshot.portfolioDashboard?.riskDistribution || []
  const comparisonRows = snapshot.portfolioDashboard?.historicalComparison || []

  const criticalRisks = riskRows.filter((row) => (row.score || 0) < 60).length
  const staleDays = snapshot.snapshotDaysValid || 14
  const generatedAge = ageDays(snapshot.generatedAt)
  const isStale = generatedAge > staleDays

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-[#d1d5db] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">ProofCanvas AI</p>
            <h1 className="font-serif text-2xl tracking-tight text-black">Komfi Intelligence Snapshot</h1>
            <p className="mt-1 text-xs text-[#6b7280]">
              Generated {formatDate(snapshot.generatedAt)} | Mode: {snapshot.sourceMode} | Sources: {snapshot.sourceSummary?.totalSources || 0}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-semibold text-[#111827] transition hover:bg-[#f9fafb]"
            >
              Back to landing
            </a>
            <span className="rounded-md bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {snapshot.versionTag}
            </span>
            {isStale && (
              <span className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-rose-700">
                Snapshot stale ({generatedAge}d)
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-6 py-8">
        <section className="grid gap-4 lg:grid-cols-3">
          {scopeBands.map((band) => (
            <article key={band.phase} className="rounded-2xl border border-[#d1d5db] bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">{band.phase}</p>
              <h2 className="mt-2 font-serif text-2xl leading-tight text-black">{band.headline}</h2>
              <ul className="mt-4 space-y-2 text-sm text-[#374151]">
                {band.items.map((item) => (
                  <li key={item} className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 01</p>
                <h3 className="font-serif text-3xl text-black">Deal Intelligence Summary</h3>
                <p className="mt-2 text-sm text-[#4b5563]">{snapshot.companyProfile?.thesis}</p>
              </div>
              <div className="rounded-lg bg-black px-3 py-2 text-right text-white">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/70">ProofScore</p>
                <p className="text-2xl font-semibold">{snapshot.proofScore?.score}</p>
                <p className="text-[10px] text-white/70">Conf {snapshot.proofScore?.confidence}%</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs uppercase tracking-wide text-[#6b7280]">Evidence Gap Index</p>
                <p className="mt-1 text-xl font-semibold text-[#111827]">{snapshot.evidenceGapIndex?.percent}%</p>
                <p className="text-[11px] text-[#6b7280]">Conf {snapshot.evidenceGapIndex?.confidence}%</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs uppercase tracking-wide text-[#6b7280]">Critical risks</p>
                <p className="mt-1 text-xl font-semibold text-[#111827]">{criticalRisks}</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs uppercase tracking-wide text-[#6b7280]">Recommendation</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{snapshot.vcMemo?.recommendation}</p>
              </div>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                <p className="text-xs uppercase tracking-wide text-[#6b7280]">Strategic goal</p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{snapshot.companyProfile?.strategicGoal}</p>
              </div>
            </div>

            <CitationLinks citations={snapshot.proofScore?.citations} sourceMap={sourceMap} />

            <div className="mt-6 space-y-3">
              {riskRows.map((row) => (
                <div key={row.category} className="rounded-xl border border-[#e5e7eb] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#111827]">{row.category}</p>
                    <p className={`text-sm font-bold ${scoreTone(row.score)}`}>{row.score}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div className={`h-full rounded-full ${barTone(row.score)}`} style={{ width: `${row.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    Confidence {row.confidence}% | {row.note}
                  </p>
                  <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 02</p>
            <h3 className="font-serif text-3xl text-black">Hypothesis Ledger + 72h Validation</h3>

            <div className="mt-5 overflow-hidden rounded-xl border border-[#e5e7eb]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9fafb] text-[#6b7280]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Hypothesis</th>
                    <th className="px-3 py-2 font-semibold">Test + signal</th>
                    <th className="px-3 py-2 font-semibold">Owner</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerRows.map((row) => (
                    <tr key={row.claim} className="border-t border-[#e5e7eb] align-top">
                      <td className="px-3 py-3 text-[#111827]">
                        <p>{row.claim}</p>
                        <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                      </td>
                      <td className="px-3 py-3 text-[#374151]">
                        <p>{row.test}</p>
                        <p className="mt-1 text-[#6b7280]">{row.signal}</p>
                      </td>
                      <td className="px-3 py-3 text-[#374151]">
                        {row.owner}
                        <p className="mt-1 text-[#6b7280]">Conf {row.confidence}%</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2 py-1 font-semibold ${chipClasses(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {sprintSteps.map((step, idx) => (
                <div key={`${step.title}-${idx}`} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                    Step {idx + 1} - {step.title}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#111827]">{step.detail}</p>
                  <p className="mt-2 text-[11px] text-[#6b7280]">Conf {step.confidence}%</p>
                  <CitationLinks citations={step.citations} sourceMap={sourceMap} />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 03</p>
            <h3 className="font-serif text-3xl text-black">AI Lever + Expansion Triggers</h3>

            <div className="mt-5 grid gap-3">
              {aiLeverRows.map((row) => (
                <div key={row.label} className="rounded-lg border border-[#e5e7eb] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[#111827]">{row.label}</p>
                    <p className={`text-sm font-semibold ${row.tone === 'positive' ? 'text-emerald-700' : row.tone === 'negative' ? 'text-rose-700' : 'text-amber-700'}`}>
                      {row.value}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-[#6b7280]">Conf {row.confidence}%</p>
                  <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Expansion checkpoint board</p>
              <div className="mt-3 space-y-2">
                {expansionRows.map((row) => (
                  <div key={row.trigger} className="rounded-md border border-[#e5e7eb] bg-white px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-[#111827]">{row.trigger}</p>
                      <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase ${chipClasses(row.status)}`}>
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6b7280]">Conf {row.confidence}%</p>
                    <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 04</p>
            <h3 className="font-serif text-3xl text-black">Portfolio Dashboard (v1)</h3>
            <div className="mt-5 rounded-xl border border-[#e5e7eb] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Risk type distribution</p>
              <div className="mt-3 space-y-2">
                {dashboardBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs text-[#374151]">
                      <span>{bar.label}</span>
                      <span>{bar.value}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#e5e7eb]">
                      <div className="h-2 rounded-full bg-black" style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#e5e7eb] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">Historical comparison</p>
              <div className="mt-3 space-y-2 text-xs">
                {comparisonRows.map((row) => (
                  <div key={row.deal} className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                    <p className="font-semibold text-[#111827]">{row.deal}</p>
                    <p className="mt-1 text-[#374151]">
                      ProofScore {row.proofScore} | Evidence Gap {row.evidenceGap}% | {row.recommendation}
                    </p>
                    <p className="mt-1 text-[11px] text-[#6b7280]">Conf {row.confidence}%</p>
                    <CitationLinks citations={row.citations} sourceMap={sourceMap} />
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 05</p>
            <h3 className="font-serif text-3xl text-black">VC-Ready Memo + PDF Export</h3>
            <div className="mt-5 rounded-xl border border-[#d1d5db] bg-[#f9fafb] p-5">
              <div className="mx-auto max-w-[560px] rounded-md border border-[#d1d5db] bg-white p-6 shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">Investment memo / draft</p>
                <h4 className="mt-2 font-serif text-2xl text-black">{snapshot.vcMemo?.title}</h4>
                <p className="mt-4 text-sm text-[#374151]">{snapshot.vcMemo?.recommendation}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded border border-[#e5e7eb] p-2">
                    <p className="text-[#6b7280]">ProofScore</p>
                    <p className="font-semibold text-black">{snapshot.proofScore?.score}</p>
                  </div>
                  <div className="rounded border border-[#e5e7eb] p-2">
                    <p className="text-[#6b7280]">Evidence Gap</p>
                    <p className="font-semibold text-black">{snapshot.evidenceGapIndex?.percent}%</p>
                  </div>
                  <div className="rounded border border-[#e5e7eb] p-2">
                    <p className="text-[#6b7280]">Memo confidence</p>
                    <p className="font-semibold text-black">{snapshot.vcMemo?.confidence}%</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#374151]">
                  {(snapshot.vcMemo?.bullets || []).map((bullet, index) => (
                    <p key={`${index}-${bullet}`}>- {bullet}</p>
                  ))}
                </div>

                <CitationLinks citations={snapshot.vcMemo?.citations} sourceMap={sourceMap} />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Mockup 06</p>
            <h3 className="font-serif text-3xl text-black">API-Oriented Output (v2)</h3>
            <p className="mt-3 text-sm text-[#374151]">
              Structured payload is generated from Notion-only evidence and exposed here as a preview contract for later API integration.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-xs leading-relaxed text-[#111827]">
              {JSON.stringify(snapshot.apiProjection, null, 2)}
            </pre>

            <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm text-[#374151]">
              <p className="font-semibold text-[#111827]">Snapshot provenance</p>
              <p className="mt-1">
                {sourceManifest.sources?.length || 0} Notion sources | stale docs: {snapshot.sourceSummary?.staleSources || 0} | avg confidence: {snapshot.sourceSummary?.averageBaseConfidence || 0}%
              </p>
              <p className="mt-1">Generated {formatDate(snapshot.generatedAt)} ({generatedAge} day(s) ago)</p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-[#d1d5db] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">Source Panel</p>
          <h3 className="font-serif text-3xl text-black">Notion Citation Registry</h3>
          <p className="mt-2 text-sm text-[#4b5563]">
            Every metric and claim above is linked to these source pages. Use this panel to audit freshness before sharing memo outputs.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(sourceManifest.sources || []).map((source) => {
              const stale = ageDays(source.lastEdited) > staleDays
              const freshnessChip = source.freshness?.includes('verified')
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : source.freshness?.includes('expired') || source.freshness?.includes('stale')
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : 'bg-amber-100 text-amber-700 border-amber-200'

              return (
                <article key={source.id} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111827]">{source.title}</p>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${freshnessChip}`}>
                      {source.freshness}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#6b7280]">
                    Updated {formatDate(source.lastEdited)} | Conf {source.baseConfidence}%{stale ? ' | stale' : ''}
                  </p>
                  <p className="mt-2 text-xs text-[#4b5563]">{source.excerpt}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-md border border-[#d1d5db] bg-white px-2 py-1 text-[11px] font-semibold text-[#111827] hover:bg-[#f3f4f6]"
                  >
                    Open source
                  </a>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
