import React, { useState, useEffect } from 'react'
import ExpOnboarding from './components/ExpOnboarding'
import FocusCarousel from './components/FocusCarousel'
import ReadPage from './components/ReadPage'
import CollectionPage from './components/CollectionPage'
import { seedProfile } from './profiles'
import './App.css'

function readComplete() {
  try { return localStorage.getItem('vitalistExp_complete') === '1' } catch { return false }
}

// Count everything that lives on the Yours page (trial/kept habits + collection)
function readYoursCount() {
  try {
    const habits = JSON.parse(localStorage.getItem('vitalistExp_habits') || '[]') || []
    const coll   = JSON.parse(localStorage.getItem('vitalistExp_collection') || '[]') || []
    return habits.length + coll.length
  } catch { return 0 }
}
function readYoursSeen() {
  try { return parseInt(localStorage.getItem('vitalistExp_yoursSeen') || '0', 10) || 0 } catch { return 0 }
}

function handleURLParams() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (params.has('reset')) {
    try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
    window.history.replaceState({}, '', window.location.pathname)
  } else if (params.has('profile')) {
    const name = params.get('profile')
    seedProfile(name)
    window.history.replaceState({}, '', window.location.pathname)
  }
}

function BottomNav({ activePage, onNavigate, badges = {} }) {
  const tabs = [
    { id: 'Building', icon: '◈', label: 'Building' },
    { id: 'Read',     icon: '▤', label: 'Read' },
    { id: 'Yours',    icon: '❁', label: 'Yours' },
    { id: 'Me',       icon: '◉', label: 'Me' },
  ]
  return (
    <nav className="exp-bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`exp-bottom-nav__btn${activePage === t.id ? ' on' : ''}`}
          onClick={() => onNavigate(t.id)}
        >
          <span className="ico">
            {t.icon}
            {badges[t.id] && <span className="exp-bottom-nav__dot" />}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

function MePage({ onNavigate }) {
  function reset(profile) {
    seedProfile(profile) || (() => {
      try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
    })()
    window.location.reload()
  }
  const profiles = [
    { id: 'new',         label: 'New user',         sub: 'Day 1 — one habit, just starting' },
    { id: 'established', label: 'Established user',  sub: '2 kept habits, 1 trial, 1 graduated' },
  ]
  return (
    <div className="me-page">
      <p className="me-page__eye">Vitalist</p>
      <h1 className="me-page__title">Me</h1>

      <p className="me-page__section">Switch profile</p>
      {profiles.map(p => (
        <button key={p.id} className="me-page__profile-btn" onClick={() => reset(p.id)}>
          <div>
            <div className="me-page__profile-label">{p.label}</div>
            <div className="me-page__profile-sub">{p.sub}</div>
          </div>
          <span className="me-page__arrow">→</span>
        </button>
      ))}

      <p className="me-page__section" style={{ marginTop: 24 }}>Reset</p>
      <button
        className="me-page__profile-btn"
        onClick={() => {
          try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
          window.location.reload()
        }}
      >
        <div>
          <div className="me-page__profile-label">Start onboarding fresh</div>
          <div className="me-page__profile-sub">Clears all data</div>
        </div>
        <span className="me-page__arrow">→</span>
      </button>
    </div>
  )
}

function MenuOverlay({ onClose }) {
  function reset(profile) {
    if (!seedProfile(profile)) {
      try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
    }
    window.location.reload()
  }
  const profiles = [
    { id: 'new',         label: 'New user',        sub: 'Day 1 — one habit, just starting' },
    { id: 'established', label: 'Established user', sub: '2 kept habits, 1 trial, 1 graduated' },
  ]
  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-panel" onClick={e => e.stopPropagation()}>
        <button className="menu-panel__close" onClick={onClose}>✕</button>
        <p className="menu-panel__eye">Vitalist</p>

        <p className="menu-panel__section">Switch profile</p>
        {profiles.map(p => (
          <button key={p.id} className="menu-panel__row" onClick={() => reset(p.id)}>
            <div>
              <div className="menu-panel__row-label">{p.label}</div>
              <div className="menu-panel__row-sub">{p.sub}</div>
            </div>
            <span className="menu-panel__arrow">→</span>
          </button>
        ))}

        <p className="menu-panel__section">Reset</p>
        <button
          className="menu-panel__row"
          onClick={() => {
            try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
            window.location.reload()
          }}
        >
          <div>
            <div className="menu-panel__row-label">Start onboarding fresh</div>
            <div className="menu-panel__row-sub">Clears all data</div>
          </div>
          <span className="menu-panel__arrow">→</span>
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [complete, setComplete] = useState(() => {
    handleURLParams()
    return readComplete()
  })
  const [activePage, setActivePage] = useState('Building')
  const [menuOpen, setMenuOpen]     = useState(false)
  const [yoursSeen, setYoursSeen]   = useState(() => readYoursSeen())

  const yoursCount = readYoursCount()
  const yoursBadge = activePage !== 'Yours' && yoursCount > yoursSeen

  // While viewing Yours, keep "seen" synced so self-adds don't nudge
  useEffect(() => {
    if (activePage === 'Yours') {
      const c = readYoursCount()
      setYoursSeen(c)
      try { localStorage.setItem('vitalistExp_yoursSeen', String(c)) } catch {}
    }
  })

  function navigate(id) {
    if (id === 'Yours') {
      const c = readYoursCount()
      setYoursSeen(c)
      try { localStorage.setItem('vitalistExp_yoursSeen', String(c)) } catch {}
    }
    setActivePage(id)
  }

  function resetOnboarding() {
    try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
    setComplete(false)
    setActivePage('Building')
  }

  if (!complete) {
    return <ExpOnboarding onComplete={() => setComplete(true)} />
  }

  return (
    <div className={`exp-app${activePage === 'Building' ? ' dark-nav' : ''}`}>
      <div className="exp-page">
        {activePage === 'Building' && <FocusCarousel onNavigate={navigate} onLogoClick={resetOnboarding} onMenu={() => setMenuOpen(true)} />}
        {activePage === 'Read'     && <ReadPage />}
        {activePage === 'Yours'    && <CollectionPage />}
        {activePage === 'Me'       && <MePage onNavigate={navigate} />}
      </div>
      <BottomNav activePage={activePage} onNavigate={navigate} badges={{ Yours: yoursBadge }} />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
    </div>
  )
}
