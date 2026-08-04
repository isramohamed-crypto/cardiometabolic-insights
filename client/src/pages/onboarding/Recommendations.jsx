import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { RECOMMENDATIONS_BY_PILLAR, suggestTierIndex } from './recommendedHabits.js'
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
// how much and when.
function Recommendations() {
  const navigate = useNavigate()
  const { answers, setAnswer } = useOnboarding()
  const [stepIndex, setStepIndex] = useState(0)
  const [stage, setStage] = useState('compiling') // 'compiling' | 'pick' | 'customize'
  const [habitIndex, setHabitIndex] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)

  const focusPillarId = answers.focusPillars?.[0]
  const pillar =
    PILLARS_CANONICAL.find((p) => p.id === focusPillarId) || PILLARS_CANONICAL[0]
  const { categoryLabel, gradient, habits } =
    RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating
  const habit = habits[habitIndex]

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
    // Placeholder: no real habit store/backend yet. Once one exists, this
    // is where the chosen habit's ownershipState becomes OWNERSHIP_STATE
    // .TRIALED (tier 1) per domain/habit.js, rather than a plain answer.
    setAnswer('startingHabit', {
      pillarId: pillar.id,
      habitId: habit.id,
      title: habit.title,
      tier: tier.label,
      moment,
      remindersOn,
    })
    navigate('/routine')
  }

  if (stage === 'compiling') {
    return (
      <main className="question-screen">
        <div className="question-screen__header">
          <p className="question-screen__eyebrow">One moment</p>
          <h1 className="question-screen__headline">
            <span>Putting together</span>
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
        suggestedTierIndex={suggestTierIndex(pillar.id, answers, habit.tiers.length)}
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
          <span>Pick a habit</span>
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
