import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

function FocusColumn({ label, items, tone }) {
  const isPositive = tone === 'positive'
  const iconName = isPositive ? 'positive' : 'negative'

  return (
    <article className={`landing-card p-10 flex flex-col gap-10 ${isPositive ? 'bg-blue-600 border-none' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between border-b pb-8 border-gray-100/20">
        <h3 className={`text-sm font-black tracking-widest uppercase ${isPositive ? 'text-blue-200' : 'text-gray-400'}`}>{label}</h3>
        <LandingIcon name={iconName} className={`${isPositive ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-900'} border-none w-10 h-10`} size={20} />
      </div>
      
      <ul className="flex flex-col gap-6">
        {items.map((item) => (
          <li key={item} className={`text-xl font-extrabold tracking-tight leading-tight ${isPositive ? 'text-white' : 'text-gray-900'}`}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function CurrentFocusSection({ content }) {
  return (
    <section id="current-focus" className="landing-section bg-gray-50/50 pb-24 md:pb-32">
      <div className="landing-container">
        <SectionHeader label="Strategic Focus" title={content.title} icon={content.icon} />
        <div className="grid gap-12 md:grid-cols-2 mt-16">
          <FocusColumn label={content.notLabel} items={content.not} tone="neutral" />
          <FocusColumn label={content.onlyLabel} items={content.only} tone="positive" />
        </div>
      </div>
    </section>
  )
}
