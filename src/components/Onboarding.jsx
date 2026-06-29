import React, { useState } from 'react'
import './Onboarding.css'

const TOTAL_QS = 5

const Q1 = {
  text: 'Who are you using AHEAD for?',
  sub: 'This shapes the content, voice, and guidance we show you.',
  options: [
    { id: 'myself', icon: '🧑', label: 'Myself', desc: 'I\'m focused on my own health journey' },
    { id: 'other',  icon: '🤝', label: 'Someone else', desc: 'A partner, family member, or someone I care for' },
  ],
}

const Q2 = {
  text: 'What should we call you?',
  sub: 'We\'ll use this to personalize your experience.',
}

const Q3 = {
  text: "What's driving you to focus on your health right now?",
  sub: 'Pick the one that resonates most.',
  options: [
    { id: 'risk',       icon: '🔭', label: 'I want to get ahead of my risk', desc: 'Proactive about future health before problems develop' },
    { id: 'confidence', icon: '✨', label: 'I want to feel in control', desc: 'Of my numbers, my choices, my direction' },
    { id: 'sleep',      icon: '😴', label: "It's affecting my energy and sleep", desc: 'Fatigue, poor rest, low motivation' },
    { id: 'triggers',   icon: '🔍', label: "I don't understand what's happening", desc: 'My body feels different and I want answers' },
    { id: 'treatment',  icon: '💊', label: "I'm managing a lot and want support", desc: 'Conditions, medications, appointments — it adds up' },
    { id: 'frustrated', icon: '🌀', label: "I've tried things and nothing sticks", desc: 'Looking for a more sustainable approach' },
  ],
}

// Topics use their full label as the stored value so they line up with
// the profile page's `topics` field (no migration needed).
// Primary list (always visible) covers broad lifestyle categories.
const Q5_TOPICS_PRIMARY = [
  { label: 'Heart-healthy eating',    icon: '🥗' },
  { label: 'Exercise & movement',     icon: '🚶' },
  { label: 'Sleep & rest',            icon: '😴' },
  { label: 'Stress & mental health',  icon: '🧘' },
  { label: 'Medications & treatment', icon: '💊' },
  { label: 'Blood pressure',          icon: '🩺' },
  { label: 'Blood sugar',             icon: '🔬' },
  { label: 'Weight management',       icon: '⚖️' },
  { label: 'Family & caregiving',     icon: '👨‍👩‍👧' },
  { label: 'Work & daily life',       icon: '💼' },
]
// Secondary list (revealed by "Show more") — deeper topics.
const Q5_TOPICS_MORE = [
  { label: 'Menopause & hormonal health',        icon: '🌸' },
  { label: 'GLP-1 & weight loss medications',    icon: '💉' },
  { label: 'Healthy aging & longevity',          icon: '⏳' },
  { label: 'Understanding my numbers',           icon: '📊' },
  { label: 'Preparing for appointments',         icon: '📋' },
  { label: 'New treatments & research',          icon: '🧪' },
  { label: 'Alcohol & lifestyle',                icon: '🍷' },
  { label: 'Cooking at home',                    icon: '🍳' },
  { label: 'Travel & staying on track',          icon: '✈️' },
  { label: 'Confidence & self-image',            icon: '✨' },
  { label: 'Community & peer support',           icon: '🤝' },
]
const Q5_TOPICS = [...Q5_TOPICS_PRIMARY, ...Q5_TOPICS_MORE]

const Q5 = {
  text: 'What matters most to you right now?',
  sub: 'Pick a few topics — at least three is a good start. We\'ll use these to tailor your feed.',
}

const Q4 = {
  text: 'What does your health picture look like right now?',
  sub: 'Select all that apply — the more we know, the better we can tailor your experience.',
  yesOptions: [
    { id: 'cholesterol', icon: '🫀', label: 'High cholesterol',              desc: 'LDL, HDL, or triglyceride concerns' },
    { id: 'hypertension',icon: '🩺', label: 'High blood pressure',           desc: 'Hypertension or pre-hypertension' },
    { id: 'diabetes',    icon: '🔬', label: 'Type 2 diabetes',               desc: 'Managing blood sugar levels' },
    { id: 'obesity',     icon: '⚖️', label: 'Weight / metabolic health',     desc: 'BMI, metabolic syndrome, or weight-related goals' },
    { id: 'heart',       icon: '❤️‍🩹', label: 'Heart disease',               desc: 'Coronary artery disease, prior cardiac event' },
    { id: 'menopause',   icon: '🌸', label: 'Menopause / hormonal changes',  desc: 'Perimenopause, menopause, or related symptoms' },
    { id: 'glp1',        icon: '💉', label: 'Weight loss medication (GLP-1)', desc: 'Taking or considering Ozempic, Wegovy, or similar' },
    { id: 'other_dx',    icon: '💭', label: 'Something else',                 desc: 'Another diagnosis or concern' },
  ],
  noOptions: [
    { id: 'family_hx',   icon: '👨‍👩‍👧', label: 'Family history',              desc: 'Heart disease, stroke, or diabetes in the family' },
    { id: 'borderline',  icon: '📊', label: 'Borderline numbers',             desc: 'Numbers that are elevated but not yet diagnosed' },
    { id: 'weight',      icon: '⚖️', label: 'Weight concerns',                desc: 'Trying to manage weight for long-term health' },
    { id: 'longevity',   icon: '⏳', label: 'Longevity & healthy aging',      desc: 'Planning ahead for quality of life as I get older' },
    { id: 'prevention',  icon: '🛡️', label: 'Prevention focused',            desc: 'No diagnosis yet, but being proactive' },
    { id: 'post_event',  icon: '❤️‍🩹', label: 'Recovery',                     desc: 'Managing health after a cardiac event or diagnosis' },
  ],
}

const roleLabels = {
  myself: 'Managing for myself',
  child:  'Managing for my child',
  other:  'Supporting someone else',
}

// Code → label mapping so the value stored in profile matches what downstream
// components (ProfilePage, SkinCheckinSheet) expect.
const CODE_TO_LABEL = {
  role: { myself: 'Myself', child: 'My child', other: 'Someone else' },
  focus: {
    risk:       'Getting ahead of my risk',
    confidence: 'Wanting to feel in control',
    sleep:      'Affecting my energy and sleep',
    triggers:   'Not understanding what\'s happening',
    treatment:  'Managing a lot at once',
    frustrated: 'Frustrated nothing sticks',
  },
  diagnosisStatus: { yes: 'Yes, I have a diagnosis', no: 'Not yet / exploring' },
  condition: {
    cholesterol: 'High cholesterol', hypertension: 'High blood pressure', diabetes: 'Type 2 diabetes',
    obesity: 'Weight / metabolic health', heart: 'Heart disease',
    menopause: 'Menopause / hormonal changes', glp1: 'Weight loss medication (GLP-1)',
    other_dx: 'Something else (diagnosed)',
    family_hx: 'Family history', borderline: 'Borderline numbers', weight: 'Weight concerns',
    longevity: 'Longevity & healthy aging', prevention: 'Prevention focused', post_event: 'Recovery',
  },
}
function mapCode(field, v) {
  if (Array.isArray(v)) return v.map(x => CODE_TO_LABEL[field]?.[x] || x)
  return CODE_TO_LABEL[field]?.[v] || v
}

export default function Onboarding({ name, onClose }) {
  // step 0..4 = Q1..Q5, step 5 = summary
  const [step, setStep] = useState(0)
  const [q5ShowMore, setQ5ShowMore] = useState(false)
  const [ans, setAns] = useState({
    q1: null,                 // role: myself | child | other
    q2: name || '',           // first name (free text), pre-filled from Registration if provided
    q3: null,                 // primary impact
    q4Branch: 'yes',          // 'yes' | 'no' — defaults to 'yes' so the list shows on entry
    q4: [],                   // multi-select: array of diagnosis or struggle ids
    q5: [],                   // multi-select: array of interest topic labels
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

  function toggleQ5(label) {
    setAns(a => {
      const set = new Set(a.q5)
      if (set.has(label)) set.delete(label); else set.add(label)
      return { ...a, q5: Array.from(set) }
    })
  }

  function setQ4Branch(branch) {
    setAns(a => ({ ...a, q4Branch: branch, q4: [] }))
  }

  function next() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function back() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // Skip: persist whatever's been answered so far, then jump to the summary
  function skip() {
    let existing = {}
    try { existing = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch (_) {}
    const trimmedName = (ans.q2 || '').trim()
    const onboardingSources = new Set(existing.onboardingSources || [])
    const profile = { ...existing }
    const maybeSet = (key, val) => {
      const hasVal = Array.isArray(val) ? val.length > 0 : (val != null && val !== '')
      if (hasVal) { profile[key] = val; onboardingSources.add(key) }
    }
    maybeSet('name',            trimmedName)
    maybeSet('role',            mapCode('role',            ans.q1))
    maybeSet('focus',           mapCode('focus',           ans.q3))
    maybeSet('diagnosisStatus', mapCode('diagnosisStatus', ans.q4Branch))
    maybeSet('condition',       mapCode('condition',       ans.q4))
    maybeSet('topics',          ans.q5)
    profile.onboardingSources = Array.from(onboardingSources)
    profile.skippedAt = new Date().toISOString()
    // Fresh onboarding = clear stale per-session state.
    delete profile.treatmentList
    delete profile.aiSources
    delete profile.aiSeededAt
    try { localStorage.setItem('cardiometabolicProfile', JSON.stringify(profile)) } catch (_) {}
    try {
      localStorage.removeItem('cardiometabolicLastCheckin')
      localStorage.removeItem('cardiometabolicCheckins')
    } catch (_) {}
    setStep(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Validation per step
  const canContinue = (() => {
    if (step === 0) return !!ans.q1
    if (step === 1) return ans.q2.trim().length >= 1
    if (step === 2) return !!ans.q4Branch && Array.isArray(ans.q4) && ans.q4.length > 0
    if (step === 3) return !!ans.q3
    if (step === 4) return Array.isArray(ans.q5) && ans.q5.length > 0
    return false
  })()

  // Persist on completion (entering step 5 - summary)
  function complete() {
    let existing = {}
    try { existing = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch (_) {}
    const trimmedName = ans.q2.trim()
    const onboardingSources = new Set(existing.onboardingSources || [])
    const fields = {
      name:            trimmedName,
      role:            mapCode('role',            ans.q1),
      focus:           mapCode('focus',           ans.q3),
      diagnosisStatus: mapCode('diagnosisStatus', ans.q4Branch),
      condition:       mapCode('condition',       ans.q4),
      topics:          ans.q5,    // topics are already stored as labels
    }
    const next_data = { ...existing }
    for (const [k, v] of Object.entries(fields)) {
      const hasVal = Array.isArray(v) ? v.length > 0 : (v != null && v !== '')
      if (hasVal) {
        next_data[k] = v
        onboardingSources.add(k)
      }
    }
    next_data.onboardingSources = Array.from(onboardingSources)
    next_data.completedAt = new Date().toISOString()
    // Fresh onboarding = clear stale per-session state so the check-in
    // doesn't re-populate from an earlier demo run.
    delete next_data.treatmentList
    delete next_data.aiSources
    delete next_data.aiSeededAt
    try { localStorage.setItem('cardiometabolicProfile', JSON.stringify(next_data)) } catch (_) {}
    try {
      localStorage.removeItem('cardiometabolicLastCheckin')
      localStorage.removeItem('cardiometabolicCheckins')
    } catch (_) {}
    next()
  }

  // ── SUMMARY (Screen 6) ─────────────────────────────────────────────
  if (step === 5) {
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

    // Populated rows
    const rows = []
    if (roleLabel)        rows.push({ icon: '👤', key: 'Managing for',       val: roleLabel })
    if (focusLabel)       rows.push({ icon: '🎯', key: 'What matters most',  val: focusLabel })
    if (conditionLabel)   rows.push({ icon: '📍', key: conditionKey,         val: conditionLabel })
    if (ans.q5?.length)   rows.push({ icon: '💡', key: 'Interests',           val: ans.q5.join(', ') })

    // Skipped items — list of what they didn't answer
    const missing = []
    if (!ans.q1)                                 missing.push({ icon: '👤', label: 'Who you\'re managing this for' })
    if (!ans.q2 || !ans.q2.trim())               missing.push({ icon: '✏️', label: 'Your name' })
    if (!ans.q3)                                 missing.push({ icon: '🎯', label: 'What matters most to you' })
    if (!(ans.q4?.length))                       missing.push({ icon: '📍', label: 'Your diagnosis or concerns' })
    if (!(ans.q5?.length))                       missing.push({ icon: '💡', label: 'Your interests' })

    const skipped = missing.length > 0
    const summaryName = (ans.q2 || '').trim().split(' ')[0]
    const title = skipped
      ? (summaryName ? `You can come back to this anytime, ${summaryName}.` : 'You can come back to this anytime.')
      : (summaryName ? `You're all set, ${summaryName}.`                    : "You're all set.")
    const sub = skipped
      ? <>No problem — you can finish your profile anytime in <strong>Profile settings</strong>. The more you share, the better we can tailor your feed.</>
      : <>We'll personalize your daily feed around what matters to you. You can update your answers anytime in <strong>Profile settings</strong>.</>

    return (
      <div className="ob-overlay">
        <div className="ob-screen">
          <div className="ob-complete">
            <div className="ob-complete__icon">✓</div>
            <h2 className="ob-complete__title">{title}</h2>
            <p className="ob-complete__sub">{sub}</p>
            {rows.length > 0 && (
              <div className="ob-profile-card">
                <div className="ob-profile-card__label">Your profile</div>
                {rows.map(r => (
                  <div className="ob-profile-row" key={r.key}>
                    <span className="ob-profile-row__icon">{r.icon}</span>
                    <div>
                      <div className="ob-profile-row__key">{r.key}</div>
                      <div className="ob-profile-row__val">{r.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {missing.length > 0 && (
              <div className="ob-missing-card">
                <div className="ob-missing-card__label">⏳ Skipped — finish later in Profile settings</div>
                {missing.map(m => (
                  <div className="ob-missing-row" key={m.label}>
                    <span className="ob-missing-row__icon">{m.icon}</span>
                    <span className="ob-missing-row__label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="ob-cta" onClick={onClose}>Let's get started →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREENS (1–4) ──────────────────────────────────────────
  const firstName = (ans.q2 || name || '').trim().split(' ')[0]
  const heroHeadline = firstName
    ? <>{firstName}, let's build your <em>health picture.</em></>
    : <>Let's build your <em>health picture.</em></>
  const heroSub = firstName
    ? `A few quick questions so we can tailor your experience around what matters most to you.`
    : `A few quick questions so we can tailor your experience around what matters most to you.`

  const progressPct = ((step + 1) / TOTAL_QS) * 100

  return (
    <div className="ob-overlay">
      <div className="ob-screen">
        {/* Hero / Header */}
        <div className="ob-hero">
          <p className="ob-hero__eyebrow">Welcome to AHEAD</p>
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
                <div className="ob-q-text">{Q4.text}</div>
                <div className="ob-q-sub">{Q4.sub}</div>

                {/* Branch toggle */}
                <div className="ob-toggle" role="tablist">
                  <button
                    className={`ob-toggle__btn${ans.q4Branch === 'yes' ? ' ob-toggle__btn--active' : ''}`}
                    onClick={() => setQ4Branch('yes')}
                    type="button"
                  >I have a diagnosis</button>
                  <button
                    className={`ob-toggle__btn${ans.q4Branch === 'no' ? ' ob-toggle__btn--active' : ''}`}
                    onClick={() => setQ4Branch('no')}
                    type="button"
                  >Not yet / being proactive</button>
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

            {step === 3 && (
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

            {step === 4 && (
              <>
                <div className="ob-q-text">{Q5.text}</div>
                <div className="ob-q-sub">{Q5.sub}</div>
                <div className="ob-chips">
                  {(() => {
                    // Always include any already-selected secondary topics in the visible
                    // list so the user can deselect them after collapsing.
                    const selectedMore = Q5_TOPICS_MORE.filter(t => ans.q5.includes(t.label))
                    const visible = [
                      ...Q5_TOPICS_PRIMARY,
                      ...(q5ShowMore ? Q5_TOPICS_MORE : selectedMore),
                    ]
                    return visible.map(o => {
                      const sel = ans.q5.includes(o.label)
                      return (
                        <button
                          key={o.label}
                          type="button"
                          className={`ob-chip${sel ? ' ob-chip--sel' : ''}`}
                          onClick={() => toggleQ5(o.label)}
                        >
                          <span className="ob-chip__icon">{o.icon}</span>
                          <span>{o.label}</span>
                        </button>
                      )
                    })
                  })()}
                  <button
                    type="button"
                    className="ob-chip ob-chip--more"
                    onClick={() => setQ5ShowMore(v => !v)}
                  >
                    {q5ShowMore ? '− Show less' : `+ Show ${Q5_TOPICS_MORE.length} more`}
                  </button>
                </div>
                {ans.q5.length > 0 && (
                  <p className="ob-q-count">{ans.q5.length} selected</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Nav row */}
        <div className="ob-nav-row">
          {step === 0
            ? <span className="ob-nav-spacer" />
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

        {/* Skip — available on every step. Routes to summary, not straight into the app */}
        <div className="ob-skip-row">
          <button className="ob-skip" onClick={skip}>Skip for now</button>
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
            <div className={`ob-opt__check${multiSelect ? ' ob-opt__check--multi' : ''}`}>{sel ? '✓' : ''}</div>
          </button>
        )
      })}
    </div>
  )
}
