import { useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useTranslation from '../../hooks/useTranslation'
import useCanvas from '../../hooks/useCanvas'
import useAI from '../../hooks/useAI'
import Button from '../Common/Button'

function BlockScoreBadge({ score, isLoading }) {
  if (isLoading) {
    return <span className="text-[11px] font-bold text-amber-500 animate-pulse px-1.5 py-0.5">...</span>
  }
  if (score == null) return null
  const s = typeof score === 'object' ? score.score : score
  if (s == null) return null

  const colorClass = s >= 7
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
    : s >= 4
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
      : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'

  return (
    <span
      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${colorClass}`}
      title={typeof score === 'object' ? score.summary || '' : ''}
    >
      {s}
    </span>
  )
}

function collectSSE(res) {
  return new Promise(async (resolve) => {
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
    resolve(fullText)
  })
}

export default function CanvasBlock({ block, value, subsectionValue, onChange, index, posOverride }) {
  const { t } = useTranslation()
  const { activeCanvas, blockScores, setBlockScoreData, updateBlock, suggestions, setSuggestionsData, setScoreData } = useCanvas()
  const [showInfo, setShowInfo] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [blockScoreLoading, setBlockScoreLoading] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)

  // AI suggestion streaming (for expanded view)
  const { isLoading: suggestLoading, streamedText: suggestStreamText, streamRequest, cancel: cancelSuggest, reset: resetSuggest } = useAI()

  const blockScore = blockScores?.[block.id] || null
  const savedSuggestion = suggestions?.[block.id] || ''

  const handleChange = useCallback((e) => {
    onChange(block.id, e.target.value)
  }, [block.id, onChange])

  const handleSubChange = useCallback((e) => {
    if (block.subsection) {
      onChange(block.subsection.id, e.target.value)
    }
  }, [block.subsection, onChange])

  const fetchBlockScore = useCallback(async () => {
    if (!activeCanvas || !value?.trim()) return
    setBlockScoreLoading(true)
    try {
      const res = await fetch('/api/ai/block-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: block.id, blocks: activeCanvas.blocks }),
      })
      const fullText = await collectSSE(res)
      try {
        const scoreObj = JSON.parse(fullText)
        setBlockScoreData(block.id, scoreObj)
      } catch {
        const match = fullText.match(/\{[\s\S]*\}/)
        if (match) setBlockScoreData(block.id, JSON.parse(match[0]))
      }
    } catch {} finally {
      setBlockScoreLoading(false)
    }
  }, [activeCanvas, block.id, value, setBlockScoreData])

  const handleImprove = useCallback(async () => {
    if (!expanded) setExpanded(true)
    if (!activeCanvas) return
    resetSuggest()
    try {
      const fullText = await streamRequest('/api/ai/suggest', { blockId: block.id, blocks: activeCanvas.blocks })
      setSuggestionsData(block.id, fullText)
    } catch {}
  }, [expanded, activeCanvas, block.id, streamRequest, resetSuggest, setSuggestionsData])

  const handleApply = useCallback(async () => {
    if (!activeCanvas) return
    setApplyLoading(true)
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: block.id, blocks: activeCanvas.blocks, format: 'replace' }),
      })
      const fullText = await collectSSE(res)
      if (fullText.trim()) {
        updateBlock(block.id, fullText.trim())
        // Clear overall score to trigger re-fetch
        setScoreData(null)
        // Re-score this block
        setTimeout(() => fetchBlockScore(), 500)
      }
    } catch {} finally {
      setApplyLoading(false)
    }
  }, [activeCanvas, block.id, updateBlock, setScoreData, fetchBlockScore])

  const displaySuggestText = suggestLoading ? suggestStreamText : savedSuggestion
  const hasSuggestions = !!(displaySuggestText || suggestLoading)

  // Auto-fetch block score when canvas loads and block has content
  useEffect(() => {
    if (value?.trim() && !blockScore && !blockScoreLoading) {
      const timer = setTimeout(() => fetchBlockScore(), index * 400)
      return () => clearTimeout(timer)
    }
  }, [activeCanvas?.id, value, blockScore, blockScoreLoading])

  // Lock body scroll when expanded
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [expanded])

  return (
    <>
      {/* Normal block view */}
      <motion.div
        className={`relative flex flex-col border-t-4 ${block.colorClass} rounded-xl
          bg-white dark:bg-dark-surface-alt border border-border dark:border-dark-border
          shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
        style={{
          gridColumn: posOverride?.gridColumn || block.gridColumn,
          gridRow: posOverride?.gridRow || block.gridRow,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-3 pb-2 border-b border-border/50 dark:border-dark-border/50">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            {block.icon && (
              <block.icon sx={{ fontSize: 18 }} className="text-text-secondary dark:text-dark-text-secondary flex-shrink-0 opacity-60" />
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold uppercase tracking-wide text-text dark:text-dark-text truncate leading-tight">
                {t(`block.${block.id}`)}
              </h3>
              <p className="text-[11px] text-text-secondary dark:text-dark-text-secondary mt-0.5 line-clamp-1">
                {t(`block.${block.id}.sub`)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <BlockScoreBadge score={blockScore} isLoading={blockScoreLoading} />
            <button
              onClick={() => setShowInfo(v => !v)}
              className="p-1 rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover
                transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
              title={t(`block.${block.id}.info`) || ''}
            >
              <InfoOutlinedIcon sx={{ fontSize: 15 }} />
            </button>
            <button
              onClick={handleImprove}
              className="p-1 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20
                transition-colors text-primary cursor-pointer flex items-center gap-0.5"
              title={t('block.improve')}
            >
              <AutoAwesomeIcon sx={{ fontSize: 15 }} />
              <span className="text-[10px] font-medium">{t('block.improve')}</span>
            </button>
          </div>
        </div>

        {/* Info tooltip */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="mx-3 mb-2 p-2.5 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 text-xs text-text-secondary dark:text-dark-text-secondary leading-relaxed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {t(`block.${block.id}.info`)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area - fixed height with overflow */}
        <div className={`flex-1 flex flex-col overflow-hidden ${block.subsection ? '' : 'pb-3'}`}>
          {/* Text preview (truncated) */}
          {value ? (
            <div
              className="px-3 pt-1 text-sm text-text dark:text-dark-text whitespace-pre-wrap overflow-hidden"
              style={{ display: '-webkit-box', WebkitLineClamp: block.subsection ? 5 : 8, WebkitBoxOrient: 'vertical', cursor: 'pointer' }}
              onClick={() => setExpanded(true)}
              role="button"
              tabIndex={0}
            >
              {value}
            </div>
          ) : (
            <textarea
              value=""
              onChange={handleChange}
              placeholder={t(`block.${block.id}.ph`)}
              className="canvas-textarea w-full px-3 text-sm bg-transparent resize-none flex-1
                text-text dark:text-dark-text placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
                focus:outline-none"
            />
          )}
        </div>

        {/* Subsection */}
        {block.subsection && (
          <div className="border-t border-dashed border-border dark:border-dark-border mx-2">
            <div className="px-1 pt-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
                {t(`block.${block.subsection.id}`)}
              </span>
            </div>
            {subsectionValue ? (
              <div
                className="px-1 pb-2 text-sm text-text dark:text-dark-text whitespace-pre-wrap overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
              >
                {subsectionValue}
              </div>
            ) : (
              <textarea
                value=""
                onChange={handleSubChange}
                placeholder={t(`block.${block.subsection.id}.ph`)}
                className="canvas-textarea w-full px-1 pb-2 text-sm bg-transparent resize-none
                  text-text dark:text-dark-text placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
                  focus:outline-none"
                style={{ minHeight: '40px' }}
              />
            )}
          </div>
        )}

        {/* Expand icon at bottom-right */}
        <button
          onClick={() => setExpanded(true)}
          className="absolute bottom-1 right-1 p-1 rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover
            transition-colors text-text-secondary/40 hover:text-text-secondary dark:text-dark-text-secondary/40 dark:hover:text-dark-text-secondary cursor-pointer"
          title={t('block.expand')}
        >
          <FullscreenIcon sx={{ fontSize: 16 }} />
        </button>
      </motion.div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-surface dark:bg-dark-surface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Expanded header */}
            <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b-4 ${block.colorClass} bg-white dark:bg-dark-surface-alt`}>
              <div className="flex items-center gap-3">
                {block.icon && <block.icon className="text-text-secondary dark:text-dark-text-secondary" />}
                <div>
                  <h2 className="text-lg font-bold text-text dark:text-dark-text">{t(`block.${block.id}`)}</h2>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{t(`block.${block.id}.sub`)}</p>
                </div>
                <BlockScoreBadge score={blockScore} isLoading={blockScoreLoading} />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleImprove} disabled={suggestLoading}>
                  <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                  {suggestLoading ? t('ai.improving') : t('block.improve')}
                </Button>
                {!blockScore && value?.trim() && (
                  <Button variant="ghost" size="sm" onClick={fetchBlockScore} disabled={blockScoreLoading}>
                    {blockScoreLoading ? '...' : 'Score'}
                  </Button>
                )}
                <button
                  onClick={() => { setExpanded(false); if (suggestLoading) cancelSuggest(); resetSuggest() }}
                  className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover text-text-secondary dark:text-dark-text-secondary cursor-pointer"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Expanded content */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              {/* Left: textarea */}
              <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-auto">
                <textarea
                  value={value || ''}
                  onChange={handleChange}
                  placeholder={t(`block.${block.id}.ph`)}
                  className="flex-1 w-full text-sm bg-white dark:bg-dark-surface-alt rounded-xl border border-border dark:border-dark-border p-4 resize-none
                    text-text dark:text-dark-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ minHeight: '200px' }}
                />
                {block.subsection && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary mb-2 block">
                      {t(`block.${block.subsection.id}`)}
                    </label>
                    <textarea
                      value={subsectionValue || ''}
                      onChange={handleSubChange}
                      placeholder={t(`block.${block.subsection.id}.ph`)}
                      className="w-full text-sm bg-white dark:bg-dark-surface-alt rounded-xl border border-border dark:border-dark-border p-4 resize-none
                        text-text dark:text-dark-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      style={{ minHeight: '100px' }}
                    />
                  </div>
                )}
              </div>

              {/* Right: AI suggestions panel */}
              {hasSuggestions && (
                <div className="w-full sm:w-96 border-t sm:border-t-0 sm:border-l border-border dark:border-dark-border bg-surface-alt dark:bg-dark-surface-alt flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b border-border dark:border-dark-border flex items-center justify-between flex-shrink-0">
                    <h3 className="text-sm font-bold text-text dark:text-dark-text">{t('ai.suggestTitle')}</h3>
                    {!suggestLoading && displaySuggestText && (
                      <button onClick={handleImprove} className="p-1 rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover cursor-pointer text-text-secondary">
                        <RefreshIcon sx={{ fontSize: 16 }} />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    {suggestLoading && !suggestStreamText && (
                      <div className="flex items-center gap-2 py-4 justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{t('ai.suggestLoading')}</span>
                      </div>
                    )}
                    {displaySuggestText && (
                      <div className="ai-markdown text-sm text-text dark:text-dark-text">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{displaySuggestText}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {displaySuggestText && !suggestLoading && (
                    <div className="px-4 py-3 border-t border-border dark:border-dark-border flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={handleApply}
                        disabled={applyLoading}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                        {applyLoading ? t('ai.improving') : t('ai.usesuggestion')}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
