import React, { useMemo } from 'react'

const CHECKIN_KEY  = 'cardiometabolicLastCheckin'
const CHECKINS_KEY = 'cardiometabolicCheckins'

function readLastCheckin() {
  try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || 'null') } catch (_) { return null }
}

function readCheckins() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHECKINS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (_) { return [] }
}

function daysAgo(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate); const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.round((a - b) / (1000 * 60 * 60 * 24))
}

// Returns 7 booleans, oldest first, for the last 7 calendar days (today is index 6).
function lastSevenDaysStreak(checkins) {
  const set = new Set()
  for (const c of checkins) {
    if (!c?.date) continue
    const d = new Date(c.date)
    if (Number.isNaN(d.getTime())) continue
    set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  }
  const now = new Date()
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    result.push(set.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`))
  }
  return result
}

// Title text used by the entry card. Matches the Track-page check-in banner
// so the user sees the same prompt on either screen.
function checkinPromptTitle(isoDate, isCheckedInToday) {
  if (isCheckedInToday) return 'Logged today — tap to view or update'
  const d = daysAgo(isoDate)
  if (d === null) return 'Start your first daily check-in'
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
  const last     = useMemo(() => readLastCheckin(), [tick])
  const checkins = useMemo(() => readCheckins(),    [tick])
  const isCheckedInToday = daysAgo(last?.date) === 0
  const streak = useMemo(() => lastSevenDaysStreak(checkins), [checkins])
  const loggedCount = streak.filter(Boolean).length

  // Copy mirrors the Track-page check-in banner so it tells the same story
  const titleLabel = checkinPromptTitle(last?.date, isCheckedInToday)
  const subLabel = isCheckedInToday
    ? 'Logged today. Tap to see your summary or update.'
    : 'Your symptoms and habits connect to your numbers — log both to see the full picture.'

  const eyebrowText = isCheckedInToday ? 'Checked in today' : 'Daily check-in'
  const ctaText = isCheckedInToday ? 'View today →' : 'Check in →'
  const dayBadge = loggedCount > 0 ? `${loggedCount} days` : 'NEW'

  return (
    <section className="checkin-section">
      <div
        className="dc-feat"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen?.() }}
      >
        {/* Magazine-cover ribbon masthead */}
        <div className="dc-feat__ribbon">
          <span className="dc-feat__ribbon-label">How are you feeling?</span>
          <span className="dc-feat__ribbon-day">{dayBadge}</span>
        </div>

        {/* Body */}
        <div className="dc-feat__body">
          <div className="dc-feat__blob" aria-hidden="true" />
          <div className="dc-feat__head">
            <p className="dc-feat__eyebrow">{eyebrowText}</p>
            <h2 className="dc-feat__title">{titleLabel}</h2>
            <p className="dc-feat__sub">{subLabel}</p>
          </div>
          <div className="dc-feat__foot">
            <div className="dc-feat__dots" aria-label={`${loggedCount} of 7 days logged this week`}>
              {streak.map((logged, i) => (
                <span key={i} className={`dc-feat__dot${logged ? ' dc-feat__dot--on' : ''}`} />
              ))}
            </div>
            <span className="dc-feat__cta">{ctaText}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
