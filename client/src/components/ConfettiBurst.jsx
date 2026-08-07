import { useState } from 'react'
import './ConfettiBurst.css'

// Reusable version of the one-off confetti burst first built for
// onboarding's Recommendations "compiling" screen — same physics (each
// piece flies out at its own angle/distance/rotation/delay so the burst
// reads as an explosion rather than a uniform ring, then a cheap
// two-phase CSS "gravity" drop), pulled out here so other celebratory
// moments (HabitTrialPrompt's keep-it/let-it-go, AddHabitFlow's finished
// step) can reuse it instead of re-deriving the same keyframes. Recommendations
// itself keeps its original inline version rather than being migrated to
// this — it was already shipped and verified, not worth the risk of a
// no-op-looking refactor touching it.
//
// `fixed` (default true) pins the burst to the viewport, same as
// Recommendations' original — good for a bigger moment (a whole habit
// just got added). Pass `fixed={false}` to instead absolutely-fill the
// nearest positioned ancestor (e.g. a single card's actions row), which
// combined with that ancestor's own `overflow: hidden` (routine cards
// already clip like this) reads as a small, contained pop instead of a
// screen-wide one.
const DEFAULT_COLORS = [
  'var(--color-leaf)',
  'var(--color-green-apple)',
  'var(--color-mineral-blue)',
  'var(--color-plum)',
  'var(--color-guava)',
  'var(--color-watermelon)',
  'var(--color-tangerine)',
  'var(--color-blueberry)',
]

function makePieces(count, colors, spread) {
  const [minDistance, extraRange] = spread
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = minDistance + Math.random() * extraRange
    return {
      id: i,
      color: colors[i % colors.length],
      tx: Math.cos(angle) * distance,
      // Flattened + biased upward so the burst reads outward first,
      // before gravity (the keyframe's 100% step) takes over.
      ty: Math.sin(angle) * distance * 0.7 - distance * 0.15,
      rot: Math.random() * 600 - 300,
      delay: Math.random() * 0.12,
    }
  })
}

function ConfettiBurst({
  count = 18,
  colors = DEFAULT_COLORS,
  fixed = true,
  small = false,
  spread = [90, 170],
  drop = 260,
  originTop = '50%',
  originLeft = '50%',
}) {
  const [pieces] = useState(() => makePieces(count, colors, spread))

  return (
    <div
      className={`confetti-burst${fixed ? ' confetti-burst--fixed' : ' confetti-burst--contained'}`}
      style={{ '--origin-top': originTop, '--origin-left': originLeft, '--drop': `${drop}px` }}
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`confetti-burst__piece${small ? ' confetti-burst__piece--small' : ''}`}
          style={{
            '--tx': `${piece.tx}px`,
            '--ty': `${piece.ty}px`,
            '--rot': `${piece.rot}deg`,
            '--delay': `${piece.delay}s`,
            background: piece.color,
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiBurst
