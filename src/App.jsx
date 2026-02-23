import LandingPage from './pages/LandingPage'
import OutputMockupsPage from './pages/OutputMockupsPage'

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/mockups')) {
    return <OutputMockupsPage />
  }

  return <LandingPage />
}
