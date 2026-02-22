import { useState, useRef, useCallback, useEffect } from 'react'
import GridViewIcon from '@mui/icons-material/GridView'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ThemeToggle from './Common/ThemeToggle'
import LangToggle from './Common/LangToggle'
import MobileMenu from './Common/MobileMenu'
import CanvasToolbar from './Canvas/CanvasToolbar'
import CanvasBoard from './Canvas/CanvasBoard'
import AIGenerateModal from './AI/AIGenerateModal'
import AIValidation from './AI/AIValidation'
import FollowUpPanel from './FollowUp/FollowUpPanel'
import { exportCanvasPdf } from '../utils/exportPdf'
import useCanvas from '../hooks/useCanvas'
import useTranslation from '../hooks/useTranslation'
import Button from './Common/Button'

export default function Layout() {
  const { activeCanvas } = useCanvas()
  const { t } = useTranslation()
  const [showGenerate, setShowGenerate] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [toolbarHidden, setToolbarHidden] = useState(false)
  const canvasRef = useRef(null)
  const mainRef = useRef(null)
  const lastScrollY = useRef(0)

  const handleExport = useCallback(() => {
    if (canvasRef.current && activeCanvas) {
      exportCanvasPdf(canvasRef, activeCanvas.name)
    }
  }, [activeCanvas])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => {
      const y = el.scrollTop
      // Update state based on accumulated direction
      if (y > lastScrollY.current + 5 && y > 20) {
        setToolbarHidden(true)
        lastScrollY.current = y
      } else if (y < lastScrollY.current - 5 || y <= 20) {
        setToolbarHidden(false)
        lastScrollY.current = y
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="h-[100dvh] bg-surface dark:bg-dark-surface overflow-hidden relative">
      {/* Top Navigation Area - collapses on mobile scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-out shadow-sm dark:shadow-none bg-surface dark:bg-dark-surface ${toolbarHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}
      >
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-y-2 px-3 md:px-6 py-2 sm:py-3 border-b border-border dark:border-dark-border bg-white/80 dark:bg-dark-surface-alt/80 backdrop-blur-md transition-colors">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
              <GridViewIcon className="text-primary text-xl md:text-2xl" />
            </div>
            <h1 className="text-base md:text-xl font-bold text-text dark:text-dark-text tracking-tight">
              Lean Canvas <span className="text-primary">AI</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button className="btn-rainbow text-white !border-0 px-3 py-1.5 md:px-4 md:py-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={() => setShowGenerate(true)}>
              <AutoFixHighIcon sx={{ fontSize: 18 }} />
              <span className="hidden sm:inline font-medium">{t('toolbar.generateIdea')}</span>
              <span className="sm:hidden font-medium">Idea</span>
            </Button>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-2 border-l border-border dark:border-dark-border pl-4 ml-2">
              <LangToggle />
              <ThemeToggle />
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-2 md:px-6 py-2 relative z-30">
          <CanvasToolbar
            onValidate={() => setShowValidation(true)}
            onFollowUp={() => setShowFollowUp(true)}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Main content */}
      <main ref={mainRef} className="h-[100dvh] overflow-x-hidden overflow-y-auto scroll-smooth pt-[150px] md:pt-[130px]">
        <div className="w-full max-w-[1600px] mx-auto pb-8">
          <CanvasBoard ref={canvasRef} />
        </div>
      </main>

      {/* Modals */}
      <AIGenerateModal open={showGenerate} onClose={() => setShowGenerate(false)} />
      <AIValidation open={showValidation} onClose={() => setShowValidation(false)} />
      <FollowUpPanel open={showFollowUp} onClose={() => setShowFollowUp(false)} />
    </div>
  )
}
