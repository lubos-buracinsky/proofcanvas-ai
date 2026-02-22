import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ChatIcon from '@mui/icons-material/Chat'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'
import Button from '../Common/Button'

export default function CanvasToolbar({ onGenerate, onValidate, onFollowUp, onExport, onToggleChat }) {
  const { activeCanvas, canvases, createCanvas, deleteCanvas, setActiveCanvas, updateCanvasName, filledCount, isEmpty } = useCanvas()
  const { t } = useTranslation()
  const [editingName, setEditingName] = useState(false)

  if (!activeCanvas) return null

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 border-b border-border dark:border-dark-border bg-surface-alt dark:bg-dark-surface-alt">
      {/* Canvas selector */}
      <div className="flex items-center gap-2">
        <select
          value={activeCanvas.id}
          onChange={e => setActiveCanvas(e.target.value)}
          className="text-sm bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg px-2 sm:px-3 py-1.5 text-text dark:text-dark-text cursor-pointer max-w-[140px] sm:max-w-none truncate"
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

      {/* Canvas name */}
      <div className="flex-1 min-w-0 hidden sm:block">
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
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
        <div className="w-16 sm:w-20 h-1.5 bg-border dark:bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(filledCount / 9) * 100}%` }}
          />
        </div>
        <span>{filledCount}/9</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="primary" size="sm" onClick={onGenerate}>
          <AutoFixHighIcon sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">{t('toolbar.generate')}</span>
        </Button>

        <Button variant="secondary" size="sm" onClick={onValidate} disabled={isEmpty}>
          <FactCheckIcon sx={{ fontSize: 16 }} />
          <span className="hidden md:inline">{t('toolbar.validate')}</span>
        </Button>

        <Button variant="secondary" size="sm" onClick={onFollowUp} disabled={isEmpty}>
          <RocketLaunchIcon sx={{ fontSize: 16 }} />
          <span className="hidden md:inline">{t('toolbar.followup')}</span>
        </Button>

        <Button variant="secondary" size="sm" onClick={onExport} disabled={isEmpty}>
          <PictureAsPdfIcon sx={{ fontSize: 16 }} />
          <span className="hidden lg:inline">PDF</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={onToggleChat}>
          <ChatIcon sx={{ fontSize: 16 }} />
        </Button>
      </div>
    </div>
  )
}
