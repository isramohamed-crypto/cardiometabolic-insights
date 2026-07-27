import React, { useState } from 'react'
import './ExpOnboarding.css'

// ── "Already doing" pillars (Mark's proto) ──────────────────────────────────
const PILLARS = [
  { id: 'eating', num: 1, label: 'Eating', goalId: 'eat', q: 'Which of these already describe how you eat?',
    options: ['Vegetables or fruit with most meals', 'Cook at home most nights', 'Fish or plant protein a couple times a week', 'Swap a sugary drink for water most days', 'Olive oil or nuts as your go-to fat'] },
  { id: 'moving', num: 2, label: 'Moving', goalId: 'move', q: 'Which of these already describe how you move?',
    options: ['A daily walk, any length', 'Take the stairs when you can', 'Get up and move during long sitting', 'A few minutes of stretching most days'] },
  { id: 'sleep', num: 3, label: 'Sleep', goalId: 'sleep', q: 'Which of these are already true about your sleep?',
    options: ['A fairly consistent bedtime', 'Screens off for the last stretch before bed', 'Some daylight early in the day', 'Cool, dark bedroom'] },
  { id: 'stress', num: 4, label: 'Stress & Calm', goalId: 'stress', q: 'Which of these already help you handle stress?',
    options: ['Take real breaks in the day', 'Time outdoors most days', 'Something that clears your head — music, a walk, quiet', 'Time for a hobby you enjoy'] },
  { id: 'people', num: 5, label: 'People', goalId: 'connect', q: 'Which of these already describe how you connect?',
    options: ['See friends or family most weeks', 'Check in with someone close, by call or text', 'Share a meal with others most weeks', 'Part of a group, class, or community'] },
]
const PILLAR_ORDER = PILLARS.map(p => p.id)
const CAT_LABEL = { eat: 'Eating', move: 'Moving', sleep: 'Sleep', stress: 'Stress & Calm', connect: 'People' }

function cheer(n) {
  if (n <= 0) return null
  const noun = `${n} habit${n !== 1 ? 's' : ''} so far`
  if (n >= 6) return `${noun} — quite a foundation`
  if (n === 5) return `${noun} — keep going`
  if (n >= 3) return `${noun} — already building`
  return `${noun} — nice`
}

// ── Gap question — "what you know you should be doing" (no water) ────────────
const GAP = [
  { id: 'move',    emoji: '🚶', label: 'Move more' },
  { id: 'strong',  emoji: '💪', label: 'Get stronger' },
  { id: 'eat',     emoji: '🥗', label: 'Eat better' },
  { id: 'sleep',   emoji: '😴', label: 'Sleep better' },
  { id: 'stress',  emoji: '🧘', label: 'Handle stress' },
  { id: 'connect', emoji: '👥', label: 'Enjoy more social time' },
  { id: 'phone',   emoji: '📵', label: 'Less time on my phone' },
  { id: 'meds',    emoji: '💊', label: 'Take my meds' },
  { id: 'appt',    emoji: '📞', label: 'Make that appointment' },
  { id: 'screen',  emoji: '🩺', label: 'Get that screening' },
]

// ── Dimension questions per goal (draft copy — Britt/Mark to refine) ────────
const DIMENSIONS = {
  move: [
    { q: 'How much walking happens in a normal day?', options: ['Barely — car, desk, couch', 'On my feet at work, but no real walk', 'Ten or fifteen minutes, most days', 'Half an hour or more'] },
    { q: 'What usually gets in the way?', options: [{ label: "By evening I'm done", sub: 'Energy runs out before the day does' }, 'No good place to walk', 'The weather, half the year', "Nothing really — I just don't think of it"] },
    { q: 'What would feel doable on an ordinary Tuesday?', options: ['Five or ten minutes', 'About twenty', 'Half an hour', 'You tell me'] },
  ],
  strong: [
    { q: "How's your strength right now?", options: ['I do no strength work', 'A little, here and there', 'Bodyweight or weights sometimes', 'I train regularly'] },
    { q: 'Where would you feel it most?', options: ['Getting up and down', 'Carrying and lifting', 'Stairs and hills', 'Overall energy'] },
    { q: "What's realistic to start?", options: ['A move or two a day', 'A short set a few times a week', 'Two real sessions a week', 'A full program'] },
  ],
  eat: [
    { q: 'How do most of your meals happen?', options: ['I grab whatever is easiest', 'I eat on the go', 'Pretty okay, could be better', 'I cook, just inconsistently'] },
    { q: "What's the toughest part of the day?", options: ['Breakfast / mornings', 'Lunch on the run', 'Evening snacking', 'Weekends'] },
    { q: "What's realistic to start?", options: ['One small swap', 'One better meal a day', 'Most meals, most days', 'A real reset'] },
  ],
  sleep: [
    { q: "What's sleep like lately?", options: ['Wired late into the night', 'I sleep, but never enough', 'I stay up later than I mean to', 'Mornings are the hard part'] },
    { q: "What's usually the culprit?", options: ['Screens and scrolling', 'A racing mind', 'No set schedule', 'Waking through the night'] },
    { q: "What's realistic to start?", options: ['One small wind-down cue', 'A consistent wake time', 'A full wind-down routine', "Not sure yet"] },
  ],
  stress: [
    { q: 'How does stress usually show up?', options: ['Tight and wound-up', 'Scattered, hard to focus', 'Low and drained', 'It hits at night'] },
    { q: 'When is it heaviest?', options: ['First thing in the morning', 'The midday crunch', 'Evenings', 'All day, honestly'] },
    { q: "What's realistic to start?", options: ['A few breaths a day', 'One short reset', 'A daily practice', "Just exploring"] },
  ],
  connect: [
    { q: 'How connected do you feel lately?', options: ['Pretty isolated', "I mean to reach out and don't", 'I see people, want more', 'Fairly connected'] },
    { q: 'What gets in the way?', options: ['Busy schedules', 'Distance', 'Low energy', 'I lose track of time'] },
    { q: "What's realistic to start?", options: ['One text a week', 'A regular check-in', 'Seeing people weekly', 'Joining something'] },
  ],
  meds: [
    { q: "How's staying on your meds going?", options: ['I forget often', 'I remember some days', 'Mostly on track', 'Refills trip me up'] },
    { q: 'When do you tend to slip?', options: ['Mornings', 'Evenings', 'Weekends / off-routine', 'When I travel'] },
    { q: 'What would help most?', options: ['A daily reminder', 'Tying it to a routine', 'A pillbox or system', 'Refill nudges'] },
  ],
  appt: [
    { q: 'Where is that appointment at?', options: ["Haven't started", 'Been meaning to call', 'Started but stalled', 'Booked, just prepping'] },
    { q: "What's holding it up?", options: ['No time to call', 'Not sure who to see', 'A little avoidance', 'Insurance / logistics'] },
    { q: 'What would move it forward?', options: ['A nudge to call', 'Help finding who', 'A prep checklist', 'Committing to a day'] },
  ],
  phone: [
    { q: "How's screen time feeling?", options: ['It runs away from me', 'Fine most days', 'Worst at night', 'Never really checked'] },
    { q: "When's it heaviest?", options: ['First thing in the morning', 'Through the work day', 'Evenings on the couch', 'In bed'] },
    { q: "What's realistic to start?", options: ['One phone-free stretch', 'No phone at meals', 'Screens off before bed', 'A daily limit'] },
  ],
  screen: [
    { q: 'Where is that screening at?', options: ["Haven't scheduled it", 'Been meaning to', 'Booked, just prepping', 'Overdue and avoiding it'] },
    { q: "What's holding it up?", options: ['No time to arrange', 'A little dread', 'Not sure what I need', 'Insurance / logistics'] },
    { q: 'What would move it forward?', options: ['A nudge to book', 'Knowing what to ask', 'A prep checklist', 'Committing to a day'] },
  ],
  default: [
    { q: 'Where are you starting from?', options: ["I haven't really started", 'I try sometimes', 'I do okay most days', 'I used to — and lost the thread'] },
    { q: "What's realistic right now?", options: ['Something tiny', 'A small daily thing', 'A few times a week', 'I want a real routine'] },
  ],
}
function dimsFor(goal) { return DIMENSIONS[goal] || DIMENSIONS.default }

// ── Habit cards per goal (3, swipeable within the chosen pillar) ────────────
const GRAD = {
  move: 'linear-gradient(155deg,#8a7565,#4a3b32)', strong: 'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
  eat: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)', sleep: 'linear-gradient(155deg,#6d7b6a,#3a4436)',
  stress: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)', connect: 'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
}
const HABIT_OPTIONS = {
  move: [
    { goalId: 'move', label: 'Walk for 10 minutes after a meal', headline: 'Walk ten minutes,', em: 'after a meal.', tagline: "That's it.", source: 'EatingWell', article: 'The Simple Nighttime Habit That May Balance Blood Sugar', why: 'A short walk after eating blunts your post-meal blood-sugar spike — by up to 22% — with no equipment and no workout. Ten minutes is plenty; the point is timing, not intensity.', read: '4 min', body: ['A short walk after a meal is one of the most studied — and least demanding — things you can do for your blood sugar. When you move right after eating, your muscles pull glucose from your bloodstream for fuel, blunting the spike that would otherwise strain your body over time.', "Research puts the effect at up to a 22% smaller rise in blood sugar, and you don't need a workout to get it. Ten minutes after dinner is plenty — the point is timing, not intensity.", 'Because it rides on something you already do every evening, it asks almost nothing of you and compounds quietly on its own.'] },
    { goalId: 'move', label: 'Do 5 controlled chair stands after breakfast', headline: 'Five chair stands,', em: 'after breakfast.', tagline: 'Slow and controlled.', source: 'Verywell Health', article: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer', why: "Standing up from a chair without your hands is real lower-body strength work — and research links regular strength training to a longer life. Five slow, controlled reps after breakfast is enough to start.", read: '5 min', body: ['Standing up from a chair without using your hands is real lower-body strength work — the kind researchers link to a longer, more independent life.', "You don't need a gym or heavy weights. A few slow, controlled reps after breakfast build the strength that keeps stairs, groceries, and getting off the floor easy for decades.", 'Anchoring it to a meal you already eat makes it automatic — no scheduling required.'] },
    { goalId: 'move', label: 'Stretch hips, glutes, and spine for five minutes', headline: 'Five minutes of stretch,', em: 'hips, glutes, spine.', tagline: 'Loosen up.', source: 'Health', article: 'I Went to My First Stretch Session, and It Changed How I Think About Healthy Aging', why: "Mobility through your hips, glutes, and spine is one of the clearest markers of how well you'll move as you age. Five minutes a day keeps those areas supple and eases everyday stiffness.", read: '4 min', body: ["Mobility through your hips, glutes, and spine is one of the clearest markers of how well you'll move as you age — and it's easy to lose from sitting all day.", 'Five minutes of gentle stretching keeps those areas supple, eases everyday stiffness, and makes almost every other movement feel better.', 'No flexibility required to start; the habit itself is what restores the range.'] },
  ],
  eat: [
    { goalId: 'eat', label: 'Veg with every dinner', headline: 'Vegetables,', em: 'with dinner.', tagline: 'Just dinner, to start.', source: 'EatingWell', why: 'Front-loading fiber and vegetables flattens your glucose response and keeps you full — an easy anchor that crowds out less helpful choices without a strict plan.' },
    { goalId: 'eat', label: 'Fork down between bites', headline: 'Fork down,', em: 'between bites.', tagline: 'At dinner tonight.', source: 'EatingWell', why: 'Eating slower gives your gut about 20 minutes to signal fullness to your brain, so you eat less without trying — and enjoy the meal more.' },
    { goalId: 'eat', label: 'Protein-first breakfast', headline: 'Protein first,', em: 'at breakfast.', tagline: 'Sets the day.', source: 'EatingWell', why: 'A protein- and fiber-anchored breakfast blunts the morning glucose spike and steadies energy into the afternoon.' },
  ],
  sleep: [
    { goalId: 'sleep', label: 'Lights low after 9', headline: 'Lights low', em: 'after 9.', tagline: 'Just try it tonight.', source: 'Sleep Foundation', why: "Bright light suppresses melatonin, the hormone that tells your body it's time to sleep. Dimming an hour before bed can move your sleep onset up by 30 minutes." },
    { goalId: 'sleep', label: 'Same wake time daily', headline: 'Same wake time,', em: 'every day.', tagline: 'Even weekends.', source: 'Verywell Health', why: 'Consistency of wake time anchors your circadian rhythm — scientists agree it matters more than total hours, and it makes falling asleep easier within a couple of weeks.' },
    { goalId: 'sleep', label: 'Screens down 30 min before bed', headline: 'Screens down,', em: 'before bed.', tagline: 'Thirty minutes.', source: 'Sleep Foundation', why: 'Putting screens away reduces the light and stimulation that keep your brain alert, easing the transition into sleep.' },
  ],
  stress: [
    { goalId: 'stress', label: 'Five breaths before scrolling', headline: 'Five breaths,', em: 'before the first scroll.', tagline: "Five. That's it.", source: 'Verywell Mind', why: "Long, slow exhales switch on your parasympathetic nervous system — the body's calm-down mode. Done before you reach for your phone, it interrupts the stress-scroll loop." },
    { goalId: 'stress', label: 'A short outdoor break', headline: 'Step outside,', em: 'once a day.', tagline: 'Even five minutes.', source: 'Verywell Mind', why: 'Brief time outdoors lowers stress hormones and lifts mood — a small reset that compounds over a week.' },
    { goalId: 'stress', label: 'One good thing at night', headline: 'One good thing,', em: 'each night.', tagline: 'Name it and rest.', source: 'Verywell Mind', why: 'Naming one good moment shifts attention toward what went right, which research links to lower stress and better sleep.' },
  ],
  connect: [
    { goalId: 'connect', label: 'Text someone you miss', headline: 'Reach out,', em: 'to one person.', tagline: 'A text counts.', source: 'Verywell Mind', why: 'Small, regular contact does most of the work of connection. Loneliness is a real health risk; a quick check-in buffers stress and supports the heart.' },
    { goalId: 'connect', label: 'A weekly call', headline: 'One call,', em: 'every week.', tagline: 'Put it on repeat.', source: 'Verywell Mind', why: 'A standing weekly call turns connection into a habit instead of a someday — frequency matters more than grand gestures.' },
    { goalId: 'connect', label: 'Share one meal', headline: 'Share a meal,', em: 'this week.', tagline: 'With anyone.', source: 'Parents', why: 'Shared meals build belonging and routine — simple rituals that anchor relationships over time.' },
  ],
}
function habitCardsFor(goal) { return HABIT_OPTIONS[goal] || HABIT_OPTIONS.move }
function photo(goalId) { return `https://picsum.photos/seed/vitalist-${goalId}/900/1200` }

const MOMENTS = ['With morning coffee', 'At lunch', 'After dinner', 'When the TV goes off', 'A time I pick']

// ── Full in-app article (habit-card justification) ──────────────────────────
function ArticleView({ card, onClose }) {
  return (
    <div className="eo-article">
      <div className="eo-article__hero" style={{ background: GRAD[card.goalId] }}>
        <img className="eo-article__photo" src={photo(card.goalId)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="eo-article__scrim" />
        <button className="eo-article__back" onClick={onClose} aria-label="Back">←</button>
        <div className="eo-article__htxt">
          <span className="eo-article__eye">{card.source} · {card.read || '4 min'} read</span>
          <h1 className="eo-article__hed">{card.article}</h1>
        </div>
      </div>
      <div className="eo-article__body">
        {(card.body || [card.why]).map((p, i) => <p key={i}>{p}</p>)}
        <p className="eo-article__foot">Curated for your habit · Vitalist by People Inc.</p>
        <button className="eo-article__done" onClick={onClose}>Back to your habit</button>
      </div>
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────────────
export default function ExpOnboarding({ onComplete }) {
  const [step, setStep]         = useState('S_auth')
  const [name, setName]         = useState('')
  const [claimed, setClaimed]   = useState({})       // { pillarId: [labels] }
  const [gapGoals, setGapGoals] = useState([])
  const [primary, setPrimary]   = useState('')
  const [dimAns, setDimAns]     = useState({})        // { qIndex: optionIndex }
  const [dimStep, setDimStep]   = useState(0)         // which starting-line question
  const [otherOpen, setOtherOpen] = useState(false)
  const [otherText, setOtherText] = useState('')
  const [habitIdx, setHabitIdx] = useState(0)
  const [showWhy, setShowWhy]   = useState(false)
  const [readArticle, setReadArticle] = useState(null)
  const [moment, setMoment]     = useState('')
  const [notif, setNotif]       = useState(true)
  const [permission, setPerm]   = useState(false)
  const [email, setEmail]       = useState('')

  const claimedCount = Object.values(claimed).reduce((a, arr) => a + arr.length, 0)
  const goal = primary || gapGoals[0] || 'move'
  const goalLabel = (GAP.find(g => g.id === goal) || {}).label || 'your goal'
  const goalLower = goalLabel.toLowerCase()
  const cards = habitCardsFor(goal)
  const card  = cards[habitIdx % cards.length]

  function toggleClaim(pid, label) {
    setClaimed(prev => {
      const cur = prev[pid] || []
      const next = cur.includes(label) ? cur.filter(x => x !== label) : [...cur, label]
      return { ...prev, [pid]: next }
    })
  }
  function toggleGap(id) {
    setGapGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  function finishOnboarding() {
    const today = new Date().toISOString().slice(0, 10)
    const collection = []
    Object.entries(claimed).forEach(([pid, labels]) => {
      const p = PILLARS.find(x => x.id === pid)
      labels.forEach((label, i) => collection.push({
        id: `claim_${pid}_${i}_${Date.now()}`, goalId: p.goalId, label,
        bg: GRAD[p.goalId], status: 'established', addedAt: today,
      }))
    })
    const chosen = card
    const habits = chosen ? [{
      id: chosen.goalId + '_' + Date.now(), goalId: chosen.goalId, label: chosen.label,
      bg: GRAD[chosen.goalId], source: chosen.source, status: 'trial', addedAt: today, tier: 1,
      anchor: moment || null,
    }] : []
    try {
      localStorage.setItem('vitalistExp_habits', JSON.stringify(habits))
      localStorage.setItem('vitalistExp_collection', JSON.stringify(collection))
      localStorage.setItem('vitalistExp_goals', JSON.stringify(gapGoals))
      localStorage.setItem('vitalistExp_primary', primary || '')
      localStorage.setItem('vitalistExp_sources', JSON.stringify(permission ? ['steps', 'sleep'] : []))
      localStorage.setItem('vitalistExp_name', name.trim())
      localStorage.setItem('vitalistExp_notif', notif ? '1' : '0')
      localStorage.setItem('vitalistExp_email', email.trim())
      localStorage.removeItem('vitalistExp_firstrun')
      localStorage.setItem('vitalistExp_returning', '0')
      localStorage.setItem('vitalistExp_complete', '1')
    } catch (_) {}
    onComplete(habits)
  }

  function handleLookAround() {
    const today = new Date().toISOString().slice(0, 10)
    const ago = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
    const habits = [
      { id: 'walk_demo',  goalId: 'move',  label: '10-minute walk after dinner', bg: GRAD.move,  source: 'EatingWell',       anchor: 'After dinner', status: 'kept',  addedAt: ago(30), tier: 2 },
      { id: 'sleep_demo', goalId: 'sleep', label: 'Lights low after 9',          bg: GRAD.sleep, source: 'Sleep Foundation', anchor: 'Before bed',   status: 'trial', addedAt: today,   tier: 1 },
    ]
    try {
      localStorage.removeItem('vitalistExp_firstrun')
      localStorage.setItem('vitalistExp_habits', JSON.stringify(habits))
      localStorage.setItem('vitalistExp_collection', JSON.stringify([]))
      localStorage.setItem('vitalistExp_goals', JSON.stringify(['move', 'sleep']))
      localStorage.setItem('vitalistExp_sources', JSON.stringify(['steps', 'sleep']))
      localStorage.setItem('vitalistExp_name', '')
      localStorage.setItem('vitalistExp_returning', '0')
      localStorage.setItem('vitalistExp_complete', '1')
      localStorage.setItem(`vitalistExp_completions_${today}`, JSON.stringify(['walk_demo']))
    } catch (_) {}
    onComplete(habits)
  }

  const logo   = <button className="eo-onblogo" onClick={() => setStep('S_auth')}>Vitalist</button>
  const status = <div className="eo-status"><span>9:41</span><span>▚ ▪ ▐</span></div>
  const nav = (onBack, onSkip, skipLabel) => (
    <div className="eo-nav">
      {onBack ? <button className="eo-nav__back" onClick={onBack}>← Back</button> : <span />}
      {onSkip ? <button className="eo-nav__skip" onClick={onSkip}>{skipLabel || 'Skip'}</button> : <span />}
    </div>
  )

  // Whole-onboarding progress (splash excluded); S_pick only counts when shown
  const FLOW = ['S_name', 'S_intro', 'S_p_eating', 'S_p_moving', 'S_p_sleep', 'S_p_stress', 'S_p_people',
    'S_foundation', 'S_gap', ...(gapGoals.length > 1 ? ['S_pick'] : []), 'S_dim', 'S_perm', 'S_habit', 'S_moment', 'S_email']
  const flowIdx = FLOW.indexOf(step)
  const flowPct = Math.round(((flowIdx + 1) / FLOW.length) * 100)
  const topbar = (
    <div className="eo-hdrbar">
      {status}
      <div className="eo-topline">
        {logo}
      </div>
      <div className="eo-topbar-track"><div className="eo-topbar-fill" style={{ width: flowPct + '%' }} /></div>
    </div>
  )
  const ShuffleIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
  )

  // ── Splash ─────────────────────────────────────────────────────────────────
  if (step === 'S_auth') return (
    <div className="eo-root eo-splash">
      <img className="eo-splash__img" src="https://picsum.photos/seed/vitalist-splash/1000/1600" alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
      <div className="eo-splash__scrim" />
      <div className="eo-splash__top">
        <p className="eo-splash__brand">Vitalist</p>
        <p className="eo-splash__by">by People Inc.</p>
      </div>
      <div className="eo-splash__content">
        <h1 className="eo-splash__hed">Helping you live a better life, <em>one habit at a time.</em></h1>
        <button className="eo-splash__cta" onClick={() => setStep('S_name')}>Get started →</button>
        <button className="eo-splash__debug" onClick={handleLookAround}>Just looking around</button>
      </div>
    </div>
  )

  // ── Name ─────────────────────────────────────────────────────────────────────
  if (step === 'S_name') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body" style={{ justifyContent: 'center', gap: 18 }}>
          <div>
            <h2 className="eo-q">First — what should we <em>call you?</em></h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>A first name is perfect. We'll keep it friendly.</p>
          </div>
          <input className="eo-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep('S_intro') }} />
          <div className="eo-spacer" />
          <button className="eo-btn primary" disabled={!name.trim()} onClick={() => setStep('S_intro')}>Continue →</button>
          {nav(() => setStep('S_auth'), () => setStep('S_intro'))}
        </div>
      </div>
    </div>
  )

  // ── Intro to "already doing" ─────────────────────────────────────────────────
  if (step === 'S_intro') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body" style={{ justifyContent: 'center', gap: 16 }}>
          <p className="eo-eye">Your foundation</p>
          <h1 className="eo-disp" style={{ fontSize: 30 }}>Let's start with <em>what's already working.</em></h1>
          <p className="eo-lede">Before anything new — a few quick questions about the healthy habits you already have. Tap the habits that sound like you, even roughly. Nothing here is a test.</p>
          <div className="eo-spacer" />
          <button className="eo-btn primary" onClick={() => setStep('S_p_eating')}>Get started →</button>
          {nav(() => setStep('S_name'), () => setStep('S_p_eating'))}
        </div>
      </div>
    </div>
  )

  // ── Pillar pages (generic) ───────────────────────────────────────────────────
  if (step.startsWith('S_p_')) {
    const pid = step.slice(4)
    const pillar = PILLARS.find(p => p.id === pid)
    const idx = PILLAR_ORDER.indexOf(pid)
    const sel = claimed[pid] || []
    const goNext = () => setStep(idx < PILLAR_ORDER.length - 1 ? 'S_p_' + PILLAR_ORDER[idx + 1] : 'S_foundation')
    const goBack = () => setStep(idx > 0 ? 'S_p_' + PILLAR_ORDER[idx - 1] : 'S_intro')
    const cheerMsg = cheer(claimedCount)
    return (
      <div className="eo-root">
        <div className="eo-screen">
          {topbar}
          <div className="eo-body">
            <div className="eo-badge-row">
              <span className="eo-badge-label">{pillar.label}</span>
            </div>
            <h2 className="eo-q">{pillar.q}</h2>
            <div className="eo-checks">
              {pillar.options.map(opt => {
                const on = sel.includes(opt)
                return (
                  <div key={opt} className={`eo-copt${on ? ' on' : ''}`} onClick={() => toggleClaim(pid, opt)}>
                    <span className={`eo-cbox${on ? ' on' : ''}`}>{on ? '✓' : ''}</span>
                    <span className="eo-copt__label">{opt}</span>
                  </div>
                )
              })}
            </div>
            <div className="eo-spacer" />
            {cheerMsg && <p className="eo-cheer"><span className="eo-cheer__dot" />{cheerMsg}</p>}
            <button className="eo-btn primary" onClick={goNext}>Continue →</button>
            {nav(goBack, goNext, 'None of these right now')}
          </div>
        </div>
      </div>
    )
  }

  // ── Foundation summary ───────────────────────────────────────────────────────
  if (step === 'S_foundation') {
    const groups = PILLARS.map(p => ({ p, items: claimed[p.id] || [] })).filter(g => g.items.length > 0)
    const total = claimedCount
    return (
      <div className="eo-root">
        <div className="eo-screen">
          {topbar}
          <div className="eo-body">
            <p className="eo-eye">Your foundation</p>
            {total > 0 ? (
              <>
                <h1 className="eo-disp" style={{ fontSize: 28 }}>You're already doing <em>{total} {total === 1 ? 'thing' : 'things'}.</em></h1>
                <p className="eo-lede">Across {groups.length} {groups.length === 1 ? 'part' : 'parts'} of your health. That's a real foundation — not a blank slate.</p>
                <div className="eo-found">
                  {groups.map(({ p, items }) => (
                    <div key={p.id} className="eo-found__group">
                      <p className="eo-found__label">{p.label}</p>
                      {items.map(it => <p key={it} className="eo-found__item"><span className="eo-found__dot" />{it}</p>)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h1 className="eo-disp" style={{ fontSize: 28 }}>A clean start — <em>that's fine too.</em></h1>
                <p className="eo-lede">No box ticked just means we begin fresh. One small thing at a time is the whole point.</p>
              </>
            )}
            <div className="eo-spacer" />
            <button className="eo-btn primary" onClick={() => setStep('S_gap')}>Now let's build on it →</button>
            {nav(() => setStep('S_p_people'), null)}
          </div>
        </div>
      </div>
    )
  }

  // ── Gap question ─────────────────────────────────────────────────────────────
  if (step === 'S_gap') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body">
          <h2 className="eo-q">Now — what do you <em>know</em> you should be doing?</h2>
          <p className="eo-lede">The thing that's been on your mind. Pick whatever fits.</p>
          <div className="eo-chips">
            {GAP.map(g => (
              <span key={g.id} className={`eo-chip${gapGoals.includes(g.id) ? ' on' : ''}`} onClick={() => toggleGap(g.id)}>
                {g.emoji} {g.label}
              </span>
            ))}
            <span className={`eo-chip more${otherOpen ? ' on' : ''}`} onClick={() => setOtherOpen(o => !o)}>✏️ Something else</span>
          </div>
          {otherOpen && (
            <input className="eo-input" style={{ marginTop: 4 }} value={otherText} onChange={e => setOtherText(e.target.value)} placeholder="What's on your mind?" />
          )}
          <div className="eo-spacer" />
          <button className="eo-btn primary" disabled={gapGoals.length === 0 && !otherText.trim()}
            onClick={() => { setDimStep(0); if (gapGoals.length === 1) { setPrimary(gapGoals[0]); setStep('S_dim') } else if (gapGoals.length === 0) { setPrimary(''); setStep('S_dim') } else setStep('S_pick') }}>
            Continue →
          </button>
          {nav(() => setStep('S_foundation'), () => { setDimStep(0); if (gapGoals.length <= 1) { setPrimary(gapGoals[0] || ''); setStep('S_dim') } else setStep('S_pick') })}
        </div>
      </div>
    </div>
  )

  // ── Pick one ─────────────────────────────────────────────────────────────────
  if (step === 'S_pick') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body">
          <h2 className="eo-q">Which one's <em>loudest</em> right now?</h2>
          {gapGoals.map(id => {
            const g = GAP.find(x => x.id === id)
            return (
              <div key={id} className={`eo-opt${primary === id ? ' on' : ''}`} onClick={() => setPrimary(id)}>
                <div className="txt"><b>{g.label}</b></div>
                <span className={`eo-radio${primary === id ? ' on' : ''}`} />
              </div>
            )
          })}
          <div className="eo-green"><span className="lab">🤝 We'll hold the rest</span><p className="eo-lede" style={{ marginTop: 4 }}>One at a time is the whole point.</p></div>
          <div className="eo-spacer" />
          <button className="eo-btn primary" disabled={!primary} onClick={() => { setDimStep(0); setStep('S_dim') }}>That one →</button>
          {nav(() => setStep('S_gap'), () => { if (!primary) setPrimary(gapGoals[0]); setDimStep(0); setStep('S_dim') })}
        </div>
      </div>
    </div>
  )

  // ── Starting-line questions — one per screen ─────────────────────────────────
  if (step === 'S_dim') {
    const qs = dimsFor(goal)
    const q = qs[Math.min(dimStep, qs.length - 1)]
    const chosen = dimAns[dimStep]
    const optLabel = o => (typeof o === 'string' ? o : o.label)
    const optSub = o => (typeof o === 'string' ? null : o.sub)
    const goNext = () => { if (dimStep < qs.length - 1) setDimStep(dimStep + 1); else setStep('S_perm') }
    const goBack = () => { if (dimStep > 0) setDimStep(dimStep - 1); else setStep(gapGoals.length > 1 ? 'S_pick' : 'S_gap') }
    return (
      <div className="eo-root">
        <div className="eo-screen">
          {topbar}
          <div className="eo-body">
            <p className="eo-eye">Your starting line</p>
            <p className="eo-dimmeta">Since you chose “{goalLabel}”</p>
            <h2 className="eo-q">{q.q}</h2>
            {q.options.map((o, oi) => (
              <div key={oi} className={`eo-opt${chosen === oi ? ' on' : ''}`} onClick={() => setDimAns(a => ({ ...a, [dimStep]: oi }))}>
                <div className="txt"><b>{optLabel(o)}</b>{optSub(o) && <span>{optSub(o)}</span>}</div>
                <span className={`eo-radio${chosen === oi ? ' on' : ''}`} />
              </div>
            ))}
            <div className="eo-spacer" />
            <button className="eo-btn primary" disabled={chosen == null} onClick={goNext}>Continue →</button>
            {nav(goBack, goNext)}
          </div>
        </div>
      </div>
    )
  }

  // ── Phone permissions ────────────────────────────────────────────────────────
  if (step === 'S_perm') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body" style={{ justifyContent: 'center', gap: 16 }}>
          <p className="eo-eye" style={{ textAlign: 'center' }}>For “{goalLabel}”</p>
          <div className="eo-wear-icon">📲</div>
          <div>
            <h2 className="eo-q">Let your phone track it for you.</h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>You chose to {goalLower}. Allow steps and sleep and Vitalist confirms it automatically — nothing to log.</p>
          </div>
          <div className="eo-wear-sources"><span className="eo-wear-chip">Steps</span><span className="eo-wear-chip">Sleep</span></div>
          <div className="eo-spacer" />
          <button className="eo-btn primary" onClick={() => { setPerm(true); setStep('S_habit') }}>Allow access →</button>
          {nav(() => setStep('S_dim'), () => { setPerm(false); setStep('S_habit') }, 'Not now')}
        </div>
      </div>
    </div>
  )

  // ── Habit suggestion — a shuffleable card, not a takeover ────────────────────
  if (step === 'S_habit') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body">
          <p className="eo-eye">A place to start · {CAT_LABEL[card.goalId] || 'For you'}</p>
          <h2 className="eo-q" style={{ fontSize: 20 }}>Here's one small thing to try.</h2>

          <div className="eo-hcard">
            <div className="eo-hcard__img" style={{ background: GRAD[card.goalId] }}>
              <img className="eo-hcard__photo" src={photo(card.goalId)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
              <div className="eo-hcard__duotone" style={{ background: GRAD[card.goalId] }} />
              <span className="eo-hcard__flag">{card.source}</span>
              <button className="eo-hcard__shuffle" onClick={() => setHabitIdx(i => i + 1)} aria-label="Show me another">{ShuffleIcon}</button>
              <div className="eo-hcard__hedwrap">
                <h1 className="eo-hcard__hed">{card.headline} <em>{card.em}</em></h1>
                <p className="eo-hcard__that">{card.tagline}</p>
              </div>
            </div>
            <div className="eo-hcard__why">
              <p className="eo-hcard__why-label">Why this works</p>
              <p className="eo-hcard__why-text">{card.why}</p>
              {card.body
                ? <button className="eo-hcard__read" onClick={() => setReadArticle(card)}>{card.source}: {card.article}<span>Read →</span></button>
                : card.article && <p className="eo-hcard__cite">{card.source}: {card.article}</p>}
            </div>
          </div>

          <button className="eo-shuffle" onClick={() => setHabitIdx(i => i + 1)}>{ShuffleIcon} Show me another</button>
          <div className="eo-spacer" />
          <button className="eo-btn primary" onClick={() => setStep('S_moment')}>I'll try it →</button>
          {nav(() => setStep('S_perm'), null)}
        </div>
      </div>
      {readArticle && <ArticleView card={readArticle} onClose={() => setReadArticle(null)} />}
    </div>
  )

  // ── Moment + notification (one step) ─────────────────────────────────────────
  if (step === 'S_moment') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body">
          <div className="eo-chosen">
            <span className="eo-chosen__dot" style={{ background: GRAD[card.goalId] }} />
            <div className="eo-chosen__txt">
              <p className="eo-chosen__eye">Your new habit</p>
              <p className="eo-chosen__label">{card.label}</p>
            </div>
          </div>
          <h2 className="eo-q">When does this live in <em>your day?</em></h2>
          <p className="eo-lede">Pin “{card.label}” to a moment you already have — pick what fits.</p>
          <div className="eo-chips">
            {MOMENTS.map(m => (
              <span key={m} className={`eo-chip${moment === m ? ' on' : ''}`} onClick={() => setMoment(m)}>{m}</span>
            ))}
          </div>
          <div className={`eo-notif${notif ? ' on' : ''}`} onClick={() => setNotif(v => !v)}>
            <div>
              <p className="eo-notif__label">A nudge at that moment</p>
              <p className="eo-notif__sub">One a day, max — never a guilt trip.</p>
            </div>
            <span className={`eo-toggle${notif ? ' on' : ''}`}><span className="eo-toggle__knob" /></span>
          </div>
          <div className="eo-spacer" />
          <button className="eo-btn primary" disabled={!moment} onClick={() => setStep('S_email')}>Continue →</button>
          {nav(() => setStep('S_habit'), () => setStep('S_email'))}
        </div>
      </div>
    </div>
  )

  // ── Email capture ────────────────────────────────────────────────────────────
  if (step === 'S_email') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body" style={{ justifyContent: 'center', gap: 16 }}>
          <div>
            <h2 className="eo-q">Create your account to <em>start investing in your healthy habits.</em></h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>Your foundation and your new habit are ready. Add an email to save them and pick up on any device — nothing to set up tonight.</p>
          </div>
          <input className="eo-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
            onKeyDown={e => { if (e.key === 'Enter') finishOnboarding() }} />
          <div className="eo-spacer" />
          <button className="eo-btn primary" onClick={finishOnboarding}>Create account &amp; start →</button>
          {nav(() => setStep('S_moment'), finishOnboarding, 'Skip')}
        </div>
      </div>
    </div>
  )

  return null
}
