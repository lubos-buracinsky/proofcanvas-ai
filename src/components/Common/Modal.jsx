import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import CloseIcon from '@mui/icons-material/Close'

export default function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className={`relative bg-surface dark:bg-dark-surface-alt rounded-2xl shadow-2xl overflow-hidden
              ${wide ? 'w-full max-w-4xl' : 'w-full max-w-lg'}
              max-h-[90vh] flex flex-col`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-dark-border">
                <h2 className="text-lg font-semibold text-text dark:text-dark-text">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
