import { Fragment } from 'react'
import { daysSinceStart } from '../../domain/habitContent.js'
import { buildWeeks, buildTierTrend, weekdayLetters } from '../../domain/profileInsights.js'
import './HabitProgressCard.css'

// Below this many days in, there isn't enough real history yet for
// "consistency" to mean anything — the card still shows (so the layout
// itself doesn't jump/reflow once real data arrives), but in a visibly
// quieter "not yet" state: dashed frame, no trend, different caption.
const GETTING_STARTED_DAYS = 3

// Recent weeks only — see buildWeeks' comment for why this is capped
// rather than showing a habit's entire lifetime.
const MAX_WEEKS_SHOWN = 4

const SPARKLINE_WIDTH = 220
const SPARKLINE_HEIGHT = 40
const SPARKLINE_INSET = 6

// Hand-rolled instead of pulling in a chart library — it's one polyline
// across at most a handful of tier-escalation points (most habits will
// only ever have 2), which doesn't earn a dependency.
function TrendSparkline({ points }) {
  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const usableHeight = SPARKLINE_HEIGHT - SPARKLINE_INSET * 2
  const stepX = points.length > 1 ? SPARKLINE_WIDTH / (points.length - 1) : SPARKLINE_WIDTH

  const path = points
    .map((p, i) => {
      const x = i * stepX
      const y = SPARKLINE_INSET + usableHeight * (1 - (p.value - min) / range)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      className="progress-card__sparkline"
      viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--color-seaweed)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The Me tab's "how it's actually going" card — a multi-week consistency
// grid plus (when there's a real one) a tier-escalation trend, for the
// single habit pickFeaturedHabit chose. See profileInsights.js for the
// data-shaping; this component is just the rendering.
function HabitProgressCard({ habit }) {
  const elapsed = daysSinceStart(habit.startedAt)
  const gettingStarted = elapsed < GETTING_STARTED_DAYS
  const weeks = buildWeeks(habit.startedAt, habit.log, MAX_WEEKS_SHOWN)
  const letters = weekdayLetters(habit.startedAt)
  const trend = gettingStarted ? null : buildTierTrend(habit.tierHistory)

  // "Two weeks" in the concept was specific to that one example — showing
  // a numeral instead scales to however many weeks a real habit has
  // actually run, rather than only reading naturally for exactly two.
  const rangeLabel = weeks.length === 1 ? 'This week' : `${weeks.length} weeks`

  const cardClassName = ['progress-card', gettingStarted && 'progress-card--getting-started']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassName}>
      <div className="progress-card__header">
        <h2 className="progress-card__habit-title">Your {habit.title.toLowerCase()}</h2>
        <span className="progress-card__range">{rangeLabel}</span>
      </div>

      <div
        className="progress-card__grid"
        role="table"
        aria-label={`${weeks.length}-week consistency for ${habit.title}`}
      >
        <span className="progress-card__grid-spacer" aria-hidden="true" />
        {letters.map((letter, i) => (
          <span key={i} className="progress-card__day-letter" aria-hidden="true">
            {letter}
          </span>
        ))}

        {weeks.map((week) => (
          <Fragment key={week.weekNumber}>
            <span className="progress-card__week-label">Week {week.weekNumber}</span>
            {week.days.map((day) => {
              const statusLabel = day.isFuture ? 'upcoming' : day.done ? 'done' : 'not done'
              return (
                <span
                  key={day.dateKey}
                  role="cell"
                  className={[
                    'progress-card__dot',
                    day.done && 'progress-card__dot--done',
                    day.isFuture && 'progress-card__dot--upcoming',
                    day.isToday && 'progress-card__dot--today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={`${day.letter}${day.isToday ? ' (today)' : ''}: ${statusLabel}`}
                />
              )
            })}
          </Fragment>
        ))}
      </div>

      {trend && (
        <div className="progress-card__trend">
          <div className="progress-card__trend-header">
            <span className="progress-card__trend-label">{trend.unit || 'Progress'}</span>
            <span className="progress-card__trend-value">
              {trend.first} → {trend.last}
            </span>
          </div>
          <TrendSparkline points={trend.points} />
        </div>
      )}

      <p className="progress-card__caption">
        {gettingStarted
          ? "A few more days and this is where you'll start seeing your pattern."
          : 'Consistency and improvement — never a score.'}
      </p>
    </div>
  )
}

export default HabitProgressCard
