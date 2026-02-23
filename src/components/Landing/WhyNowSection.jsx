import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function WhyNowSection({ content }) {
  return (
    <section id="why-now" className="landing-section bg-white">
      <div className="landing-container">
        <SectionHeader label="Context" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="md:col-span-2 lg:col-span-1 landing-card p-12 bg-black text-white border-none flex flex-col justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">Structural Shift</h3>
            <p className="text-3xl font-black leading-tight tracking-tight mb-8">
              AI has dramatically lowered the cost of intelligence.
            </p>
            <div className="w-16 h-1 bg-blue-500"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
            {content.bullets.map((bullet) => (
              <div key={bullet} className="landing-chip-card border-gray-100 p-8 flex flex-col items-start gap-4">
                <LandingIcon name="growth" className="bg-blue-50 text-blue-600 border-none w-10 h-10 shrink-0" size={20} />
                <span className="text-lg font-bold text-gray-900 leading-tight tracking-tight">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-12 bg-gray-50 border border-gray-100 rounded-xl text-center">
          <p className="text-2xl font-bold text-gray-900 max-w-4xl mx-auto tracking-tight leading-snug">
            {content.text}
          </p>
        </div>
      </div>
    </section>
  )
}
