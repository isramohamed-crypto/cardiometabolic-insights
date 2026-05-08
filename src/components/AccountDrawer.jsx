import React, { useEffect, useRef } from 'react'
import './AccountDrawer.css'

const MENU = [
  { id: 'profile',       icon: '👤', label: 'Profile',           desc: 'View and complete your profile' },
  { id: 'notifications', icon: '🔔', label: 'Notifications',     desc: 'Reminders, digests, and updates' },
  { id: 'settings',      icon: '⚙️', label: 'Account settings',  desc: 'Email, phone, password, privacy' },
  { id: 'help',          icon: '💬', label: 'Help & support',    desc: 'FAQ, contact, send feedback' },
  { id: 'signout',       icon: '↩️', label: 'Sign out',          desc: '' },
]

export default function AccountDrawer({ profile, completionPct, strengthLabel, onClose, onSelect, onAvatarChange }) {
  const fileRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const initial = (profile?.name || 'C').trim().charAt(0).toUpperCase() || 'C'
  const displayName = profile?.name?.trim() || 'Welcome'
  const avatarUrl = profile?.avatarUrl || ''

  // Ring geometry — larger circle than nav (radius 27 in a 60 viewBox)
  const RING_R = 27
  const RING_C = 2 * Math.PI * RING_R
  const showRing = completionPct < 100

  function pickFile() { fileRef.current?.click() }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      const url = String(ev.target?.result || '')
      if (url) onAvatarChange?.(url)
    }
    reader.readAsDataURL(file)
    // Reset input so the same file can be picked again
    e.target.value = ''
  }

  return (
    <div className="ad-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <aside className="ad-drawer" role="dialog" aria-label="Account menu">
        {/* Header */}
        <div className="ad-header">
          <div className="ad-header__top">
            <button
              className={`ad-avatar-wrap${showRing ? ' ad-avatar-wrap--with-ring' : ''}`}
              type="button"
              aria-label="Change profile photo"
              onClick={pickFile}
            >
              {showRing && (
                <svg className="ad-avatar-ring" viewBox="0 0 60 60" aria-hidden="true">
                  <circle cx="30" cy="30" r={RING_R} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
                  <circle
                    cx="30" cy="30" r={RING_R}
                    fill="none" stroke="#FDDA3C" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(completionPct / 100) * RING_C} ${RING_C}`}
                    transform="rotate(-90 30 30)"
                  />
                </svg>
              )}
              {avatarUrl
                ? <img src={avatarUrl} alt="" className="ad-avatar-img" />
                : <span className="ad-avatar">{initial}</span>}
              <span className="ad-avatar__plus" aria-hidden="true">+</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onFile}
            />
            <button className="ad-close" onClick={onClose} aria-label="Close menu">✕</button>
          </div>
          <div className="ad-name">{displayName}</div>
          <div className="ad-strength">
            <div className="ad-strength__row">
              <span className="ad-strength__label">Profile strength</span>
              <span className="ad-strength__pct">{completionPct}%</span>
            </div>
            <div className="ad-strength__bar">
              <div className="ad-strength__fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="ad-strength__tier">
              <span className={`ad-tier ad-tier--${strengthLabel.toLowerCase().replace(/[^a-z]/g, '')}`}>
                {strengthLabel}
              </span>
              <button className="ad-strength__cta" onClick={() => onSelect('profile')}>
                Complete profile →
              </button>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="ad-menu">
          {MENU.map(m => (
            <button key={m.id} className="ad-item" onClick={() => onSelect(m.id)}>
              <span className="ad-item__icon">{m.icon}</span>
              <span className="ad-item__body">
                <span className="ad-item__label">{m.label}</span>
                {m.desc && <span className="ad-item__desc">{m.desc}</span>}
              </span>
              <span className="ad-item__chev">›</span>
            </button>
          ))}
        </nav>

        <div className="ad-footer">
          <p>SkInsights · v0.1</p>
        </div>
      </aside>
    </div>
  )
}
