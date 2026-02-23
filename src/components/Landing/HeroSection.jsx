import LandingIcon from './LandingIcon'
import heroIntelligenceImg from '../../assets/hero-intelligence.svg'

const investorSignals = [
  { label: 'Risk Decomposition', value: '100%', icon: 'risk' },
  { label: 'Intelligence Depth', value: 'VC-Ready', icon: 'memo' },
  { label: 'Analysis Speed', value: '5 Days', icon: 'time' },
]

export default function HeroSection({ content, contactEmail }) {
  return (
    <section id="top" className="landing-section landing-hero border-none bg-white">
      <div className="landing-container">
        <div className="landing-hero-grid items-start">
          <div className="max-w-3xl">
            <p className="landing-kicker text-blue-600 mb-4">{content.eyebrow}</p>
            <h1 className="landing-h1 text-balance mb-8 font-extrabold tracking-tight leading-tight">
              {content.title}
            </h1>
            <p className="landing-lead text-xl text-gray-600 mb-8 max-w-2xl">
              {content.intro}
            </p>
            <p className="landing-statement text-lg text-gray-800 font-medium mb-10 max-w-2xl border-l-2 border-gray-200 pl-6 italic">
              {content.statement}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#final-cta" className="landing-btn landing-btn-primary px-8 py-3 text-base">
                {content.primaryCta}
              </a>
              <a href={`mailto:${contactEmail}`} className="landing-btn landing-btn-secondary px-8 py-3 text-base">
                {content.secondaryCta}
              </a>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {investorSignals.map((signal) => (
                <div key={signal.label} className="flex flex-col gap-1 border-t border-gray-100 pt-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <LandingIcon name={signal.icon} size={14} className="border-none bg-transparent p-0 w-auto h-auto text-gray-400" />
                    {signal.label}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 leading-none">{signal.value}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="landing-media-stack relative" aria-label="ProofCanvas mockups">
            <figure className="landing-image-card shadow-2xl relative z-10 border-gray-100">
              <img src={heroIntelligenceImg} alt="ProofCanvas risk intelligence dashboard mockup" className="landing-image" />
            </figure>
            
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gray-50 rounded-xl -z-0 border border-gray-200"></div>

            <article className="landing-card bg-gray-900 p-8 mt-12 text-white border-none">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <LandingIcon name="process" size={14} className="border-none bg-transparent p-0 w-auto h-auto text-blue-400" />
                Pilot Format
              </p>
              <ul className="flex flex-col gap-6">
                {content.highlights.map((item) => (
                  <li key={item.label} className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-100">{item.value}</p>
                  </li>
                ))}
              </ul>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}
