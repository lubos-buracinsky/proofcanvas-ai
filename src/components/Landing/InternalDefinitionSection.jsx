import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function InternalDefinitionSection({ content }) {
  return (
    <section id="internal-definition" className="landing-section bg-white">
      <div className="landing-container">
        <SectionHeader label="Strategic Timeline" title={content.title} icon={content.icon} />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.versions.map((version, index) => (
            <div key={version.heading} className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <LandingIcon name={version.icon} className="bg-blue-50 text-blue-600 border-none w-10 h-10 shrink-0" size={20} />
                  <span className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase">{version.heading}</span>
                </div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight mt-4">{version.text}</p>
              </div>

              {version.bullets?.length ? (
                <ul className="flex flex-col gap-4">
                  {version.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-4 items-start">
                      <span className="text-blue-500 font-bold shrink-0">→</span>
                      <span className="text-lg font-bold text-gray-700 leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-black text-white rounded-xl text-center">
          <p className="text-2xl font-bold tracking-tight leading-snug italic">
            "We are building the infrastructure layer for early-stage capital, deliberately."
          </p>
        </div>
      </div>
    </section>
  )
}
