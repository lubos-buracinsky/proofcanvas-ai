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
      const delta = y - lastScrollY.current
      if (delta > 8 && y > 60) setToolbarHidden(true)
      else if (delta < -8) setToolbarHidden(false)
      lastScrollY.current = y
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="h-[100dvh] flex flex-col bg-surface dark:bg-dark-surface overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 md:px-6 py-3 border-b border-border dark:border-dark-border bg-white/80 dark:bg-dark-surface-alt/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
            <GridViewIcon className="text-primary text-xl md:text-2xl" />
          </div>
          <h1 className="text-base md:text-xl font-bold text-text dark:text-dark-text tracking-tight">
            Lean Canvas <span className="text-primary">AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" className="btn-rainbow text-white shadow-md hover:shadow-lg transition-shadow" onClick={() => setShowGenerate(true)}>
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

      {/* Toolbar - collapses on scroll down relative to content layout*/}
      <div className="relative z-30 shadow-sm dark:shadow-none">
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden transform-gpu"
          style={{
            maxHeight: toolbarHidden ? 0 : 250,
            opacity: toolbarHidden ? 0 : 1,
            transform: `translateY(${toolbarHidden ? '-10px' : '0'})`
          }}
        >
          <div className="px-2 md:px-6 py-2">
            <CanvasToolbar
              onValidate={() => setShowValidation(true)}
              onFollowUp={() => setShowFollowUp(true)}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
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
