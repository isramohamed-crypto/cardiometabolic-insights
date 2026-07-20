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
  text: 'Here\'s your first habit',
  sub: 'Chosen for you based on what you shared. Try it for one week — you can always swap it.',
}

// ── First-habit recommendation system ─────────────────────────────────────────
// Mirrors data from MyRituals HABIT_LIBRARY for the onboarding card display.
const HABIT_REC_DATA = {
  hl_walk:    { icon: '🚶', label: '10-min walk after meals',   desc: 'After meals is best',           category: 'Move',     catColor: '#2D9B83', catBg: '#e6f7f4', hook: 'Drops blood sugar 22% — no medication needed',                    anchor: 'After your largest meal',  stat: '22%',   statLabel: 'DROP IN POST-MEAL GLUCOSE',             statColor: '#2D9B83', body: 'Even a brief walk after eating blunts the blood sugar spike by up to 22% — without any medication. It also lowers resting BP by 4–9 mmHg over weeks of consistency.',                                                              source: 'American Diabetes Association Clinical Guidelines, 2023' },
  hl_fiber:   { icon: '🥣', label: 'Fiber-rich breakfast',      desc: 'Oats and legumes bind LDL',     category: 'Nourish',  catColor: '#E07B4A', catBg: '#fef3ec', hook: 'Oat fiber binds LDL before it ever reaches your bloodstream',       anchor: 'Every morning',            stat: '15%',   statLabel: 'LDL REDUCTION FROM DAILY OAT FIBER',    statColor: '#E07B4A', body: 'Beta-glucan fiber found in oats and legumes physically binds LDL cholesterol in your gut before it enters your bloodstream — lowering it 10–15% over 8 weeks.',                                                                    source: 'American Heart Journal; Harvard T.H. Chan School of Public Health' },
  hl_sodium:  { icon: '🧂', label: 'Limit sodium today',        desc: 'Under 1,500 mg makes a diff',   category: 'Nourish',  catColor: '#E07B4A', catBg: '#fef3ec', hook: 'Cutting sodium is as powerful as adding a blood pressure medication', anchor: 'At each meal',             stat: '5 mmHg', statLabel: 'AVERAGE SYSTOLIC DROP ON LOW-SODIUM',  statColor: '#E07B4A', body: 'Reducing sodium below 1,500 mg/day lowers systolic BP by an average of 5 mmHg — equivalent to adding one blood pressure medication for many people.',                                                                              source: 'DASH-Sodium Trial; AHA Dietary Guidelines' },
  hl_stretch: { icon: '🧘', label: 'Morning stretch',           desc: 'Starts circulation early',      category: 'Move',     catColor: '#2D9B83', catBg: '#e6f7f4', hook: 'Morning movement drops cortisol 15% before your day even starts',    anchor: 'When you wake up',         stat: '15%',   statLabel: 'CORTISOL REDUCTION AFTER MORNING MOVE', statColor: '#2D9B83', body: 'Morning movement — even gentle stretching — reduces cortisol by 15% and activates the parasympathetic nervous system, setting a lower stress baseline for the day.',                                                                source: 'Journal of Behavioral Medicine; Applied Physiology' },
  hl_protein: { icon: '🥚', label: 'Protein-rich breakfast',    desc: 'Reduces hunger hormones',       category: 'Nourish',  catColor: '#E07B4A', catBg: '#fef3ec', hook: 'Cuts hunger hormones 25% — critical on GLP-1 medications',           anchor: 'Every morning',            stat: '25%',   statLabel: 'REDUCTION IN HUNGER HORMONE (GHRELIN)', statColor: '#E07B4A', body: 'A high-protein breakfast reduces ghrelin — the hunger hormone — by up to 25% for the rest of the day. Especially important on GLP-1 medications to maintain muscle.',                                                              source: 'American Journal of Clinical Nutrition, 2023' },
  hl_sleep:   { icon: '😴', label: 'Protect your sleep window', desc: 'Same time every night',         category: 'Rest',     catColor: '#8B5CF6', catBg: '#f5f3ff', hook: 'One bad week raises insulin resistance 37% without changing your diet', anchor: 'Same time every night',    stat: '37%',   statLabel: 'HIGHER INSULIN RESISTANCE AFTER POOR SLEEP', statColor: '#8B5CF6', body: 'Sleeping under 6 hours raises insulin resistance by 37%, elevates cortisol, and increases cardiovascular risk — even if everything else in your routine is perfect.',                                                            source: 'Annals of Internal Medicine; Sleep Research Society' },
  hl_breathe: { icon: '💨', label: '5-min deep breathing',      desc: 'Interrupts the stress pipeline', category: 'Mind',    catColor: '#EC4899', catBg: '#fdf2f8', hook: "Today's stress shows up in your numbers 48 hours from now",           anchor: 'Once a day — same time',   stat: '48h',   statLabel: 'LAG BETWEEN STRESS AND BP/GLUCOSE SPIKE', statColor: '#EC4899', body: 'Stress elevates cortisol, which raises blood pressure and blood sugar — but the spike typically arrives 48 hours later. Daily breathing practice blunts cortisol before it compounds.', source: 'Journal of Hypertension; Psychosomatic Medicine' },
  hl_water:   { icon: '💧', label: 'Start your day hydrated',   desc: 'Dehydration quietly raises BP', category: 'Hydrate',  catColor: '#3B82F6', catBg: '#eff6ff', hook: 'Mild dehydration silently raises your blood pressure',                anchor: 'Before anything else',     stat: '8%',    statLabel: 'BP RISE FROM MILD DEHYDRATION',         statColor: '#3B82F6', body: 'Even mild dehydration raises blood pressure and puts extra strain on kidneys — especially important for people on blood pressure or diabetes medications.',                                                                      source: 'European Journal of Nutrition; AHA Hydration Guidelines' },
}

// Returns an ordered list of habit IDs, most relevant first, for cycling.
function getHabitRecs(ans) {
  const conds = resolveConditionLabels(ans.q4, ans.q4OtherText)
  const motiv = ans.q3
  const ordered = []
  const add = id => { if (!ordered.includes(id)) ordered.push(id) }

  if (conds.some(c => /diabetes/i.test(c)))      add('hl_walk')
  if (conds.some(c => /cholesterol/i.test(c)))   add('hl_fiber')
  if (conds.some(c => /blood pressure/i.test(c) || /hypertension/i.test(c))) add('hl_sodium')
  if (conds.some(c => /menopause/i.test(c)))     add('hl_stretch')
  if (conds.some(c => /glp-1/i.test(c) || /weight loss med/i.test(c)))       add('hl_protein')

  if (motiv === 'sleep')      add('hl_sleep')
  if (['triggers', 'frustrated', 'treatment'].includes(motiv)) add('hl_breathe')

  for (const id of ['hl_breathe', 'hl_sleep', 'hl_fiber', 'hl_walk', 'hl_water']) add(id)
  return ordered
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
  const [habitIdx, setHabitIdx] = useState(0)
  const [completedHabitId, setCompletedHabitId] = useState(null)
  const [ans, setAns] = useState({
    q1: null,           // role
    q2: name || '',     // name
    q3: null,           // motivation
    q4: [],             // conditions (multi-select)
    q4OtherText: '',
    q_life: [],         // life values (multi-select)
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

  function next() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function back() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  function completeWithHabit() {
    const recs = getHabitRecs(ans)
    const habitId = recs[habitIdx % recs.length]
    saveProfile({ completedAt: new Date().toISOString() })
    // Write after saveProfile (which clears vitalistMyRituals2)
    try { localStorage.setItem('vitalistMyRituals2', JSON.stringify([habitId])) } catch (_) {}
    setCompletedHabitId(habitId)
    next()
  }

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
    if (step === 5) return true  // habit card is always pre-selected
    return false
  })()

  // ── SUMMARY — habit win moment ────────────────────────────────────────────
  if (step === SUMMARY_STEP) {
    const habitId   = completedHabitId || getHabitRecs(ans)[0]
    const habit     = HABIT_REC_DATA[habitId] || Object.values(HABIT_REC_DATA)[0]
    const winName   = (ans.q2 || '').trim().split(' ')[0]
    const winTitle  = winName ? `Your first step is set, ${winName}.` : 'Your first step is set.'

    return (
      <div className="ob-overlay">
        <div className="ob-screen">
          <div className="ob-win">
            <div className="ob-win__badge">✓</div>
            <h2 className="ob-win__title">{winTitle}</h2>
            <p className="ob-win__sub">
              We've added this to your daily rituals. Try it for one week — that's all it takes to see a difference.
            </p>

            {/* Habit card — confirmed state */}
            <div className="ob-habit-card ob-habit-card--confirmed" style={{ '--cat-color': habit.catColor, '--cat-bg': habit.catBg }}>
              <div className="ob-habit-card__main">
                <div className="ob-habit-card__icon-wrap" style={{ background: habit.catBg }}>
                  {habit.icon}
                </div>
                <div className="ob-habit-card__text">
                  <div className="ob-habit-card__label">{habit.label}</div>
                  <div className="ob-habit-card__anchor">{habit.anchor}</div>
                </div>
              </div>
              <div className="ob-habit-card__why">
                <span className="ob-habit-card__cat" style={{ color: habit.catColor, background: habit.catBg }}>{habit.category}</span>
                <p className="ob-habit-card__hook">{habit.hook}</p>
              </div>
              <div className="ob-habit-card__stat-row">
                <span className="ob-habit-card__stat-num" style={{ color: habit.statColor }}>{habit.stat}</span>
                <span className="ob-habit-card__stat-lbl">{habit.statLabel}</span>
              </div>
              <p className="ob-habit-card__body-text">{habit.body}</p>
              <p className="ob-habit-card__source">{habit.source}</p>
            </div>

            <div className="ob-win__what-next">
              <div className="ob-win__wn-title">What happens next</div>
              <div className="ob-win__wn-row">
                <span className="ob-win__wn-dot ob-win__wn-dot--1" />
                <span>Your ritual shows up on your home feed every day</span>
              </div>
              <div className="ob-win__wn-row">
                <span className="ob-win__wn-dot ob-win__wn-dot--2" />
                <span>After 7 days you decide — keep it, swap it, or add more</span>
              </div>
              <div className="ob-win__wn-row">
                <span className="ob-win__wn-dot ob-win__wn-dot--3" />
                <span>We'll track the impact on your numbers over time</span>
              </div>
            </div>

            <button className="ob-cta" onClick={onClose}>Let's get started →</button>
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

            {/* Step 5: First habit recommendation */}
            {step === 5 && (() => {
              const recs = getHabitRecs(ans)
              const habitId = recs[habitIdx % recs.length]
              const habit = HABIT_REC_DATA[habitId]
              return (
                <>
                  <div className="ob-q-text">{Q5.text}</div>
                  <div className="ob-q-sub">{Q5.sub}</div>
                  <div className="ob-habit-card" style={{ '--cat-color': habit.catColor, '--cat-bg': habit.catBg }}>
                    <div className="ob-habit-card__main">
                      <div className="ob-habit-card__icon-wrap" style={{ background: habit.catBg }}>
                        {habit.icon}
                      </div>
                      <div className="ob-habit-card__text">
                        <div className="ob-habit-card__label">{habit.label}</div>
                        <div className="ob-habit-card__anchor">{habit.anchor}</div>
                      </div>
                      <span className="ob-habit-card__ai-tag">AI pick</span>
                    </div>
                    <div className="ob-habit-card__why">
                      <span className="ob-habit-card__cat" style={{ color: habit.catColor, background: habit.catBg }}>{habit.category}</span>
                      <p className="ob-habit-card__hook">{habit.hook}</p>
                    </div>
                    <div className="ob-habit-card__stat-row">
                      <span className="ob-habit-card__stat-num" style={{ color: habit.statColor }}>{habit.stat}</span>
                      <span className="ob-habit-card__stat-lbl">{habit.statLabel}</span>
                    </div>
                    <p className="ob-habit-card__body-text">{habit.body}</p>
                    <p className="ob-habit-card__source">{habit.source}</p>
                  </div>
                  <button
                    type="button"
                    className="ob-swap-btn"
                    onClick={() => setHabitIdx(i => i + 1)}
                  >
                    Not quite right? See another →
                  </button>
                </>
              )
            })()}
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
              if (step === TOTAL_QS - 1) completeWithHabit()
              else next()
            }}
          >
            {step === TOTAL_QS - 1 ? 'Add this habit →' : 'Continue →'}
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
