const VERSIONS = [
  { id: 'v0', label: 'v0 — Concierge Sprint', badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'v1', label: 'v1 — Dashboard', badge: 'Preview', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'v2', label: 'v2+ — API & Portfolio', badge: 'Concept', badgeColor: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
]

export default function VersionSwitcher({ active, onChange }) {
  return (
    <div className="mx-auto flex w-full max-w-[1240px] px-6">
      <nav className="flex gap-1 border-b border-[#e5e7eb]">
        {VERSIONS.map((v) => {
          const isActive = active === v.id
          return (
            <button
              key={v.id}
              onClick={() => onChange(v.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? 'border-b-2 border-black bg-black text-white rounded-t-md'
                  : 'text-[#6b7280] hover:text-black'
              }`}
            >
              {v.label}
              <span
                className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                  isActive ? 'border-white/30 bg-white/20 text-white' : v.badgeColor
                }`}
              >
                {v.badge}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
