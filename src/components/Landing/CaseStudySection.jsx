import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function CaseStudySection({ content }) {
  return (
    <section id="case-study" className="landing-section bg-gray-900 text-white border-none">
      <div className="landing-container">
        <SectionHeader label="Self-Validation" title={content.title} intro={content.intro} icon={content.icon} />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.blocks.map((block) => (
            <div key={block.heading} className="p-8 border border-gray-800 rounded-xl bg-gray-800/50 flex flex-col gap-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <LandingIcon name={block.icon} className="bg-gray-700 text-blue-400 border-none w-10 h-10 shrink-0" size={20} />
                <h3 className="text-xl font-bold tracking-tight text-white leading-tight">{block.heading}</h3>
              </div>
              
              <div className="mt-auto">
                {block.text ? (
                  <p className="text-base text-gray-400 font-medium leading-relaxed italic">{block.text}</p>
                ) : null}
                
                {block.list ? (
                  <ul className="flex flex-col gap-3">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-2 text-sm font-semibold text-gray-400 leading-snug">
                        <span className="text-blue-400">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-gray-100 tracking-tight leading-tight italic">
            "{content.outro}"
          </p>
        </div>
      </div>
    </section>
  )
}
