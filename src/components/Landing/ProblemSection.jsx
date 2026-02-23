import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function ProblemSection({ content }) {
  return (
    <section id="problem" className="landing-section bg-gray-50/50">
      <div className="landing-container">
        <SectionHeader label="Reality" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="landing-card bg-white p-8 border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Structural Inefficiencies</h3>
            <ul className="flex flex-col gap-8">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-4">
                  <LandingIcon name="risk" className="bg-red-50 text-red-500 border-none w-10 h-10 shrink-0" size={20} />
                  <span className="text-lg font-medium text-gray-800 leading-snug pt-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="landing-card bg-black text-white p-10 border-none">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Investment Consequence</p>
              <p className="text-2xl font-bold leading-tight mb-8">
                {content.outro}
              </p>
              <div className="w-12 h-1 bg-blue-500"></div>
            </div>
            
            <div className="p-2 border-l-2 border-gray-200 pl-8">
              <p className="text-lg text-gray-500 font-medium italic">
                Without decomposition, diligence cannot compound at portfolio level and investment quality remains personality-dependent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
