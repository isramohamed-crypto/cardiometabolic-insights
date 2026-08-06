import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from './recommendedHabits.js'
import HabitPickCard from './HabitPickCard.jsx'
import WhyThisMattersTray from './WhyThisMattersTray.jsx'
import CustomizeHabit from './CustomizeHabit.jsx'
import './QuestionScreen.css'
import './Recommendations.css'

const COMPILING_STEPS = [
  'Reviewing what’s already working',
  'Factoring in your health profile',
  'Zeroing in on your focus area',
  'Building your personalized plan',
]

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

  const focusPillarId = answers.focusPillars?.[0]
  const pillar =
    PILLARS_CANONICAL.find((p) => p.id === focusPillarId) || PILLARS_CANONICAL[0]
  const { categoryLabel, habits } =
    RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating
  const habit = habits[habitIndex]
  const gradient = getHabitVisual(pillar.id, habit.id)

  useEffect(() => {
    if (stage !== 'compiling') return
    if (stepIndex >= COMPILING_STEPS.length) {
      const timeout = setTimeout(() => setStage('pick'), 500)
      return () => clearTimeout(timeout)
    }
    const timeout = setTimeout(() => setStepIndex((i) => i + 1), 650)
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
        <div className="question-screen__header">
          <p className="question-screen__eyebrow">One moment</p>
          <h1 className="question-screen__headline">
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
                >
                  <span className="recommendations__step-check" aria-hidden="true">
                    {done ? '✓' : ''}
                  </span>
                  {step}
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    )
  }

  if (stage === 'customize') {
    return (
      <CustomizeHabit
        habit={habit}
        onBack={() => setStage('pick')}
        onSave={handleFinalize}
      />
    )
  }

  return (
    <main className="question-screen">
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
    </main>
  )
}

export default Recommendations
