import { useLocation } from 'react-router-dom'
import './Header.css'

const TITLES = {
  '/routine': 'Routine',
  '/read': 'Read',
  '/collection': 'Collection',
  '/me': 'Me',
}

function Header() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Vitalist'

  return (
    <header className="app-header">
      <p className="app-header__wordmark">Vitalist</p>
      <h1 className="app-header__title">{title}</h1>
    </header>
  )
}

export default Header
