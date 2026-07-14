import React, { useState } from 'react'
import './Onboarding.css'

// Steps 0-5 = 6 questions; step 6 = summary
const TOTAL_QS = 6
const SUMMARY_STEP = 6

const Q1 = {
  text: 'Who are you using Vitalist for?',
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
    { id: 'risk',       icon: '🔭', label: 'I want to get ahead of my risk',        desc: 'Proactive about future health before problems develop' },
    { id: 'confidence', icon: '✨', label: 'I want to feel in control',              desc: 'Of my numbers, my choices, my direction' },
    { id: 'sleep',      icon: '😴', label: "It's affecting my energy and sleep",     desc: 'Fatigue, poor rest, low motivation' },
    { id: 'triggers',   icon: '🔍', label: "I don't understand what's happening",   desc: 'My body feels different and I want answers' },
    { id: 'treatment',  icon: '💊', label: "I'm managing a lot and want support",   desc: 'Conditions, medications, appointments — it adds up' },
    { id: 'frustrated', icon: '🌀', label: "I've tried things and nothing sticks",  desc: 'Looking for a more sustainable approach' },
  ],
}

// Health picture — show first 6, "Show more" reveals the rest
const Q4 = {
  text: 'What does your health picture look like right now?',
  sub: 'Select all that apply — the more we know, the better we can tailor your experience.',
  options: [
    { id: 'cholesterol', icon: '🫀', label: 'High cholesterol',              desc: 'LDL, HDL, or triglyceride concerns',                       group: 'diagnosed' },
    { id: 'hypertension',icon: '🩺', label: 'High blood pressure',           desc: 'Hypertension or pre-hypertension',                         group: 'diagnosed' },
    { id: 'diabetes',    icon: '🔬', label: 'Type 2 diabetes',               desc: 'Managing blood sugar levels',                              group: 'diagnosed' },
    { id: 'obesity',     icon: '⚖️', label: 'Weight / metabolic health',     desc: 'BMI, metabolic syndrome, or weight-related goals',          group: 'diagnosed' },
    { id: 'heart',       icon: '❤️‍🩹', label: 'Heart disease',               desc: 'Coronary artery disease, prior cardiac event',              group: 'diagnosed' },
    { id: 'menopause',   icon: '🌸', label: 'Menopause / hormonal changes',  desc: 'Perimenopause, menopause, or related symptoms',             group: 'diagnosed' },
    // ↑ first 6 always visible ↓ revealed by "Show more"
    { id: 'glp1',        icon: '💉', label: 'Weight loss medication (GLP-1)', desc: 'Taking or considering Ozempic, Wegovy, or similar',        group: 'diagnosed' },
    { id: 'family_hx',   icon: '👨‍👩‍👧', label: 'Family history',              desc: 'Heart disease, stroke, or diabetes in the family',         group: 'proactive' },
    { id: 'borderline',  icon: '📊', label: 'Borderline numbers',             desc: 'Numbers that are elevated but not yet diagnosed',           group: 'proactive' },
    { id: 'longevity',   icon: '⏳', label: 'Longevity & healthy aging',      desc: 'Planning ahead for quality of life as I get older',         group: 'proactive' },
    { id: 'prevention',  icon: '🛡️', label: 'Prevention focused',            desc: 'No diagnosis yet, but being proactive',                    group: 'proactive' },
    { id: 'post_event',  icon: '❤️‍🩹', label: 'Recovery',                     desc: 'Managing health after a cardiac event or diagnosis',        group: 'proactive' },
    { id: 'other_dx',    icon: '💭', label: 'Something else',                 desc: 'Tell us in your own words',                                group: 'diagnosed' },
  ],
}
const Q4_VISIBLE_DEFAULT = 6  // how many options show before "Show more"

const Q_LIFE = {
  text: "What's most important to you in your life?",
  sub: 'This helps us connect your health to what actually matters to you.',
  options: [
    { id: 'family',   icon: '👨‍👩‍👧', label: 'Caring for my family',       desc: 'Being present and healthy for the people I love' },
    { id: 'food',     icon: '🍽️', label: 'Food and entertaining',         desc: 'Enjoying meals, cooking, and sharing food with others' },
    { id: 'travel',   icon: '✈️', label: 'Travel and exploring',          desc: 'Seeing new places and having adventures' },
    { id: 'culture',  icon: '🎭', label: 'Entertainment and culture',     desc: 'Music, arts, shows, and the things that bring joy' },
    { id: 'finances', icon: '💰', label: 'My financial freedom',          desc: 'Building security and making the most of what I\'ve earned' },
    { id: 'fitness',  icon: '💪', label: 'Fitness and feeling strong',    desc: 'Physical strength, energy, and an active life' },
    { id: 'home',     icon: '🏡', label: 'Having a home that I love',     desc: 'Creating a space and life I\'m proud of' },
  ],
}

const Q5_TOPICS_PRIMARY = [
  { label: 'Heart-healthy eating',    icon: '🥗', change: 'Eat more heart-healthy meals' },
  { label: 'Exercise & movement',     icon: '🚶', change: 'Move more during the day' },
  { label: 'Sleep & rest',            icon: '😴', change: 'Get better sleep' },
  { label: 'Stress & mental health',  icon: '🧘', change: 'Manage my stress' },
  { label: 'Medications & treatment', icon: '💊', change: 'Stay on top of my medications' },
  { label: 'Blood pressure',          icon: '🩺', change: 'Track my blood pressure' },
  { label: 'Blood sugar',             icon: '🔬', change: 'Track my blood sugar' },
  { label: 'Weight management',       icon: '⚖️', change: 'Manage my weight' },
  { label: 'Family & caregiving',     icon: '👨‍👩‍👧', change: 'Balance caregiving with my own health' },
  { label: 'Work & daily life',       icon: '💼', change: 'Fit healthy habits into my workday' },
]
const Q5_TOPICS_MORE = [
  { label: 'Menopause & hormonal health',        icon: '🌸', change: 'Manage menopause symptoms' },
  { label: 'GLP-1 & weight loss medications',    icon: '💉', change: 'Stay consistent with my GLP-1 routine' },
  { label: 'Healthy aging & longevity',          icon: '⏳', change: 'Build habits for long-term health' },
  { label: 'Understanding my numbers',           icon: '📊', change: 'Understand what my numbers mean' },
  { label: 'Preparing for appointments',         icon: '📋', change: 'Prepare better for appointments' },
  { label: 'New treatments & research',          icon: '🧪', change: 'Stay informed on new treatments' },
  { label: 'Alcohol & lifestyle',                icon: '🍷', change: 'Cut back on alcohol' },
  { label: 'Cooking at home',                    icon: '🍳', change: 'Cook more meals at home' },
  { label: 'Travel & staying on track',          icon: '✈️', change: 'Stay on track while traveling' },
  { label: 'Confidence & self-image',            icon: '✨', change: 'Build confidence in my body' },
  { label: 'Community & peer support',           icon: '🤝', change: 'Connect with others who get it' },
]

const Q5 = {
  text: 'Which of these changes feels most manageable right now?',
  sub: 'Start with just one — small changes stick better than trying to do everything at once. We\'ll turn it into a daily habit, and you can always add more later.',
}

function deriveDiagnosisStatus(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return null
  const hasDiagnosed = ids.some(id => Q4.options.find(o => o.id === id)?.group === 'diagnosed')
  return hasDiagnosed ? 'yes' : 'no'
}

const roleLabels = {
  myself: 'Managing for myself',
  child:  'Managing for my child',
  other:  'Supporting someone else',
}

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
    other_dx: 'Something else',
    family_hx: 'Family history', borderline: 'Borderline numbers',
    longevity: 'Longevity & healthy aging', prevention: 'Prevention focused', post_event: 'Recovery',
  },
  lifeValue: {
    family:   'Caring for my family',
    food:     'Food and entertaining',
    travel:   'Travel and exploring',
    culture:  'Entertainment and culture',
    finances: 'My financial freedom',
    fitness:  'Fitness and feeling strong',
    home:     'Having a home that I love',
  },
}

function resolveConditionLabels(ids, otherText) {
  const trimmedOther = (otherText || '').trim()
  return (ids || []).map(id => {
    if (id === 'other_dx' && trimmedOther) return trimmedOther
    return CODE_TO_LABEL.condition[id] || id
  })
}
function mapCode(field, v) {
  if (Array.isArray(v)) return v.map(x => CODE_TO_LABEL[field]?.[x] || x)
  return CODE_TO_LABEL[field]?.[v] || v
}

export default function Onboarding({ name, onClose }) {
  const [step, setStep] = useState(0)
  const [q4ShowMore, setQ4ShowMore] = useState(false)
  const [q5ShowMore, setQ5ShowMore] = useState(false)
  const [ans, setAns] = useState({
    q1: null,           // role
    q2: name || '',     // name
    q3: null,           // motivation
    q4: [],             // conditions (multi-select)
    q4OtherText: '',
    q_life: [],         // life values (multi-select)
    q5: [],             // habits (single-select)
  })

  function selectOpt(key, id) {
    setAns(a => ({ ...a, [key]: id }))
  }

  function toggleQ4(id) {
    setAns(a => {
      const set = new Set(a.q4)
      const wasSelected = set.has(id)
      if (wasSelected) set.delete(id); else set.add(id)
      const next = { ...a, q4: Array.from(set) }
      if (id === 'other_dx' && wasSelected) next.q4OtherText = ''
      return next
    })
  }

  function toggleQ5(label) {
    setAns(a => ({ ...a, q5: a.q5.includes(label) ? [] : [label] }))
  }

  function next() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function back() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  function saveProfile(extra = {}) {
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
    maybeSet('diagnosisStatus', mapCode('diagnosisStatus', deriveDiagnosisStatus(ans.q4)))
    maybeSet('condition',       resolveConditionLabels(ans.q4, ans.q4OtherText))
    maybeSet('lifeValue',       ans.q_life.map(id => CODE_TO_LABEL.lifeValue?.[id] || id))
    maybeSet('topics',          ans.q5)
    profile.onboardingSources = Array.from(onboardingSources)
    Object.assign(profile, extra)
    delete profile.treatmentList
    delete profile.aiSources
    delete profile.aiSeededAt
    try { localStorage.setItem('cardiometabolicProfile', JSON.stringify(profile)) } catch (_) {}
    try {
      localStorage.removeItem('cardiometabolicLastCheckin')
      localStorage.removeItem('cardiometabolicCheckins')
      localStorage.removeItem('vitalistMyRituals2')
      localStorage.removeItem('vitalistMyRitualsCompletions')
    } catch (_) {}
  }

  function complete() {
    saveProfile({ completedAt: new Date().toISOString() })
    next()
  }

  function skip() {
    saveProfile({ skippedAt: new Date().toISOString() })
    setStep(SUMMARY_STEP)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Per-step validation
  const canContinue = (() => {
    if (step === 0) return !!ans.q1
    if (step === 1) return ans.q2.trim().length >= 1
    if (step === 2) return !!ans.q3
    if (step === 3) return Array.isArray(ans.q4) && ans.q4.length > 0
    if (step === 4) return Array.isArray(ans.q_life) && ans.q_life.length > 0
    if (step === 5) return Array.isArray(ans.q5) && ans.q5.length > 0
    return false
  })()

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  if (step === SUMMARY_STEP) {
    const focusLabel     = Q3.options.find(o => o.id === ans.q3)?.label || ''
    const lifeLabel      = (Array.isArray(ans.q_life) ? ans.q_life : []).map(id => Q_LIFE.options.find(o => o.id === id)?.label).filter(Boolean).join(', ')
    const diagnosisStatus = deriveDiagnosisStatus(ans.q4)
    const conditionLabel = resolveConditionLabels(ans.q4, ans.q4OtherText).join(', ')
    const conditionKey   = diagnosisStatus === 'yes'
      ? (ans.q4.length > 1 ? 'Diagnoses' : 'Diagnosis')
      : (ans.q4.length > 1 ? 'Main concerns' : 'Main concern')

    const rows = []
    if (focusLabel)      rows.push({ icon: '🎯', key: 'What\'s driving you',  val: focusLabel })
    if (conditionLabel)  rows.push({ icon: '📍', key: conditionKey,            val: conditionLabel })
    if (lifeLabel)       rows.push({ icon: '💛', key: 'Most important to you', val: lifeLabel })
    if (ans.q5?.length)  rows.push({ icon: '💡', key: 'First habit',           val: ans.q5.join(', ') })

    const missing = []
    if (!ans.q1)              missing.push({ icon: '👤', label: 'Who you\'re managing this for' })
    if (!ans.q2?.trim())      missing.push({ icon: '✏️', label: 'Your name' })
    if (!ans.q3)              missing.push({ icon: '🎯', label: 'What\'s driving you' })
    if (!ans.q4?.length)      missing.push({ icon: '📍', label: 'Your health picture' })
    if (!ans.q_life?.length)  missing.push({ icon: '💛', label: 'What matters most to you' })
    if (!ans.q5?.length)      missing.push({ icon: '💡', label: 'Your first habit' })

    const skipped = missing.length > 0
    const summaryName = (ans.q2 || '').trim().split(' ')[0]
    const title = skipped
      ? (summaryName ? `You can come back to this anytime, ${summaryName}.` : 'You can come back to this anytime.')
      : (summaryName ? `You're all set, ${summaryName}.` : "You're all set.")
    const sub = skipped
      ? <>No problem — finish your profile anytime in <strong>Profile settings</strong>. The more you share, the better we can tailor your experience.</>
      : <>We'll personalize your daily feed around what matters to you. Update your answers anytime in <strong>Profile settings</strong>.</>

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
            <button className="ob-cta" onClick={() => { onClose() }}>Let's get started →</button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREENS ──────────────────────────────────────────────────────
  const firstName = (ans.q2 || name || '').trim().split(' ')[0]
  const heroHeadline = firstName
    ? <>{firstName}, let's build your <em>health picture.</em></>
    : <>Let's build your <em>health picture.</em></>

  const progressPct = ((step + 1) / TOTAL_QS) * 100

  return (
    <div className="ob-overlay">
      <div className="ob-screen">
        {/* Hero */}
        <div className="ob-hero">
          <p className="ob-hero__eyebrow">Welcome to Vitalist</p>
          <h1 className="ob-hero__title">{heroHeadline}</h1>
          <p className="ob-hero__sub">A few quick questions so we can tailor your experience around what matters most to you.</p>
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

            {/* Step 0: Who are you using Vitalist for? */}
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

            {/* Step 1: Name */}
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

            {/* Step 2: What's driving you */}
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

            {/* Step 3: Health picture (show 6, then show more) */}
            {step === 3 && (
              <>
                <div className="ob-q-text">{Q4.text}</div>
                <div className="ob-q-sub">{Q4.sub}</div>
                <OptionList
                  options={q4ShowMore ? Q4.options : Q4.options.slice(0, Q4_VISIBLE_DEFAULT)}
                  selectedIds={ans.q4}
                  multiSelect
                  onSelect={id => toggleQ4(id)}
                />
                {/* Show more / less toggle */}
                <button
                  type="button"
                  className="ob-chip ob-chip--more"
                  style={{ marginTop: 8 }}
                  onClick={() => setQ4ShowMore(v => !v)}
                >
                  {q4ShowMore
                    ? `− Show fewer options`
                    : `+ ${Q4.options.length - Q4_VISIBLE_DEFAULT} more options`}
                </button>
                {ans.q4.includes('other_dx') && (
                  <input
                    className="ob-input"
                    type="text"
                    placeholder="Tell us what's going on…"
                    value={ans.q4OtherText}
                    onChange={e => setAns(a => ({ ...a, q4OtherText: e.target.value }))}
                    style={{ marginTop: 'var(--space-3)' }}
                  />
                )}
              </>
            )}

            {/* Step 4: What's most important to you (new) */}
            {step === 4 && (
              <>
                <div className="ob-q-text">{Q_LIFE.text}</div>
                <div className="ob-q-sub">{Q_LIFE.sub}</div>
                <OptionList
                  options={Q_LIFE.options}
                  selectedIds={ans.q_life}
                  multiSelect
                  onSelect={id => setAns(a => {
                    const s = new Set(a.q_life)
                    s.has(id) ? s.delete(id) : s.add(id)
                    return { ...a, q_life: Array.from(s) }
                  })}
                />
              </>
            )}

            {/* Step 5: Habits */}
            {step === 5 && (
              <>
                <div className="ob-q-text">{Q5.text}</div>
                <div className="ob-q-sub">{Q5.sub}</div>
                <div className="ob-chips">
                  {(() => {
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
                          <span>{o.change || o.label}</span>
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
                  <p className="ob-q-count">✓ We'll add this as your first daily habit to track.</p>
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
