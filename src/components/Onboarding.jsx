import React, { useState } from 'react'
import './Onboarding.css'

const Q1 = {
  eyebrow: 'Question 1 of 3',
  text: 'What would make the biggest difference for you right now?',
  sub: 'Pick the one thing that matters most today.',
  options: [
    { id: 'routine',    icon: '🧴', label: 'A skincare routine that actually works', desc: 'Personalized product guidance and daily routines' },
    { id: 'triggers',   icon: '🔍', label: 'Knowing my triggers', desc: 'Food, stress, weather, and product tracking' },
    { id: 'sleep',      icon: '😴', label: 'Better sleep', desc: 'Nighttime itch management and sleep strategies' },
    { id: 'stress',     icon: '🧘', label: 'Less stress on my skin', desc: 'Stress-flare connection and calming techniques' },
    { id: 'confidence', icon: '✨', label: 'Feeling confident in my skin', desc: 'Managing visibility, self-image, and social situations' },
  ],
}

const Q2 = {
  eyebrow: 'Question 2 of 3',
  text: 'Who are you managing this for?',
  sub: 'This changes the content, voice, and guidance we show you.',
  options: [
    { id: 'myself', icon: '🙋', label: 'Myself', desc: 'I\'m managing my own eczema' },
    { id: 'child',  icon: '👶', label: 'My child', desc: 'I\'m a parent or caregiver for a child with eczema' },
    { id: 'other',  icon: '👥', label: 'Someone else', desc: 'A partner, family member, or someone I care for' },
  ],
}

function getQ3Options(q2) {
  if (q2 === 'child') return [
    { id: 'child_unsure',  icon: '🔍', label: "My child has a skin issue but we don't have a diagnosis yet", desc: 'Still figuring out if it\'s eczema, seeing the pediatrician or waiting for a referral' },
    { id: 'child_otc',    icon: '🧴', label: 'Diagnosed — managing with creams and OTC treatments', desc: 'Moisturizers, gentle products, maybe OTC hydrocortisone' },
    { id: 'child_rx',     icon: '💊', label: 'On prescription treatment — working with a dermatologist', desc: 'Prescription topicals or other Rx — adjusting to find the right approach' },
    { id: 'child_biologic',icon: '💉', label: 'On or starting a biologic', desc: 'Advanced treatment for moderate-to-severe eczema' },
    { id: 'child_veteran', icon: '✨', label: 'We\'ve been managing this for a while', desc: 'Experienced caregiver — want better strategies, not the basics' },
  ]
  if (q2 === 'other') return [
    { id: 'other_unsure',  icon: '🔍', label: "They have a skin issue but aren't sure what it is", desc: 'Supporting someone who hasn\'t been diagnosed yet' },
    { id: 'other_otc',    icon: '🧴', label: "They're managing with OTC products", desc: 'Moisturizers and over-the-counter treatments' },
    { id: 'other_rx',     icon: '💊', label: "They're on prescription treatment", desc: 'Topical Rx or other prescriptions' },
    { id: 'other_biologic',icon: '💉', label: "They're on or starting a biologic", desc: 'Advanced treatment like Dupixent' },
    { id: 'other_veteran', icon: '✨', label: "They've been managing this for a while", desc: 'Looking for ways to better support them' },
  ]
  return [
    { id: 'pre_dx',      icon: '🔍', label: "I have a skin issue but I'm not sure what it is yet", desc: 'Haven\'t been diagnosed — still figuring out what\'s going on' },
    { id: 'dx_otc',     icon: '🧴', label: 'Diagnosed — using creams or over-the-counter treatments', desc: 'Managing with moisturizers, OTC hydrocortisone, or home remedies' },
    { id: 'rx_searching',icon: '💊', label: 'On prescription treatment but still figuring out what works', desc: 'Trying topical Rx or other prescriptions — not yet stable' },
    { id: 'biologic',   icon: '💉', label: 'On or starting a biologic (like Dupixent)', desc: 'New to biologics or already on one — need adherence and HCP support' },
    { id: 'veteran',    icon: '✨', label: 'Been managing this a long time — I know my routine', desc: 'Experienced and self-directed — looking for optimization, not basics' },
  ]
}

const roleLabels = { myself: 'Managing for myself', child: 'Managing for my child', other: 'Supporting someone else' }

export default function Onboarding({ name, onClose }) {
  const [step, setStep] = useState(0) // 0=Q1, 1=Q2, 2=Q3, 3=complete
  const [ans, setAns] = useState({ q1: null, q2: null, q3: null })

  function select(key, id) {
    setAns(a => ({ ...a, [key]: id, ...(key === 'q2' ? { q3: null } : {}) }))
  }

  function next() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function back() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const q3Opts = getQ3Options(ans.q2)
  const questions = [
    { q: Q1, key: 'q1' },
    { q: Q2, key: 'q2' },
    { q: { eyebrow: 'Question 3 of 3', text: 'Which of these sounds most like you right now?', sub: 'No wrong answer — this helps us show you relevant guidance from day one.', options: q3Opts }, key: 'q3' },
  ]

  if (step === 3) {
    const q1Label = Q1.options.find(o => o.id === ans.q1)?.label || ''
    const q3Label = q3Opts.find(o => o.id === ans.q3)?.label || ''
    const firstName = name ? name.split(' ')[0] : ''

    return (
      <div className="ob-overlay">
        <div className="ob-screen">
          <div className="ob-complete">
            <div className="ob-complete__icon">✓</div>
            <h2 className="ob-complete__title">{firstName ? `You're all set, ${firstName}.` : 'Your companion is ready.'}</h2>
            <p className="ob-complete__sub">We'll personalize your daily feed around what matters to you. You can always update these in settings.</p>
            <div className="ob-profile-card">
              <div className="ob-profile-card__label">Your profile</div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">🎯</span>
                <div>
                  <div className="ob-profile-row__key">Primary focus</div>
                  <div className="ob-profile-row__val">{q1Label}</div>
                </div>
              </div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">👤</span>
                <div>
                  <div className="ob-profile-row__key">Managing for</div>
                  <div className="ob-profile-row__val">{roleLabels[ans.q2] || ''}</div>
                </div>
              </div>
              <div className="ob-profile-row">
                <span className="ob-profile-row__icon">📍</span>
                <div>
                  <div className="ob-profile-row__key">Current stage</div>
                  <div className="ob-profile-row__val">{q3Label}</div>
                </div>
              </div>
            </div>
            <button className="ob-cta" onClick={onClose}>Go to my experience →</button>
          </div>
        </div>
      </div>
    )
  }

  const { q, key } = questions[step]
  const canNext = !!ans[key]

  const firstName = name ? name.split(' ')[0] : ''
  const heroHeadline = firstName
    ? <>{firstName}, let's <em>personalize</em> your care.</>
    : <>Better skin <em>starts here.</em></>
  const heroSub = firstName
    ? `We have a few quick questions to tailor your feed, tracking, and guidance around what matters most to you.`
    : `Let's personalize your eczema companion — three quick questions.`

  return (
    <div className="ob-overlay">
      <div className="ob-screen">
        {/* Hero */}
        <div className="ob-hero">
          <p className="ob-hero__eyebrow">Welcome to Eczema360</p>
          <h1 className="ob-hero__title">{heroHeadline}</h1>
          <p className="ob-hero__sub">{heroSub}</p>
        </div>

        {/* Progress */}
        <div className="ob-progress-wrap">
          <div className="ob-progress-top">
            <span className="ob-progress-label">Getting to know you</span>
            <span className="ob-progress-step">{step + 1} of 3</span>
          </div>
          <div className="ob-progress-bar">
            <div className="ob-progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="ob-q-section">
          <div className="ob-q-card">
            <div className="ob-q-text">{q.text}</div>
            <div className="ob-q-sub">{q.sub}</div>
            <div className="ob-opts">
              {q.options.map(o => {
                const sel = ans[key] === o.id
                return (
                  <button key={o.id} className={`ob-opt${sel ? ' ob-opt--sel' : ''}`} onClick={() => select(key, o.id)}>
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
            disabled={!canNext}
            onClick={() => { if (step === 2) { next() } else { next() } }}
          >
            {step === 2 ? "Let's get started!" : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
