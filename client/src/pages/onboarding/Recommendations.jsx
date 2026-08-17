import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from './recommendedHabits.js'
import { getWhyCarouselContent } from './whyCarouselContent.js'
import { CONTENT_POOL } from '../../domain/habitContent.js'
import HabitPickCard from './HabitPickCard.jsx'
import WhyThisMattersTray from './WhyThisMattersTray.jsx'
import WhyCarousel from './WhyCarousel.jsx'
import HabitSettingsCard from '../../components/HabitSettingsCard.jsx'
import { getHabitWhen } from './recommendedHabits.js'
import './QuestionScreen.css'
import './Recommendations.css'

const COMPILING_STEPS = [
  'Reviewing what’s already working',
  'Factoring in your health profile',
  'Zeroing in on your focus area',
  'Building your personalized plan',
]

// How long the confetti burst plays before the compiling screen starts
// fading, and how long that fade itself takes — kept as named constants
// since both the effect's setTimeout calls and the CSS transition
// duration (recommendations.css's .recommendations__compiling) need to
// agree on the second number.
const CONFETTI_SETTLE_MS = 700
const COMPILING_FADE_MS = 450

const CONFETTI_COUNT = 34
// Reuses the app's existing brand palette (index.css) instead of
// inventing new confetti-only colors.
const CONFETTI_COLORS = [
  'var(--color-leaf)',
  'var(--color-green-apple)',
  'var(--color-mineral-blue)',
  'var(--color-plum)',
  'var(--color-guava)',
  'var(--color-watermelon)',
  'var(--color-tangerine)',
  'var(--color-blueberry)',
]

// One-time random burst, computed once per Recommendations mount (see the
// useState lazy initializer below) rather than on every render — each
// piece flies out at its own angle/distance/rotation/delay so the burst
// reads as an explosion, not a uniform ring.
function makeConfettiPieces() {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 90 + Math.random() * 170
    return {
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance * 0.7 - 30, // flattened + biased upward so the burst reads outward first, before gravity takes over
      rot: Math.random() * 600 - 300,
      delay: Math.random() * 0.12,
    }
  })
}

// Sits between the last onboarding question (FocusAreas) and the app
// itself. Three stages: a brief "compiling" beat, a swipeable card per
// starter habit for the user's chosen pillar (card + tray adapted from
// Figma nodes 1185:4175 and 1214:4722), then a customize step — habits
// stay generic (see recommendedHabits.js), so this is where the user sets
// how much and when. Onboarding-only — adding a habit later from
// Routine/Collection uses AddHabitFlow instead (same underlying pick/
// customize pieces, but embedded in the app's own chrome instead of this
// screen's, and without the "compiling" beat or the connect/create-account/
// all-set sequence that follows a first habit).
function Recommendations() {
  const navigate = useNavigate()
  const { answers } = useOnboarding()
  const { addHabit } = useHabits()
  const [stepIndex, setStepIndex] = useState(0)
  const [stage, setStage] = useState('compiling') // 'compiling' | 'pick' | 'customize'
  const [habitIndex, setHabitIndex] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [compilingExiting, setCompilingExiting] = useState(false)
  const [confettiPieces] = useState(makeConfettiPieces)

  const focusPillarId = answers.focusPillars?.[0]
  const pillar =
    PILLARS_CANONICAL.find((p) => p.id === focusPillarId) || PILLARS_CANONICAL[0]
  const { categoryLabel, habits } =
    RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating
  const habit = habits[habitIndex]
  const gradient = getHabitVisual(pillar.id, habit.id)
  // Habits with real sourced content (either a hand-authored carousel, or
  // one built on the fly from CONTENT_POOL) get the richer full-screen
  // WhyCarousel instead of the generic WhyThisMattersTray — see
  // whyCarouselContent.js.
  const carouselContent = getWhyCarouselContent(habit.id, CONTENT_POOL)

  useEffect(() => {
    if (stage !== 'compiling') return
    if (stepIndex >= COMPILING_STEPS.length) {
      // Every step is done — celebrate with a confetti burst, hold on it
      // for a beat, then fade the whole compiling screen out before
      // handing off to the real pick screen (which fades in on its own —
      // see .recommendations__pick-enter below).
      setShowConfetti(true)
      const fadeTimeout = setTimeout(() => setCompilingExiting(true), CONFETTI_SETTLE_MS)
      const stageTimeout = setTimeout(
        () => setStage('pick'),
        CONFETTI_SETTLE_MS + COMPILING_FADE_MS,
      )
      return () => {
        clearTimeout(fadeTimeout)
        clearTimeout(stageTimeout)
      }
    }
    // Each step holds for its own random duration (0.5-2s) rather than a
    // fixed interval, so the list doesn't read as a mechanical metronome —
    // recomputed per step, not once for the whole sequence.
    const stepDelay = 500 + Math.random() * 1500
    const timeout = setTimeout(() => setStepIndex((i) => i + 1), stepDelay)
    return () => clearTimeout(timeout)
  }, [stage, stepIndex])

  const handleNext = () => setHabitIndex((i) => (i + 1) % habits.length)
  const handlePrev = () => setHabitIndex((i) => (i - 1 + habits.length) % habits.length)

  const handleFinalize = ({ tier, moment, remindersOn }) => {
    // addHabit defaults ownershipState to TRIALED — actively trying it out
    // — per the state machine in domain/habit.js.
    addHabit({
      id: habit.id,
      title: habit.title,
      subtitle: habit.subtitle,
      pillarId: pillar.id,
      tier: tier.label,
      moment,
      remindersOn,
    })
    navigate('/connect')
  }

  if (stage === 'compiling') {
    return (
      <main className="question-screen">
        <div
          className={`recommendations__compiling${compilingExiting ? ' recommendations__compiling--exiting' : ''}`}
        >
          <div className="question-screen__header">
            <p className="question-screen__eyebrow recommendations__rise-in">One moment</p>
            <h1 className="question-screen__headline recommendations__rise-in recommendations__rise-in--1">
              <span>Putting together</span>{' '}
              <span>your plan…</span>
            </h1>
          </div>

          <div className="question-screen__body">
            <ul className="recommendations__steps">
              {COMPILING_STEPS.map((step, i) => {
                const done = i < stepIndex
                const active = i === stepIndex
                return (
                  <li
                    key={step}
                    className={`recommendations__step${done ? ' recommendations__step--done' : ''}${active ? ' recommendations__step--active' : ''}`}
                    style={{ '--stagger': `${150 + i * 90}ms` }}
                  >
                    <span className="recommendations__step-check" aria-hidden="true">
                      {active && <span className="recommendations__step-ring" />}
                      {done ? '✓' : ''}
                    </span>
                    {step}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Fixed to the viewport rather than nested in the fading wrapper
            above, so the burst itself doesn't get cut short by the
            compiling screen's own fade-out. */}
        {showConfetti && (
          <div className="recommendations__confetti" aria-hidden="true">
            {confettiPieces.map((piece) => (
              <span
                key={piece.id}
                className="recommendations__confetti-piece"
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
        )}
      </main>
    )
  }

  if (stage === 'customize') {
    return (
      <HabitSettingsCard
        title={habit.title}
        when={getHabitWhen(habit.id)}
        submitLabel="Add this habit"
        onBack={() => setStage('pick')}
        onSubmit={({ moment, remindersOn }) =>
          handleFinalize({ tier: habit.tiers[0], moment, remindersOn })
        }
      />
    )
  }

  return (
    <main className="question-screen recommendations__pick-enter">
      {/* The pick stage had no way back — every other onboarding screen has
          one, and this is the screen someone is most likely to want to leave
          (to change the focus area that produced these suggestions). */}
      <button
        type="button"
        className="question-screen__back question-screen__back--top"
        onClick={() => navigate('/onboarding/focus')}
      >
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Your plan</p>
        <h1 className="question-screen__headline">
          <span>Pick a habit</span>{' '}
          <span>to start with</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">
          Based on everything you told us, these are built for {pillar.label.toLowerCase()}.
        </p>

        <HabitPickCard
          habit={habit}
          categoryLabel={categoryLabel}
          pillarId={pillar.id}
          gradient={gradient}
          index={habitIndex}
          total={habits.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSelect={setHabitIndex}
          onAdd={() => setStage('customize')}
          onWhyThisOne={() => setTrayOpen(true)}
        />
      </div>

      {carouselContent ? (
        <WhyCarousel
          open={trayOpen}
          content={carouselContent}
          onClose={() => setTrayOpen(false)}
          onAdd={() => {
            setTrayOpen(false)
            setStage('customize')
          }}
          onAnother={() => {
            handleNext()
            setTrayOpen(false)
          }}
        />
      ) : (
        <WhyThisMattersTray
          open={trayOpen}
          habit={habit}
          gradient={gradient}
          onClose={() => setTrayOpen(false)}
          onAdd={() => {
            setTrayOpen(false)
            setStage('customize')
          }}
          onAnother={() => {
            handleNext()
            setTrayOpen(false)
          }}
        />
      )}
    </main>
  )
}

export default Recommendations
