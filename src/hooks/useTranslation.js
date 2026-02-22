import { useCallback } from 'react'
import useLangStore from '../stores/langStore'
import { t as translate } from '../utils/i18n'

export default function useTranslation() {
  const lang = useLangStore(s => s.lang)
  const t = useCallback((key) => translate(key, lang), [lang])
  return { t, lang }
}
