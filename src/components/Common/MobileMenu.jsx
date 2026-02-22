import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
                aria-label="Open menu"
            >
                <MenuIcon />
            </button>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="relative z-[10000]">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/50"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 bottom-0 w-64 bg-surface dark:bg-dark-surface shadow-xl flex flex-col"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border">
                                    <span className="font-bold text-text dark:text-dark-text">Menu</span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Theme</span>
                                        <ThemeToggle />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Language</span>
                                        <LangToggle />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}
