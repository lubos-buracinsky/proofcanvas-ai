import LandingIcon from './LandingIcon'
import SectionHeader from './SectionHeader'

export default function FinalCtaSection({ content, contactEmail }) {
  return (
    <section id="final-cta" className="landing-section bg-blue-600 text-white border-none py-24">
      <div className="landing-container text-center max-w-4xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col gap-6 items-center">
          <LandingIcon name="focus" className="bg-white text-blue-600 border-none w-16 h-16 shrink-0" size={32} />
          <h2 className="text-5xl font-black tracking-tight leading-tight">{content.title}</h2>
          <p className="text-xl font-medium text-blue-100 max-w-2xl leading-relaxed">
            {content.intro}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a href={`mailto:${contactEmail}`} className="landing-btn bg-white text-blue-600 px-12 py-5 text-lg font-bold hover:bg-gray-100 transition-colors">
            {content.primaryCta}
          </a>
          <a href={`mailto:${contactEmail}`} className="landing-btn border-white/30 border-2 text-white px-12 py-5 text-lg font-bold hover:bg-white/10 transition-colors">
            {content.secondaryCta}
          </a>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            {content.note}
          </p>
          <div className="w-12 h-1 bg-blue-400"></div>
        </div>
      </div>
    </section>
  )
}
