import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

function DeliverableCard({ item, index }) {
  return (
    <article className="landing-card p-8 bg-white hover:bg-gray-50/30 transition-colors border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <LandingIcon name={item.icon} className="bg-blue-50 text-blue-600 border-none w-10 h-10 shrink-0" size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Artifact 0{index + 1}</span>
      </div>
      
      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-4 tracking-tight">{item.title}</h3>

      {item.description ? <p className="text-gray-500 font-medium mb-6 text-base leading-relaxed">{item.description}</p> : null}
      
      {item.bullets?.length ? (
        <div className="mt-auto">
          <ul className="flex flex-col gap-3">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-sm font-semibold text-gray-700">
                <span className="text-blue-500 font-bold">→</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      
      {item.footnote ? <div className="mt-6 pt-6 border-t border-gray-100"><p className="text-xs font-bold uppercase tracking-widest text-blue-500">{item.footnote}</p></div> : null}
    </article>
  )
}

export default function DeliverablesSection({ content }) {
  return (
    <section id="deliverables" className="landing-section bg-gray-50/30">
      <div className="landing-container">
        <SectionHeader label="Intelligence Report" title={content.title} intro={content.intro} icon={content.icon} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <DeliverableCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
