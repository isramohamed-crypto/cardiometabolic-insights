import React, { useState, useEffect } from 'react'
import './DailyPillbox.css'

const SELECTED_KEY    = 'vitalistMyRituals2'
const COMPLETIONS_KEY = 'vitalistMyRitualsCompletions'
const MEDICATION_IDS  = new Set(['hl_bp_med','hl_chol_med','hl_dm_med','hl_meno_hrt','hl_glp1','hl_meds_gen','hl_bg_check','hl_symptoms'])

// Minimal display data — mirrors HABIT_LIBRARY icons/labels
const PILL_DATA = {
  hl_walk:        { icon: '🚶', label: '10-min walk' },
  hl_fiber:       { icon: '🥣', label: 'Fiber breakfast' },
  hl_sodium:      { icon: '🧂', label: 'Limit sodium' },
  hl_stretch:     { icon: '🧘', label: 'Morning stretch' },
  hl_protein:     { icon: '🥚', label: 'Protein breakfast' },
  hl_sleep:       { icon: '😴', label: '7+ hrs sleep' },
  hl_breathe:     { icon: '💨', label: 'Deep breathing' },
  hl_water:       { icon: '💧', label: 'Hydration' },
  hl_strength:    { icon: '🏋️', label: 'Strength' },
  hl_dinner_walk: { icon: '🌆', label: 'Post-dinner walk' },
  hl_log:         { icon: '📊', label: 'Log a number' },
  hl_grateful:    { icon: '📓', label: 'Gratitude note' },
}

function todayKey() { return new Date().toISOString().slice(0, 10) }

function readSelectedIds() {
  try { const s = localStorage.getItem(SELECTED_KEY); return s ? JSON.parse(s) : [] } catch { return [] }
}

function readTodayDone() {
  try {
    const log = JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '{}')
    return new Set(log[todayKey()] || [])
  } catch { return new Set() }
}

function toggleDone(id) {
  try {
    const log = JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '{}')
    const key = todayKey()
    const cur = new Set(log[key] || [])
    if (cur.has(id)) cur.delete(id); else cur.add(id)
    log[key] = [...cur]
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(log))
    return new Set(log[key])
  } catch { return new Set() }
}

export default function DailyPillbox({ tick = 0 }) {
  const [done, setDone] = useState(() => readTodayDone())
  const [justDone, setJustDone] = useState(new Set())

  // Sync when another component (MyRituals) logs something
  useEffect(() => { setDone(readTodayDone()) }, [tick])

  const ids    = readSelectedIds().filter(id => !MEDICATION_IDS.has(id))
  const habits = ids.map(id => ({ id, ...(PILL_DATA[id] || { icon: '•', label: id }) }))

  const doneCount = habits.filter(h => done.has(h.id)).length
  const allDone   = habits.length > 0 && doneCount === habits.length

  if (habits.length === 0) return null

  function handleTap(id) {
    const wasChecked = done.has(id)
    const updated = toggleDone(id)
    setDone(updated)
    if (!wasChecked) {
      setJustDone(prev => new Set([...prev, id]))
      setTimeout(() => setJustDone(prev => { const n = new Set(prev); n.delete(id); return n }), 500)
    }
  }

  return (
    <div className={`dp-card${allDone ? ' dp-card--done' : ''}`}>
      <div className="dp-header">
        <div>
          <p className="dp-eyebrow">Today's habits</p>
          <p className="dp-score">
            {allDone
              ? "All done today 🔥"
              : doneCount === 0
                ? `${habits.length} habit${habits.length !== 1 ? 's' : ''} to do`
                : `${doneCount} of ${habits.length} done`}
          </p>
        </div>
        {allDone && (
          <div className="dp-all-done-badge">✓</div>
        )}
        {!allDone && doneCount > 0 && (
          <div className="dp-progress-ring">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="#2D9B83" strokeWidth="3"
                strokeDasharray={`${(doneCount / habits.length) * 88} 88`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="dp-progress-ring__num">{doneCount}</span>
          </div>
        )}
      </div>

      <div className="dp-pills">
        {habits.map(h => {
          const isDone  = done.has(h.id)
          const isNew   = justDone.has(h.id)
          return (
            <button
              key={h.id}
              type="button"
              className={[
                'dp-pill',
                isDone ? 'dp-pill--done' : '',
                isNew  ? 'dp-pill--pop'  : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleTap(h.id)}
            >
              <span className="dp-pill__icon">{isDone ? '✓' : h.icon}</span>
              <span className="dp-pill__label">{h.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
