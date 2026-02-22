import { useState, useEffect } from 'react'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import useTranslation from '../../hooks/useTranslation'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors text-text-secondary dark:text-dark-text-secondary cursor-pointer"
      title={dark ? t('theme.light') : t('theme.dark')}
    >
      {dark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  )
}
