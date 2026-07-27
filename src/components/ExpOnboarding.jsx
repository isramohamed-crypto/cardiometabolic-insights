import React, { useState } from 'react'
import './ExpOnboarding.css'

// ── "Already doing" pillars (Mark's proto) ──────────────────────────────────
const PILLARS = [
  { id: 'eating', num: 1, label: 'Eating', goalId: 'eat', q: 'Any of these part of your week already?',
    options: ['Vegetables or fruit with most meals', 'Cook at home most nights', 'Fish or plant protein a couple times a week', 'Swap a sugary drink for water most days', 'Olive oil or nuts as your go-to fat'] },
  { id: 'moving', num: 2, label: 'Moving', goalId: 'move', q: 'Do any of these sound like you?',
    options: ['A daily walk, any length', 'Take the stairs when you can', 'Get up and move during long sitting', 'A few minutes of stretching most days'] },
  { id: 'sleep', num: 3, label: 'Sleep', goalId: 'sleep', q: "How's sleep going? Tap what's already true.",
    options: ['A fairly consistent bedtime', 'Screens off for the last stretch before bed', 'Some daylight early in the day', 'Cool, dark bedroom'] },
  { id: 'stress', num: 4, label: 'Stress & Calm', goalId: 'stress', q: 'Any of these already in your life?',
    options: ['Take real breaks in the day', 'Time outdoors most days', 'Something that clears your head — music, a walk, quiet', 'Time for a hobby you enjoy'] },
  { id: 'people', num: 5, label: 'People', goalId: 'connect', q: 'Staying connected looks like a lot of things.',
    options: ['See friends or family most weeks', 'Check in with someone close, by call or text', 'Share a meal with others most weeks', 'Part of a group, class, or community'] },
]
const PILLAR_ORDER = PILLARS.map(p => p.id)
const CAT_LABEL = { eat: 'Eating', move: 'Moving', sleep: 'Sleep', stress: 'Stress & Calm', connect: 'People' }

function cheer(n) {
  if (n <= 0) return null
  if (n >= 6) return `${n} so far — quite a foundation`
  if (n === 5) return `${n} so far — keep going`
  if (n >= 3) return `${n} so far — already building`
  return `${n} so far — nice`
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

// ── Habit cards per goal ─────────────────────────────────────────────────────
const GRAD = {
  move: 'linear-gradient(155deg,#8a7565,#4a3b32)', strong: 'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
  eat: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)', sleep: 'linear-gradient(155deg,#6d7b6a,#3a4436)',
  stress: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)', connect: 'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
}

// content[n] rotates daily — one piece surfaced per day, multi-source
// type: 'justification' | 'supporting' | 'reinforcement'
const HABIT_OPTIONS = {
  move: [
    { goalId: 'move', tier: 1, grain: 'fine',
      label: 'Walk for 10 minutes after a meal',
      headline: 'Walk ten minutes,', em: 'after a meal.',
      tagline: "That's it.", anchor: 'After dinner',
      why: 'A short walk after eating blunts your post-meal blood-sugar spike — by up to 22% — with no equipment and no workout. Ten minutes is plenty; the point is timing, not intensity.',
      content: [
        { type: 'justification', source: 'EatingWell',     title: 'The Simple Nighttime Habit That May Balance Blood Sugar' },
        { type: 'supporting',    source: 'Byrdie',          title: 'Why I Started Taking a Post-Dinner Walk Every Night' },
        { type: 'reinforcement', source: 'Verywell Health', title: 'Walking After Eating: Benefits and What to Know' },
      ] },
    { goalId: 'move', tier: 1, grain: 'fine',
      label: 'Do 5 controlled chair stands after breakfast',
      headline: 'Five chair stands,', em: 'after breakfast.',
      tagline: 'Slow and controlled.', anchor: 'After breakfast',
      why: "Standing up from a chair without your hands is real lower-body strength work — and research links regular strength training to a longer life. Five slow, controlled reps after breakfast is enough to start.",
      content: [
        { type: 'justification', source: 'Verywell Health', title: 'Research Shows Strength Training Every Week Can Help You Live Longer' },
        { type: 'supporting',    source: 'Prevention',      title: '5 Chair Exercises for Stronger Legs at Any Age' },
        { type: 'reinforcement', source: 'EatingWell',      title: 'How to Build Strength at Home With No Equipment' },
      ] },
    { goalId: 'move', tier: 1, grain: 'fine',
      label: 'Stretch hips, glutes, and spine for five minutes',
      headline: 'Five minutes of stretch,', em: 'hips, glutes, spine.',
      tagline: 'Loosen up.', anchor: 'Morning',
      why: "Mobility through your hips, glutes, and spine is one of the clearest markers of how well you'll move as you age. Five minutes a day keeps those areas supple and eases everyday stiffness.",
      content: [
        { type: 'justification', source: 'Health',   title: 'I Went to My First Stretch Session and It Changed Everything' },
        { type: 'supporting',    source: 'Byrdie',   title: 'Your 5-Minute Morning Mobility Routine' },
        { type: 'reinforcement', source: 'Prevention', title: 'Why Hip Flexibility Matters More Than You Think' },
      ] },
  ],
  eat: [
    { goalId: 'eat', tier: 1, grain: 'fine',
      label: 'Veg with every dinner',
      headline: 'Vegetables,', em: 'with dinner.',
      tagline: 'Just dinner, to start.', anchor: 'At dinner',
      why: 'Front-loading fiber and vegetables flattens your glucose response and keeps you full — an easy anchor that crowds out less helpful choices without a strict plan.',
      content: [
        { type: 'justification', source: 'EatingWell', title: 'Why Adding Vegetables to Dinner Is the Easiest Diet Change' },
        { type: 'supporting',    source: 'Byrdie',      title: 'The Simple Habit That Helped Me Eat More Vegetables' },
        { type: 'reinforcement', source: 'Real Simple', title: 'How to Add Vegetables to Every Meal Without Thinking About It' },
      ] },
    { goalId: 'eat', tier: 1, grain: 'fine',
      label: 'Fork down between bites',
      headline: 'Fork down,', em: 'between bites.',
      tagline: 'At dinner tonight.', anchor: 'At dinner',
      why: 'Eating slower gives your gut about 20 minutes to signal fullness to your brain, so you eat less without trying — and enjoy the meal more.',
      content: [
        { type: 'justification', source: 'EatingWell',     title: 'The Science Behind Eating Slowly (and Why It Works)' },
        { type: 'supporting',    source: 'Prevention',      title: 'Why Putting Down Your Fork Between Bites Actually Works' },
        { type: 'reinforcement', source: 'Verywell Health', title: 'Mindful Eating: What It Is and How to Start' },
      ] },
    { goalId: 'eat', tier: 1, grain: 'fine',
      label: 'Protein-first breakfast',
      headline: 'Protein first,', em: 'at breakfast.',
      tagline: 'Sets the day.', anchor: 'Morning',
      why: 'A protein- and fiber-anchored breakfast blunts the morning glucose spike and steadies energy into the afternoon.',
      content: [
        { type: 'justification', source: 'EatingWell', title: 'The Best High-Protein Breakfasts for All-Day Energy' },
        { type: 'supporting',    source: 'Byrdie',      title: 'Morning Protein Changed My Energy — Here Is How' },
        { type: 'reinforcement', source: 'Health',      title: 'Why Starting Your Day With Protein Is a Game Changer' },
      ] },
  ],
  sleep: [
    { goalId: 'sleep', tier: 1, grain: 'fine',
      label: 'Lights low after 9',
      headline: 'Lights low', em: 'after 9.',
      tagline: 'Just try it tonight.', anchor: 'After 9 PM',
      why: "Bright light suppresses melatonin, the hormone that tells your body it's time to sleep. Dimming an hour before bed can move your sleep onset up by 30 minutes.",
      content: [
        { type: 'justification', source: 'Sleep Foundation', title: 'How Light Affects Your Sleep and What to Do About It' },
        { type: 'supporting',    source: 'Verywell Health',  title: 'Blue Light and Sleep: What Is the Connection?' },
        { type: 'reinforcement', source: 'Real Simple',      title: 'Night Owl Habits: How to Wind Down an Hour Earlier' },
      ] },
    { goalId: 'sleep', tier: 1, grain: 'fine',
      label: 'Same wake time daily',
      headline: 'Same wake time,', em: 'every day.',
      tagline: 'Even weekends.', anchor: 'Each morning',
      why: 'Consistency of wake time anchors your circadian rhythm — scientists agree it matters more than total hours, and it makes falling asleep easier within a couple of weeks.',
      content: [
        { type: 'justification', source: 'Verywell Health',  title: 'Why a Consistent Wake Time Is the Key to Better Sleep' },
        { type: 'supporting',    source: 'Sleep Foundation', title: 'Your Circadian Rhythm and How to Reset It' },
        { type: 'reinforcement', source: 'Prevention',       title: 'The One Sleep Habit Experts Agree On' },
      ] },
    { goalId: 'sleep', tier: 1, grain: 'fine',
      label: 'Screens down 30 min before bed',
      headline: 'Screens down,', em: 'before bed.',
      tagline: 'Thirty minutes.', anchor: 'Before bed',
      why: 'Putting screens away reduces the light and stimulation that keep your brain alert, easing the transition into sleep.',
      content: [
        { type: 'justification', source: 'Sleep Foundation', title: 'How Electronic Devices Affect Your Sleep Quality' },
        { type: 'supporting',    source: 'Byrdie',           title: 'I Stopped Looking at My Phone Before Bed — Here Is What Happened' },
        { type: 'reinforcement', source: 'Verywell Mind',    title: 'Why Screen Time Before Bed Disrupts Your Sleep' },
      ] },
  ],
  stress: [
    { goalId: 'stress', tier: 1, grain: 'fine',
      label: 'Five breaths before scrolling',
      headline: 'Five breaths,', em: 'before the first scroll.',
      tagline: "Five. That's it.", anchor: 'First thing',
      why: "Long, slow exhales switch on your parasympathetic nervous system — the body's calm-down mode. Done before you reach for your phone, it interrupts the stress-scroll loop.",
      content: [
        { type: 'justification', source: 'Verywell Mind', title: 'The Physiological Benefits of Deep Breathing' },
        { type: 'supporting',    source: 'Prevention',    title: '5 Breathing Exercises to Calm Anxiety Fast' },
        { type: 'reinforcement', source: 'Health',        title: 'Why Box Breathing Is the Stress Tool More People Should Know' },
      ] },
    { goalId: 'stress', tier: 1, grain: 'fine',
      label: 'A short outdoor break',
      headline: 'Step outside,', em: 'once a day.',
      tagline: 'Even five minutes.', anchor: 'Midday',
      why: 'Brief time outdoors lowers stress hormones and lifts mood — a small reset that compounds over a week.',
      content: [
        { type: 'justification', source: 'Verywell Mind', title: 'Nature and Stress Relief: What the Research Says' },
        { type: 'supporting',    source: 'Real Simple',   title: 'Why a 5-Minute Walk Outside Changes Your Mood' },
        { type: 'reinforcement', source: 'Prevention',    title: 'The Science of Stress and the Great Outdoors' },
      ] },
    { goalId: 'stress', tier: 1, grain: 'fine',
      label: 'One good thing at night',
      headline: 'One good thing,', em: 'each night.',
      tagline: 'Name it and rest.', anchor: 'Before bed',
      why: 'Naming one good moment shifts attention toward what went right, which research links to lower stress and better sleep.',
      content: [
        { type: 'justification', source: 'Verywell Mind', title: 'How Gratitude Affects Stress and Anxiety' },
        { type: 'supporting',    source: 'Health',        title: 'A Simple Gratitude Practice That Can Change Your Day' },
        { type: 'reinforcement', source: 'Prevention',    title: 'Why Ending Your Day With One Good Thought Works' },
      ] },
  ],
  connect: [
    { goalId: 'connect', tier: 1, grain: 'fine',
      label: 'Text someone you miss',
      headline: 'Reach out,', em: 'to one person.',
      tagline: 'A text counts.', anchor: 'Anytime',
      why: 'Small, regular contact does most of the work of connection. Loneliness is a real health risk; a quick check-in buffers stress and supports the heart.',
      content: [
        { type: 'justification', source: 'Verywell Mind', title: 'Loneliness Is a Health Risk — Here Is What You Can Do' },
        { type: 'supporting',    source: 'Real Simple',   title: 'The Simple Act of Texting Can Fight Loneliness' },
        { type: 'reinforcement', source: 'Health',        title: 'How Small Moments of Connection Add Up' },
      ] },
    { goalId: 'connect', tier: 1, grain: 'fine',
      label: 'A weekly call',
      headline: 'One call,', em: 'every week.',
      tagline: 'Put it on repeat.', anchor: 'Weekly',
      why: 'A standing weekly call turns connection into a habit instead of a someday — frequency matters more than grand gestures.',
      content: [
        { type: 'justification', source: 'Verywell Mind', title: 'The Health Benefits of Staying Connected' },
        { type: 'supporting',    source: 'Prevention',    title: 'How a Weekly Phone Call Can Strengthen Any Relationship' },
        { type: 'reinforcement', source: 'Real Simple',   title: 'Why Scheduling Friend Time Actually Works' },
      ] },
    { goalId: 'connect', tier: 1, grain: 'fine',
      label: 'Share one meal',
      headline: 'Share a meal,', em: 'this week.',
      tagline: 'With anyone.', anchor: 'This week',
      why: 'Shared meals build belonging and routine — simple rituals that anchor relationships over time.',
      content: [
        { type: 'justification', source: 'Parents',     title: 'The Science Behind Family Dinners' },
        { type: 'supporting',    source: 'Real Simple', title: 'Why Eating Together Is Good for Your Health' },
        { type: 'reinforcement', source: 'EatingWell',  title: 'How Shared Meals Build Stronger Relationships' },
      ] },
  ],
}
function habitCardsFor(goal) { return HABIT_OPTIONS[goal] || HABIT_OPTIONS.move }
function photo(goalId, id) { return `https://picsum.photos/seed/vitalist-${id || goalId}/900/1200` }

// picks today's content piece (rotates daily across sources)
function getDailyContent(card) {
  const pool = card.content || []
  if (!pool.length) return { source: card.source || '', title: '' }
  const day = Math.floor(Date.now() / 86400000)
  return pool[day % pool.length]
}

const MOMENTS = ['With morning coffee', 'At lunch', 'After dinner', 'When the TV goes off', 'A time I pick']

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
  const [moment, setMoment]     = useState('')
  const [notif, setNotif]       = useState(true)
  const [permission, setPerm]   = useState(false)
  const [email, setEmail]       = useState('')

  const claimedCount = Object.values(claimed).reduce((a, arr) => a + arr.length, 0)
  const goal = primary || gapGoals[0] || 'move'
  const cards = habitCardsFor(goal)
  const card  = cards[habitIdx % cards.length]
  const todayContent = getDailyContent(card)

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
      localStorage.setItem('vitalistExp_complete', '1')
    } catch (_) {}
    onComplete(habits)
  }

  function handleLookAround() {
    const today = new Date().toISOString().slice(0, 10)
    const ago = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)
    const habits = [
      // My habits — carried over from onboarding claims
      { id: 'walk_demo',   goalId: 'move',    label: '10-minute walk after dinner',  bg: GRAD.move,    source: 'EatingWell',       anchor: 'After dinner',  status: 'my_habit', addedAt: ago(60), tier: 3 },
      { id: 'breath_demo', goalId: 'stress',  label: 'Five breaths before scrolling',bg: GRAD.stress,  source: 'Verywell Mind',    anchor: 'Before phone',  status: 'my_habit', addedAt: ago(45), tier: 2 },
      { id: 'water_demo',  goalId: 'eat',     label: 'Glass of water before coffee', bg: GRAD.eat,     source: 'Healthline',       anchor: 'Each morning',  status: 'my_habit', addedAt: ago(90), tier: 4 },
      // Adopted — past trial, working toward my habit
      { id: 'strong_demo', goalId: 'strong',  label: 'Ten squats before the shower', bg: GRAD.strong,  source: 'Verywell Health',  anchor: 'Before shower', status: 'adopted',  addedAt: ago(14), tier: 1 },
      // Trial — new habit, working on it
      { id: 'sleep_demo',  goalId: 'sleep',   label: 'Lights low after 9',           bg: GRAD.sleep,   source: 'Sleep Foundation', anchor: 'Before bed',    status: 'trial',    addedAt: today,   tier: 1 },
    ]
    try {
      localStorage.removeItem('vitalistExp_firstrun')
      localStorage.setItem('vitalistExp_habits', JSON.stringify(habits))
      localStorage.setItem('vitalistExp_collection', JSON.stringify([]))
      localStorage.setItem('vitalistExp_goals', JSON.stringify(['move', 'sleep', 'stress', 'eat', 'strong']))
      localStorage.setItem('vitalistExp_sources', JSON.stringify(['steps', 'sleep']))
      localStorage.setItem('vitalistExp_name', '')
      localStorage.setItem('vitalistExp_complete', '1')
      localStorage.setItem(`vitalistExp_completions_${today}`, JSON.stringify(['walk_demo', 'breath_demo', 'water_demo']))
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
        <span className="eo-hdrbar__num">Step {Math.max(1, flowIdx + 1)} of {FLOW.length}</span>
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
          <p className="eo-lede">Before anything new — a few quick questions about what you already do. Tap anything that sounds like you, even roughly. Nothing here is a test.</p>
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
              <span key={g.id} data-pillar={g.id} className={`eo-chip${gapGoals.includes(g.id) ? ' on' : ''}`} onClick={() => toggleGap(g.id)}>
                {g.label}
              </span>
            ))}
            <span className={`eo-chip more${otherOpen ? ' on' : ''}`} onClick={() => setOtherOpen(o => !o)}>Something else</span>
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
          <p className="eo-lede">We'll hold the rest — one at a time is the whole point.</p>
          {gapGoals.map(id => {
            const g = GAP.find(x => x.id === id)
            return (
              <div key={id} className={`eo-opt${primary === id ? ' on' : ''}`} onClick={() => setPrimary(id)}>
                <div className="txt"><b>{g.label}</b></div>
                <span className={`eo-radio${primary === id ? ' on' : ''}`} />
              </div>
            )
          })}
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
            <p className="eo-dimmeta">Question {dimStep + 1} of {qs.length}</p>
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
        <div className="eo-body" style={{ justifyContent: 'center', gap: 18 }}>
          <div className="eo-wear-icon">📲</div>
          <div>
            <h2 className="eo-q">Let your phone fill in the picture.</h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>Allow steps and sleep and we'll confirm most habits for you — nothing to log.</p>
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

          <div className="eo-hcard-rail">

            {/* ① Front — done status · habit name · today's content */}
            <div className="eo-hcard eo-hcard--front">
              <img className="eo-hcard__photo" src={photo(card.goalId, card.id)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
              <div className="eo-hcard__overlay">
                <div className="eo-hcard__front-top">
                  <span className="eo-pill eo-pill--outline">To Do</span>
                </div>
                <div className="eo-hcard__front-body">
                  <span className="eo-pill">{CAT_LABEL[card.goalId] || 'For you'}</span>
                  <h1 className="eo-hcard__hed">{card.headline} <em>{card.em}</em></h1>
                </div>
                <div className="eo-hcard__front-foot">
                  <span className="eo-pill">{todayContent.source}</span>
                  <p className="eo-hcard__content-sub">{todayContent.title}</p>
                </div>
              </div>
            </div>

            {/* ② Detail — ownership state · category · tier · time association */}
            <div className="eo-hcard eo-hcard--detail">
              <div className="eo-hcard__pills-stack">
                <span className="eo-pill">Trial</span>
                <span className="eo-pill">{CAT_LABEL[card.goalId] || 'For you'}</span>
                <span className="eo-pill">Tier {card.tier || 1}</span>
                {card.anchor && <span className="eo-pill">{card.anchor}</span>}
                <span className="eo-pill eo-pill--outline">To Do</span>
              </div>
              <h1 className="eo-hcard__hed">{card.headline} <em>{card.em}</em></h1>
              <button className="eo-pill eo-hcard__why-btn" onClick={() => setShowWhy(true)}>Why this works →</button>
            </div>

            {/* ③ Content — today's brand-attributed piece */}
            <div className="eo-hcard eo-hcard--content">
              <div className="eo-hcard__content-head">
                <img className="eo-hcard__content-bg" src={photo(card.goalId, card.id)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
                <div className="eo-hcard__content-head-inner">
                  <span className="eo-pill">{todayContent.source}</span>
                  <p className="eo-hcard__content-title">{todayContent.title}</p>
                  <span className="eo-pill">Save</span>
                </div>
              </div>
              <div className="eo-hcard__content-img" />
            </div>

          </div>

          {/* Why sheet */}
          {showWhy && (
            <div className="eo-why-sheet" onClick={() => setShowWhy(false)}>
              <div className="eo-why-sheet__panel" onClick={e => e.stopPropagation()}>
                <div className="eo-why-sheet__handle" />
                <p className="eo-why-sheet__eyebrow">Why this works</p>
                <h3 className="eo-why-sheet__hed">{card.headline} {card.em}</h3>
                <p className="eo-why-sheet__body">{card.why}</p>
                <button className="eo-btn primary" style={{ marginTop: 'auto' }} onClick={() => setShowWhy(false)}>Got it</button>
              </div>
            </div>
          )}
          <div className="eo-spacer" />
          <button className="eo-shuffle" onClick={() => setHabitIdx(i => i + 1)}>{ShuffleIcon} Show me another</button>
          <button className="eo-btn primary" onClick={() => setStep('S_moment')}>I'll try it →</button>
          {nav(() => setStep('S_perm'), null)}
        </div>
      </div>
    </div>
  )

  // ── Moment + notification (one step) ─────────────────────────────────────────
  if (step === 'S_moment') return (
    <div className="eo-root">
      <div className="eo-screen">
        {topbar}
        <div className="eo-body">
          <h2 className="eo-q">When in your day does <em>this live?</em></h2>
          <p className="eo-lede">Pin it to a moment you already have — pick what fits.</p>
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
            <h2 className="eo-q">Want your plan <em>saved?</em></h2>
            <p className="eo-lede" style={{ marginTop: 8 }}>Drop an email and we'll keep your habit and foundation so you can pick up anywhere.</p>
          </div>
          <input className="eo-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
            onKeyDown={e => { if (e.key === 'Enter') finishOnboarding() }} />
          <div className="eo-spacer" />
          <button className="eo-btn primary" onClick={finishOnboarding}>Start tonight →</button>
          {nav(() => setStep('S_moment'), finishOnboarding, 'Skip')}
        </div>
      </div>
    </div>
  )

  return null
}
