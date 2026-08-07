import { NavLink } from 'react-router-dom'
import './Footer.css'

// Labels are the footer nav's own display text — the routes themselves
// (and each page's own H1 title, set independently in Header.jsx) keep
// their existing names, so this rename only changes what the tab bar
// itself reads, not what each section calls itself once you're in it.
const TABS = [
  { to: '/routine', label: 'Today' },
  { to: '/read', label: 'Learn' },
  { to: '/collection', label: 'Habits' },
  { to: '/me', label: 'Progress' },
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
