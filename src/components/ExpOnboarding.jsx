import React, { useState } from 'react'
import './ExpOnboarding.css'

// ── Goal catalogue ──────────────────────────────────────────────────────────
const GOALS = [
  { id: 'move',    emoji: '🚶', label: 'Move more' },
  { id: 'strong',  emoji: '💪', label: 'Get stronger' },
  { id: 'eat',     emoji: '🥗', label: 'Eat better' },
  { id: 'water',   emoji: '💧', label: 'Drink more water' },
  { id: 'sleep',   emoji: '😴', label: 'Sleep better' },
  { id: 'stress',  emoji: '🧘', label: 'Handle stress' },
  { id: 'connect', emoji: '👥', label: 'See my people more' },
  { id: 'phone',   emoji: '📵', label: 'Less time on my phone' },
  { id: 'alcohol', emoji: '🍷', label: 'Drink less' },
  { id: 'smoke',   emoji: '🚭', label: 'Smoke / vape less' },
  { id: 'meds',    emoji: '💊', label: 'Take my meds' },
  { id: 'appt',    emoji: '📞', label: 'Make that appointment' },
  { id: 'screen',  emoji: '🩺', label: 'Get that screening' },
]

// ── Starting-line options (contextual to primary goal) ──────────────────────
const STARTING_LINES = {
  move: [
    { id: 'sedentary', emoji: '🛋️', label: 'Most days I barely move' },
    { id: 'standing',  emoji: '🧍', label: "On my feet all day, but that's it" },
    { id: 'walking',   emoji: '🚶', label: 'I walk plenty — real exercise is missing' },
    { id: 'active',    emoji: '🎽', label: 'I exercise, just not consistently' },
  ],
  sleep: [
    { id: 'wired',     emoji: '🌙', label: 'Wired late into the night' },
    { id: 'notenough', emoji: '⏰', label: 'I sleep, but never quite enough' },
    { id: 'toolate',   emoji: '📱', label: 'I stay up later than I mean to' },
    { id: 'mornings',  emoji: '😴', label: 'I sleep okay — mornings are the hard part' },
  ],
  eat: [
    { id: 'fast',   emoji: '🏃', label: 'I eat fast and on the go' },
    { id: 'grab',   emoji: '🍔', label: 'I grab whatever is easiest' },
    { id: 'okay',   emoji: '📊', label: 'Pretty okay, but could be more intentional' },
    { id: 'slipped',emoji: '😅', label: 'I used to cook — and lost the thread' },
  ],
  default: [
    { id: 'notstarted', emoji: '🌱', label: "I haven't really started" },
    { id: 'sometimes',  emoji: '🔄', label: 'I try sometimes, inconsistently' },
    { id: 'mostdays',   emoji: '📈', label: 'I do okay most days' },
    { id: 'slipped',    emoji: '😅', label: 'I used to — and lost the thread' },
  ],
}

// ── Moment anchors ──────────────────────────────────────────────────────────
const ANCHORS = {
  move: [
    { id: 'dinner',   emoji: '🍽️', label: 'After dinner' },
    { id: 'coffee',   emoji: '☕', label: 'With morning coffee' },
    { id: 'charging', emoji: '🔌', label: 'While the phone charges' },
  ],
  sleep: [
    { id: 'tvoff',    emoji: '📺', label: 'When the TV goes off' },
    { id: 'teeth',    emoji: '🪥', label: 'Brushing my teeth' },
    { id: 'charging', emoji: '🔌', label: 'While the phone charges' },
  ],
  default: [
    { id: 'morning',  emoji: '☀️', label: 'In the morning' },
    { id: 'dinner',   emoji: '🍽️', label: 'After dinner' },
    { id: 'charging', emoji: '🔌', label: 'While the phone charges' },
  ],
}

// ── Habit covers (micro-action per goal) ────────────────────────────────────
const HABIT_MAP = {
  move: {
    headline: 'Three minutes outside,',
    headlineEm: 'after dinner.',
    tagline: "That's it.",
    label: '3-min walk after dinner',
    icon: '🚶',
    bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)',
    why: 'Even a brief walk after eating blunts blood sugar spikes by up to 22% — without any medication. And it compounds: three minutes becomes ten becomes twenty, on its own timeline.',
    source: 'EatingWell',
  },
  sleep: {
    headline: 'Lights low',
    headlineEm: 'after 9.',
    tagline: 'Just try it tonight.',
    label: 'Lights low after 9',
    icon: '😴',
    bg: 'linear-gradient(155deg,#6d7b6a 0%,#3a4436 72%)',
    why: 'Bright light suppresses melatonin — the hormone that tells your body it\'s time to sleep. Dimming screens and overhead lights just one hour before bed can shift your sleep onset by up to 30 minutes.',
    source: 'Sleep Foundation',
  },
  eat: {
    headline: 'Fork down',
    headlineEm: 'between bites.',
    tagline: 'At dinner tonight.',
    label: 'Fork down between bites',
    icon: '🥗',
    bg: 'linear-gradient(155deg,#8a6a5a 0%,#5a3a2a 72%)',
    why: "Eating slower gives your gut time to signal fullness to your brain — it takes about 20 minutes. People who eat slower consume fewer calories without trying, and enjoy their food more.",
    source: 'EatingWell',
  },
  water: {
    headline: 'One glass of water,',
    headlineEm: 'before coffee.',
    tagline: "That's the whole thing.",
    label: 'Glass of water before coffee',
    icon: '💧',
    bg: 'linear-gradient(155deg,#5a7a8a 0%,#2d4a5a 72%)',
    why: 'After 7–8 hours of sleep, you wake up mildly dehydrated. That alone can impair focus, mood, and energy. One glass before caffeine sets the baseline.',
    source: 'Healthline',
  },
  stress: {
    headline: 'Five breaths',
    headlineEm: 'before the first scroll.',
    tagline: 'Five. That\'s it.',
    label: '5 breaths before scrolling',
    icon: '🧘',
    bg: 'linear-gradient(155deg,#7a6a8a 0%,#4a3a5a 72%)',
    why: "Five slow breaths activate your parasympathetic nervous system — your body's calm-down mode. It's the simplest way to interrupt the stress-scroll cycle before it starts.",
    source: 'Verywell Mind',
  },
  strong: {
    headline: 'Ten squats',
    headlineEm: 'before the shower.',
    tagline: 'Every day. Thirty seconds.',
    label: '10 squats before the shower',
    icon: '💪',
    bg: 'linear-gradient(155deg,#5a6a5a 0%,#3a4a3a 72%)',
    why: "Squats engage the body's largest muscle groups — legs and glutes — which burns more energy and builds functional strength faster than almost anything else. No gym needed.",
    source: 'Verywell Fit',
  },
  default: {
    headline: 'One small thing,',
    headlineEm: 'starting tonight.',
    tagline: "That's it.",
    label: 'One small step',
    icon: '✨',
    bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)',
    why: "Small actions, repeated consistently, build identity. You're not trying to change everything — just prove to yourself that you can start.",
    source: 'James Clear',
  },
}


// ── Things they already do ──────────────────────────────────────────────────
const EXISTING_HABITS = [
  { id: 'ex_walk',    goalId: 'move',    label: 'Walk regularly',           bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)' },
  { id: 'ex_water',   goalId: 'water',   label: 'Drink enough water',       bg: 'linear-gradient(155deg,#5a7a8a 0%,#2d4a5a 72%)' },
  { id: 'ex_sleep',   goalId: 'sleep',   label: 'Keep a regular sleep time',bg: 'linear-gradient(155deg,#6d7b6a 0%,#3a4436 72%)' },
  { id: 'ex_vitamins',goalId: 'eat',     label: 'Take my vitamins',         bg: 'linear-gradient(155deg,#8a6a5a 0%,#5a3a2a 72%)' },
  { id: 'ex_meditate',goalId: 'stress',  label: 'Meditate or breathe',      bg: 'linear-gradient(155deg,#7a6a8a 0%,#4a3a5a 72%)' },
  { id: 'ex_cook',    goalId: 'eat',     label: 'Cook at home most nights', bg: 'linear-gradient(155deg,#8a6a5a 0%,#5a3a2a 72%)' },
  { id: 'ex_strength',goalId: 'strong',  label: 'Strength training',        bg: 'linear-gradient(155deg,#5a6a5a 0%,#3a4a3a 72%)' },
  { id: 'ex_alcohol', goalId: 'alcohol', label: 'Limit alcohol',            bg: 'linear-gradient(155deg,#6a5a7a 0%,#3a2a5a 72%)' },
]

function getHabit(goalId) {
  return HABIT_MAP[goalId] || HABIT_MAP.default
}

function getAnchors(goalId) {
  return ANCHORS[goalId] || ANCHORS.default
}

function getStartingLines(goalId) {
  return STARTING_LINES[goalId] || STARTING_LINES.default
}

// ── Component ───────────────────────────────────────────────────────────────
export default function ExpOnboarding({ onComplete }) {
  const [step, setStep]               = useState('S_auth')
  const [selectedGoals, setGoals]     = useState([])
  const [primaryGoal, setPrimary]     = useState(null)
  const [startingLine, setStartLine]  = useState(null)
  const [anchor, setAnchor]           = useState(null)
  const [showWhy, setShowWhy]         = useState(false)
  const [altIndex, setAltIndex]       = useState(0)
  const [existingHabits, setExisting]   = useState([])

  const goal     = primaryGoal || selectedGoals[0]
  const habit    = getHabit(goal)
  const anchors  = getAnchors(goal)
  const lines    = getStartingLines(goal)

  // Rotate through alternative habits on "Show me another"
  const ALT_GOALS = Object.keys(HABIT_MAP).filter(k => k !== 'default' && k !== goal)
  const altGoal   = ALT_GOALS[altIndex % ALT_GOALS.length]
  const altHabit  = HABIT_MAP[altGoal]

  // ── Auth button icons ──────────────────────────────────────────────────────
  const IconEmail = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>
  )
  const IconPhone = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  )
  const IconGoogle = (
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
  )
  const IconApple = (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
  )

  function toggleGoal(id) {
    setGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function finishOnboarding(sources = []) {
    const habitId   = goal || 'move'
    const habitData = getHabit(habitId)
    const today     = new Date().toISOString().slice(0, 10)
    const habits    = [{
      id:       habitId + '_' + Date.now(),
      goalId:   habitId,
      label:    habitData.label,
      icon:     habitData.icon,
      bg:       habitData.bg,
      anchor:   null,
      status:   'trial',
      addedAt:  today,
      tier:     1,
    }]
    const collection = existingHabits.map(id => {
      const h = EXISTING_HABITS.find(e => e.id === id)
      return { id, goalId: h.goalId, label: h.label, bg: h.bg, status: 'established', addedAt: today }
    })
    try {
      localStorage.setItem('vitalistExp_habits', JSON.stringify(habits))
      localStorage.setItem('vitalistExp_goals', JSON.stringify(selectedGoals))
      localStorage.setItem('vitalistExp_collection', JSON.stringify(collection))
      localStorage.setItem('vitalistExp_sources', JSON.stringify(sources))
      localStorage.setItem('vitalistExp_complete', '1')
    } catch (_) {}
    onComplete(habits)
  }

  function handleLookAround() {
    // Demo state: pre-seed two habits
    const today = new Date().toISOString().slice(0, 10)
    const ago30 = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
    const habits = [
      { id: 'walk_demo', goalId: 'move',  label: '3-min walk after dinner',  icon: '🚶', bg: HABIT_MAP.move.bg,  anchor: 'After dinner',  status: 'kept',  addedAt: ago30, tier: 2 },
      { id: 'sleep_demo', goalId: 'sleep', label: 'Lights low after 9',       icon: '😴', bg: HABIT_MAP.sleep.bg, anchor: 'Before bed',    status: 'trial', addedAt: today, tier: 1 },
    ]
    try {
      localStorage.setItem('vitalistExp_habits', JSON.stringify(habits))
      localStorage.setItem('vitalistExp_sources', JSON.stringify(['steps', 'sleep']))
      localStorage.setItem('vitalistExp_complete', '1')
    } catch (_) {}
    onComplete(habits)
  }

  // ── Screens ────────────────────────────────────────────────────────────────
  if (step === 'S_auth') return (
    <div className="eo-root eo-auth">
      <div className="eo-auth__scroll">
        <div className="eo-auth__hero">
          <div className="eo-auth__hero-bg" />
          <div className="eo-auth__hero-scrim" />
          <div className="eo-auth__hero-inner">
            <p className="eo-auth__eyebrow">Vitalist <span>·</span> People Inc.</p>
            <h1 className="eo-auth__welcome">Welcome to <em>Vitalist</em></h1>
          </div>
        </div>
        <div className="eo-auth__panel">
          <p className="eo-auth__intro">
            A personalized health companion that connects your conditions, your
            choices, and your future — so you always know what's happening and
            what to do next.
          </p>
          <p className="eo-auth__intro">
            Track your numbers, identify patterns, and build lasting habits —
            across cholesterol, blood pressure, weight, menopause, and more.
          </p>
          <div className="eo-auth__divider"><span>Join now</span></div>
          <div className="eo-auth__actions">
            <button className="eo-auth__btn email" onClick={() => setStep('S2')}>
              <span className="eo-auth__btn-icon">{IconEmail}</span>
              Continue with Email
            </button>
            <button className="eo-auth__btn phone" onClick={() => setStep('S2')}>
              <span className="eo-auth__btn-icon">{IconPhone}</span>
              Continue with Phone
            </button>
            <button className="eo-auth__btn google" onClick={() => setStep('S2')}>
              <span className="eo-auth__btn-icon">{IconGoogle}</span>
              Continue with Google
            </button>
            <button className="eo-auth__btn apple" onClick={() => setStep('S2')}>
              <span className="eo-auth__btn-icon">{IconApple}</span>
              Continue with Apple
            </button>
          </div>
          <p className="eo-auth__legal">
            By continuing, you agree to our <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>. Your data is protected under HIPAA. We will never sell your information.
          </p>
          <button className="eo-auth__peek" onClick={handleLookAround}>
            Just looking around →
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'S0') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-body">
          <div className="eo-hero">
            <p className="eo-eye">Welcome to Vitalist</p>
            <h1 className="eo-disp" style={{ fontSize: 32 }}>
              You already know <em>what would help.</em>
            </h1>
          </div>
          <p className="eo-lede">
            Let's make one of them actually happen — starting tonight.
            No program, no pressure.
          </p>
          <div className="eo-spacer" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="eo-btn primary" onClick={() => setStep('S2')}>
              Let's go →
            </button>
            <button className="eo-link" onClick={handleLookAround}>
              Just looking around
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (step === 'S2') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-prog"><span>Getting started</span><span className="step">1 of 3</span></div>
        <div className="eo-track"><div className="eo-track-fill" style={{ width: '33%' }} /></div>
        <div className="eo-body">
          <h2 className="eo-q">Which of these are on your to-do list?</h2>
          <p className="eo-lede">Pick everything that's been on your mind.</p>
          <div className="eo-chips">
            {GOALS.map(g => (
              <span
                key={g.id}
                className={`eo-chip${selectedGoals.includes(g.id) ? ' on' : ''}`}
                onClick={() => toggleGoal(g.id)}
              >
                {g.emoji} {g.label}
              </span>
            ))}
            <span className="eo-chip more" onClick={() => {}}>✏️ Something else</span>
            <span className="eo-chip more" onClick={() => {}}>🤷 Not sure</span>
          </div>
          <button
            className="eo-btn primary"
            disabled={selectedGoals.length === 0}
            onClick={() => {
              if (selectedGoals.length === 1) {
                setPrimary(selectedGoals[0])
                setStep('S2b')
              } else {
                setStep('S2a')
              }
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'S2a') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-prog"><span>Getting started</span><span className="step">1 of 3</span></div>
        <div className="eo-track"><div className="eo-track-fill" style={{ width: '33%' }} /></div>
        <div className="eo-body">
          <h2 className="eo-q">Which one's loudest right now?</h2>
          {selectedGoals.map(id => {
            const g = GOALS.find(x => x.id === id)
            return (
              <div
                key={id}
                className={`eo-opt${primaryGoal === id ? ' on' : ''}`}
                onClick={() => setPrimary(id)}
              >
                <span className="emo">{g.emoji}</span>
                <div className="txt"><b>{g.label}</b></div>
                <span className={`eo-radio${primaryGoal === id ? ' on' : ''}`} />
              </div>
            )
          })}
          <div className="eo-green">
            <span className="lab">🤝 We'll hold the rest</span>
            <p className="eo-lede" style={{ marginTop: 4 }}>One at a time is the whole point.</p>
          </div>
          <div className="eo-spacer" />
          <button
            className="eo-btn primary"
            disabled={!primaryGoal}
            onClick={() => setStep('S2b')}
          >
            That one →
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'S_existing') {
    function toggleExisting(id) {
      setExisting(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }
    return (
      <div className="eo-root">
        <div className="eo-screen">
          <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
          <div className="eo-prog"><span>One more thing</span><span className="step">3 of 3</span></div>
          <div className="eo-track"><div className="eo-track-fill" style={{ width: '100%' }} /></div>
          <div className="eo-body">
            <h2 className="eo-q">What are you <em>already</em> doing?</h2>
            <p className="eo-lede">We'll add these to your collection — credit where it's due.</p>
            <div className="eo-chips">
              {EXISTING_HABITS.map(h => (
                <span
                  key={h.id}
                  className={`eo-chip${existingHabits.includes(h.id) ? ' on' : ''}`}
                  onClick={() => toggleExisting(h.id)}
                >
                  {h.label}
                </span>
              ))}
            </div>
            <div className="eo-spacer" />
            <button className="eo-btn primary" onClick={() => setStep('S4')}>
              {existingHabits.length > 0 ? 'Nice — keep going →' : 'Starting fresh →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'S2b') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-prog"><span>Your starting line</span><span className="step">2 of 3</span></div>
        <div className="eo-track"><div className="eo-track-fill" style={{ width: '66%' }} /></div>
        <div className="eo-body">
          <h2 className="eo-q">
            Everyone's starting line is different — <em>where's yours?</em>
          </h2>
          {lines.map(l => (
            <div
              key={l.id}
              className={`eo-opt${startingLine === l.id ? ' on' : ''}`}
              onClick={() => setStartLine(l.id)}
            >
              <span className="emo">{l.emoji}</span>
              <div className="txt"><b>{l.label}</b></div>
              <span className={`eo-radio${startingLine === l.id ? ' on' : ''}`} />
            </div>
          ))}
          <div className="eo-spacer" />
          <button
            className="eo-btn primary"
            disabled={!startingLine}
            onClick={() => setStep('S_existing')}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )


  if (step === 'S4') {
    const displayHabit = altIndex === 0 ? habit : altHabit
    return (
      <div className="eo-root">
        <div className="eo-cover">
          <div className="eo-cover__bg" style={{ background: displayHabit.bg }} />
          <div className="eo-cover__overlay" />
          <div className="eo-cover__status"><span>9:41</span><span>▚ ▪ ▐</span></div>
          <p className="eo-brand eo-brand--light">Vitalist</p>
          <div className="eo-cover__flag-row">
            <span className="eo-cover__flag">{displayHabit.source}</span>
            <p className="eo-cover__eyebrow">
              {anchor ? anchors.find(a => a.id === anchor)?.label : 'Tonight'}
            </p>
          </div>
          <div className="eo-cover__content">
            <h1 className="eo-cover__hed">
              {altIndex === 0
                ? <>{displayHabit.headline} <em>{displayHabit.headlineEm}</em></>
                : <>{displayHabit.headline} <em>{displayHabit.headlineEm}</em></>
              }
            </h1>
            <p className="eo-cover__that">{displayHabit.tagline}</p>
            <div className="eo-cover__actions">
              <button
                className="eo-cover__primary"
                onClick={() => setStep('S5')}
              >
                I'll try it →
              </button>
              <div className="eo-cover__row">
                <button
                  className="eo-cover__link"
                  onClick={() => setAltIndex(i => i + 1)}
                >
                  Show me another
                </button>
                <button
                  className="eo-cover__link"
                  onClick={() => setShowWhy(true)}
                >
                  Why this works
                </button>
              </div>
            </div>
          </div>

          {showWhy && (
            <div className="eo-why" onClick={e => e.stopPropagation()}>
              <div className="eo-why__handle" />
              <p className="eo-why__label">Why this works</p>
              <p className="eo-why__text">{displayHabit.why}</p>
              <button className="eo-why__close" onClick={() => setShowWhy(false)}>Got it</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'S5') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-body" style={{ justifyContent: 'center', gap: 20 }}>
          <div className="eo-notif-icon">🔔</div>
          <div>
            <h2 className="eo-q">Want a nudge at your moment?</h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>
              One a day, max — and never a guilt trip.
            </p>
          </div>
          <div className="eo-spacer" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="eo-btn primary" onClick={() => setStep('S_wear')}>
              Yes, nudge me →
            </button>
            <button className="eo-link" onClick={() => setStep('S_wear')}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (step === 'S_wear') return (
    <div className="eo-root">
      <div className="eo-screen">
        <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
        <p className="eo-brand">Vitalist</p>
        <div className="eo-body" style={{ justifyContent: 'center', gap: 18 }}>
          <div className="eo-wear-icon">⌚</div>
          <div>
            <h2 className="eo-q">Connect a tracker?</h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>
              Link Apple Health or your wearable and we'll fill in steps, sleep and more —
              so most habits confirm themselves. Nothing to tap.
            </p>
          </div>
          <div className="eo-wear-sources">
            <span className="eo-wear-chip">Steps</span>
            <span className="eo-wear-chip">Sleep</span>
            <span className="eo-wear-chip">Workouts</span>
            <span className="eo-wear-chip">Heart rate</span>
          </div>
          <div className="eo-spacer" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="eo-btn primary"
              onClick={() => finishOnboarding(['steps', 'sleep', 'workouts', 'hrv'])}
            >
              Connect Apple Health →
            </button>
            <button className="eo-link" onClick={() => finishOnboarding([])}>
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return null
}
