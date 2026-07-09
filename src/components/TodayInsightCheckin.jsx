import React, { useMemo } from 'react'
import { useProfileStage } from '../context/ProfileStageContext'
import { generateHistoricCheckins } from '../data/mockCheckins'

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

function checkinPromptTitle(isoDate, isCheckedInToday) {
  if (isCheckedInToday) return 'Logged today — tap to view or update'
  const d = daysAgo(isoDate)
  if (d === null) return 'Log your first check-in!'
  if (d === 1)    return 'Log today\'s check-in'
  return `Log today's check-in — it's been ${d} days`
}

/**
 * Combines "Today's insight" and the daily check-in entry point into one
 * unit on the Today feed.
 *
 * - New users: the insight card has no real content yet (it's just a locked
 *   placeholder), so it's folded entirely into the check-in card as a small
 *   pill — one compact card total, and its CTA opens the check-in sheet.
 * - Established users: the insight is the actual payoff of their tracking
 *   history (title, narrative, 3-stat breakdown) and deserves to stay full
 *   size, so it keeps its own section — just consolidated into the *same*
 *   card as the check-in entry point, divided rather than duplicated as two
 *   separate cards with their own headers/borders/shadows.
 */
export default function TodayInsightCheckin({ onOpenCheckin, tick = 0 }) {
  const { isNew, isMature } = useProfileStage()
  const last     = useMemo(() => readLastCheckin(), [tick])
  const realCheckins = useMemo(() => readCheckins(), [tick])
  // Established users get the same synthetic history Track uses, merged
  // ahead of any real check-ins, so the streak dots here match the story
  // Track tells instead of showing a blank week for a "mature" user.
  const checkins = useMemo(
    () => (isMature ? [...generateHistoricCheckins(), ...realCheckins] : realCheckins),
    [isMature, realCheckins]
  )
  const isCheckedInToday = daysAgo(last?.date) === 0
  const streak = useMemo(() => lastSevenDaysStreak(checkins), [checkins])
  const loggedCount = streak.filter(Boolean).length

  // Established users with no real check-in yet fall back to the synthetic
  // history's most recent date, so the prompt reads like an ongoing routine
  // rather than "start your first check-in".
  const effectiveLastDate = last?.date || (isMature && checkins.length > 0 ? checkins[checkins.length - 1].date : null)

  // Copy mirrors the Track-page check-in banner so it tells the same story
  const titleLabel = checkinPromptTitle(effectiveLastDate, isCheckedInToday)
  const isNewUser = !effectiveLastDate
  const subLabel = isCheckedInToday
    ? 'Logged today. Tap to see your summary or update.'
    : isNewUser
      ? 'Start tracking how you feel — it only takes a minute.'
      : 'Your symptoms and habits connect to your numbers — log both to see the full picture.'

  const eyebrowText = isCheckedInToday ? 'Checked in today' : 'Daily check-in'
  const ctaText = isCheckedInToday ? 'View today →' : 'Check in →'
  const dayBadge = loggedCount > 0 ? `${loggedCount} days` : 'NEW'

  const checkinBody = (
    <>
      <div className="dc-feat__ribbon">
        <span className="dc-feat__ribbon-label">How are you feeling?</span>
      </div>
      <div className="dc-feat__body">
        <div className="dc-feat__blob" aria-hidden="true" />
        <div className="dc-feat__head">
          <p className="dc-feat__eyebrow">{eyebrowText}</p>
          <h2 className="dc-feat__title">{titleLabel}</h2>
          <p className="dc-feat__sub">{subLabel}</p>
          {isNew && (
            <p className="tic-pill">
              <span className="tic-pill__icon" aria-hidden="true">✨</span>
              AI insights unlock as you log more
            </p>
          )}
        </div>
        <div className="dc-feat__foot">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="dc-feat__dots">
              {streak.map((logged, i) => (
                <span key={i} className={`dc-feat__dot${logged ? ' dc-feat__dot--on' : ''}`} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              {loggedCount} of 7 days logged this week
            </span>
          </div>
          <span className="dc-feat__cta">{ctaText}</span>
        </div>
      </div>
    </>
  )

  if (isNew) {
    return (
      <section className="checkin-section">
        <div
          className="dc-feat"
          onClick={onOpenCheckin}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenCheckin?.() }}
        >
          {checkinBody}
        </div>
      </section>
    )
  }

  return (
    <section className="checkin-section">
      <div className="tic-card">
        <div className="tic-insight">
          <div className="insight-tag">
            <div className="itag-dot" />
            AI insight · From your tracking
          </div>
          <h4 className="insight-title">Stress is showing up in your numbers 48 hrs later</h4>
          <p className="insight-body">
            On days you log high stress, your blood pressure and blood sugar trend
            higher two days later — confirmed across 3 of your last 4 weeks of data.
            Managing stress today is one of the highest-impact moves you can make.
          </p>
          <div className="insight-data">
            <div className="insight-stat">
              <div className="is-val">3/4</div>
              <div className="is-lbl">Weeks confirmed</div>
            </div>
            <div className="insight-stat">
              <div className="is-val">+8pts</div>
              <div className="is-lbl">Avg BP after stress</div>
            </div>
            <div className="insight-stat">
              <div className="is-val">48h</div>
              <div className="is-lbl">Lag time</div>
            </div>
          </div>
          <p className="insight-source">Vitalist AI · Based on your check-in history</p>
        </div>

        <div className="tic-divider" />

        <button type="button" className="tic-checkin" onClick={onOpenCheckin}>
          {checkinBody}
        </button>
      </div>
    </section>
  )
}
