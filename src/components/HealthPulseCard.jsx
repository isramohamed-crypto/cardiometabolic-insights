import React, { useMemo } from 'react'
import './HealthPulseSheet.css'

const STORAGE_KEY = 'cardiometabolicEpro'

function readEproRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch (_) { return [] }
}

// Pulse is "due" if (a) no records yet, or (b) latest record is 6+ days old.
function isPulseDue(records) {
  if (records.length === 0) return true
  const last = records[records.length - 1]
  if (!last?.date) return true
  const days = Math.floor((Date.now() - new Date(last.date).getTime()) / (1000 * 60 * 60 * 24))
  return days >= 6
}

/**
 * Today-screen entry card for the Weekly Health Pulse. Renders only when
 * the pulse is due. Parent (App) owns the sheet open/close state and
 * bumps `tick` after a pulse is logged so this card re-reads.
 */
export default function HealthPulseCard({ onOpen, tick = 0 }) {
  const records = useMemo(() => readEproRecords(), [tick])
  const due = isPulseDue(records)
  if (!due) return null
  const isFirst = records.length === 0

  return (
    <section className="hp-card-wrap">
      <button
        type="button"
        className="hp-card"
        onClick={onOpen}
      >
        <div className="hp-card__icon">📋</div>
        <div className="hp-card__body">
          <div className="hp-card__eyebrow">Weekly Health Pulse · 3 min</div>
          <div className="hp-card__title">
            {isFirst ? 'Take your first Weekly Health Pulse' : "Time for this week's Health Pulse"}
          </div>
          <div className="hp-card__sub">
            Tracks symptoms and life impact. The data builds a clearer picture for your care team between visits.
          </div>
        </div>
        <div className="hp-card__arrow" aria-hidden="true">→</div>
      </button>
    </section>
  )
}
