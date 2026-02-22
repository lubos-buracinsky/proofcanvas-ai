import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import useTranslation from '../../hooks/useTranslation'

export default function CanvasBlock({ block, value, subsectionValue, onChange, onSuggest, index, posOverride }) {
  const { t } = useTranslation()
  const [showInfo, setShowInfo] = useState(false)

  const handleChange = useCallback((e) => {
    onChange(block.id, e.target.value)
  }, [block.id, onChange])

  const handleSubChange = useCallback((e) => {
    if (block.subsection) {
      onChange(block.subsection.id, e.target.value)
    }
  }, [block.subsection, onChange])

  return (
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
      <div className="flex items-start justify-between px-3 pt-3 pb-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text dark:text-dark-text truncate">
            {t(`block.${block.id}`)}
          </h3>
          <p className="text-[10px] text-text-secondary dark:text-dark-text-secondary mt-0.5 line-clamp-1">
            {t(`block.${block.id}.sub`)}
          </p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => setShowInfo(v => !v)}
            className="p-1 rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover
              transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
            title={t(`block.${block.id}.info`) || ''}
          >
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
          </button>
          <button
            onClick={() => onSuggest(block.id)}
            className="p-1 rounded-md hover:bg-surface-hover dark:hover:bg-dark-surface-hover
              transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
            title={t('ai.suggestion')}
          >
            <AutoAwesomeIcon sx={{ fontSize: 14 }} />
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

      {/* Main textarea */}
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={t(`block.${block.id}.ph`)}
        className={`canvas-textarea w-full px-3 text-sm bg-transparent resize-none
          text-text dark:text-dark-text placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
          focus:outline-none ${block.subsection ? 'flex-1' : 'flex-1 pb-3'}`}
      />

      {/* Subsection */}
      {block.subsection && (
        <div className="border-t border-dashed border-border dark:border-dark-border mx-2">
          <div className="px-1 pt-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
              {t(`block.${block.subsection.id}`)}
            </span>
          </div>
          <textarea
            value={subsectionValue || ''}
            onChange={handleSubChange}
            placeholder={t(`block.${block.subsection.id}.ph`)}
            className="canvas-textarea w-full px-1 pb-2 text-sm bg-transparent resize-none
              text-text dark:text-dark-text placeholder:text-text-secondary/50 dark:placeholder:text-dark-text-secondary/50
              focus:outline-none"
            style={{ minHeight: '40px' }}
          />
        </div>
      )}
    </motion.div>
  )
}
