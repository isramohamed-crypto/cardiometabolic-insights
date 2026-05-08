import React, { useState, useEffect } from 'react'

const links = ['Today', 'Track', 'Learn', 'Prepare']

// SVG geometry for the progress ring
const RING_R = 16
const RING_C = 2 * Math.PI * RING_R // ≈ 100.53

export default function Nav({
  activePage,
  setActivePage,
  onLogoClick,
  onAvatarClick,
  avatarInitial = 'C',
  avatarUrl = '',
  completionPct = 100,
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showRing = completionPct < 100

  return (
    <header className={`nav${activePage !== 'Today' && activePage !== 'Prepare' && activePage !== 'Learn' && activePage !== 'Track' ? ' nav--secondary' : scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__brand">
        <button className="nav__wordmark" onClick={onLogoClick} style={{background:'none',border:'none',cursor:'pointer',padding:0}}>SkInsights</button>
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
      <button
        className={`nav__avatar${showRing ? ' nav__avatar--with-ring' : ''}`}
        aria-label={showRing ? `Open account menu — profile ${completionPct}% complete` : 'Open account menu'}
        onClick={onAvatarClick}
      >
        {showRing && (
          <svg className="nav__avatar-ring" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r={RING_R} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r={RING_R}
              fill="none" stroke="#FDDA3C" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(completionPct / 100) * RING_C} ${RING_C}`}
              transform="rotate(-90 18 18)"
            />
          </svg>
        )}
        <span className="nav__avatar-inner">
          {avatarUrl
            ? <img src={avatarUrl} alt="" />
            : avatarInitial}
        </span>
      </button>
    </header>
  )
}
