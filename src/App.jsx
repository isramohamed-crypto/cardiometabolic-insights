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
// A 30-day ownership check-in is due on an established habit
function readCheckinDue() {
  try {
    const habits   = JSON.parse(localStorage.getItem('vitalistExp_habits') || '[]') || []
    const coll     = JSON.parse(localStorage.getItem('vitalistExp_collection') || '[]') || []
    const checkins = JSON.parse(localStorage.getItem('vitalistExp_checkins') || '{}') || {}
    const established = [
      ...coll.filter(h => h.status === 'established' || h.status === 'graduated'),
      ...habits.filter(h => h.status === 'kept'),
    ]
    return established.some(h => {
      const last = checkins[h.id]?.date || h.addedAt
      if (!last) return false
      const days = Math.floor((Date.now() - new Date(last).getTime()) / 86400000)
      return days >= 30
    })
  } catch { return false }
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

const CS_ANSWER = { automatic: 'Still automatic', slipping: 'Working on it', stopped: 'Set aside' }
const CS_EVIDENCE = {
  move:   { src: 'steps',    line: 'avg 4,900 steps/day, up from 2,100' },
  strong: { src: 'workouts', line: '2 strength sessions/week' },
  sleep:  { src: 'sleep',    line: 'wake window tightened to ±25 min' },
  stress: { src: 'hrv',      line: 'calmer heart-rate variability' },
}

function MePage() {
  const j = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)) } catch { return d } }
  let name = ''
  try { name = localStorage.getItem('vitalistExp_name') || '' } catch (_) {}
  const habits   = j('vitalistExp_habits', [])
  const coll     = j('vitalistExp_collection', [])
  const sources  = j('vitalistExp_sources', [])
  const checkins = j('vitalistExp_checkins', {})

  const established = [
    ...coll.filter(h => h.status === 'graduated' || h.status === 'established'),
    ...habits.filter(h => h.status === 'kept'),
  ]
  const trial = habits.filter(h => h.status === 'trial')

  const daysAgoOf = s => { const t = new Date(s).getTime(); return isNaN(t) ? 0 : Math.floor((Date.now() - t) / 86400000) }
  const dur = h => {
    if (h.status === 'graduated') return 'Graduated · part of the routine'
    const w = Math.max(1, Math.floor(daysAgoOf(h.addedAt) / 7))
    return `Kept ${w} week${w !== 1 ? 's' : ''}`
  }

  const now = new Date()
  const from = new Date(Date.now() - 90 * 86400000)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const range = `${fmt(from)} – ${fmt(now)}, ${now.getFullYear()}`

  const notes = Object.entries(checkins).map(([id, v]) => {
    const h = [...established, ...trial, ...habits].find(x => x.id === id)
    return { label: h ? h.label : 'A habit', answer: v.answer }
  })

  return (
    <div className="cs-page">
      <div className="cs-head">
        <div className="cs-head__row">
          <span className="cs-eye">Care summary</span>
          <span className="cs-range">{range}</span>
        </div>
        <h1 className="cs-title">For your next visit</h1>
        <p className="cs-sub">{name ? `${name} · ` : ''}a snapshot to bring to your doctor</p>
      </div>

      <div className="cs-section">
        <p className="cs-label">Managing</p>
        <div className="cs-chips">
          <span className="cs-chip">Prediabetes</span>
          <span className="cs-chip">High blood pressure</span>
          <span className="cs-chip">Perimenopause</span>
        </div>
      </div>

      {established.length > 0 && (
        <div className="cs-section">
          <p className="cs-label">Habits that stuck</p>
          {established.map(h => {
            const ev = CS_EVIDENCE[h.goalId]
            const evidence = ev && sources.includes(ev.src) ? ` · ${ev.line}` : ''
            return (
              <div key={h.id} className="cs-habit">
                <span className="cs-habit__dot" style={{ background: h.bg || 'linear-gradient(155deg,#9db4d6,#4a6a8a)' }} />
                <div className="cs-habit__body">
                  <p className="cs-habit__label">{h.label}</p>
                  <p className="cs-habit__meta">{dur(h)}{evidence}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {trial.length > 0 && (
        <div className="cs-section">
          <p className="cs-label">Working on now</p>
          {trial.map(h => (
            <div key={h.id} className="cs-habit">
              <span className="cs-habit__dot" style={{ background: h.bg || 'linear-gradient(155deg,#9db4d6,#4a6a8a)' }} />
              <div className="cs-habit__body">
                <p className="cs-habit__label">{h.label}</p>
                <p className="cs-habit__meta">In trial</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {sources.length > 0 && (
        <div className="cs-section">
          <p className="cs-label">What your trackers show</p>
          <div className="cs-metrics">
            <div className="cs-metric"><p className="cs-metric__k">Resting HR</p><p className="cs-metric__v">64 <span className="cs-good">−6</span></p></div>
            {sources.includes('sleep') && <div className="cs-metric"><p className="cs-metric__k">Sleep score</p><p className="cs-metric__v">78 <span className="cs-warn">−9</span></p></div>}
            {sources.includes('steps') && <div className="cs-metric"><p className="cs-metric__k">Steps/day</p><p className="cs-metric__v">4.9k <span className="cs-good">+2.3k</span></p></div>}
          </div>
          {sources.includes('sleep') && <p className="cs-note">Sleep score dipped over ~3 weeks — worth raising.</p>}
        </div>
      )}

      {notes.length > 0 && (
        <div className="cs-section">
          <p className="cs-label">In your words</p>
          {notes.map((n, i) => (
            <p key={i} className="cs-quote">{n.label} — <span>{CS_ANSWER[n.answer] || n.answer}</span></p>
          ))}
        </div>
      )}

      <div className="cs-section">
        <p className="cs-label">Questions for your visit</p>
        <p className="cs-q">Could the sleep dip relate to perimenopause or my BP meds?</p>
        <p className="cs-q">Given the step increase, should we recheck my A1c sooner?</p>
      </div>

      <button className="cs-export" onClick={() => { try { window.print() } catch (_) {} }}>Export as PDF</button>
    </div>
  )
}

function AppHeader({ onMenu }) {
  return (
    <div className="app-header">
      <span className="app-header__logo">Vitalist<span className="app-header__by">by People Inc.</span></span>
      <button className="app-header__menu" onClick={onMenu} aria-label="Menu">
        <span/><span/><span/>
      </button>
    </div>
  )
}

function MenuOverlay({ current, onClose, onSwitch, onReset }) {
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
          <button
            key={p.id}
            className={`menu-panel__row${current === p.id ? ' on' : ''}`}
            onClick={() => onSwitch(p.id)}
          >
            <div>
              <div className="menu-panel__row-label">{p.label}</div>
              <div className="menu-panel__row-sub">{p.sub}</div>
            </div>
            <span className="menu-panel__arrow">{current === p.id ? '✓' : '→'}</span>
          </button>
        ))}

        <p className="menu-panel__section">Reset</p>
        <button className="menu-panel__row" onClick={onReset}>
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
  const [profile, setProfile]       = useState(() => { try { return localStorage.getItem('vitalistExp_profile') || '' } catch { return '' } })
  const [dataVersion, setDataVersion] = useState(0) // bump to remount pages after a profile swap

  // Switch demo profile in place — no reload, no onboarding, stay on current page
  function switchProfile(id) {
    seedProfile(id)
    try { localStorage.setItem('vitalistExp_profile', id) } catch {}
    setProfile(id)
    setMenuOpen(false)
    setDataVersion(v => v + 1)
  }
  function resetAll() {
    setMenuOpen(false)
    resetOnboarding()
  }

  const yoursCount = readYoursCount()
  const yoursBadge = activePage !== 'Yours' && (yoursCount > yoursSeen || readCheckinDue())

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

  const openMenu = () => setMenuOpen(true)

  return (
    <div className={`exp-app${activePage === 'Building' ? ' dark-nav' : ''}`}>
      <div className="exp-page" key={dataVersion}>
        {activePage === 'Building' && <FocusCarousel onNavigate={navigate} onLogoClick={resetOnboarding} onMenu={openMenu} />}
        {activePage === 'Read'     && <><AppHeader onMenu={openMenu} /><ReadPage /></>}
        {activePage === 'Yours'    && <><AppHeader onMenu={openMenu} /><CollectionPage /></>}
        {activePage === 'Me'       && <><AppHeader onMenu={openMenu} /><MePage onNavigate={navigate} /></>}
      </div>
      <BottomNav activePage={activePage} onNavigate={navigate} badges={{ Yours: yoursBadge }} />
      {menuOpen && (
        <MenuOverlay
          current={profile}
          onClose={() => setMenuOpen(false)}
          onSwitch={switchProfile}
          onReset={resetAll}
        />
      )}
    </div>
  )
}
