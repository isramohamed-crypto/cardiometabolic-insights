import React, { useState, useEffect } from 'react'

const links = ['Today', 'Track', 'Learn', 'Prepare']

export default function Nav({ activePage, setActivePage, onLogoClick, onAvatarClick, avatarInitial = 'C', avatarUrl = '' }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${activePage !== 'Today' && activePage !== 'Prepare' && activePage !== 'Learn' && activePage !== 'Track' ? ' nav--secondary' : scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__brand">
        <button className="nav__wordmark" onClick={onLogoClick} style={{background:'none',border:'none',cursor:'pointer',padding:0}}>Cardiometabolic360</button>
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
      <button className="nav__avatar" aria-label="Open account menu" onClick={onAvatarClick}>
        {avatarUrl
          ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px', display: 'block' }} />
          : avatarInitial}
      </button>
    </header>
  )
}
