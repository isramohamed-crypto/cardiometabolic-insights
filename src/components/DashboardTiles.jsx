import React, { useState, useEffect } from 'react'

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS = {
  green:  { bg: 'rgba(29,158,117,0.12)', text: '#0F6E56', bar: '#1D9E75' },
  teal:   { bg: 'rgba(15,110,86,0.10)',  text: '#085041', bar: '#0F6E56' },
  amber:  { bg: 'rgba(194,103,58,0.12)', text: '#8C4A20', bar: '#C2673A' },
  red:    { bg: 'rgba(184,50,50,0.12)',  text: '#8B1F1F', bar: '#B83232' },
}

// ─── Tile definitions ────────────────────────────────────────────────────────
const TILE_DEFS = [
  {
    id: 'ldl',
    label: 'LDL',
    sublabel: 'Cholesterol',
    unit: 'mg/dL',
    icon: '🫀',
    type: 'periodic',
    badge: 'Annual test',
    placeholder: 'e.g. 142',
    desc: 'LDL ("bad" cholesterol) is a key marker for heart disease risk. High levels can lead to plaque buildup in your arteries. You\'ll find this on your latest lab results.',
    defaultOn: true,
    removable: true,
    getStatus: v => {
      const n = parseFloat(v)
      if (isNaN(n)) return null
      if (n < 100) return { label: 'Optimal', color: 'green' }
      if (n < 130) return { label: 'Near optimal', color: 'teal' }
      if (n < 160) return { label: 'Borderline', color: 'amber' }
      return { label: 'High', color: 'red' }
    },
  },
  {
    id: 'bp',
    label: 'Blood pressure',
    shortLabel: 'BP',
    unit: 'mmHg',
    icon: '🩺',
    type: 'daily',
    badge: 'Daily',
    placeholder: 'e.g. 128/82',
    desc: 'The two numbers are systolic (pressure when your heart beats) over diastolic (pressure between beats). Enter it as shown on your monitor, e.g. 128/82.',
    defaultOn: true,
    removable: true,
    getStatus: v => {
      const sys = parseFloat((v || '').split('/')[0])
      if (isNaN(sys)) return null
      if (sys < 120) return { label: 'Normal', color: 'green' }
      if (sys < 130) return { label: 'Elevated', color: 'teal' }
      if (sys < 140) return { label: 'Stage 1', color: 'amber' }
      return { label: 'Stage 2', color: 'red' }
    },
  },
  {
    id: 'appt',
    label: 'Next appt',
    icon: '📅',
    type: 'appointment',
    badge: 'Upcoming',
    defaultOn: true,
    removable: true,
  },
  {
    id: 'glucose',
    label: 'Blood sugar',
    unit: 'mg/dL',
    icon: '🔬',
    type: 'daily',
    badge: 'Daily',
    placeholder: 'e.g. 95',
    desc: 'Blood sugar (glucose) measures how much sugar is in your blood. Fasting levels under 100 mg/dL are normal. Log after fasting for the most consistent tracking.',
    defaultOn: false,
    removable: true,
    getStatus: v => {
      const n = parseFloat(v)
      if (isNaN(n)) return null
      if (n < 100) return { label: 'Normal', color: 'green' }
      if (n < 126) return { label: 'Prediabetes', color: 'amber' }
      return { label: 'High', color: 'red' }
    },
  },
  {
    id: 'weight',
    label: 'Weight',
    unit: 'lbs',
    icon: '⚖️',
    type: 'daily',
    badge: 'Weekly',
    placeholder: 'e.g. 185',
    desc: 'Tracking weight over time helps your care team spot trends linked to heart health and metabolic risk. Weigh yourself at the same time each day for consistency.',
    defaultOn: false,
    removable: true,
  },
  {
    id: 'a1c',
    label: 'A1C',
    unit: '%',
    icon: '🧪',
    type: 'periodic',
    badge: 'Quarterly',
    placeholder: 'e.g. 6.5',
    desc: 'A1C reflects your average blood sugar over the past 2–3 months. Unlike daily glucose, it gives your doctor a longer-term picture of how well blood sugar is controlled.',
    defaultOn: false,
    removable: true,
    getStatus: v => {
      const n = parseFloat(v)
      if (isNaN(n)) return null
      if (n < 5.7) return { label: 'Normal', color: 'green' }
      if (n < 6.5) return { label: 'Prediabetes', color: 'amber' }
      return { label: 'Diabetes range', color: 'red' }
    },
  },
  {
    id: 'cycle',
    label: 'Cycle & symptoms',
    shortLabel: 'Cycle',
    icon: '🌸',
    type: 'daily',
    badge: 'Daily',
    placeholder: 'Day 1–28 or symptom note',
    desc: 'Hormonal changes through your cycle and perimenopause can directly affect cholesterol, blood pressure, and blood sugar. Tracking helps connect symptoms to your broader health picture.',
    defaultOn: false,
    removable: true,
    optional: true,
    optionalNote: 'For menstrual cycle and perimenopause tracking',
  },
]

// ─── localStorage helpers ────────────────────────────────────────────────────
function readTileConfig() {
  try {
    const raw = localStorage.getItem('aheadTileConfig')
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return TILE_DEFS.filter(t => t.defaultOn).map(t => t.id)
}

function writeTileConfig(ids) {
  try { localStorage.setItem('aheadTileConfig', JSON.stringify(ids)) } catch (_) {}
}

function readReadings() {
  try {
    const raw = localStorage.getItem('aheadReadings')
    return raw ? JSON.parse(raw) : {}
  } catch (_) { return {} }
}

function writeReading(id, value, date) {
  const all = readReadings()
  all[id] = { value, date: date ? new Date(date).toISOString() : new Date().toISOString() }
  try { localStorage.setItem('aheadReadings', JSON.stringify(all)) } catch (_) {}
  // Also write LDL status to profile so other components can use it
  if (id === 'ldl') {
    try {
      const def = TILE_DEFS.find(t => t.id === 'ldl')
      const status = def?.getStatus?.(value)
      const profile = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
      profile.ldlValue = value
      profile.ldlStatus = status?.label || null
      profile.ldlUpdated = new Date().toISOString()
      localStorage.setItem('cardiometabolicProfile', JSON.stringify(profile))
    } catch (_) {}
  }
}

function readStreak() {
  try {
    const checkins = JSON.parse(localStorage.getItem('cardiometabolicCheckins') || '[]')
    if (!Array.isArray(checkins) || checkins.length === 0) return 0
    const now = new Date()
    const set = new Set()
    for (const c of checkins) {
      if (!c?.date) continue
      const d = new Date(c.date)
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      if (set.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)) streak++
      else if (i > 0) break
    }
    return streak
  } catch (_) { return 0 }
}

function readNextAppointment() {
  try {
    const profile = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return profile.nextAppointment || null
  } catch (_) { return null }
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const appt = new Date(dateStr + 'T12:00')
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const apptDay = new Date(appt.getFullYear(), appt.getMonth(), appt.getDate())
  const diff = Math.round((apptDay - today) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatApptDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T12:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Cycle Log Modal ─────────────────────────────────────────────────────────
const FLOW_OPTIONS = [
  { id: 'none',     label: 'None',     dot: '#CBD5E1' },
  { id: 'spotting', label: 'Spotting', dot: '#FCA5A5' },
  { id: 'light',    label: 'Light',    dot: '#F87171' },
  { id: 'medium',   label: 'Medium',   dot: '#EF4444' },
  { id: 'heavy',    label: 'Heavy',    dot: '#B91C1C' },
]
const ALL_SYMPTOMS = [
  'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood changes',
  'Hot flashes', 'Night sweats', 'Breast tenderness', 'Sleep issues',
  'Brain fog', 'Anxiety', 'Joint pain', 'Nausea', 'Back pain',
  'Spotting', 'Skin changes', 'Low libido', 'Heart palpitations',
]
const PREVIEW_SYMPTOMS = ['Cramps', 'Fatigue', 'Bloating', 'Hot flashes', 'Mood changes']

function buildDateStrip() {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }
  return days
}

function CycleLogModal({ current, onClose, onSave }) {
  const parsed = (() => { try { return JSON.parse(current?.value || '{}') } catch (_) { return {} } })()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [flow, setFlow] = useState(parsed.flow || null)
  const [symptoms, setSymptoms] = useState(new Set(parsed.symptoms || []))
  const [query, setQuery] = useState('')

  const dateStrip = buildDateStrip()
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const suggestions = query.trim().length > 0
    ? ALL_SYMPTOMS.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !symptoms.has(s))
    : []

  function toggleSymptom(s) {
    setSymptoms(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
    setQuery('')
  }

  function save() {
    const value = JSON.stringify({
      flow,
      symptoms: Array.from(symptoms),
    })
    onSave(value, selectedDate)
    onClose()
  }

  const canSave = flow !== null || symptoms.size > 0

  return (
    <div className="reading-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="reading-modal" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="reading-modal__header">
          <div>
            <p className="reading-modal__title">🌸 Cycle & symptoms</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <button className="reading-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Date strip */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' }}>
          {dateStrip.map(d => {
            const isSelected = d.toDateString() === selectedDate.toDateString()
            const isToday = d.toDateString() === new Date().toDateString()
            return (
              <button
                key={d.toDateString()}
                type="button"
                onClick={() => setSelectedDate(d)}
                style={{
                  flex: '0 0 40px', height: 56, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  borderRadius: 12, cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? 'var(--color-teal)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-teal)' : 'var(--color-card)',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 500, color: isSelected ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)' }}>
                  {dayNames[d.getDay()]}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: isSelected ? '#fff' : isToday ? 'var(--color-teal)' : 'var(--color-text)' }}>
                  {d.getDate()}
                </span>
              </button>
            )
          })}
        </div>

        {/* Flow */}
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>Period flow</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {FLOW_OPTIONS.map(f => (
            <button key={f.id} type="button" onClick={() => setFlow(flow === f.id ? null : f.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 5, padding: '9px 4px', borderRadius: 12,
                border: `1.5px solid ${flow === f.id ? 'var(--color-teal)' : 'var(--color-border)'}`,
                background: flow === f.id ? 'rgba(27,58,92,0.07)' : 'var(--color-card)',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: 13, height: 13, borderRadius: '50%', background: f.dot, display: 'block' }} />
              <span style={{ fontSize: 9, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Symptoms */}
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>Symptoms</p>

        {/* Selected pills */}
        {symptoms.size > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {Array.from(symptoms).map(s => (
              <button key={s} type="button" onClick={() => toggleSymptom(s)}
                style={{
                  padding: '5px 10px', borderRadius: 20, fontSize: 12,
                  border: '1.5px solid var(--color-teal)',
                  background: 'rgba(27,58,92,0.08)',
                  color: 'var(--color-teal)', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {s} <span style={{ opacity: 0.6, fontSize: 10 }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Type-ahead input */}
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search symptoms..."
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14,
            border: '1.5px solid var(--color-border)', background: 'var(--color-card)',
            color: 'var(--color-text)', marginBottom: 8, boxSizing: 'border-box',
            outline: 'none',
          }}
        />

        {/* Suggestions from search */}
        {suggestions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {suggestions.map(s => (
              <button key={s} type="button" onClick={() => toggleSymptom(s)}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 13,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-text-secondary)', cursor: 'pointer',
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        )}

        {/* Preview pills when no query */}
        {query.trim().length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {PREVIEW_SYMPTOMS.filter(s => !symptoms.has(s)).map(s => (
              <button key={s} type="button" onClick={() => toggleSymptom(s)}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 13,
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-text-secondary)', cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button className="reading-modal__save" onClick={save} disabled={!canSave}>
          Save →
        </button>
      </div>
    </div>
  )
}

// ─── Log Modal ───────────────────────────────────────────────────────────────
function LogModal({ def, current, onClose, onSave }) {
  const [value, setValue] = useState(current?.value || '')

  if (def.id === 'cycle') {
    return <CycleLogModal current={current} onClose={onClose} onSave={onSave} />
  }

  function save() {
    if (!value.trim()) return
    onSave(value.trim())
    onClose()
  }

  return (
    <div className="reading-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="reading-modal">
        <div className="reading-modal__header">
          <div>
            <p className="reading-modal__title">{def.icon} Log {def.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <button className="reading-modal__close" onClick={onClose}>✕</button>
        </div>
        {def.desc && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
            {def.desc}
          </p>
        )}
        {def.type === 'periodic' && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '-8px 0 12px', lineHeight: 1.4, fontStyle: 'italic' }}>
            This updates {def.badge.toLowerCase()} — we'll keep it on your dashboard until you log a new one.
          </p>
        )}
        <div className="reading-modal__input-wrap">
          <input
            className="reading-modal__input"
            type="text"
            inputMode="decimal"
            placeholder={def.placeholder || 'Enter value'}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            autoFocus
          />
          {def.unit && <span className="reading-modal__unit">{def.unit}</span>}
        </div>
        {current?.value && (
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
            Last logged: {current.value} {def.unit} on {formatDate(current.date)}
          </p>
        )}
        <button className="reading-modal__save" onClick={save} disabled={!value.trim()}>
          Save →
        </button>
      </div>
    </div>
  )
}

// ─── Manage Sheet ────────────────────────────────────────────────────────────
function ManageSheet({ activeIds, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(activeIds))

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function save() {
    // Preserve order: existing active first, then newly added
    const ordered = TILE_DEFS.filter(t => selected.has(t.id)).map(t => t.id)
    onSave(ordered)
    onClose()
  }

  const standard = TILE_DEFS.filter(t => !t.optional)
  const optional = TILE_DEFS.filter(t => t.optional)

  return (
    <div className="reading-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="reading-modal" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="reading-modal__header">
          <p className="reading-modal__title">Customize your dashboard</p>
          <button className="reading-modal__close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
          Choose what you want to track. You can change this anytime.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {standard.map(def => (
            <button
              key={def.id}
              type="button"
              onClick={() => toggle(def.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12,
                border: `1.5px solid ${selected.has(def.id) ? 'var(--color-teal)' : 'var(--color-border)'}`,
                background: selected.has(def.id) ? 'rgba(27,58,92,0.06)' : 'var(--color-card)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <span style={{ fontSize: 20 }}>{def.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{def.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{def.badge}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: selected.has(def.id) ? 'var(--color-teal)' : 'transparent',
                border: `1.5px solid ${selected.has(def.id) ? 'var(--color-teal)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#fff', flexShrink: 0,
              }}>
                {selected.has(def.id) ? '✓' : ''}
              </div>
            </button>
          ))}
        </div>

        {optional.length > 0 && (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Optional
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {optional.map(def => (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => toggle(def.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 12,
                    border: `1.5px solid ${selected.has(def.id) ? 'var(--color-teal)' : 'var(--color-border)'}`,
                    background: selected.has(def.id) ? 'rgba(27,58,92,0.06)' : 'var(--color-card)',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{def.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{def.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>{def.optionalNote || def.badge}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: selected.has(def.id) ? 'var(--color-teal)' : 'transparent',
                    border: `1.5px solid ${selected.has(def.id) ? 'var(--color-teal)' : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: '#fff', flexShrink: 0,
                  }}>
                    {selected.has(def.id) ? '✓' : ''}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <button className="reading-modal__save" onClick={save}>
          Save dashboard →
        </button>
      </div>
    </div>
  )
}

// ─── Individual Tile ─────────────────────────────────────────────────────────
function Tile({ def, reading, streak, appt, onTap }) {
  let value = null
  let sub = null
  let status = null
  let isEmpty = true

  if (def.type === 'computed') {
    value = streak > 0 ? String(streak) : '—'
    sub = streak > 0 ? 'days' : 'Start today'
    isEmpty = streak === 0
  } else if (def.type === 'appointment') {
    const daysLeft = daysUntil(appt?.date)
    if (daysLeft === null || daysLeft < 0) {
      value = '—'
      sub = 'Add in Prepare'
      isEmpty = true
    } else if (daysLeft === 0) {
      value = 'Today'
      sub = 'Good luck'
      isEmpty = false
    } else if (daysLeft === 1) {
      value = 'Tomorrow'
      sub = formatApptDate(appt?.date)
      isEmpty = false
    } else {
      value = `${daysLeft}d`
      sub = formatApptDate(appt?.date)
      isEmpty = false
    }
  } else if (def.id === 'cycle') {
    if (reading?.value) {
      try {
        const parsed = JSON.parse(reading.value)
        value = parsed.flow ? parsed.flow.charAt(0).toUpperCase() + parsed.flow.slice(1) : `${parsed.symptoms?.length || 0} symptoms`
        sub = formatDate(reading.date)
        isEmpty = false
      } catch (_) {
        value = '—'; sub = 'Tap to log'; isEmpty = true
      }
    } else {
      value = '—'; sub = 'Tap to log'; isEmpty = true
    }
  } else {
    if (reading?.value) {
      value = reading.value
      sub = formatDate(reading.date)
      status = def.getStatus?.(reading.value) || null
      isEmpty = false
    } else {
      value = '—'
      sub = 'Tap to log'
      isEmpty = true
    }
  }

  const statusStyle = status ? STATUS[status.color] : null

  return (
    <button
      className="dash-tile"
      onClick={onTap}
      style={{
        borderTop: statusStyle ? `3px solid ${statusStyle.bar}` : '3px solid var(--color-border)',
        background: statusStyle ? statusStyle.bg : 'var(--color-card)',
      }}
    >
      <div className="dash-tile__icon">{def.icon}</div>
      <div className={`dash-tile__value${isEmpty ? ' dash-tile__value--empty' : ''}`}>{value}</div>
      <div className="dash-tile__label">{def.shortLabel || def.label}</div>
      {sub && <div className="dash-tile__sub">{sub}</div>}
      {status && (
        <div className="dash-tile__status" style={{ color: statusStyle.text, background: statusStyle.bg }}>
          {status.label}
        </div>
      )}
      {def.unit && !isEmpty && (
        <div className="dash-tile__unit">{def.unit}</div>
      )}
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DashboardTiles({ tick = 0 }) {
  const [activeIds, setActiveIds] = useState(() => readTileConfig())
  const [readings, setReadings] = useState(() => readReadings())
  const [streak, setStreak] = useState(0)
  const [appt, setAppt] = useState(null)
  const [logTile, setLogTile] = useState(null)   // def of tile being logged
  const [showManage, setShowManage] = useState(false)

  function refresh() {
    setStreak(readStreak())
    setAppt(readNextAppointment() ? { date: readNextAppointment() } : null)
    setReadings(readReadings())
  }

  useEffect(() => { refresh() }, [tick])
  useEffect(() => {
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  function handleSave(tileId, value, date) {
    writeReading(tileId, value, date)
    setReadings(readReadings())
  }

  function handleManageSave(newIds) {
    writeTileConfig(newIds)
    setActiveIds(newIds)
  }

  const activeTiles = activeIds
    .map(id => TILE_DEFS.find(d => d.id === id))
    .filter(Boolean)

  return (
    <>
      <div className="dash-tiles-wrap">
        <div className="dash-tiles">
          {activeTiles.map(def => (
            <Tile
              key={def.id}
              def={def}
              reading={readings[def.id]}
              streak={streak}
              appt={appt}
              onTap={() => {
                if (def.type === 'computed' || def.type === 'appointment') return
                setLogTile(def)
              }}
            />
          ))}
          <button
            className="dash-tile dash-tile--add"
            onClick={() => setShowManage(true)}
            aria-label="Customize dashboard"
          >
            <span className="dash-tile__add-icon">＋</span>
            <span className="dash-tile__add-label">Add tile</span>
          </button>
        </div>
      </div>

      {logTile && (
        <LogModal
          def={logTile}
          current={readings[logTile.id]}
          onClose={() => setLogTile(null)}
          onSave={(value, date) => handleSave(logTile.id, value, date)}
        />
      )}

      {showManage && (
        <ManageSheet
          activeIds={activeIds}
          onClose={() => setShowManage(false)}
          onSave={handleManageSave}
        />
      )}
    </>
  )
}
