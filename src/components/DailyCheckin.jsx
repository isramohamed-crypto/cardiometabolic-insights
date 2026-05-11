import React, { useMemo } from 'react'

const CHECKIN_KEY = 'skinsightsLastCheckin'

function readLastCheckin() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || 'null') } catch (_) { return null }
}

function daysAgo(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate); const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.round((a - b) / (1000 * 60 * 60 * 24))
}

// Title text used by the entry card. Matches the Track-page check-in banner
// so the user sees the same prompt on either screen.
function checkinPromptTitle(isoDate, isCheckedInToday) {
  if (isCheckedInToday) return 'Logged today — tap to view or update'
  const d = daysAgo(isoDate)
  if (d === null) return 'Start your first skin check-in'
  if (d === 1)    return 'Log today\'s check-in'
  return `Log today's check-in — it's been ${d} days`
}

/**
 * Entry card for the Skin check-in. Owns no sheet state itself — the sheet
 * is mounted at App level so it can be opened from anywhere (e.g. Track page).
 * The `tick` prop is bumped by the parent after a check-in completes so this
 * card re-reads the latest record.
 */
export default function DailyCheckin({ onOpen, tick = 0 }) {
  const last = useMemo(() => readLastCheckin(), [tick])
  const isCheckedInToday = daysAgo(last?.date) === 0
  // Copy mirrors the Track-page check-in banner so it tells the same story
  const titleLabel = checkinPromptTitle(last?.date, isCheckedInToday)
  const subLabel = isCheckedInToday
    ? 'Your trend is up to date. Tap to see today\'s summary.'
    : 'Adds to your trend, triggers, and pattern detection.'

  return (
    <div
      className={`daily-checkin${isCheckedInToday ? ' daily-checkin--done' : ''}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen?.() }}
    >
      <div className="daily-checkin__icon">{isCheckedInToday ? '✓' : '📋'}</div>
      <div className="daily-checkin__body">
        <p className="daily-checkin__title">{titleLabel}</p>
        <p className="daily-checkin__sub">{subLabel}</p>
      </div>
      <div className="daily-checkin__arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  )
}
