import React, { useState, useEffect } from 'react'

const links = ['Today', 'Track', 'Learn', 'Prepare']

export default function Nav({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
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
