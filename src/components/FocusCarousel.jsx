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

function Card({ habit, done, onDone, onAsk }) {
  const sub  = habitSubText(habit, done)
  const chip = doneLabel(habit, done)

  return (
    <div className="fc-card">
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

      {/* Text + actions */}
      <div className="fc-card__body">
        {habit.source && <p className="fc-card__source">{habit.source}</p>}

        <HeadLine label={habit.label} />

        {sub && <p className="fc-card__sub">{sub}</p>}

        {habit.anchor && (
          <p className="fc-card__anchor">
            {habit.anchor}
          </p>
        )}

        {/* Done chip */}
        <div
          className={`fc-done-chip${done ? ' done' : ''}`}
          onClick={() => onDone(habit.id)}
        >
          <div className="fc-done-chip__circle">
            {done ? '✓' : ''}
          </div>
          <span className="fc-done-chip__label">{chip}</span>
        </div>

        {/* Ask bar */}
        <div className="fc-ask-bar" onClick={() => onAsk(habit)}>
          <span className="fc-ask-bar__text">Ask about this habit…</span>
          <div className="fc-ask-bar__btn">→</div>
        </div>
      </div>
    </div>
  )
}

function AISheet({ habit, onClose }) {
  const prompts = habit ? [
    `Why does "${habit.label}" actually work?`,
    `What's the science behind this?`,
    `How do I make this easier to stick to?`,
    `What if I miss a day?`,
  ] : []
  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />
        <p className="fc-ai-sheet__label">Ask about this habit</p>
        {prompts.map(p => (
          <button key={p} className="fc-ai-chip" onClick={onClose}>{p}</button>
        ))}
        <button className="fc-ai-sheet__close" onClick={onClose}>Close</button>
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
  const [habits]        = useState(() => readHabits() || [])
  const [done, setDone] = useState(() => readDone())
  const [idx, setIdx]   = useState(0)
  const [overview, setOverview] = useState(false)
  const [askHabit, setAskHabit] = useState(null)
  const [showHint, setShowHint] = useState(habits.length > 1)

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
      if (delta < 0 && idx < habits.length - 1) { setIdx(i => i + 1); setShowHint(false) }
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

  const vw = typeof window !== 'undefined' ? window.innerWidth : 390
  const translatePx = -(idx * vw) + dragX
  const isActiveDrag = dragging.current && Math.abs(dragX) > 2

  return (
    <div className="fc-root">
      {/* Top bar */}
      <div className="fc-topbar">
        <div className="fc-logo-row">
          <button className="fc-logo-btn" onClick={onLogoClick}>Vitalist</button>
          <button className="fc-hamburger" onClick={() => (onMenu ? onMenu() : onNavigate('Me'))}>
            <span/><span/><span/>
          </button>
        </div>
        <div className="fc-eyebrow-row">
          <span className="fc-eyebrow">
            What you're building{habits.length > 1 ? ` · ${idx + 1} of ${habits.length}` : ''}
          </span>
        </div>
      </div>

      {/* Cards */}
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
              done={done.includes(h.id)}
              onDone={toggleDone}
              onAsk={setAskHabit}
            />
          ))}
        </div>
      </div>

      {habits.length > 1 && (
        <div className="fc-dots">
          {habits.map((_, i) => (
            <div key={i} className={`fc-dot${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
      {showHint && <div className="fc-swipe-hint">swipe to see all</div>}

      {overview && (
        <Overview
          habits={habits}
          done={done}
          onSelect={i => { setIdx(i); setOverview(false) }}
          onClose={() => setOverview(false)}
          onToggleDone={toggleDone}
        />
      )}
      {askHabit && <AISheet habit={askHabit} onClose={() => setAskHabit(null)} />}
    </div>
  )
}
