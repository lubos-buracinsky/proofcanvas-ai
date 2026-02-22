import { useState, useRef, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import GridViewIcon from '@mui/icons-material/GridView'
import ThemeToggle from './Common/ThemeToggle'
import LangToggle from './Common/LangToggle'
import CanvasToolbar from './Canvas/CanvasToolbar'
import CanvasBoard from './Canvas/CanvasBoard'
import AIGenerateModal from './AI/AIGenerateModal'
import AIAssistant from './AI/AIAssistant'
import AIValidation from './AI/AIValidation'
import AISuggestModal from './AI/AISuggestModal'
import FollowUpPanel from './FollowUp/FollowUpPanel'
import { exportCanvasPdf } from '../utils/exportPdf'
import useCanvas from '../hooks/useCanvas'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export default function Layout() {
  const { activeCanvas } = useCanvas()
  const [showGenerate, setShowGenerate] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [suggestBlockId, setSuggestBlockId] = useState(null)
  const canvasRef = useRef(null)
  const isMobile = useIsMobile()

  const handleExport = useCallback(() => {
    if (canvasRef.current && activeCanvas) {
      exportCanvasPdf(canvasRef, activeCanvas.name)
    }
  }, [activeCanvas])

  const handleSuggest = useCallback((blockId) => {
    setSuggestBlockId(blockId)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-surface dark:bg-dark-surface">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border dark:border-dark-border bg-white dark:bg-dark-surface-alt">
        <div className="flex items-center gap-2">
          <GridViewIcon className="text-primary" />
          <h1 className="text-base sm:text-lg font-bold text-text dark:text-dark-text">
            Lean Canvas <span className="text-primary">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Toolbar */}
      <CanvasToolbar
        onGenerate={() => setShowGenerate(true)}
        onValidate={() => setShowValidation(true)}
        onFollowUp={() => setShowFollowUp(true)}
        onExport={handleExport}
        onToggleChat={() => setShowChat(v => !v)}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas area */}
        <main className="flex-1 overflow-auto">
          <CanvasBoard ref={canvasRef} onSuggest={handleSuggest} />
        </main>

        {/* AI Chat sidebar - overlay on mobile, side panel on desktop */}
        <AnimatePresence>
          {showChat && (
            <>
              {/* Mobile backdrop */}
              {isMobile && (
                <motion.div
                  className="absolute inset-0 bg-black/40 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowChat(false)}
                />
              )}
              <motion.aside
                className={`${isMobile
                  ? 'absolute inset-y-0 right-0 w-[85vw] max-w-96 z-20 shadow-2xl'
                  : 'w-80 lg:w-96 flex-shrink-0'
                } border-l border-border dark:border-dark-border bg-white dark:bg-dark-surface-alt overflow-hidden`}
                initial={isMobile ? { x: '100%' } : { width: 0, opacity: 0 }}
                animate={isMobile ? { x: 0 } : { width: undefined, opacity: 1 }}
                exit={isMobile ? { x: '100%' } : { width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <AIAssistant onClose={() => setShowChat(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AIGenerateModal open={showGenerate} onClose={() => setShowGenerate(false)} />
      <AIValidation open={showValidation} onClose={() => setShowValidation(false)} />
      <AISuggestModal blockId={suggestBlockId} onClose={() => setSuggestBlockId(null)} />
      <FollowUpPanel open={showFollowUp} onClose={() => setShowFollowUp(false)} />
    </div>
  )
}
