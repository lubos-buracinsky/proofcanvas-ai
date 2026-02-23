import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function VisionSection({ content }) {
  return (
    <section id="vision" className="landing-section bg-white">
      <div className="landing-container">
        <SectionHeader label="Future" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-16">
          {content.bullets.map((bullet) => (
            <div key={bullet} className="flex flex-col gap-6 items-start">
              <LandingIcon name="vision" className="bg-gray-100 text-gray-900 border-none w-10 h-10" size={20} />
              <p className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-gray-100 text-center">
          <p className="text-3xl font-black text-gray-900 tracking-tight leading-tight max-w-2xl mx-auto">
            {content.ambition}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-1 bg-blue-600"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
