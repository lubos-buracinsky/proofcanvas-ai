import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function OpportunitySection({ content }) {
  return (
    <section id="opportunity" className="landing-section bg-white">
      <div className="landing-container">
        <SectionHeader label="Strategy" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2 lg:col-span-1 landing-card p-10 bg-black text-white border-none">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">The ProofCanvas Methodology</h3>
            <p className="text-2xl font-bold leading-tight mb-8">
              {content.lead}
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-400 font-bold uppercase tracking-widest">
              <span className="w-10 h-[1px] bg-blue-400"></span>
              Modern Diligence
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
            {content.bullets.map((bullet) => (
              <article key={bullet} className="landing-chip-card border-gray-100 hover:border-gray-300 shadow-sm transition-all p-8 flex flex-col items-start gap-4">
                <LandingIcon name="signal" className="bg-blue-50 text-blue-600 border-none w-10 h-10 shrink-0" size={20} />
                <span className="text-lg font-bold text-gray-900 leading-tight">{bullet}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 p-10 bg-gray-50 border border-gray-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-2xl font-bold text-gray-900 text-center md:text-left">
            {content.outro}
          </p>
          <a href="#final-cta" className="landing-btn landing-btn-primary px-10 py-4 text-base whitespace-nowrap">
            Explore Methodology
          </a>
        </div>
      </div>
    </section>
  )
}
