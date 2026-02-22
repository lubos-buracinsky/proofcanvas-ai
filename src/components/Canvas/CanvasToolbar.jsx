import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import AddIcon from '@mui/icons-material/Add'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'
import Button from '../Common/Button'

function InlineScore({ score, isLoading }) {
  if (isLoading) {
    return <span className="text-sm font-bold text-amber-500 animate-pulse">...</span>
  }
  if (!score) return null
  const s = score.score
  const colorClass = s >= 7 ? 'text-emerald-600 dark:text-emerald-400' : s >= 4 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
  return (
    <span className={`text-base font-bold ${colorClass}`} title={score.summary || ''}>
      {s}/10
    </span>
  )
}

function CanvasDropdown({ canvases, activeId, onChange, onCreate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = canvases.find(c => c.id === activeId)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors cursor-pointer min-w-0 max-w-[260px]"
      >
        <span className="text-base font-semibold text-text dark:text-dark-text truncate" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {active?.name || '—'}
          {active?.author && <span className="text-text-secondary dark:text-dark-text-secondary ml-1">({active.author})</span>}
        </span>
        <KeyboardArrowDownIcon sx={{ fontSize: 18 }} className={`text-text-secondary dark:text-dark-text-secondary transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 min-w-[240px] max-w-[320px] bg-white dark:bg-dark-surface-alt border border-border dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {canvases.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onChange(c.id); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-surface-hover dark:hover:bg-dark-surface-hover
                    ${c.id === activeId ? 'bg-primary/5 dark:bg-primary/10 text-primary font-medium' : 'text-text dark:text-dark-text'}`}
                >
                  {c.name}
                  {c.author && <span className="text-text-secondary dark:text-dark-text-secondary ml-1 text-xs">({c.author})</span>}
                </button>
              ))}
            </div>
            <div className="border-t border-border dark:border-dark-border p-1">
              <button
                onClick={() => { onCreate(); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
              >
                <AddIcon sx={{ fontSize: 16 }} />
                Nový canvas
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CanvasToolbar({ onValidate, onFollowUp, onExport }) {
  const { activeCanvas, canvases, createCanvas, setActiveCanvas, isEmpty, score, setScoreData, validation } = useCanvas()
  const { t } = useTranslation()
  const [scoringLoading, setScoringLoading] = useState(false)

  const fetchScore = useCallback(async () => {
    if (!activeCanvas || isEmpty) return
    setScoringLoading(true)
    try {
      const res = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: activeCanvas.blocks }),
      })
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) fullText += parsed.text
            } catch {}
          }
        }
      }

      try {
        const scoreObj = JSON.parse(fullText)
        setScoreData(scoreObj)
      } catch {
        const match = fullText.match(/\{[\s\S]*\}/)
        if (match) {
          setScoreData(JSON.parse(match[0]))
        }
      }
    } catch {} finally {
      setScoringLoading(false)
    }
  }, [activeCanvas, isEmpty, setScoreData])

  // Auto-fetch score when canvas has content but no score
  useEffect(() => {
    if (activeCanvas && !isEmpty && !score && !scoringLoading) {
      fetchScore()
    }
  }, [activeCanvas?.id, isEmpty])

  if (!activeCanvas) return null

  const hasValidation = !!validation

  return (
    <div className="flex flex-col border-b border-border dark:border-dark-border bg-surface-alt dark:bg-dark-surface-alt">
      {/* Single row: Dropdown + Score + Validate ... spacer ... Follow-up + PDF */}
      <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3">
        <CanvasDropdown
          canvases={canvases}
          activeId={activeCanvas.id}
          onChange={setActiveCanvas}
          onCreate={() => createCanvas()}
        />

        {!isEmpty && (
          <button
            onClick={fetchScore}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            title={score?.summary || t('ai.scoring')}
          >
            <InlineScore score={score} isLoading={scoringLoading} />
          </button>
        )}

        <Button
          variant={isEmpty ? 'secondary' : 'dark'}
          size="md"
          onClick={onValidate}
          disabled={isEmpty}
        >
          <FactCheckIcon sx={{ fontSize: 18 }} />
          {hasValidation ? t('toolbar.validation') : t('toolbar.validate')}
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        <Button variant="dark" size="md" onClick={onFollowUp} disabled={isEmpty}>
          <RocketLaunchIcon sx={{ fontSize: 18 }} />
          {t('toolbar.followup')}
        </Button>

        <Button variant="ghost" size="sm" onClick={onExport} disabled={isEmpty}>
          <PictureAsPdfIcon sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">PDF</span>
        </Button>
      </div>
    </div>
  )
}
