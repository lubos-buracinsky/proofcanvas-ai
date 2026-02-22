import { useState, useCallback } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import useAI from '../../hooks/useAI'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'

function parseCanvasJSON(text) {
  try {
    const parsed = JSON.parse(text)
    if (parsed.problem) return parsed
  } catch {}
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim())
      if (parsed.problem) return parsed
    } catch {}
  }
  const jsonMatch = text.match(/\{[\s\S]*"problem"[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.problem) return parsed
    } catch {}
  }
  return null
}

export default function AIGenerateModal({ open, onClose }) {
  const [idea, setIdea] = useState('')
  const [error, setError] = useState('')
  const { isLoading, streamedText, streamRequest, cancel, reset } = useAI()
  const { setCanvasBlocks, updateCanvasName } = useCanvas()
  const { t } = useTranslation()

  const handleGenerate = useCallback(async () => {
    if (!idea.trim()) return
    setError('')
    try {
      const fullText = await streamRequest('/api/ai/generate', { idea: idea.trim() })
      const parsed = parseCanvasJSON(fullText)
      if (parsed) {
        setCanvasBlocks(parsed)
        const name = idea.trim().length > 40 ? idea.trim().slice(0, 40) + '...' : idea.trim()
        updateCanvasName(name)
        setTimeout(() => { reset(); setIdea(''); onClose() }, 500)
      } else {
        setError(t('ai.parseFailed'))
      }
    } catch (err) {
      setError(err.message)
    }
  }, [idea, streamRequest, setCanvasBlocks, updateCanvasName, reset, onClose, t])

  const handleClose = () => { if (isLoading) cancel(); reset(); setError(''); onClose() }

  return (
    <Modal open={open} onClose={handleClose} title={t('ai.generateTitle')}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text dark:text-dark-text mb-2">
            {t('ai.describeIdea')}
          </label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder={t('ai.ideaPlaceholder')}
            className="w-full h-32 px-4 py-3 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-surface
              text-text dark:text-dark-text placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
            disabled={isLoading}
          />
        </div>
        {isLoading && (
          <div className="rounded-xl bg-surface-alt dark:bg-dark-surface p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary">{t('ai.generating')}</span>
            </div>
            <pre className="text-xs text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap max-h-48 overflow-auto">
              {streamedText}
            </pre>
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={handleGenerate} disabled={isLoading || !idea.trim()}>
            <AutoFixHighIcon sx={{ fontSize: 16 }} />
            {isLoading ? t('ai.generatingBtn') : t('ai.generateBtn')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
