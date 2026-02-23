import { useState } from 'react'
import snapshot from '../data/komfiSnapshot.generated.json'
import sourceManifest from '../data/komfiSnapshot.sources.json'
import { formatDate, ageDays } from '../components/Mockups/mockupUtils'
import VersionSwitcher from '../components/Mockups/VersionSwitcher'
import V0ConciergeView from '../components/Mockups/V0ConciergeView'
import V1DashboardView from '../components/Mockups/V1DashboardView'
import V2PortfolioView from '../components/Mockups/V2PortfolioView'

export default function OutputMockupsPage() {
  const [activeVersion, setActiveVersion] = useState('v0')
  const sourceMap = new Map((sourceManifest.sources || []).map((source) => [source.id, source]))

  const generatedAge = ageDays(snapshot.generatedAt)
  const isStale = generatedAge > (snapshot.snapshotDaysValid || 14)

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

      <VersionSwitcher active={activeVersion} onChange={setActiveVersion} />

      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-6 py-8">
        {activeVersion === 'v0' && <V0ConciergeView snapshot={snapshot} sourceMap={sourceMap} />}
        {activeVersion === 'v1' && <V1DashboardView snapshot={snapshot} sourceMap={sourceMap} />}
        {activeVersion === 'v2' && <V2PortfolioView snapshot={snapshot} sourceMap={sourceMap} />}
      </main>
    </div>
  )
}
