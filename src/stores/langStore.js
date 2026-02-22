import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useLangStore = create(
  persist(
    (set) => ({
      lang: 'cs',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set(state => ({ lang: state.lang === 'cs' ? 'en' : 'cs' })),
    }),
    { name: 'leancanvas-lang' }
  )
)

export default useLangStore
