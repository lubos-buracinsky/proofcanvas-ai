import LandingNav from '../components/Landing/LandingNav'
import HeroSection from '../components/Landing/HeroSection'
import ProblemSection from '../components/Landing/ProblemSection'
import OpportunitySection from '../components/Landing/OpportunitySection'
import DeliverablesSection from '../components/Landing/DeliverablesSection'
import PilotStructureSection from '../components/Landing/PilotStructureSection'
import AudienceSection from '../components/Landing/AudienceSection'
import VisionSection from '../components/Landing/VisionSection'
import CaseStudySection from '../components/Landing/CaseStudySection'
import WhyNowSection from '../components/Landing/WhyNowSection'
import FinalCtaSection from '../components/Landing/FinalCtaSection'
import EmailPitchSection from '../components/Landing/EmailPitchSection'
import InternalDefinitionSection from '../components/Landing/InternalDefinitionSection'
import CurrentFocusSection from '../components/Landing/CurrentFocusSection'
import LandingIcon from '../components/Landing/LandingIcon'
import { contactEmail, landingContent } from '../data/landingContent'

export default function LandingPage() {
  return (
    <div className="landing-page bg-white selection:bg-blue-100 selection:text-blue-900">
      <LandingNav
        brand={landingContent.hero.eyebrow}
        nav={landingContent.nav}
        primaryCta={landingContent.hero.primaryCta}
        secondaryCta={landingContent.hero.secondaryCta}
        primaryHref="#final-cta"
        secondaryHref={`mailto:${contactEmail}`}
      />

      <main>
        <HeroSection content={landingContent.hero} contactEmail={contactEmail} />
        <ProblemSection content={landingContent.problem} />
        <OpportunitySection content={landingContent.opportunity} />
        <DeliverablesSection content={landingContent.deliverables} />
        <PilotStructureSection content={landingContent.pilotStructure} />
        <AudienceSection content={landingContent.audience} />
        <VisionSection content={landingContent.vision} />
        <CaseStudySection content={landingContent.caseStudy} />
        <WhyNowSection content={landingContent.whyNow} />
        <FinalCtaSection content={landingContent.finalCta} contactEmail={contactEmail} />
        <EmailPitchSection content={landingContent.emailPitch} />
        <InternalDefinitionSection content={landingContent.productDefinition} />
        <CurrentFocusSection content={landingContent.currentFocus} />
      </main>

      <footer className="border-t border-gray-100 bg-white py-20">
        <div className="landing-container flex flex-col gap-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <a href="#top" className="flex items-center gap-2 text-gray-900 font-bold tracking-tight">
              <LandingIcon name="signal" size={14} className="bg-transparent border-none p-0 w-auto h-auto" />
              <span>ProofCanvas AI</span>
            </a>
            <p className="font-medium">Structured risk intelligence for early-stage capital.</p>
          </div>
          <div className="flex gap-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">
            <a href="#problem" className="hover:text-gray-900 transition-colors">Problem</a>
            <a href="#opportunity" className="hover:text-gray-900 transition-colors">Methodology</a>
            <a href="#final-cta" className="hover:text-gray-900 transition-colors">Contact</a>
            <a href="#top" className="hover:text-gray-900 transition-colors">Back to top</a>
          </div>
        </div>
        <div className="landing-container mt-12 pt-8 border-t border-gray-50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
          © 2026 ProofCanvas Intelligence Engine. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
