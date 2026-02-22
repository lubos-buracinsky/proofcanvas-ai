import { useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RefreshIcon from '@mui/icons-material/Refresh'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import useAI from '../../hooks/useAI'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'
import { BLOCKS } from '../../utils/canvasHelpers'

export default function AISuggestModal({ blockId, onClose }) {
  const { isLoading, streamedText, streamRequest, cancel, reset } = useAI()
  const { activeCanvas, suggestions, setSuggestionsData } = useCanvas()
  const { t } = useTranslation()

  const block = BLOCKS.find(b => b.id === blockId)
  const open = !!blockId
  const savedData = blockId ? suggestions[blockId] : ''

  const runSuggest = useCallback(async () => {
    if (!activeCanvas || !blockId) return
    reset()
    try {
      const fullText = await streamRequest('/api/ai/suggest', { blockId, blocks: activeCanvas.blocks })
      setSuggestionsData(blockId, fullText)
    } catch {}
  }, [activeCanvas, blockId, streamRequest, setSuggestionsData, reset])

  useEffect(() => {
    if (open && activeCanvas && blockId && !savedData) {
      runSuggest()
    }
  }, [open, blockId])

  const handleClose = useCallback(() => {
    if (isLoading) cancel()
    reset()
    onClose()
  }, [isLoading, cancel, reset, onClose])

  const displayText = isLoading ? streamedText : (savedData || '')

  return (
    <Modal open={open} onClose={handleClose} title={`${t('ai.suggestTitle')}: ${t(`block.${block?.id}`) || ''}`}>
      <div className="min-h-[150px]">
        {isLoading && !streamedText && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('ai.suggestLoading')}</span>
          </div>
        )}
        {displayText && (
          <div className="ai-markdown text-sm text-text dark:text-dark-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>
          </div>
        )}
        {!displayText && !isLoading && (
          <div className="text-center py-8 text-text-secondary dark:text-dark-text-secondary text-sm">
            {t('ai.suggestEmpty')}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          {!isLoading && (
            <Button variant="secondary" onClick={runSuggest}>
              <RefreshIcon sx={{ fontSize: 16 }} />
              {t('ai.suggestRegen')}
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            {isLoading ? t('stop') : t('close')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
