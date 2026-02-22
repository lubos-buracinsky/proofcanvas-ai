import { motion } from 'motion/react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary: 'bg-white dark:bg-dark-surface-alt text-text dark:text-dark-text border border-border dark:border-dark-border hover:bg-surface-hover dark:hover:bg-dark-surface-hover',
  ghost: 'text-text-secondary dark:text-dark-text-secondary hover:bg-surface-hover dark:hover:bg-dark-surface-hover',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs gap-1',
  md: 'px-4 py-2 text-sm gap-1.5',
  lg: 'px-6 py-3 text-base gap-2',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer
        ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}
