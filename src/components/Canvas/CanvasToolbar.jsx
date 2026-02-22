import { useState, useCallback, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PersonIcon from '@mui/icons-material/Person'
import GradeIcon from '@mui/icons-material/Grade'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'
import Button from '../Common/Button'

function ScoreBadge({ score, isLoading, onClick }) {
  if (isLoading) {
    return (
      <button
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse cursor-pointer"
        disabled
      >
        <GradeIcon sx={{ fontSize: 14 }} />
        ...
      </button>
    )
  }

  if (!score) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-alt dark:bg-dark-surface border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary text-xs font-medium hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors cursor-pointer"
        title="AI hodnocení"
      >
        <GradeIcon sx={{ fontSize: 14 }} />
        AI
      </button>
    )
  }

  const s = score.score
  const color = s >= 7 ? 'emerald' : s >= 4 ? 'amber' : 'red'
  const bgClass = `bg-${color}-50 dark:bg-${color}-900/20 border-${color}-200 dark:border-${color}-800 text-${color}-600 dark:text-${color}-400`

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity ${bgClass}`}
      title={score.summary || 'AI hodnocení'}
    >
      <GradeIcon sx={{ fontSize: 14 }} />
      {s}/10
    </button>
  )
}

export default function CanvasToolbar({ onGenerate, onValidate, onFollowUp, onExport }) {
  const { activeCanvas, canvases, createCanvas, deleteCanvas, setActiveCanvas, updateCanvasName, filledCount, isEmpty, score, setScoreData } = useCanvas()
  const { t } = useTranslation()
  const [editingName, setEditingName] = useState(false)
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

      // Parse the JSON response
      try {
        const scoreObj = JSON.parse(fullText)
        setScoreData(scoreObj)
      } catch {
        // Try extracting JSON from text
        const match = fullText.match(/\{[\s\S]*\}/)
        if (match) {
          setScoreData(JSON.parse(match[0]))
        }
      }
    } catch {} finally {
      setScoringLoading(false)
    }
  }, [activeCanvas, isEmpty, setScoreData])

  if (!activeCanvas) return null

  return (
    <div className="flex flex-col border-b border-border dark:border-dark-border bg-surface-alt dark:bg-dark-surface-alt">
      {/* Row 1: Canvas selector + name + actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3">
        {/* Canvas selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={activeCanvas.id}
            onChange={e => setActiveCanvas(e.target.value)}
            className="text-sm bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-2 sm:px-3 py-1.5 text-text dark:text-dark-text cursor-pointer flex-1 sm:flex-none sm:max-w-none truncate"
          >
            {canvases.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => createCanvas()}
            className="p-1.5 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover text-text-secondary dark:text-dark-text-secondary cursor-pointer"
            title={t('toolbar.new')}
          >
            <AddIcon fontSize="small" />
          </button>

          {canvases.length > 1 && (
            <button
              onClick={() => {
                if (confirm(t('toolbar.deleteConfirm'))) deleteCanvas(activeCanvas.id)
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer"
              title={t('toolbar.delete')}
            >
              <DeleteOutlineIcon fontSize="small" />
            </button>
          )}
        </div>

        {/* Canvas name + author (desktop) */}
        <div className="flex-1 min-w-0 hidden sm:flex sm:items-center sm:gap-3">
          {editingName ? (
            <input
              autoFocus
              className="text-sm font-medium bg-white dark:bg-dark-surface border border-primary rounded-lg px-3 py-1.5 text-text dark:text-dark-text w-full max-w-xs"
              value={activeCanvas.name}
              onChange={e => updateCanvasName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-sm font-medium text-text dark:text-dark-text hover:text-primary transition-colors cursor-pointer truncate max-w-xs block"
            >
              {activeCanvas.name}
            </button>
          )}
          {activeCanvas.author && (
            <span className="flex items-center gap-1 text-xs text-text-secondary dark:text-dark-text-secondary bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-full px-2.5 py-1 flex-shrink-0">
              <PersonIcon sx={{ fontSize: 14 }} />
              {activeCanvas.author}
            </span>
          )}
        </div>

        {/* Score + Progress (desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {!isEmpty && (
            <ScoreBadge score={score} isLoading={scoringLoading} onClick={fetchScore} />
          )}
          <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
            <div className="w-20 h-1.5 bg-border dark:bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(filledCount / 9) * 100}%` }}
              />
            </div>
            <span>{filledCount}/9</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant={isEmpty ? 'primary' : 'secondary'} size="sm" onClick={onGenerate}>
            <AutoFixHighIcon sx={{ fontSize: 16 }} />
            {t('toolbar.generate')}
          </Button>

          <Button variant={isEmpty ? 'secondary' : 'primary'} size="sm" onClick={onValidate} disabled={isEmpty}>
            <FactCheckIcon sx={{ fontSize: 16 }} />
            {t('toolbar.validate')}
          </Button>

          <Button variant="secondary" size="sm" onClick={onFollowUp} disabled={isEmpty}>
            <RocketLaunchIcon sx={{ fontSize: 16 }} />
            {t('toolbar.followup')}
          </Button>

          <Button variant="secondary" size="sm" onClick={onExport} disabled={isEmpty}>
            <PictureAsPdfIcon sx={{ fontSize: 16 }} />
            PDF
          </Button>
        </div>
      </div>

      {/* Row 2: Mobile-only progress + score + author */}
      <div className="flex sm:hidden items-center gap-3 px-2 pb-2">
        {activeCanvas.author && (
          <span className="flex items-center gap-1 text-xs text-text-secondary dark:text-dark-text-secondary">
            <PersonIcon sx={{ fontSize: 14 }} />
            {activeCanvas.author}
          </span>
        )}
        {!isEmpty && (
          <ScoreBadge score={score} isLoading={scoringLoading} onClick={fetchScore} />
        )}
        <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary ml-auto">
          <div className="w-16 h-1.5 bg-border dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(filledCount / 9) * 100}%` }}
            />
          </div>
          <span>{filledCount}/9</span>
        </div>
      </div>
    </div>
  )
}
