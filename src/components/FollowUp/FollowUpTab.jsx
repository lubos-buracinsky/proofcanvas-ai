import { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Button from '../Common/Button'
import useAI from '../../hooks/useAI'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'

const LABEL_KEYS = {
  mvp: 'followup.mvp',
  interviews: 'followup.interviews',
  gtm: 'followup.gtm',
  experiments: 'followup.experiments',
  actionplan: 'followup.actionplan',
}

export default function FollowUpTab({ type }) {
  const { isLoading, streamedText, streamRequest, cancel, reset } = useAI()
  const { activeCanvas, followUp, setFollowUpData } = useCanvas()
  const { t } = useTranslation()

  const savedData = followUp[type]

  const handleGenerate = useCallback(async () => {
    if (!activeCanvas) return
    reset()
    try {
      const fullText = await streamRequest('/api/ai/followup', { blocks: activeCanvas.blocks, type })
      setFollowUpData(type, fullText)
    } catch {}
  }, [activeCanvas, type, streamRequest, setFollowUpData, reset])

  const displayText = isLoading ? streamedText : (savedData || '')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-text dark:text-dark-text">{t(LABEL_KEYS[type])}</h3>
        <Button onClick={isLoading ? cancel : handleGenerate} disabled={!activeCanvas} variant={isLoading ? 'secondary' : 'primary'} size="md">
          <AutoFixHighIcon sx={{ fontSize: 16 }} />
          {isLoading ? t('followup.stop') : savedData ? t('followup.regenerate') : t('followup.generate')}
        </Button>
      </div>
      {!displayText && !isLoading && (
        <div className="text-center py-16 text-text-secondary dark:text-dark-text-secondary">
          <p className="text-sm">{t('followup.empty')}</p>
        </div>
      )}
      {isLoading && !streamedText && (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('followup.loading')}</span>
        </div>
      )}
      {displayText && (
        <div className="ai-markdown text-sm text-text dark:text-dark-text bg-white dark:bg-dark-surface-alt rounded-2xl border border-border dark:border-dark-border p-4 sm:p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayText}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
