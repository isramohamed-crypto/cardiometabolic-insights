import { useLocation } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import './Header.css'

// Per-tab H1 phrase. Only Routine's has been specified so far — the
// others fall back to a plain section title until their copy is set.
const PHRASES = {
  '/routine': 'Getting started is the hardest part.',
}

const TITLES = {
  '/routine': 'Routine',
  '/read': 'Read',
  '/collection': 'Collection',
  '/me': 'Me',
}

function Header() {
  const { pathname } = useLocation()
  const { answers } = useOnboarding()

  const greeting = answers.name ? `Welcome back, ${answers.name}` : 'Welcome'
  const phrase = PHRASES[pathname] || TITLES[pathname] || 'Vitalist'

  return (
    <header className="app-header">
      <p className="app-header__eyebrow">{greeting}</p>
      <h1 className="app-header__title">{phrase}</h1>
    </header>
  )
}

export default Header
