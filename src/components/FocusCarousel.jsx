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

// Editorial imagery per goal — atmospheric placeholder photography (stable per seed).
// Swap these URLs for Mark's real content shots when they land.
const IMAGERY = {
  move:   'https://picsum.photos/seed/vitalist-move-walk/900/1200',
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
      'The research puts it at up to a 22% smaller rise in blood sugar, and you don\'t need a workout to get it. Ten minutes counts. Even three counts. The point isn\'t intensity — it\'s timing.',
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

function streakLabel(habit) {
  if (habit.status === 'kept') {
    const weeks = habit.tier || 1
    return `${weeks} week${weeks !== 1 ? 's' : ''} kept`
  }
  const added = habit.addedAt || TODAY
  const days = Math.max(0, Math.floor((Date.now() - new Date(added).getTime()) / 86400000))
  if (days === 0) return 'Starting today'
  return `Day ${days + 1} of your trial`
}

// Passive sub-text — contextual per habit type
function habitSubText(habit, done) {
  if (done) return null // don't show sub when done
  if (habit.status === 'kept') return `Settling in — ${streakLabel(habit)}.`
  // Trial habits
  const passive = ['move', 'sleep', 'water']
  const goalId = habit.goalId || ''
  if (passive.includes(goalId)) {
    return "We'll catch this from your steps — nothing to tap."
  }
  return 'Tap when you\'ve done it.'
}

function doneLabel(habit, done) {
  if (done) {
    const now = new Date()
    const h = now.getHours()
    const m = String(now.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'pm' : 'am'
    const hh = h % 12 || 12
    return `Seen tonight · ${hh}:${m}${ampm}`
  }
  if (habit.goalId === 'move' || habit.goalId === 'sleep' || habit.goalId === 'water') {
    return "We'll log this automatically"
  }
  return 'Tap when it\'s done'
}

// Split headline — bold first, italic last N words
function HeadLine({ label }) {
  // Find natural italic break — after first comma if present, else last 2 words
  const commaIdx = label.indexOf(',')
  let main, italic
  if (commaIdx > 0) {
    main   = label.slice(0, commaIdx + 1)
    italic = label.slice(commaIdx + 1).trim()
  } else {
    const words = label.split(' ')
    const split = Math.max(1, words.length - 2)
    main   = words.slice(0, split).join(' ')
    italic = words.slice(split).join(' ')
  }
  return (
    <h2 className="fc-card__hed">
      {main} {italic && <em>{italic}</em>}
    </h2>
  )
}

function Card({ habit, done, onDone, sources, onConnect, onRead, width }) {
  const sub     = habitSubText(habit, done)
  const chip    = doneLabel(habit, done)
  const content = CONTENT[habit.goalId]

  return (
    <div className="fc-card" style={{ width }}>
      {/* Full-bleed gradient background (fallback under the photo) */}
      <div className="fc-card__bg" style={{ background: habit.bg }} />

      {/* Editorial imagery — full-bleed photo + brand duotone + motif */}
      <div className="fc-card__editorial">
        <img
          className="fc-card__photo"
          src={photoFor(habit)}
          alt=""
          draggable="false"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div className="fc-card__duotone" style={{ background: habit.bg }} />
        <div className="fc-card__motif" />
      </div>

      {/* Bottom scrim */}
      <div className="fc-card__scrim" />

      {/* Stacked cards over the image — habit + editorial, one connected unit */}
      <div className="fc-card__stack">
        <div className="fc-hcard">
          {habit.source && <p className="fc-hcard__source">{habit.source}</p>}
          <HeadLine label={habit.label} />
          {sub && <p className="fc-card__sub">{sub}</p>}
          <CardWearable habit={habit} sources={sources} onConnect={onConnect} />
          <div
            className={`fc-done-chip${done ? ' done' : ''}`}
            onClick={() => onDone(habit.id)}
          >
            <div className="fc-done-chip__circle">{done ? '✓' : ''}</div>
            <span className="fc-done-chip__label">{chip}</span>
          </div>
        </div>

        {content && (
          <button className="fc-ecard" onClick={() => onRead && onRead(content, habit)}>
            <span className="fc-ecard__tag">Related read</span>
            <span className="fc-ecard__hed">{content.hed}</span>
            <span className="fc-ecard__meta">{content.source} · {content.read} read <span className="fc-ecard__go">→</span></span>
          </button>
        )}
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

export default function FocusCarousel({ onNavigate, onLogoClick, onMenu }) {
  const name            = readName()
  const [habits]        = useState(() => readHabits() || [])
  const [done, setDone] = useState(() => readDone())
  const [idx, setIdx]   = useState(0)
  const [overview, setOverview] = useState(false)
  const [askHabit, setAskHabit] = useState(null)
  const [reading, setReading]   = useState(null)
  const [showHint, setShowHint] = useState(habits.length > 1)
  const [sources, setSources]   = useState(() => readSources())

  const connectSource = useCallback((source) => {
    setSources(prev => {
      if (prev.includes(source)) return prev
      const next = [...prev, source]
      writeSources(next)
      return next
    })
  }, [])

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
      // pages = each habit + one "next slot" card at the end (index habits.length)
      if (delta < 0 && idx < habits.length) { setIdx(i => i + 1); setShowHint(false) }
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

  const pageCount   = habits.length + 1 // habits + "next slot" card
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
          {habits.map(h => (
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

      {pageCount > 1 && (
        <div className="fc-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <div key={i} className={`fc-dot${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
      {showHint && <div className="fc-swipe-hint">swipe to see all</div>}

      {/* AI chat — app-level circular button, not attached to a card */}
      {habits.length > 0 && (
        <button
          className="fc-ai-fab"
          aria-label="Ask Vitalist AI"
          onClick={() => setAskHabit(habits[Math.min(idx, habits.length - 1)])}
        >
          <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.1L19 8.8l-5.3 1.7L12 16l-1.7-5.5L5 8.8l5.3-1.7L12 2z"/><path d="M18.5 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" opacity=".7"/></svg>
        </button>
      )}

      {overview && (
        <Overview
          habits={habits}
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
    </div>
  )
}
