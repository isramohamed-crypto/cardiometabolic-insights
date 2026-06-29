import React, { useState, useCallback, useRef } from 'react'
import { getHabits, readTodayCompletions, toggleHabit, computeStreak, computeHabitStreak, computeComeback, DAILY_MINIMUM } from '../data/habits'
import './HabitSection.css'

function ProgressRing({ pct, fillColor, trackColor, size = 52, stroke = 4, children }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={fillColor} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .4s ease, stroke .3s ease' }}
        />
      </svg>
      {children && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          lineHeight: 1
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function HabitSection({ onOpenSheet }) {
  const [completions, setCompletions] = useState(() => readTodayCompletions())
  const [shimmer, setShimmer] = useState(false)
  const [badgeKey, setBadgeKey] = useState(0)
  const shimmerTimer = useRef(null)
  const habits     = getHabits()
  const streak     = computeStreak()
  const isComeback = computeComeback()

  const identity = (() => {
    try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}').identity || '' } catch (_) { return '' }
  })()

  const refresh = useCallback(() => setCompletions(readTodayCompletions()), [])

  const total     = habits.length
  const done      = completions.filter(id => habits.some(h => h.id === id)).length
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0
  const isPerfect = done === total && total > 0
  const dayEarned = done >= DAILY_MINIMUM

  // Phase 1 (not earned): fill toward minimum
  // Phase 2 (just earned, done === min): hold at 100%
  // Phase 3 (bonus, done > min): track toward perfect day
  const ringPct = !dayEarned
    ? Math.round((done / DAILY_MINIMUM) * 100)
    : done === DAILY_MINIMUM || total <= DAILY_MINIMUM
      ? 100
      : Math.round(((done - DAILY_MINIMUM) / (total - DAILY_MINIMUM)) * 100) || 100

  // Color changes when switching to bonus-progress mode
  const ringFill  = !dayEarned
    ? 'rgba(255,255,255,0.9)'
    : isPerfect
      ? 'rgba(255,215,0,1)'
      : 'rgba(255,200,50,0.9)'
  const ringTrack = !dayEarned
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(255,255,255,0.15)'

  // Emoji shown inside the ring once earned
  const ringEmoji = isPerfect ? '⭐' : isComeback ? '💪' : '🔥'

  function handleToggle(habitId) {
    const wasDone = completions.includes(habitId)
    const oldDone = completions.filter(id => habits.some(h => h.id === id)).length

    toggleHabit(habitId)
    refresh()

    // Full-screen shimmer on every tap
    clearTimeout(shimmerTimer.current)
    setShimmer(false)
    requestAnimationFrame(() => {
      setShimmer(true)
      shimmerTimer.current = setTimeout(() => setShimmer(false), 600)
    })

    // Badge pop when crossing the minimum (checking only)
    if (!wasDone) {
      const newDone = oldDone + 1
      if (oldDone < DAILY_MINIMUM && newDone >= DAILY_MINIMUM) {
        setBadgeKey(k => k + 1)
      }
    }
  }

  return (
    <section className="habit-section">
      {shimmer && <div className="habit-shimmer" />}

      <div className="habit-section__head">
        <div>
          <p className="habit-section__eyebrow">Daily habits</p>
          <h2 className="habit-section__title">Today's habits</h2>
        </div>
        {/* External badges only when NOT yet earned */}
        {!dayEarned && (
          <div className="habit-section__badges">
            {isComeback && (
              <div className="habit-badge habit-badge--comeback">
                <span>💪</span><span>Comeback</span>
              </div>
            )}
            {streak > 0 && (
              <div className="habit-badge habit-badge--streak">
                <span>🔥</span><span>{streak}d</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress summary */}
      <div className={`habit-summary${dayEarned ? ' habit-summary--earned' : ''}`} onClick={() => onOpenSheet?.()}>
        <ProgressRing pct={ringPct} fillColor={ringFill} trackColor={ringTrack}>
          {dayEarned && (
            <div key={badgeKey} className="habit-ring-badge">
              <span className="habit-ring-badge__emoji">{ringEmoji}</span>
              {streak > 0 && <span className="habit-ring-badge__streak">{streak}d</span>}
            </div>
          )}
        </ProgressRing>
        <div className="habit-summary__body">
          <div className="habit-summary__count">
            <span className="habit-summary__done">{done}</span>
            <span className="habit-summary__total"> / {total} done today</span>
          </div>
          <div className="habit-summary__sub">
            {isPerfect
              ? '🎉 Perfect day!'
              : dayEarned && identity
                ? `"${identity}"`
                : dayEarned
                  ? `✓ Day counts — ${total - done} more for a perfect day`
                  : done === 0
                    ? `Check off any ${DAILY_MINIMUM} to earn today`
                    : `${DAILY_MINIMUM - done} more to earn today`}
          </div>
        </div>
        <div className="habit-summary__arrow">→</div>
      </div>

      {/* Flat habit list */}
      <div className="habit-list habit-list--card">
        {habits.map(habit => {
          const isDone = completions.includes(habit.id)
          return (
            <button
              key={habit.id}
              type="button"
              className={`habit-item${isDone ? ' habit-item--done' : ''}`}
              onClick={() => handleToggle(habit.id)}
            >
              <div className={`habit-item__check${isDone ? ' habit-item__check--done' : ''}`}>
                {isDone && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="habit-item__icon">{habit.icon}</span>
              <div className="habit-item__body">
                <div className="habit-item__label">{habit.label}</div>
                <div className="habit-item__desc">{habit.desc}</div>
              </div>
              {(() => {
                const hs = computeHabitStreak(habit.id)
                if (hs >= 2) return <span className="habit-item__streak">🔥{hs}</span>
                return null
              })()}
            </button>
          )
        })}
      </div>
    </section>
  )
}
