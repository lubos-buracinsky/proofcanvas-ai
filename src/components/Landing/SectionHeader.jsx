import LandingIcon from './LandingIcon'

export default function SectionHeader({ label, title, intro, align = 'left', icon }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`mb-12 flex flex-col gap-4 ${alignClass}`}>
      {label ? (
        <p className="landing-kicker text-blue-600 flex items-center gap-2">
          {icon ? <LandingIcon name={icon} size={14} className="bg-transparent border-none p-0 w-auto h-auto text-blue-600" /> : null}
          <span className="font-bold tracking-widest">{label}</span>
        </p>
      ) : null}
      <h2 className="landing-h2 font-extrabold text-gray-900 leading-tight">{title}</h2>
      {intro ? <p className="landing-lead text-xl text-gray-600 max-w-2xl">{intro}</p> : null}
    </div>
  )
}
