import React, { useState } from 'react'
import './Onboarding.css'

const TOTAL_QS = 4

const Q1 = {
  text: 'Who are you managing this for?',
  sub: 'This changes the content, voice, and guidance we show you.',
  options: [
    { id: 'myself', icon: '🧑', label: 'Myself', desc: 'I\'m managing my own skin' },
    { id: 'child',  icon: '👶', label: 'My child', desc: 'I\'m a parent or caregiver for a child with eczema' },
    { id: 'other',  icon: '🤝', label: 'Someone else', desc: 'A partner, family member, or someone I care for' },
  ],
}

const Q2 = {
  text: 'What should we call you?',
  sub: 'We\'ll use this to personalize your experience.',
}

const Q3 = {
  text: 'How does your skin affect you most?',
  sub: 'Pick the one that resonates most right now.',
  options: [
    { id: 'confidence', icon: '✨', label: 'It\'s affecting my confidence', desc: 'Visibility, self-image, social situations' },
    { id: 'sleep',      icon: '😴', label: 'It\'s disrupting my sleep', desc: 'Nighttime itch and trouble resting' },
    { id: 'triggers',   icon: '🔍', label: 'I can\'t figure out my triggers', desc: 'Food, stress, weather, products' },
    { id: 'treatment',  icon: '💊', label: 'I\'m trying to manage my treatment', desc: 'Sticking with my routine and seeing results' },
    { id: 'frustrated', icon: '🌀', label: 'I\'m frustrated — nothing works', desc: 'Tried a lot already, looking for new ideas' },
  ],
}

const Q4 = {
  text: 'Do you have a skin diagnosis?',
  sub: 'Either way, we\'ll tailor the experience to where you are.',
  yesOptions: [
    { id: 'eczema',     icon: '🌿', label: 'Eczema',         desc: 'Atopic dermatitis or similar' },
    { id: 'psoriasis',  icon: '🩹', label: 'Psoriasis',      desc: 'Plaque, guttate, or other type' },
    { id: 'rosacea',    icon: '🌹', label: 'Rosacea',        desc: 'Redness, flushing, sensitivity' },
    { id: 'acne',       icon: '💧', label: 'Acne',           desc: 'Hormonal, cystic, or persistent' },
    { id: 'other_dx',   icon: '💭', label: 'Something else', desc: 'A different diagnosis' },
  ],
  noOptions: [
    { id: 'redness',     icon: '🌡️', label: 'Redness or irritation',  desc: 'Skin gets red, blotchy, inflamed' },
    { id: 'dryness',     icon: '🍂', label: 'Dryness or flaking',      desc: 'Tight, rough, peeling skin' },
    { id: 'itching',     icon: '🤲', label: 'Itching or sensitivity',  desc: 'Reactive to products or environments' },
    { id: 'breakouts',   icon: '🫧', label: 'Breakouts or bumps',      desc: 'Pimples, cysts, or texture changes' },
    { id: 'flares',      icon: '⚡', label: 'Unpredictable flare-ups', desc: 'Comes and goes without clear cause' },
  ],
}

const roleLabels = {
  myself: 'Managing for myself',
  child:  'Managing for my child',
  other:  'Supporting someone else',
}

export default function Onboarding({ name, onClose }) {
  // step 0..3 = Q1..Q4, step 4 = summary
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState({
    q1: null,                 // role: myself | child | other
    q2: name || '',           // first name (free text), pre-filled from Registration if provided
    q3: null,                 // primary impact
    q4Branch: 'yes',          // 'yes' | 'no' — defaults to 'yes' so the list shows on entry
    q4: [],                   // multi-select: array of diagnosis or struggle ids
  })

  function selectOpt(key, id) {
    setAns(a => ({ ...a, [key]: id }))
  }

  function toggleQ4(id) {
    setAns(a => {
      const set = new Set(a.q4)
      if (set.has(id)) set.delete(id); else set.add(id)
      return { ...a, q4: Array.from(set) }
    })
  }

  function setQ4Branch(branch) {
    setAns(a => ({ ...a, q4Branch: branch, q4: [] }))
  }

  function next() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function back() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // Validation per step
  const canContinue = (() => {
    if (step === 0) return !!ans.q1
    if (step === 1) return ans.q2.trim().length >= 1
    if (step === 2) return !!ans.q3
    if (step === 3) return !!ans.q4Branch && Array.isArray(ans.q4) && ans.q4.length > 0
    return false
  })()

  // Persist on completion (entering step 4 - summary)
  function complete() {
    const profile = {
      name: ans.q2.trim(),
      role: ans.q1,
      focus: ans.q3,
      diagnosisStatus: ans.q4Branch,
      condition: ans.q4,
      completedAt: new Date().toISOString(),
    }
    try { localStorage.setItem('skinsightsProfile', JSON.stringify(profile)) } catch (_) {}
    next()
  }

  // ── SUMMARY (Screen 5) ─────────────────────────────────────────────
  if (step === 4) {
    const roleLabel  = roleLabels[ans.q1] || ''
    const focusLabel = Q3.options.find(o => o.id === ans.q3)?.label || ''
    const q4List = ans.q4Branch === 'yes' ? Q4.yesOptions : Q4.noOptions
    const conditionLabel = (ans.q4 || [])
      .map(id => q4List.find(o => o.id === id)?.label)
      .filter(Boolean)
      .join(', ')
    const conditionKey   = ans.q4Branch === 'yes'
      ? (ans.q4.length > 1 ? 'Diagnoses' : 'Diagnosis')
      : (ans.q4.length > 1 ? 'Main concerns' : 'Main concern')

    return (
      <div className="ob-overlay">
        <div className="ob-screen">
          <div className="ob-complete">
            <div className="ob-complete__icon">✓</div>
            <h2 className="ob-complete__title">Your Skinsights is ready.</h2>
            <p className="ob-complete__sub">We'll personalize your daily feed around what matters to you. You can update your answers anytime in <strong>Account settings</strong>, where you can also complete the rest of your profile.</p>
            <div className="ob-profile-card">
              <div className="ob-profile-card__label">Your profile</div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">👤</span>
                <div>
                  <div className="ob-profile-row__key">Managing for</div>
                  <div className="ob-profile-row__val">{roleLabel}</div>
                </div>
              </div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">🎯</span>
                <div>
                  <div className="ob-profile-row__key">What matters most</div>
                  <div className="ob-profile-row__val">{focusLabel}</div>
                </div>
              </div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">📍</span>
                <div>
                  <div className="ob-profile-row__key">{conditionKey}</div>
                  <div className="ob-profile-row__val">{conditionLabel}</div>
                </div>
              </div>
            </div>
            <button className="ob-cta" onClick={onClose}>Let's get skinsighted →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREENS (1–4) ──────────────────────────────────────────
  const firstName = (ans.q2 || name || '').trim().split(' ')[0]
  const heroHeadline = firstName
    ? <>{firstName}, let's <em>personalize</em> your care.</>
    : <>Better skin <em>starts here.</em></>
  const heroSub = firstName
    ? `A few quick questions to tailor your feed, tracking, and guidance around what matters most to you.`
    : `Let's personalize your eczema companion — four quick questions.`

  const progressPct = ((step + 1) / TOTAL_QS) * 100

  return (
    <div className="ob-overlay">
      <div className="ob-screen">
        {/* Hero / Header */}
        <div className="ob-hero">
          <p className="ob-hero__eyebrow">Welcome to SkInsights</p>
          <h1 className="ob-hero__title">{heroHeadline}</h1>
          <p className="ob-hero__sub">{heroSub}</p>
        </div>

        {/* Progress */}
        <div className="ob-progress-wrap">
          <div className="ob-progress-top">
            <span className="ob-progress-label">Getting to know you</span>
            <span className="ob-progress-step">{step + 1} of {TOTAL_QS}</span>
          </div>
          <div className="ob-progress-bar">
            <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="ob-q-section">
          <div className="ob-q-card">
            {step === 0 && (
              <>
                <div className="ob-q-text">{Q1.text}</div>
                <div className="ob-q-sub">{Q1.sub}</div>
                <OptionList
                  options={Q1.options}
                  selectedId={ans.q1}
                  onSelect={id => selectOpt('q1', id)}
                />
              </>
            )}

            {step === 1 && (
              <>
                <div className="ob-q-text">{Q2.text}</div>
                <div className="ob-q-sub">{Q2.sub}</div>
                <input
                  className="ob-input"
                  type="text"
                  placeholder="Your first name"
                  value={ans.q2}
                  onChange={e => setAns(a => ({ ...a, q2: e.target.value }))}
                  autoComplete="given-name"
                  autoFocus
                />
              </>
            )}

            {step === 2 && (
              <>
                <div className="ob-q-text">{Q3.text}</div>
                <div className="ob-q-sub">{Q3.sub}</div>
                <OptionList
                  options={Q3.options}
                  selectedId={ans.q3}
                  onSelect={id => selectOpt('q3', id)}
                />
              </>
            )}

            {step === 3 && (
              <>
                <div className="ob-q-text">{Q4.text}</div>
                <div className="ob-q-sub">{Q4.sub}</div>

                {/* Branch toggle */}
                <div className="ob-toggle" role="tablist">
                  <button
                    className={`ob-toggle__btn${ans.q4Branch === 'yes' ? ' ob-toggle__btn--active' : ''}`}
                    onClick={() => setQ4Branch('yes')}
                    type="button"
                  >Yes, I do</button>
                  <button
                    className={`ob-toggle__btn${ans.q4Branch === 'no' ? ' ob-toggle__btn--active' : ''}`}
                    onClick={() => setQ4Branch('no')}
                    type="button"
                  >Not yet / not sure</button>
                </div>

                {ans.q4Branch && (
                  <>
                    <p className="ob-q-hint">
                      {ans.q4Branch === 'yes'
                        ? 'Please select your diagnosis. You can choose more than one if it applies.'
                        : 'Please select what you\'re experiencing. You can choose more than one if it applies.'}
                    </p>
                    <OptionList
                      options={ans.q4Branch === 'yes' ? Q4.yesOptions : Q4.noOptions}
                      selectedIds={ans.q4}
                      multiSelect
                      onSelect={id => toggleQ4(id)}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Nav row */}
        <div className="ob-nav-row">
          {step === 0
            ? <button className="ob-skip" onClick={onClose}>Skip for now</button>
            : <button className="ob-back" onClick={back}>← Back</button>
          }
          <button
            className="ob-next"
            disabled={!canContinue}
            onClick={() => {
              if (step === TOTAL_QS - 1) complete()
              else next()
            }}
          >
            {step === TOTAL_QS - 1 ? 'Finish →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function OptionList({ options, selectedId, selectedIds, multiSelect, onSelect }) {
  const selSet = multiSelect
    ? new Set(Array.isArray(selectedIds) ? selectedIds : [])
    : null
  return (
    <div className="ob-opts">
      {options.map(o => {
        const sel = multiSelect ? selSet.has(o.id) : selectedId === o.id
        return (
          <button
            key={o.id}
            type="button"
            className={`ob-opt${sel ? ' ob-opt--sel' : ''}`}
            onClick={() => onSelect(o.id)}
          >
            <span className="ob-opt__emoji">{o.icon}</span>
            <div className="ob-opt__body">
              <div className="ob-opt__label">{o.label}</div>
              <div className="ob-opt__desc">{o.desc}</div>
            </div>
            <div className="ob-opt__check">{sel ? '✓' : ''}</div>
          </button>
        )
      })}
    </div>
  )
}
