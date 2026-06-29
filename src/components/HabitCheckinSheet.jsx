import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getHabits, readTodayCompletions, toggleHabit, computeStreak, computeHabitStreak, computeTotalCompleted, computePerfectDays, computeComeback, DAILY_MINIMUM } from '../data/habits'

const MILESTONE_STREAKS = [3, 7, 14, 30]

export default function HabitCheckinSheet({ open, onClose, onComplete }) {
  const habits = getHabits()
  const [completions, setCompletions] = useState(() => readTodayCompletions())
  const [celebrating, setCelebrating] = useState(null)
  const [earnedFlash, setEarnedFlash] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const earnedTimerRef = useRef(null)
  const shimmerTimer = useRef(null)

  useEffect(() => {
    if (open) setCompletions(readTodayCompletions())
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  const refresh = useCallback(() => setCompletions(readTodayCompletions()), [])

  function handleToggle(habit) {
    const wasDone = completions.includes(habit.id)
    toggleHabit(habit.id)
    refresh()

    // Full-screen shimmer on every tap
    clearTimeout(shimmerTimer.current)
    setShimmer(false)
    requestAnimationFrame(() => {
      setShimmer(true)
      shimmerTimer.current = setTimeout(() => setShimmer(false), 600)
    })

    if (!wasDone) {
      const newCompletions = [...completions, habit.id]
      const oldDoneCount = completions.filter(id => habits.some(h => h.id === id)).length
      const newDoneCount = newCompletions.filter(id => habits.some(h => h.id === id)).length

      // Just crossed the minimum threshold
      if (oldDoneCount < DAILY_MINIMUM && newDoneCount >= DAILY_MINIMUM) {
        clearTimeout(earnedTimerRef.current)
        setEarnedFlash(true)
        earnedTimerRef.current = setTimeout(() => setEarnedFlash(false), 2600)
      }

      // All done — check for streak milestone
      const allDone = habits.every(h => newCompletions.includes(h.id))
      if (allDone) {
        const streak = computeStreak()
        if (MILESTONE_STREAKS.includes(streak)) {
          setCelebrating(streak)
        }
      }
    }
  }

  const total      = habits.length
  const done       = completions.filter(id => habits.some(h => h.id === id)).length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0
  const allDone    = done === total
  const dayEarned  = done >= DAILY_MINIMUM
  const streak     = computeStreak()
  const isComeback = computeComeback()

  const identity = (() => {
    try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}').identity || '' } catch (_) { return '' }
  })()

  if (!open) return null

  return (
    <div className="hcs-overlay" role="dialog" aria-modal="true" aria-label="Daily habits">
      {shimmer && <div className="habit-shimmer" />}
      <div className="hcs-backdrop" onClick={onClose} />

      <div className="hcs-sheet">
        <div className="hcs-handle" />

        <div className="hcs-header">
          <div>
            <p className="hcs-header__eyebrow">Today's habits</p>
            <h2 className="hcs-header__title">
              {allDone
                ? 'Perfect day 🎉'
                : done >= DAILY_MINIMUM
                  ? `Day earned ✓`
                  : `${done} of ${total} done`}
            </h2>
          </div>
          <button className="hcs-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1L13 13M13 1L1 13"/>
            </svg>
          </button>
        </div>

        <div className="hcs-progress-wrap">
          <div className="hcs-progress-bar">
            <div
              className={`hcs-progress-fill${dayEarned ? ' hcs-progress-fill--earned' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="hcs-progress-label">{pct}%</span>
        </div>

        <div className="hcs-body">
          {/* Stats */}
          <div className="hcs-stats">
            <div className="hcs-stat">
              <span className="hcs-stat__value">{computeTotalCompleted()}</span>
              <span className="hcs-stat__label">Total logged</span>
            </div>
            <div className="hcs-stat">
              <span className="hcs-stat__value">{done}</span>
              <span className="hcs-stat__label">Today</span>
            </div>
            <div className="hcs-stat">
              <span className="hcs-stat__value">{streak}</span>
              <span className="hcs-stat__label">Day streak</span>
            </div>
            <div className="hcs-stat">
              <span className="hcs-stat__value">{computePerfectDays()}</span>
              <span className="hcs-stat__label">Perfect days</span>
            </div>
          </div>

          {/* Comeback banner */}
          {isComeback && (
            <div className="hcs-comeback">
              <span className="hcs-comeback__emoji">💪</span>
              <div className="hcs-comeback__body">
                <div className="hcs-comeback__title">Welcome back — {streak}-day comeback</div>
                <div className="hcs-comeback__sub">You broke your streak and started again. That takes guts.</div>
              </div>
            </div>
          )}

          {/* Day status — key forces re-mount (and re-animation) on state change */}
          <div
            key={allDone ? 'perfect' : dayEarned ? 'earned' : 'pending'}
            className={`hcs-day-status ${dayEarned ? (allDone ? 'hcs-day-status--perfect' : 'hcs-day-status--earned') : 'hcs-day-status--pending'}`}
          >
            <span className="hcs-day-status__icon">{allDone ? '⭐' : dayEarned ? '✓' : '○'}</span>
            <span className="hcs-day-status__label">
              {allDone ? 'Perfect day' : dayEarned ? 'Day earned' : `${DAILY_MINIMUM - done} more to earn today`}
            </span>
          </div>

          {/* Identity reinforcement — only when day is earned */}
          {dayEarned && identity && (
            <div className="hcs-identity">
              <span className="hcs-identity__label">You said you're</span>
              <span className="hcs-identity__statement">"{identity}"</span>
            </div>
          )}

          {/* Flat habit list */}
          <div className="hcs-habit-list">
            {habits.map(habit => {
              const isDone = completions.includes(habit.id)
              return (
                <button
                  key={habit.id}
                  type="button"
                  className={`hcs-habit${isDone ? ' hcs-habit--done' : ''}`}
                  onClick={() => handleToggle(habit)}
                >
                  <div className={`hcs-habit__check${isDone ? ' hcs-habit__check--done' : ''}`}>
                    {isDone && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="hcs-habit__icon">{habit.icon}</span>
                  <div className="hcs-habit__body">
                    <div className="hcs-habit__label">{habit.label}</div>
                    <div className="hcs-habit__desc">{habit.desc}</div>
                  </div>
                  {(() => {
                    const hs = computeHabitStreak(habit.id)
                    if (hs >= 2) return <span className="hcs-habit__streak">🔥 {hs}d</span>
                    return null
                  })()}
                </button>
              )
            })}
          </div>
        </div>

        <div className="hcs-footer">
          <button type="button" className="hcs-done-btn" onClick={() => { onComplete?.(); onClose() }}>
            {allDone ? 'All done — close' : 'Save & close'}
          </button>
        </div>

        {/* Day earned toast */}
        {earnedFlash && (
          <div className="hcs-earned-toast" aria-live="polite">
            <span className="hcs-earned-toast__check">✓</span>
            <span>Day earned!</span>
            {streak > 0 && <span className="hcs-earned-toast__streak">🔥 {streak}d</span>}
          </div>
        )}
      </div>

      {celebrating && (
        <div className="hcs-celebrate" onClick={() => setCelebrating(null)}>
          <div className="hcs-celebrate__card">
            <div className="hcs-celebrate__emoji">🔥</div>
            <div className="hcs-celebrate__streak">{celebrating} days</div>
            <div className="hcs-celebrate__msg">
              {celebrating === 3  && 'Three days running — momentum is building.'}
              {celebrating === 7  && "One week. You're building a real habit."}
              {celebrating === 14 && "Two weeks straight — this is becoming automatic."}
              {celebrating === 30 && "Thirty days. This is who you are now."}
            </div>
            <button className="hcs-celebrate__btn" onClick={() => setCelebrating(null)}>Keep going →</button>
          </div>
        </div>
      )}
    </div>
  )
}
