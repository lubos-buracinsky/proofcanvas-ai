import { useState, useRef, useCallback } from 'react'
import GridViewIcon from '@mui/icons-material/GridView'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ThemeToggle from './Common/ThemeToggle'
import LangToggle from './Common/LangToggle'
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
  const canvasRef = useRef(null)

  const handleExport = useCallback(() => {
    if (canvasRef.current && activeCanvas) {
      exportCanvasPdf(canvasRef, activeCanvas.name)
    }
  }, [activeCanvas])

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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="btn-rainbow text-white" onClick={() => setShowGenerate(true)}>
            <AutoFixHighIcon sx={{ fontSize: 16 }} />
            {t('toolbar.generateIdea')}
          </Button>
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-30">
        <CanvasToolbar
          onValidate={() => setShowValidation(true)}
          onFollowUp={() => setShowFollowUp(true)}
          onExport={handleExport}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <CanvasBoard ref={canvasRef} />
      </main>

      {/* Modals */}
      <AIGenerateModal open={showGenerate} onClose={() => setShowGenerate(false)} />
      <AIValidation open={showValidation} onClose={() => setShowValidation(false)} />
      <FollowUpPanel open={showFollowUp} onClose={() => setShowFollowUp(false)} />
    </div>
  )
}
