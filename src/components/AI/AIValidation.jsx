import { useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RefreshIcon from '@mui/icons-material/Refresh'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import useAI from '../../hooks/useAI'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'

export default function AIValidation({ open, onClose }) {
  const { isLoading, streamedText, streamRequest, cancel, reset } = useAI()
  const { activeCanvas, validation, setValidationData } = useCanvas()
  const { t } = useTranslation()

  const runValidation = useCallback(async () => {
    if (!activeCanvas) return
    reset()
    try {
      const fullText = await streamRequest('/api/ai/validate', { blocks: activeCanvas.blocks })
      setValidationData(fullText)
    } catch {}
  }, [activeCanvas, streamRequest, setValidationData, reset])

  useEffect(() => {
    if (open && activeCanvas && !validation) {
      runValidation()
    }
  }, [open])

  const handleClose = useCallback(() => {
    if (isLoading) cancel()
    reset()
    onClose()
  }, [isLoading, cancel, reset, onClose])

  const displayText = isLoading ? streamedText : (validation || '')

  return (
    <Modal open={open} onClose={handleClose} title={t('ai.validationTitle')} wide>
      <div className="min-h-[200px]">
        {isLoading && !streamedText && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('ai.validating')}</span>
          </div>
        )}
        {displayText && (
          <div className="ai-markdown text-sm text-text dark:text-dark-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>
          </div>
        )}
        {!displayText && !isLoading && (
          <div className="text-center py-8 text-text-secondary dark:text-dark-text-secondary text-sm">
            {t('ai.validationEmpty')}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          {!isLoading && (
            <Button variant="secondary" onClick={runValidation}>
              <RefreshIcon sx={{ fontSize: 16 }} />
              {t('ai.revalidate')}
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
