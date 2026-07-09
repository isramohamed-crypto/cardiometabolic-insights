import React, { useMemo } from 'react'
import { useProfileStage } from '../context/ProfileStageContext'
import { generateHistoricCheckins } from '../data/mockCheckins'

const CHECKIN_KEY  = 'cardiometabolicLastCheckin'
const CHECKINS_KEY = 'cardiometabolicCheckins'

// Number of logged check-ins a new user needs before an AI insight has
// enough data points to be generated.
const INSIGHT_THRESHOLD = 3

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
 * Renders "Today's insight" and the daily check-in entry point on the Today
 * feed.
 *
 * - New users: the insight has no real content yet (it's just a locked
 *   placeholder), so it's folded entirely into the check-in card as a small
 *   pill — one compact card total, and its CTA opens the check-in sheet.
 * - Established users: the insight is the actual payoff of their tracking
 *   history (title, narrative, 3-stat breakdown, a recommended video) and is
 *   substantial enough to stand on its own — so it renders as its own card,
 *   stacked above a separate "How are you feeling?" check-in card, rather
 *   than dividing one card in two.
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
    // Progress toward the first AI insight populates as real check-ins come
    // in — it starts at "log 3 to unlock" and fills in one dot per check-in
    // logged, until there are enough data points for an insight.
    const checkinCount = checkins.length
    const isInsightReady = checkinCount >= INSIGHT_THRESHOLD
    const remaining = Math.max(0, INSIGHT_THRESHOLD - checkinCount)
    const unlockTitle = isInsightReady
      ? "Your first insight is ready — check back after today's check-in"
      : checkinCount === 0
        ? `Log ${INSIGHT_THRESHOLD} check-ins to unlock your first insight`
        : `${checkinCount} of ${INSIGHT_THRESHOLD} check-ins logged — ${remaining} more to go`

    return (
      <section className="checkin-section checkin-section--split">
        <div className={`tic-unlock${isInsightReady ? ' tic-unlock--ready' : ''}`}>
          <p className="ai-eyebrow">
            <span className="ai-eyebrow__icon" aria-hidden="true">✨</span>
            AI Insights
          </p>
          <p className="tic-unlock__title">{unlockTitle}</p>
          {!isInsightReady && (
            <div className="tic-unlock__dots" aria-hidden="true">
              {Array.from({ length: INSIGHT_THRESHOLD }).map((_, i) => (
                <span key={i} className={`tic-unlock__dot${i < checkinCount ? ' tic-unlock__dot--on' : ''}`} />
              ))}
            </div>
          )}
        </div>
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
    <section className="checkin-section checkin-section--split">
      {/* AI insight — its own card, the payoff of the user's tracking history */}
      <div className="tic-card tic-card--standalone">
        <div className="tic-insight">
          <p className="ai-eyebrow">
            <span className="ai-eyebrow__icon" aria-hidden="true">✨</span>
            AI Insights · From your tracking
          </p>
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

          {/* Actionable recommendation tied to the insight */}
          <div style={{
            marginTop: 14,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            overflow: 'hidden',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
              {/* Thumbnail */}
              <div style={{
                width: 80, flexShrink: 0,
                background: 'linear-gradient(135deg, #1e3a5f, #2d6a8f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, paddingLeft: 2,
                }}>▶</div>
              </div>
              {/* Text */}
              <div style={{ padding: '10px 12px', flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2D9B83', marginBottom: 3 }}>
                  5-min video · Stress & BP
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 2 }}>
                  4 ways to lower stress before it hits your numbers
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Verywell Health · 5 min</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How are you feeling? — its own separate check-in card */}
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
