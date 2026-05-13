import React, { useState, useEffect, useRef } from 'react'
import './Registration.css'

export default function Registration({ onClose, onStartOnboarding }) {
  const [showSheet, setShowSheet] = useState(false)
  const [signupMethod, setSignupMethod] = useState('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [hipaa, setHipaa] = useState(true)
  const [comms, setComms] = useState(false)
  const nameRef = useRef(null)

  const phoneDigits = (phone.match(/\d/g) || []).length
  const contactValid = signupMethod === 'email'
    ? (email.includes('@') && email.includes('.'))
    : phoneDigits >= 10
  const canSubmit = name.trim().length >= 2 && contactValid && password.length >= 8 && hipaa

  function openSheet(method = 'email') {
    setSignupMethod(method)
    setShowSheet(true)
    setTimeout(() => nameRef.current?.focus(), 350)
  }

  function handleSubmit() {
    if (!canSubmit) return
    setShowSheet(false)
    onStartOnboarding(name.trim())
  }

  function socialSignIn() {
    onStartOnboarding('')
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="reg-overlay">
      <div className="reg-screen">

        {/* HERO */}
        <div className="reg-hero">
          <div className="reg-hero__bg">
            <div className="reg-hero__icons">
              <span className="reg-hero__icon">🧴</span>
              <span className="reg-hero__icon">🌙</span>
              <span className="reg-hero__icon">🧘</span>
              <span className="reg-hero__icon">✨</span>
              <span className="reg-hero__icon">📊</span>
              <span className="reg-hero__icon">💊</span>
            </div>
          </div>
          <div className="reg-hero__content">
            <div className="reg-hero__wordmark">
              Skinsights360
              <span className="reg-hero__wordmark-sep">|</span>
              <span className="reg-hero__wordmark-partner">People Inc.</span>
            </div>
            <h1 className="reg-hero__headline">
              <em>Welcome.</em> Smart skin care for real life.
            </h1>
          </div>
          <button className="reg-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* BODY */}
        <div className="reg-body">
          <p className="reg-value-prop">
            Daily tracking, AI patterns, derm-ready reports, and content built around how you live.
          </p>

          <div className="reg-divider">
            <div className="reg-divider__line" />
            <span className="reg-divider__text">What you get</span>
            <div className="reg-divider__line" />
          </div>

          <div className="reg-benefits">
            {[
              { icon: '🌿', color: 'purple', title: 'Content built around how you live', desc: 'Tips and guidance matched to your home, your routine, and what\'s actually affecting your skin' },
              { icon: '✓',  color: 'sage',   title: 'Small changes that add up', desc: 'Track what you\'re doing differently and see what\'s actually making a difference over time' },
              { icon: '💡', color: 'warm',   title: 'See what your skin is telling you', desc: 'Patterns emerge when you start paying attention. We help you notice them first' },
              { icon: '🩺', color: 'lime',   title: 'Walk into your next derm visit ready', desc: 'Your check-in history and trigger patterns, organized so your doctor can actually use them' },
            ].map(b => (
              <div className="reg-benefit" key={b.title}>
                <div className={`reg-benefit__icon reg-benefit__icon--${b.color}`}>{b.icon}</div>
                <div className="reg-benefit__text">
                  <div className="reg-benefit__title">{b.title}</div>
                  <div className="reg-benefit__desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="reg-auth-buttons">
            <button className="reg-auth-btn reg-auth-btn--email" onClick={() => openSheet('email')}>
              <span className="reg-auth-btn__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
              </span>
              Continue with Email
            </button>
            <button className="reg-auth-btn reg-auth-btn--phone" onClick={() => openSheet('phone')}>
              <span className="reg-auth-btn__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              Continue with Phone
            </button>
            <button className="reg-auth-btn reg-auth-btn--google" onClick={socialSignIn}>
              <span className="reg-auth-btn__icon">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </span>
              Continue with Google
            </button>
            <button className="reg-auth-btn reg-auth-btn--apple" onClick={socialSignIn}>
              <span className="reg-auth-btn__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              </span>
              Continue with Apple
            </button>
          </div>

          <p className="reg-terms">
            By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. Your data is protected under HIPAA. We will never sell your information.
          </p>
        </div>
      </div>

      {/* EMAIL SHEET */}
      {showSheet && (
        <div className="reg-sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowSheet(false) }}>
          <div className="reg-sheet">
            <div className="reg-sheet__header">
              <div className="reg-sheet__title">Create your account</div>
              <button className="reg-sheet__close" onClick={() => setShowSheet(false)}>✕</button>
            </div>
            <p className="reg-sheet__sub">A few details and you're in. Takes less than a minute.</p>

            <div className="reg-input-group">
              <label className="reg-input-label">Your first name</label>
              <input ref={nameRef} className="reg-input" type="text" placeholder="What should we call you?" value={name} onChange={e => setName(e.target.value)} autoComplete="given-name" />
            </div>
            {signupMethod === 'email' ? (
              <div className="reg-input-group">
                <label className="reg-input-label">Email address</label>
                <input className="reg-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              </div>
            ) : (
              <div className="reg-input-group">
                <label className="reg-input-label">Phone number</label>
                <input className="reg-input" type="tel" inputMode="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
              </div>
            )}
            <div className="reg-input-group">
              <label className="reg-input-label">Create a password</label>
              <input className="reg-input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            </div>

            <div className="reg-consent-group">
              <div className="reg-consent-row" onClick={() => setHipaa(v => !v)}>
                <div className={`reg-consent-check${hipaa ? ' on' : ''}`}>{hipaa ? '✓' : ''}</div>
                <div className="reg-consent-text"><strong>I agree to the HIPAA authorization</strong> for processing my health data to personalize my experience.</div>
              </div>
              <div className="reg-consent-row" onClick={() => setComms(v => !v)}>
                <div className={`reg-consent-check${comms ? ' on' : ''}`}>{comms ? '✓' : ''}</div>
                <div className="reg-consent-text">Send me personalized tips, content updates, and weekly skin summaries{signupMethod === 'phone' ? ' by text.' : ' via email.'}</div>
              </div>
            </div>

            <button className="reg-sheet-btn" disabled={!canSubmit} onClick={handleSubmit}>
              Create my account →
            </button>
            <p className="reg-sheet-terms">Your data is encrypted and HIPAA-compliant. We never sell your information. <a href="#">Privacy Policy</a></p>
          </div>
        </div>
      )}

    </div>
  )
}
