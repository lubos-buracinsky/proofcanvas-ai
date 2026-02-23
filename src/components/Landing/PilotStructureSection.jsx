import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function PilotStructureSection({ content }) {
  return (
    <section id="pilot-structure" className="landing-section bg-white">
      <div className="landing-container">
        <SectionHeader label="Engagement" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-10">
            {content.bullets.map((bullet, index) => (
              <div key={bullet} className="flex gap-6 items-start">
                <span className="text-4xl font-black text-gray-100 leading-none">0{index + 1}</span>
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold text-gray-900 tracking-tight">{bullet}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="landing-card bg-gray-50 border-gray-100 p-12 flex flex-col items-center text-center">
            <LandingIcon name="time" className="bg-blue-600 text-white border-none w-16 h-16 mb-8" size={32} />
            <p className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{content.turnaround}</p>
            <p className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-10">{content.price}</p>
            <p className="text-gray-500 font-medium mb-10 max-w-sm">
              {content.outro}
            </p>
            <a href="#final-cta" className="landing-btn landing-btn-primary w-full py-4 text-base">
              Secure Pilot Slot
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
