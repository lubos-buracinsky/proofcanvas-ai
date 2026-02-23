export function chipClasses(status) {
  if (status === 'ready') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (status === 'blocked') return 'bg-rose-100 text-rose-700 border-rose-200'
  if (status === 'tracking') return 'bg-amber-100 text-amber-700 border-amber-200'
  if (status === 'Risky') return 'bg-rose-100 text-rose-700 border-rose-200'
  if (status === 'In validation') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (status === 'Validated') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  return 'bg-neutral-100 text-neutral-700 border-neutral-200'
}

export function scoreTone(score) {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 55) return 'text-amber-600'
  return 'text-rose-600'
}

export function barTone(score) {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 55) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function formatDate(iso) {
  if (!iso) return 'Unknown'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function ageDays(iso) {
  const ts = Date.parse(iso)
  if (Number.isNaN(ts)) return Number.POSITIVE_INFINITY
  return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
}

export function CitationLinks({ citations, sourceMap }) {
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
