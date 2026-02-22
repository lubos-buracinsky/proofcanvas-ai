import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import CloseIcon from '@mui/icons-material/Close'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import BuildIcon from '@mui/icons-material/Build'
import PeopleIcon from '@mui/icons-material/People'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ScienceIcon from '@mui/icons-material/Science'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import generatePdf from 'react-to-pdf'
import FollowUpTab from './FollowUpTab'
import useTranslation from '../../hooks/useTranslation'

const TAB_IDS = [
  { id: 'mvp', key: 'followup.mvp', icon: BuildIcon },
  { id: 'interviews', key: 'followup.interviews', icon: PeopleIcon },
  { id: 'gtm', key: 'followup.gtm', icon: RocketLaunchIcon },
  { id: 'experiments', key: 'followup.experiments', icon: ScienceIcon },
  { id: 'actionplan', key: 'followup.actionplan', icon: CalendarMonthIcon },
]

export default function FollowUpPanel({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('mvp')
  const { t } = useTranslation()
  const contentRef = useRef(null)

  const handleExportPdf = useCallback(() => {
    if (!contentRef.current) return
    generatePdf(() => contentRef.current, {
      filename: `followup-${activeTab}.pdf`,
      page: { margin: 20 },
    })
  }, [activeTab])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-surface dark:bg-dark-surface"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border dark:border-dark-border bg-white dark:bg-dark-surface-alt">
          <h2 className="text-lg font-bold text-text dark:text-dark-text">{t('followup.title')}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover text-text-secondary dark:text-dark-text-secondary cursor-pointer"
              title={t('followup.exportPdf')}
            >
              <PictureAsPdfIcon />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover text-text-secondary dark:text-dark-text-secondary cursor-pointer">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="flex gap-1 px-3 sm:px-6 py-2 sm:py-3 border-b border-border dark:border-dark-border bg-surface-alt dark:bg-dark-surface-alt overflow-x-auto">
          {TAB_IDS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer
                  ${activeTab === tab.id ? 'bg-primary text-white' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover'}`}
              >
                <Icon sx={{ fontSize: 18 }} />
                {t(tab.key)}
              </button>
            )
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-6" ref={contentRef}>
          <FollowUpTab type={activeTab} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
