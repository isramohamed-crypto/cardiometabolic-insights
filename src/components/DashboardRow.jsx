import React, { useState, useEffect } from 'react'

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

function readLastReading() {
  try {
    const raw = localStorage.getItem('cardiometabolicLastReading')
    return raw ? JSON.parse(raw) : null
  } catch (_) { return null }
}

function writeLastReading(reading) {
  try { localStorage.setItem('cardiometabolicLastReading', JSON.stringify(reading)) } catch (_) {}
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

function formatApptDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T12:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Simple modal for logging a health reading
function ReadingModal({ onClose, onSave }) {
  const [type, setType] = useState('ldl')
  const [value, setValue] = useState('')

  const TYPES = [
    { id: 'ldl',      label: 'LDL',        unit: 'mg/dL', placeholder: 'e.g. 110' },
    { id: 'bp',       label: 'Blood pressure', unit: 'mmHg', placeholder: 'e.g. 128/82' },
    { id: 'glucose',  label: 'Blood sugar', unit: 'mg/dL', placeholder: 'e.g. 95' },
    { id: 'weight',   label: 'Weight',      unit: 'lbs',   placeholder: 'e.g. 185' },
  ]
  const selected = TYPES.find(t => t.id === type)

  function save() {
    if (!value.trim()) return
    onSave({ type, label: selected.label, value: value.trim(), unit: selected.unit, date: new Date().toISOString() })
    onClose()
  }

  return (
    <div className="reading-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="reading-modal">
        <div className="reading-modal__header">
          <p className="reading-modal__title">Log a reading</p>
          <button className="reading-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="reading-modal__types">
          {TYPES.map(t => (
            <button
              key={t.id}
              className={`reading-modal__type${type === t.id ? ' reading-modal__type--active' : ''}`}
              onClick={() => { setType(t.id); setValue('') }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="reading-modal__input-wrap">
          <input
            className="reading-modal__input"
            type="text"
            inputMode="decimal"
            placeholder={selected.placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            autoFocus
          />
          <span className="reading-modal__unit">{selected.unit}</span>
        </div>
        <button className="reading-modal__save" onClick={save} disabled={!value.trim()}>
          Save reading →
        </button>
      </div>
    </div>
  )
}

export default function DashboardRow({ tick = 0 }) {
  const [streak, setStreak] = useState(0)
  const [lastReading, setLastReading] = useState(null)
  const [appt, setAppt] = useState(null)
  const [showModal, setShowModal] = useState(false)

  function refresh() {
    setStreak(readStreak())
    setLastReading(readLastReading())
    setAppt(readNextAppointment())
  }

  useEffect(() => { refresh() }, [tick])
  useEffect(() => {
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  function handleSaveReading(reading) {
    writeLastReading(reading)
    setLastReading(reading)
  }

  const daysLeft = daysUntil(appt?.date)
  const apptLabel = daysLeft === null ? '—'
    : daysLeft < 0 ? '—'
    : daysLeft === 0 ? 'Today'
    : daysLeft === 1 ? 'Tomorrow'
    : `${formatApptDate(appt?.date)}`

  const apptEmpty = daysLeft === null || daysLeft < 0

  const apptSub = daysLeft === null ? 'Add in Prepare'
    : daysLeft < 0 ? 'Update in Prepare'
    : daysLeft === 0 ? 'Good luck today'
    : daysLeft === 1 ? 'Tomorrow'
    : `In ${daysLeft} days`


  return (
    <>
      <div className="dashboard-row">
        {/* Stat 1 — Streak */}
        <div className="dash-stat">
          <p className="dash-stat__value">{streak > 0 ? streak : '—'}</p>
          <p className="dash-stat__label">Day streak</p>
          <p className="dash-stat__sub">{streak > 0 ? 'Keep it up' : 'Start today'}</p>
        </div>

        <div className="dash-divider" />

        {/* Stat 2 — Last reading */}
        <div className="dash-stat dash-stat--tap" onClick={() => setShowModal(true)}>
          <p className="dash-stat__value">
            {lastReading ? lastReading.value : '—'}
          </p>
          <p className="dash-stat__label">
            {lastReading ? lastReading.label : 'Log reading'}
          </p>
          <p className="dash-stat__sub">
            {lastReading
              ? `${lastReading.unit} · Tap to update`
              : 'LDL, BP, glucose…'}
          </p>
        </div>

        <div className="dash-divider" />

        {/* Stat 3 — Next appointment */}
        <div className="dash-stat">
          <p className={`dash-stat__value${apptEmpty ? ' dash-stat__value--empty' : ''}`}>{apptLabel}</p>
          <p className="dash-stat__label">Next appt</p>
          <p className="dash-stat__sub">{apptSub}</p>
        </div>
      </div>

      {showModal && (
        <ReadingModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveReading}
        />
      )}
    </>
  )
}
