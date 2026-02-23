import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function AudienceSection({ content }) {
  return (
    <section id="audience" className="landing-section bg-gray-50/50">
      <div className="landing-container">
        <SectionHeader label="Target" title={content.title} icon={content.icon} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.bullets.map((bullet) => (
            <div key={bullet} className="landing-card bg-white p-8 border-gray-100 flex flex-col gap-6 items-start hover:shadow-md transition-shadow">
              <LandingIcon name="audience" className="bg-blue-50 text-blue-600 border-none w-12 h-12" size={24} />
              <p className="text-xl font-bold text-gray-900 leading-tight tracking-tight">{bullet}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-xl font-medium text-gray-500 italic max-w-3xl mx-auto">
            {content.outro}
          </p>
        </div>
      </div>
    </section>
  )
}
