import { NavLink } from 'react-router-dom'
import './Footer.css'

const TABS = [
  { to: '/routine', label: 'Routine' },
  { to: '/read', label: 'Read' },
  { to: '/collection', label: 'Collection' },
  { to: '/me', label: 'Me' },
]

function Footer() {
  return (
    <nav className="app-footer" aria-label="Primary">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `app-footer__tab${isActive ? ' app-footer__tab--active' : ''}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Footer
