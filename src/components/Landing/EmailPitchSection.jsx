import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function EmailPitchSection({ content }) {
  return (
    <section id="email-pitch" className="landing-section bg-gray-50/50">
      <div className="landing-container">
        <SectionHeader label="Outreach" title={content.title} icon={content.icon} />
        
        <div className="landing-card bg-white p-12 border-gray-100 max-w-3xl mx-auto shadow-sm">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
              <LandingIcon name="memo" className="bg-gray-100 text-gray-900 border-none w-12 h-12" size={24} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject Line</span>
                <p className="text-xl font-black text-gray-900 tracking-tight leading-tight">{content.subject}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 bg-gray-50 p-10 rounded-xl border border-gray-100 italic">
              {content.body.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-700 font-medium leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
              <p>Ready to Send</p>
              <div className="w-16 h-[1px] bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
