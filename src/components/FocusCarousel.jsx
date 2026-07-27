import React, { useState, useRef, useCallback, useEffect } from 'react'
import './FocusCarousel.css'

const TODAY = new Date().toISOString().slice(0, 10)
const STORAGE_KEY = `vitalistExp_completions_${TODAY}`

function readDone() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function writeDone(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch {}
}
function readHabits() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_habits') || 'null') } catch { return null }
}
function readName() {
  try { return localStorage.getItem('vitalistExp_name') || '' } catch { return '' }
}
function readPrimary() {
  try { return localStorage.getItem('vitalistExp_primary') || '' } catch { return '' }
}

// Editorial imagery per goal — atmospheric placeholder photography (stable per seed).
// Swap these URLs for Mark's real content shots when they land.
const IMAGERY = {
  move:   '/forest.jpg',
  strong: 'https://picsum.photos/seed/vitalist-strong/900/1200',
  eat:    'https://picsum.photos/seed/vitalist-eat/900/1200',
  water:  'https://picsum.photos/seed/vitalist-water/900/1200',
  sleep:  'https://picsum.photos/seed/vitalist-sleep/900/1200',
  stress: 'https://picsum.photos/seed/vitalist-stress/900/1200',
}
function photoFor(habit) {
  return IMAGERY[habit.goalId] || `https://picsum.photos/seed/vitalist-${habit.goalId || 'default'}/900/1200`
}

// ── Wearable / tracker sources ──────────────────────────────────────────────
const WEARABLE = {
  move:   { source: 'steps',    label: 'Steps' },
  sleep:  { source: 'sleep',    label: 'Sleep' },
  strong: { source: 'workouts', label: 'Workouts' },
  stress: { source: 'hrv',      label: 'HRV' },
}
function readSources() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_sources') || '[]') } catch { return [] }
}
function writeSources(s) {
  try { localStorage.setItem('vitalistExp_sources', JSON.stringify(s)) } catch {}
}
const WatchIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5.5"/><path d="M8.5 3.5 9 8M15.5 3.5 15 8M8.5 20.5 9 16M15.5 20.5 15 16M12 9.5V12l1.8 1"/></svg>
)
// AI indicator glyph (sparkles) — no emoji
const SparkIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.1L19 8.8l-5.3 1.7L12 16l-1.7-5.5L5 8.8l5.3-1.7L12 2z"/><path d="M18.5 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" opacity=".65"/></svg>
)

function CardWearable({ habit, sources, onConnect }) {
  const w = WEARABLE[habit.goalId]
  if (!w) return null
  const on = sources.includes(w.source)
  if (on) {
    return <span className="fc-wear fc-wear--on">{WatchIcon} Auto · {w.label}</span>
  }
  return (
    <button
      className="fc-wear fc-wear--off"
      onClick={e => { e.stopPropagation(); onConnect(w.source) }}
    >
      {WatchIcon} Attach {w.label} tracker
    </button>
  )
}

// ── Editorial content teed up per habit (from the Read library) ─────────────
const CONTENT = {
  move: {
    source: 'EatingWell', read: '4 min', eye: 'Movement & metabolism',
    hed: 'The nighttime walk that may balance blood sugar',
    body: [
      'A short walk after dinner is one of the most studied — and most underrated — things you can do for your metabolism. When you move right after eating, your muscles pull glucose out of your bloodstream for fuel, blunting the post-meal spike that would otherwise strain your body over time.',
      'The research puts it at up to a 22% smaller rise in blood sugar, and you don\'t need a workout to get it. Ten minutes after dinner is plenty. The point isn\'t intensity — it\'s timing.',
      'That\'s why Vitalist ties this one to dinner: the habit rides on something you already do every night, so it asks almost nothing of you and compounds quietly on its own.',
    ],
  },
  strong: {
    source: 'Verywell Health', read: '5 min', eye: 'Strength & longevity',
    hed: 'How weekly strength training helps you live longer',
    body: [
      'Strength isn\'t about aesthetics — it\'s one of the clearest predictors of how well you age. Muscle is metabolically active tissue that helps regulate blood sugar, supports your joints, and keeps you independent decades from now.',
      'The encouraging part: you don\'t need a gym or heavy weights. Bodyweight movements done consistently — a set of squats before your shower — deliver most of the benefit. Consistency beats intensity every time.',
    ],
  },
  sleep: {
    source: 'Verywell Health', read: '4 min', eye: 'Sleep science',
    hed: 'Wake at the same time every day',
    body: [
      'Sleep scientists largely agree on the single most effective lever for better sleep, and it\'s probably not what you\'d guess. It isn\'t total hours — it\'s the consistency of your wake time.',
      'A steady wake time anchors your circadian rhythm, so your body starts to feel sleepy and alert at predictable times. Over a couple of weeks, falling asleep gets easier without any extra effort at night.',
      'That\'s why this habit focuses on the morning, not bedtime — the lever that actually moves the system.',
    ],
  },
  stress: {
    source: 'Verywell Mind', read: '4 min', eye: 'Stress & the nervous system',
    hed: 'The benefits of deep breathing',
    body: [
      'Five slow breaths can shift your body out of fight-or-flight faster than almost anything else. Long, slow exhales activate the parasympathetic nervous system — your body\'s built-in calm-down switch.',
      'The trick is to make the exhale longer than the inhale. That\'s the signal your nervous system reads as "safe." Done before you reach for your phone, it interrupts the stress-scroll loop before it starts.',
    ],
  },
  connect: {
    source: 'Verywell Mind', read: '5 min', eye: 'Connection & health',
    hed: 'How social isolation affects your health',
    body: [
      'Loneliness isn\'t only hard emotionally — researchers now treat chronic isolation as a physical health risk on par with smoking. Connection buffers stress, supports the heart, and even influences how long we live.',
      'The good news is that small, regular contact does most of the work: a standing weekly call, a short walk with a friend. It\'s frequency, not grand gestures, that builds belonging.',
    ],
  },
  eat: {
    source: 'EatingWell', read: '4 min', eye: 'Nutrition & glucose',
    hed: '5 best breakfast foods for blood sugar',
    body: [
      'What you eat first thing sets the tone for your glucose response all day. A breakfast anchored in protein and fiber — rather than fast carbs alone — flattens the morning spike and keeps energy steadier into the afternoon.',
      'Think eggs, Greek yogurt, oats, berries, and nuts. Small, repeatable choices beat any strict plan, which is exactly how Vitalist frames it.',
    ],
  },
  water: {
    source: 'Better Homes & Gardens', read: '3 min', eye: 'Mood & environment',
    hed: 'A simple morning reset',
    body: [
      'After seven or eight hours of sleep you wake up mildly dehydrated, and that alone can dull focus, mood, and energy before the day even starts.',
      'One glass of water before your coffee rehydrates you and sets a calm baseline. It\'s a tiny anchor habit — easy to start, easy to keep.',
    ],
  },
}

// ── First-run habit recommendations ─────────────────────────────────────────
const GRAD = {
  move:   'linear-gradient(155deg,#8a7565,#4a3b32)',
  sleep:  'linear-gradient(155deg,#6d7b6a,#3a4436)',
  eat:    'linear-gradient(155deg,#8a6a5a,#5a3a2a)',
  water:  'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
  stress: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)',
  strong: 'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
}
const RECOMMEND = {
  move:   { goalId: 'move',   label: '10-minute walk after dinner',   headline: 'Ten minutes outside,', em: 'after dinner.',           tagline: "That's it.",              source: 'EatingWell' },
  sleep:  { goalId: 'sleep',  label: 'Lights low after 9',            headline: 'Lights low',           em: 'after 9.',                tagline: 'Just try it tonight.',    source: 'Sleep Foundation' },
  eat:    { goalId: 'eat',    label: 'Fork down between bites',       headline: 'Fork down',            em: 'between bites.',          tagline: 'At dinner tonight.',      source: 'EatingWell' },
  water:  { goalId: 'water',  label: 'A glass of water before coffee',headline: 'One glass of water,',  em: 'before coffee.',          tagline: "That's the whole thing.", source: 'Healthline' },
  stress: { goalId: 'stress', label: 'Five breaths before scrolling', headline: 'Five breaths',         em: 'before the first scroll.',tagline: "Five. That's it.",        source: 'Verywell Mind' },
  strong: { goalId: 'strong', label: 'Ten squats before the shower',  headline: 'Ten squats',           em: 'before the shower.',      tagline: 'Thirty seconds.',         source: 'Verywell Fit' },
}
const REC_ORDER = ['move', 'sleep', 'eat', 'water', 'stress', 'strong']

function FirstRun({ name, primary, onSelect }) {
  const order = [primary, ...REC_ORDER.filter(g => g !== primary)].filter(g => RECOMMEND[g])
  const list  = order.length ? order : REC_ORDER
  const [i, setI]             = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [exiting, setExiting] = useState(false)
  const rec   = RECOMMEND[list[i % list.length]]         || RECOMMEND.move
  const next1 = RECOMMEND[list[(i + 1) % list.length]]   || RECOMMEND.sleep
  const next2 = RECOMMEND[list[(i + 2) % list.length]]   || RECOMMEND.eat

  function choose() {
    setLeaving(true)
    setTimeout(() => onSelect(rec), 640)
  }
  function showNext() {
    if (exiting) return
    setExiting(true)
    setTimeout(() => { setI(prev => prev + 1); setExiting(false) }, 280)
  }

  return (
    <div className="fr-root">
      <div className="fr-welcome">
        <p className="fr-brand">Vitalist</p>
        <h1 className="fr-hed">Welcome{name ? `, ${name}` : ''}.</h1>
        <p className="fr-sub">Swap until one feels right.</p>
      </div>

      <div className="fr-stack">
        {/* ghost 2 — furthest back */}
        <div className="fr-card fr-card--ghost2" style={{ background: GRAD[next2.goalId] }}>
          <img className="fr-card__photo"
               src={IMAGERY[next2.goalId] || `https://picsum.photos/seed/vitalist-${next2.goalId}/900/1200`}
               alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
        </div>

        {/* ghost 1 — middle */}
        <div className="fr-card fr-card--ghost1" style={{ background: GRAD[next1.goalId] }}>
          <img className="fr-card__photo"
               src={IMAGERY[next1.goalId] || `https://picsum.photos/seed/vitalist-${next1.goalId}/900/1200`}
               alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
        </div>

        {/* active card */}
        <div className={`fr-card fr-card--front${leaving ? ' fr-card--settle' : ''}${exiting ? ' fr-card--exit' : ''}`}>
          <div className="fr-card__bg" style={{ background: GRAD[rec.goalId] || rec.bg }} />
          <img className="fr-card__photo"
               src={IMAGERY[rec.goalId] || `https://picsum.photos/seed/vitalist-${rec.goalId}/900/1200`}
               alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
          <span className="fr-card__flag">{rec.source}</span>
          <div className="fr-card__txt">
            <h2 className="fr-card__hed">{rec.headline} <em>{rec.em}</em></h2>
            <p className="fr-card__that">{rec.tagline}</p>
          </div>
        </div>
      </div>

      <div className="fr-actions">
        <button className="fr-primary" onClick={choose}>I'll try it →</button>
        <button className="fr-link" onClick={showNext}>Show me another</button>
      </div>
    </div>
  )
}

function PostConfirm({ habit, sources, onConnect, onClose }) {
  const w = WEARABLE[habit.goalId]
  const connected = w && sources.includes(w.source)
  const [notif, setNotif] = useState(false)
  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />
        <p className="fc-pc__hed">Nice — it's yours.</p>
        <p className="fc-pc__sub">Make it effortless:</p>
        {w && (
          <button className={`fc-pc__opt${connected ? ' on' : ''}`} onClick={() => { if (!connected) onConnect(w.source) }}>
            <span>{connected ? `Auto-tracking with ${w.label} — nothing to log` : `Connect ${w.label} — logs itself`}</span>
            <span className="fc-pc__check">{connected ? '✓' : '+'}</span>
          </button>
        )}
        <button
          className={`fc-pc__opt${notif ? ' on' : ''}`}
          onClick={() => { setNotif(v => !v); try { localStorage.setItem('vitalistExp_notif', notif ? '0' : '1') } catch (_) {} }}
        >
          <span>{notif ? 'Daily nudge on — one a day, max' : 'Turn on a daily nudge'}</span>
          <span className="fc-pc__check">{notif ? '✓' : '+'}</span>
        </button>
        <button className="fc-ai-sheet__close" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}

function Reader({ content, habit, onClose }) {
  return (
    <div className="fc-reader">
      <div className="fc-reader__hero">
        <img className="fc-reader__photo" src={photoFor(habit)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="fc-reader__hero-bg" style={{ background: habit.bg }} />
        <div className="fc-reader__hero-scrim" />
        <button className="fc-reader__back" onClick={onClose} aria-label="Back">←</button>
        <div className="fc-reader__hero-txt">
          <span className="fc-reader__eye">{content.eye}</span>
          <h1 className="fc-reader__hed">{content.hed}</h1>
          <span className="fc-reader__meta">{content.source} · {content.read} read</span>
        </div>
      </div>
      <div className="fc-reader__body">
        {content.body.map((p, i) => <p key={i}>{p}</p>)}
        <p className="fc-reader__foot">Curated for your habit · Vitalist by People Inc.</p>
        <button className="fc-reader__done" onClick={onClose}>Back to today</button>
      </div>
    </div>
  )
}

function NextSlotCard({ width }) {
  return (
    <div className="fc-card fc-card--next" style={{ width }}>
      <div className="fc-next__inner">
        <div className="fc-next__mark">+</div>
        <h3 className="fc-next__hed">One habit at a time.</h3>
        <p className="fc-next__body">
          Your next slot opens once this one feels automatic — earned, not
          assigned. No rush.
        </p>
      </div>
    </div>
  )
}

function daysIn(habit) {
  const added = habit.addedAt || TODAY
  return Math.max(0, Math.floor((Date.now() - new Date(added).getTime()) / 86400000))
}

function isEligible(habit) {
  return habit.status === 'trial' && daysIn(habit) >= 7
}

function streakLabel(habit) {
  if (habit.status === 'my_habit' || habit.status === 'kept' || habit.status === 'established') {
    const d = daysIn(habit)
    const weeks = Math.floor(d / 7)
    if (weeks < 1) return 'Just made yours'
    return `${weeks} week${weeks !== 1 ? 's' : ''} strong`
  }
  if (habit.status === 'adopted') {
    const d = daysIn(habit)
    const weeks = Math.floor(d / 7)
    if (weeks < 1) return 'Building'
    return `${weeks} week${weeks !== 1 ? 's' : ''} building`
  }
  // trial
  const d = daysIn(habit)
  if (d === 0) return 'Day 1 — starting today'
  return `Day ${d + 1} of your trial`
}

// Demo "detected from tracker" readouts per goal
const DETECT = { move: '6,300 steps', sleep: '7h 20m', strong: '2 sessions', stress: 'HRV steady' }
function trackerConnected(habit, sources) {
  const w = WEARABLE[habit.goalId]
  return !!(w && sources && sources.includes(w.source))
}

// Contextual sub-text — tracker-aware
function habitSubText(habit, done, sources) {
  if (done) return null
  if (trackerConnected(habit, sources)) return "Nothing to log — we'll track this automatically."
  if (WEARABLE[habit.goalId]) return 'Attach a tracker and this logs itself.'
  if (habit.status === 'my_habit' || habit.status === 'kept' || habit.status === 'established')
    return `${streakLabel(habit)}.`
  if (habit.status === 'adopted') return `Settling in — ${streakLabel(habit)}.`
  if (isEligible(habit)) return 'Seven days in. Ready to make it official?'
  return 'Tap when you\'ve done it.'
}

function doneLabel(habit, done, sources) {
  const connected = trackerConnected(habit, sources)
  if (done) {
    if (connected) return `Detected from your tracker · ${DETECT[habit.goalId] || 'logged'}`
    const now = new Date()
    const h = now.getHours()
    const m = String(now.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'pm' : 'am'
    const hh = h % 12 || 12
    return `Seen today · ${hh}:${m}${ampm}`
  }
  if (connected) return "We'll log this automatically"
  return 'Tap when it\'s done'
}

// ── Pillar labels + daily content pool ──────────────────────────────────────
const CAT_LABEL = {
  move: 'Moving', strong: 'Strength', eat: 'Eating',
  sleep: 'Sleep', stress: 'Stress & Calm', connect: 'People', water: 'Hydration',
}

const BRAND_LOGO = {
  'EatingWell':      'https://logo.clearbit.com/eatingwell.com',
  'Byrdie':          'https://logo.clearbit.com/byrdie.com',
  'Verywell Health': 'https://logo.clearbit.com/verywellhealth.com',
  'Verywell Mind':   'https://logo.clearbit.com/verywellmind.com',
  'Prevention':      'https://logo.clearbit.com/prevention.com',
  'Real Simple':     'https://logo.clearbit.com/realsimple.com',
  'Sleep Foundation':'https://logo.clearbit.com/sleepfoundation.org',
  'Health':          'https://logo.clearbit.com/health.com',
  'Healthline':      'https://logo.clearbit.com/healthline.com',
}

function BrandPill({ source }) {
  const logo = BRAND_LOGO[source]
  const [err, setErr] = React.useState(false)
  return (
    <span className="fc-brand-pill">
      {logo && !err
        ? <img src={logo} alt={source} className="fc-brand-pill__logo" onError={() => setErr(true)} />
        : null}
      {(!logo || err) && source}
    </span>
  )
}

const DAILY_CONTENT = {
  move: [
    { source: 'EatingWell',     title: 'The Simple Nighttime Habit That May Balance Blood Sugar' },
    { source: 'Byrdie',          title: 'Why I Started Taking a Post-Dinner Walk Every Night' },
    { source: 'Verywell Health', title: 'Walking After Eating: Benefits and What to Know' },
  ],
  strong: [
    { source: 'Verywell Health', title: 'Research Shows Strength Training Every Week Can Help You Live Longer' },
    { source: 'Prevention',      title: '5 Chair Exercises for Stronger Legs at Any Age' },
    { source: 'EatingWell',      title: 'How to Build Strength at Home With No Equipment' },
  ],
  eat: [
    { source: 'EatingWell',  title: 'Why Adding Vegetables to Dinner Is the Easiest Diet Change' },
    { source: 'Byrdie',       title: 'The Simple Habit That Helped Me Eat More Vegetables' },
    { source: 'Real Simple',  title: 'How to Add Vegetables to Every Meal Without Thinking About It' },
  ],
  sleep: [
    { source: 'Sleep Foundation', title: 'How Light Affects Your Sleep and What to Do About It' },
    { source: 'Verywell Health',   title: 'Blue Light and Sleep: What Is the Connection?' },
    { source: 'Real Simple',       title: 'Night Owl Habits: How to Wind Down an Hour Earlier' },
  ],
  stress: [
    { source: 'Verywell Mind', title: 'The Physiological Benefits of Deep Breathing' },
    { source: 'Prevention',    title: '5 Breathing Exercises to Calm Anxiety Fast' },
    { source: 'Health',        title: 'Why Box Breathing Is the Stress Tool More People Should Know' },
  ],
  connect: [
    { source: 'Verywell Mind', title: 'Loneliness Is a Health Risk — Here Is What You Can Do' },
    { source: 'Real Simple',   title: 'The Simple Act of Texting Can Fight Loneliness' },
    { source: 'Health',        title: 'How Small Moments of Connection Add Up' },
  ],
  water: [
    { source: 'Healthline',      title: 'How Much Water Do You Actually Need Each Day?' },
    { source: 'Real Simple',     title: 'Simple Ways to Drink More Water Every Day' },
    { source: 'Verywell Health', title: 'Signs You Might Be Mildly Dehydrated' },
  ],
}
function getTodayContent(habit) {
  const pool = DAILY_CONTENT[habit.goalId] || []
  if (!pool.length) return { source: habit.source || '', title: habit.label }
  const day = Math.floor(Date.now() / 86400000)
  return pool[day % pool.length]
}

// ── Habit card — front layout ────────────────────────────────────────────────
function Card({ habit, done, onDone, width }) {
  const today = getTodayContent(habit)
  const cat   = CAT_LABEL[habit.goalId] || habit.goalId

  return (
    <div className="fc-card" style={{ width }}>
      {/* background layers */}
      <div className="fc-card__bg" style={{ background: habit.bg }} />
      <div className="fc-card__editorial">
        <img className="fc-card__photo" src={photoFor(habit)} alt="" draggable="false"
             onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="fc-card__duotone" style={{ background: habit.bg }} />
        <div className="fc-card__motif" />
      </div>

      {/* content overlay — top / mid / foot */}
      <div className="fc-card__overlay">
        <div className="fc-card__top">
          <button
            className={`fc-status-pill${done ? ' fc-status-pill--done' : ''}`}
            onClick={() => onDone(habit.id)}
          >
            {done ? '✓  Done' : 'To Do'}
          </button>
        </div>

        <div className="fc-card__mid">
          <span className="fc-cat-pill">{cat}</span>
          <h2 className="fc-card__hed">{habit.label}</h2>
        </div>

        <div className="fc-card__foot">
          <BrandPill source={today.source} />
          <p className="fc-card__content-title">{today.title}</p>
        </div>
      </div>
    </div>
  )
}

function AISheet({ habit, onClose, onAddHabit }) {
  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />

        <div className="fc-ai-sheet__intro">
          <div className="fc-ai-sheet__avatar">{SparkIcon}</div>
          <div>
            <p className="fc-ai-sheet__hi">Hey — I'm your Vitalist guide.</p>
            <p className="fc-ai-sheet__sub">Ask me anything, or start here.</p>
          </div>
        </div>

        {habit && (
          <>
            <p className="fc-ai-sheet__group">About “{habit.label}”</p>
            <button className="fc-ai-chip" onClick={onClose}>Why does this actually work?</button>
            <button className="fc-ai-chip" onClick={onClose}>How do I make it easier to stick to?</button>
            <button className="fc-ai-chip" onClick={onClose}>What if I miss a day?</button>
          </>
        )}

        <p className="fc-ai-sheet__group">Anything else</p>
        <button className="fc-ai-chip" onClick={() => (onAddHabit ? onAddHabit() : onClose())}>How do I add a new habit?</button>
        <button className="fc-ai-chip" onClick={onClose}>What should I focus on next?</button>

        <div className="fc-ai-sheet__composer">
          <input className="fc-ai-input" placeholder="Ask Vitalist…" readOnly onMouseDown={e => e.preventDefault()} />
          <span className="fc-ai-send" aria-hidden="true">↑</span>
        </div>
      </div>
    </div>
  )
}

function Overview({ habits, done, onSelect, onClose, onToggleDone }) {
  const doneSet  = new Set(done)
  const doneCount = habits.filter(h => doneSet.has(h.id)).length
  return (
    <div className="fc-overview">
      <button className="fc-overview__close" onClick={onClose}>✕</button>
      <div className="fc-overview__header">
        <p className="fc-overview__eye">What you're building</p>
        <h2 className="fc-overview__title">
          {doneCount === habits.length && habits.length > 0
            ? 'All done today.'
            : `${doneCount} of ${habits.length} today`}
        </h2>
        <p className="fc-overview__sub">Tap any habit to focus on it.</p>
      </div>
      <div className="fc-overview__grid">
        {habits.map((h, i) => {
          const isDone = doneSet.has(h.id)
          return (
            <div key={h.id} className="fc-ov-row" onClick={() => onSelect(i)}>
              <div className="fc-ov-row__swatch" style={{ background: h.bg }} />
              <div className="fc-ov-row__body">
                <div className="fc-ov-row__label">{h.label}</div>
                <div className="fc-ov-row__meta">{streakLabel(h)}</div>
              </div>
              <span className={`fc-ov-row__status${h.status === 'kept' ? ' kept' : ''}`}>
                {h.status === 'kept' ? 'Kept' : 'Trial'}
              </span>
              <div
                className={`fc-ov-row__check${isDone ? ' done' : ''}`}
                onClick={e => { e.stopPropagation(); onToggleDone(h.id) }}
              >
                {isDone ? '✓' : ''}
              </div>
            </div>
          )
        })}
        <div className="fc-add-row">
          <div className="fc-add-row__icon">+</div>
          Add another habit
        </div>
      </div>
    </div>
  )
}

function MyHabitsSection({ habits, done, onToggleDone }) {
  return (
    <div className="fc-my-habits">
      <p className="fc-my-habits__label">My habits</p>
      {habits.map(h => {
        const isDone = done.includes(h.id)
        return (
          <div key={h.id} className="fc-my-habit-row">
            <div className="fc-my-habit-row__swatch" style={{ background: h.bg }} />
            <div className="fc-my-habit-row__body">
              <p className="fc-my-habit-row__name">{h.label}</p>
              <p className="fc-my-habit-row__meta">{streakLabel(h)}</p>
            </div>
            <button
              className={`fc-my-habit-row__check${isDone ? ' done' : ''}`}
              onClick={() => onToggleDone(h.id)}
            >
              {isDone ? '✓' : ''}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function Day7Sheet({ habit, onAdopt, onDrop, onClose }) {
  const d = daysIn(habit)
  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel fc-d7__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />
        <p className="fc-d7__eyebrow">Day {d}</p>
        <h2 className="fc-d7__hed">Still in?</h2>
        <p className="fc-d7__habit">"{habit.label}"</p>
        <p className="fc-d7__body">
          A week is enough to know if something fits. If it did, make it yours.
          If it didn't, that's data too.
        </p>
        <button className="fc-d7__adopt" onClick={onAdopt}>Make it mine</button>
        <button className="fc-d7__drop" onClick={onDrop}>Let it go</button>
      </div>
    </div>
  )
}

export default function FocusCarousel({ onNavigate, onLogoClick, onMenu }) {
  const name            = readName()
  const [habits, setHabits] = useState(() => readHabits() || [])
  const [firstRun, setFirstRun] = useState(() => { try { return localStorage.getItem('vitalistExp_firstrun') === '1' } catch { return false } })
  const [postConfirm, setPostConfirm] = useState(null)
  const [done, setDone] = useState(() => readDone())
  const [idx, setIdx]   = useState(0)
  const [overview, setOverview] = useState(false)
  const [askHabit, setAskHabit] = useState(null)
  const [reading, setReading]   = useState(null)
  const [showHint, setShowHint] = useState(habits.length > 1)
  const [sources, setSources]   = useState(() => readSources())
  const [showDecision, setShowDecision] = useState(false)

  const working     = habits.filter(h => h.status === 'trial' || h.status === 'adopted')
  const established = habits.filter(h => h.status === 'my_habit' || h.status === 'kept' || h.status === 'established')

  const connectSource = useCallback((source) => {
    setSources(prev => {
      if (prev.includes(source)) return prev
      const next = [...prev, source]
      writeSources(next)
      return next
    })
  }, [])

  function adoptHabit(id) {
    const next = habits.map(h => h.id === id ? { ...h, status: 'adopted' } : h)
    setHabits(next)
    try { localStorage.setItem('vitalistExp_habits', JSON.stringify(next)) } catch {}
    setShowDecision(false)
  }

  function dropHabit(id) {
    const next = habits.filter(h => h.id !== id)
    setHabits(next)
    try { localStorage.setItem('vitalistExp_habits', JSON.stringify(next)) } catch {}
    setShowDecision(false)
  }

  function onSelectRecommendation(rec) {
    const today = new Date().toISOString().slice(0, 10)
    const habit = {
      id: rec.goalId + '_' + Date.now(),
      goalId: rec.goalId,
      label: rec.label,
      bg: GRAD[rec.goalId] || rec.bg,
      source: rec.source,
      status: 'trial',
      addedAt: today,
      tier: 1,
      anchor: null,
    }
    const next = [habit]
    try {
      localStorage.setItem('vitalistExp_habits', JSON.stringify(next))
      localStorage.removeItem('vitalistExp_firstrun')
    } catch (_) {}
    setHabits(next)
    setFirstRun(false)
    setPostConfirm(habit)
  }

  const dragStartX = useRef(null)
  const dragCurrX  = useRef(null)
  const dragging   = useRef(false)
  const [dragX, setDragX] = useState(0)

  useEffect(() => { writeDone(done) }, [done])
  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(() => setShowHint(false), 3000)
    return () => clearTimeout(t)
  }, [showHint])

  const toggleDone = useCallback((id) => {
    setDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  function startDrag(x) { dragStartX.current = x; dragCurrX.current = x; dragging.current = true }
  function moveDrag(x)  { if (!dragging.current) return; dragCurrX.current = x; setDragX(x - dragStartX.current) }
  function endDrag() {
    if (!dragging.current) return
    dragging.current = false
    const delta = dragCurrX.current - dragStartX.current
    if (Math.abs(delta) > 50) {
      // pages = each working habit + one "next slot" card at the end
      if (delta < 0 && idx < working.length) { setIdx(i => i + 1); setShowHint(false) }
      else if (delta > 0 && idx > 0) setIdx(i => i - 1)
    }
    setDragX(0)
  }

  useEffect(() => {
    const mm = e => { if (dragging.current) moveDrag(e.clientX) }
    const mu = () => endDrag()
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu)
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu) }
  })

  if (firstRun) {
    return (
      <div className="fc-root">
        <FirstRun name={name} primary={readPrimary()} onSelect={onSelectRecommendation} />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="fc-empty">
        <h2 className="fc-empty__hed">Nothing here yet.</h2>
        <p className="fc-empty__body">Complete onboarding to add your first habit, or start fresh.</p>
        <button className="fc-empty__btn" onClick={() => {
          try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
          window.location.reload()
        }}>Start fresh</button>
      </div>
    )
  }

  const pageCount   = working.length + 1 // working habits + "next slot" card
  const vw          = typeof window !== 'undefined' ? window.innerWidth : 390
  const translatePx = -(idx * vw) + dragX
  const isActiveDrag = dragging.current && Math.abs(dragX) > 2

  return (
    <div className="fc-root">
      {/* Top bar */}
      <div className="fc-topbar">
        <div className="fc-logo-row">
          <button className="fc-logo-btn" onClick={onLogoClick}>
            Vitalist<span className="fc-logo-btn__by">by People Inc.</span>
          </button>
          <button className="fc-hamburger" onClick={() => (onMenu ? onMenu() : onNavigate('Me'))}>
            <span/><span/><span/>
          </button>
        </div>
        <div className="fc-eyebrow-row">
          <span className="fc-eyebrow">{name ? `Welcome back, ${name}` : 'Your daily routine'}</span>
        </div>
      </div>

      {/* Scrollable content — carousel + my habits stacked vertically */}
      <div className="fc-page-scroll">
        {/* Working on it — swipe carousel */}
        <div className="fc-routine">
          <div className="fc-routine__slot">
            {(() => {
              const h = working[Math.min(idx, working.length - 1)]
              if (!h) return null
              if (h.status === 'trial' && isEligible(h)) {
                const d = daysIn(h)
                return (
                  <button className="fc-routine__slot-label fc-routine__slot-label--decision" onClick={() => setShowDecision(true)}>
                    Day {d} · Decide →
                  </button>
                )
              }
              return <p className="fc-routine__slot-label">Working on it</p>
            })()}
            {/* Cards — carousel */}
            <div
              className="fc-stage"
              onTouchStart={e => startDrag(e.touches[0].clientX)}
              onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX) }}
              onTouchEnd={endDrag}
              onMouseDown={e => { e.preventDefault(); startDrag(e.clientX) }}
              style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
            >
              <div
                className="fc-strip"
                style={{
                  transform: `translateX(${translatePx}px)`,
                  transition: isActiveDrag ? 'none' : 'transform .32s cubic-bezier(.42,0,.22,1)',
                }}
              >
                {working.map(h => (
                  <Card
                    key={h.id}
                    habit={h}
                    width={vw}
                    done={done.includes(h.id)}
                    onDone={toggleDone}
                    sources={sources}
                    onConnect={connectSource}
                    onRead={(content, habit) => setReading({ content, habit })}
                  />
                ))}
                <NextSlotCard width={vw} />
              </div>
            </div>
          </div>
        </div>

        {/* My habits — established habits scroll below carousel */}
        {established.length > 0 && (
          <MyHabitsSection habits={established} done={done} onToggleDone={toggleDone} />
        )}

        {/* Bottom padding clears fixed nav */}
        <div style={{ height: 103 }} />
      </div>

      {pageCount > 1 && (
        <div className="fc-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <div key={i} className={`fc-dot${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
      {showHint && <div className="fc-swipe-hint">swipe to see all</div>}

      {/* AI chat — app-level circular button, not attached to a card */}
      {working.length > 0 && (
        <button
          className="fc-ai-fab"
          aria-label="Ask Vitalist AI"
          onClick={() => setAskHabit(working[Math.min(idx, working.length - 1)])}
        >
          <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.1L19 8.8l-5.3 1.7L12 16l-1.7-5.5L5 8.8l5.3-1.7L12 2z"/><path d="M18.5 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" opacity=".7"/></svg>
        </button>
      )}

      {overview && (
        <Overview
          habits={working}
          done={done}
          onSelect={i => { setIdx(i); setOverview(false) }}
          onClose={() => setOverview(false)}
          onToggleDone={toggleDone}
        />
      )}
      {askHabit && (
        <AISheet
          habit={askHabit}
          onClose={() => setAskHabit(null)}
          onAddHabit={() => { setAskHabit(null); onNavigate('Yours') }}
        />
      )}
      {reading && (
        <Reader content={reading.content} habit={reading.habit} onClose={() => setReading(null)} />
      )}
      {postConfirm && (
        <PostConfirm habit={postConfirm} sources={sources} onConnect={connectSource} onClose={() => setPostConfirm(null)} />
      )}
      {showDecision && (() => {
        const h = working[Math.min(idx, working.length - 1)]
        return h ? (
          <Day7Sheet
            habit={h}
            onAdopt={() => adoptHabit(h.id)}
            onDrop={() => dropHabit(h.id)}
            onClose={() => setShowDecision(false)}
          />
        ) : null
      })()}
    </div>
  )
}
