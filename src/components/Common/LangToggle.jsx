import useLangStore from '../../stores/langStore'

export default function LangToggle() {
  const { lang, toggleLang } = useLangStore()

  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 rounded-lg text-xs font-bold border border-border dark:border-dark-border
        hover:bg-surface-hover dark:hover:bg-dark-surface-hover transition-colors cursor-pointer
        text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider"
      title={lang === 'cs' ? 'Switch to English' : 'Přepnout na češtinu'}
    >
      {lang === 'cs' ? 'CZ' : 'EN'}
    </button>
  )
}
