import React, { useState } from 'react'
import './MyRituals.css'

const CATEGORIES = [
  { id: 'all',     label: 'All' },
  { id: 'move',    label: 'Move',    emoji: '🏃', color: '#2D9B83' },
  { id: 'nourish', label: 'Nourish', emoji: '🥗', color: '#E07B4A' },
  { id: 'hydrate', label: 'Hydrate', emoji: '💧', color: '#3B82F6' },
  { id: 'rest',    label: 'Rest',    emoji: '😴', color: '#8B5CF6' },
  { id: 'mind',    label: 'Mind',    emoji: '🧘', color: '#EC4899' },
  { id: 'monitor', label: 'Monitor', emoji: '📊', color: '#F59E0B' },
]

function readReadings() {
  try { return JSON.parse(localStorage.getItem('aheadReadings') || '{}') } catch { return {} }
}

function getInsight(category) {
  const r = readReadings()
  const bp      = r?.bp?.value
  const ldl     = r?.ldl?.value ? parseFloat(r.ldl.value) : null
  const glucose = r?.glucose?.value ? parseFloat(r.glucose.value) : null

  const bpSys = bp ? parseFloat(bp.split('/')[0]) : null

  switch (category) {
    case 'move':
      return {
        stat: '−22%',
        statLabel: 'post-meal glucose',
        body: bpSys
          ? `Your last BP was ${bp}. A daily 10-min walk can reduce systolic by 4–9 mmHg over 4 weeks — and lowers post-meal glucose by ~22%.`
          : 'A 10-min walk after dinner lowers post-meal glucose by ~22% and reduces systolic BP by 4–9 mmHg — one habit hitting every condition at once.',
        source: 'Diabetes Care / AHA',
      }
    case 'nourish':
      return {
        stat: '30%',
        statLabel: 'fewer cardiac events',
        body: ldl
          ? `Your LDL is ${ldl} mg/dL. Swapping saturated fat for fiber-rich foods directly lowers LDL — beta-glucan in oats binds it in the gut before it reaches your bloodstream.`
          : 'Mediterranean-style eating cuts cardiac events by up to 30% and improves both LDL and blood sugar control.',
        source: 'PREDIMED Trial / NEJM',
      }
    case 'hydrate':
      return {
        stat: '1–2%',
        statLabel: 'dehydration raises BP',
        body: bpSys
          ? `Even mild dehydration raises BP — especially important with your current reading of ${bp} and any BP or diabetes medications you may be taking.`
          : 'Even mild dehydration raises blood pressure and strains kidney function — especially important when taking BP medications or metformin.',
        source: 'Journal of Hypertension',
      }
    case 'rest':
      return {
        stat: '<6hrs',
        statLabel: 'sleep = higher risk',
        body: glucose
          ? `Poor sleep raises cortisol, which directly worsens insulin resistance — reflected in numbers like your glucose (${glucose} mg/dL). Sleep is a cardiometabolic lever most people ignore.`
          : 'Sleeping under 6 hours raises cortisol, worsens insulin resistance, and spikes hunger hormones. Poor sleep is an independent cardiometabolic risk factor.',
        source: 'AHA / Circulation',
      }
    case 'mind':
      return {
        stat: '48hrs',
        statLabel: 'stress lag in numbers',
        body: bpSys
          ? `Chronic stress raises cortisol, which elevates BP — your ${bp} reading may partly reflect stress load, not just sodium or activity. High-stress days show up in readings ~48 hrs later.`
          : 'Chronic stress elevates cortisol, which raises blood pressure and worsens insulin resistance. High-stress days often show up in your readings 48 hours later.',
        source: 'American Heart Association',
      }
    case 'monitor':
      return {
        stat: '2×',
        statLabel: 'more likely to hit targets',
        body: (bpSys || ldl || glucose)
          ? `You've logged ${[bp && 'BP', ldl && 'LDL', glucose && 'glucose'].filter(Boolean).join(', ')}. Patients who track consistently between appointments are 2× more likely to reach their targets.`
          : 'Patients who track vitals between appointments are twice as likely to reach their BP and glucose goals. Knowing your numbers changes your behavior.',
        source: 'Journal of General Internal Medicine',
      }
    default:
      return null
  }
}

const DEFAULT_HABITS = [
  { id: 'r_walk',      category: 'move',    icon: '🚶', label: '10-min walk' },
  { id: 'r_stretch',   category: 'move',    icon: '💪', label: 'Morning stretch' },
  { id: 'r_veggies',   category: 'nourish', icon: '🥗', label: 'Eat vegetables' },
  { id: 'r_breakfast', category: 'nourish', icon: '🥚', label: 'Heart-healthy breakfast' },
  { id: 'r_water1',    category: 'hydrate', icon: '💧', label: '2 glasses of water' },
  { id: 'r_water2',    category: 'hydrate', icon: '🥤', label: 'Water before each meal' },
  { id: 'r_sleep',     category: 'rest',    icon: '😴', label: '7+ hours sleep' },
  { id: 'r_wind',      category: 'rest',    icon: '🌙', label: 'Wind-down routine' },
  { id: 'r_breathe',   category: 'mind',    icon: '💨', label: '5-min deep breathing' },
  { id: 'r_grateful',  category: 'mind',    icon: '📓', label: 'Gratitude note' },
  { id: 'r_meds',      category: 'monitor', icon: '💊', label: 'Take medications' },
  { id: 'r_log',       category: 'monitor', icon: '📊', label: 'Log a health number' },
]

const STORAGE_KEY = 'vitalistMyRituals'
const COMPLETIONS_KEY = 'vitalistMyRitualsCompletions'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readHabits() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : DEFAULT_HABITS
  } catch { return DEFAULT_HABITS }
}

function saveHabits(habits) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(habits)) } catch {}
}

function readCompletions() {
  try {
    const log = JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '{}')
    return log[todayKey()] || []
  } catch { return [] }
}

function persistToggle(id) {
  try {
    const log = JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '{}')
    const key = todayKey()
    const current = new Set(log[key] || [])
    if (current.has(id)) current.delete(id); else current.add(id)
    log[key] = [...current]
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(log))
    return log[key]
  } catch { return [] }
}

const ICON_OPTIONS = ['✨', '🏃', '🚶', '💪', '🥗', '🥚', '🍎', '💧', '🥤', '😴', '🌙', '💨', '🧘', '📓', '💊', '📊', '🩺', '❤️', '🧂', '🐟']

export default function MyRituals() {
  const [habits, setHabits]               = useState(readHabits)
  const [completions, setCompletions]     = useState(readCompletions)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAdd, setShowAdd]             = useState(false)
  const [showAll, setShowAll]             = useState(false)
  const [newLabel, setNewLabel]           = useState('')
  const [newCategory, setNewCategory]     = useState('move')
  const [newIcon, setNewIcon]             = useState('✨')

  const DEFAULT_VISIBLE = 3
  const filtered    = activeCategory === 'all' ? habits : habits.filter(h => h.category === activeCategory)
  const isAllView   = activeCategory === 'all'
  const visible     = isAllView && !showAll ? filtered.slice(0, DEFAULT_VISIBLE) : filtered
  const hiddenCount = filtered.length - DEFAULT_VISIBLE

  const done  = completions.filter(id => habits.some(h => h.id === id)).length
  const total = habits.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  function handleCategoryChange(id) {
    setActiveCategory(id)
    setShowAll(false)
  }

  function handleToggle(id) {
    setCompletions(persistToggle(id))
  }

  function handleAdd() {
    if (!newLabel.trim()) return
    const habit = { id: `custom_${Date.now()}`, category: newCategory, icon: newIcon, label: newLabel.trim(), custom: true }
    const updated = [...habits, habit]
    setHabits(updated)
    saveHabits(updated)
    setNewLabel('')
    setNewIcon('✨')
    setShowAdd(false)
  }

  function handleDelete(e, id) {
    e.stopPropagation()
    const updated = habits.filter(h => h.id !== id)
    setHabits(updated)
    saveHabits(updated)
  }

  return (
    <section className="mr-section">

      {/* Header */}
      <div className="mr-header">
        <div>
          <p className="mr-eyebrow">Daily rituals</p>
          <h2 className="mr-title">My Rituals</h2>
        </div>
        <div className="mr-header__right">
          <button className="mr-plus-btn" onClick={() => setShowAdd(s => !s)} aria-label="Add ritual">
            {showAdd ? '✕' : '+'}
          </button>
          <div className="mr-score">
            <span className="mr-score__done">{done}</span>
            <span className="mr-score__sep">/</span>
            <span className="mr-score__total">{total}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mr-bar">
        <div className="mr-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Category chips */}
      <div className="mr-cats">
        {CATEGORIES.map(c => {
          const active = activeCategory === c.id
          return (
            <button
              key={c.id}
              className={`mr-cat${active ? ' mr-cat--active' : ''}`}
              style={active && c.color ? { background: c.color, borderColor: c.color, color: '#fff' } : {}}
              onClick={() => handleCategoryChange(c.id)}
            >
              {c.emoji && <span className="mr-cat__emoji">{c.emoji}</span>}
              {c.label}
            </button>
          )
        })}
      </div>

      {/* Category insight card */}
      {!isAllView && (() => {
        const ins = getInsight(activeCategory)
        const color = CATEGORIES.find(c => c.id === activeCategory)?.color || '#2D9B83'
        return (
          <div className="mr-insight" style={{ borderLeftColor: color }}>
            <div className="mr-insight__stat" style={{ color }}>{ins.stat}</div>
            <div className="mr-insight__stat-label">{ins.statLabel}</div>
            <p className="mr-insight__body">{ins.body}</p>
            <p className="mr-insight__source">{ins.source}</p>
          </div>
        )
      })()}

      {/* Habit rows */}
      <div className="mr-list">
        {filtered.length === 0 && (
          <p className="mr-empty">No rituals in this category yet. Add one above.</p>
        )}
        {visible.map(habit => {
          const isDone  = completions.includes(habit.id)
          const catMeta = CATEGORIES.find(c => c.id === habit.category)
          const color   = catMeta?.color || '#9CA3AF'
          return (
            <div
              key={habit.id}
              className={`mr-item${isDone ? ' mr-item--done' : ''}`}
              onClick={() => handleToggle(habit.id)}
              role="button"
              tabIndex={0}
            >
              <div className="mr-item__check" style={isDone ? { background: color, borderColor: color } : { borderColor: color }}>
                {isDone && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="mr-item__icon">{habit.icon}</span>
              <span className="mr-item__label">{habit.label}</span>
              <div className="mr-item__right">
                <span className="mr-item__tag" style={{ background: `${color}18`, color }}>
                  {catMeta?.label}
                </span>
                {habit.custom && (
                  <button className="mr-item__del" onClick={e => handleDelete(e, habit.id)} title="Remove">×</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Show more / collapse */}
      {isAllView && hiddenCount > 0 && !showAll && (
        <button className="mr-show-more" onClick={() => setShowAll(true)}>
          + {hiddenCount} more ritual{hiddenCount !== 1 ? 's' : ''}
        </button>
      )}
      {isAllView && showAll && filtered.length > DEFAULT_VISIBLE && (
        <button className="mr-show-more mr-show-more--collapse" onClick={() => setShowAll(false)}>
          Show less
        </button>
      )}

      {showAdd && (
        <div className="mr-add-form">
          {/* Icon picker */}
          <div className="mr-icon-picker">
            {ICON_OPTIONS.map(ic => (
              <button
                key={ic}
                className={`mr-icon-opt${newIcon === ic ? ' mr-icon-opt--active' : ''}`}
                onClick={() => setNewIcon(ic)}
              >
                {ic}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            className="mr-add-input"
            type="text"
            placeholder="Name your ritual..."
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />

          {/* Category select */}
          <div className="mr-add-cats">
            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
              <button
                key={c.id}
                className={`mr-cat mr-cat--sm${newCategory === c.id ? ' mr-cat--active' : ''}`}
                style={newCategory === c.id ? { background: c.color, borderColor: c.color, color: '#fff' } : {}}
                onClick={() => setNewCategory(c.id)}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <button className="mr-save-btn" onClick={handleAdd} disabled={!newLabel.trim()}>
            Add ritual
          </button>
        </div>
      )}
    </section>
  )
}
