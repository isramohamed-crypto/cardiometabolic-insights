import React from 'react'

const links = ['Today', 'Track', 'Learn', 'Prepare']

export default function Nav({ activePage, setActivePage }) {
  return (
    <header className="nav">
      <div className="nav__brand">
        <span className="nav__wordmark">Eczema360</span>
      </div>
      <nav className="nav__links">
        {links.map(link => (
          <a
            key={link}
            href="#"
            className={`nav__link${activePage === link ? ' nav__link--active' : ''}`}
            onClick={e => { e.preventDefault(); setActivePage(link) }}
          >
            {link}
          </a>
        ))}
      </nav>
      <button className="nav__avatar" aria-label="Profile">D</button>
    </header>
  )
}
