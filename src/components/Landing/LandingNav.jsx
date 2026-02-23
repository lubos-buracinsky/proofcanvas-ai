import LandingIcon from './LandingIcon'

export default function LandingNav({ brand, nav, primaryCta, secondaryCta, primaryHref, secondaryHref }) {
  return (
    <header className="landing-nav">
      <div className="landing-container">
        <div className="flex h-16 items-center justify-between gap-6">
          <a href="#top" className="landing-brand" aria-label="ProofCanvas home">
            <LandingIcon name="signal" size={16} />
            <span className="tracking-tight">{brand}</span>
          </a>

          <nav className="hidden lg:block" aria-label="Landing sections">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="landing-nav-link hover:text-black transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <a href={secondaryHref} className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
              {secondaryCta}
            </a>
            <a href={primaryHref} className="landing-btn landing-btn-primary">
              {primaryCta}
            </a>
          </div>
        </div>

        <nav className="pb-4 lg:hidden" aria-label="Landing sections mobile">
          <ul className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="landing-nav-link whitespace-nowrap">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
