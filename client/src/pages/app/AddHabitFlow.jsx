import { useState } from 'react'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { RECOMMENDATIONS_BY_PILLAR, suggestTierIndex, getHabitVisual } from '../onboarding/recommendedHabits.js'
import HabitPickCard from '../onboarding/HabitPickCard.jsx'
import WhyThisMattersTray from '../onboarding/WhyThisMattersTray.jsx'
import CustomizeHabit from '../onboarding/CustomizeHabit.jsx'
import '../onboarding/QuestionScreen.css'
import './AddHabitFlow.css'

// The "add a habit" version of onboarding's Recommendations — same
// underlying pick-a-habit and customize steps, but rendered in place inside
// Routine/Collection's own page body instead of navigating to a full
// screen. AppLayout's Header and Footer never unmount, so this needs its
// own close (×) affordance rather than relying on a Back button chain.
// Two other differences from onboarding's version: there's no known focus
// pillar to fall back on here (that only exists from the original
// FocusAreas question), so this opens by asking which one to focus on this
// time; and there's no "compiling" loading beat or connect/create-account/
// all-set sequence afterward — those are first-run-only.

// Sentinel id for the "not sure? recommend one for me" option appended to
// the pillar list below — selectable and highlightable just like a real
// pillar, but resolved to an actual pillar id (see recommendPillar) only
// once Continue is pressed, so the rest of the flow never has to know this
// option exists.
const RECOMMEND_ID = 'recommend'

// Simple, demo-appropriate heuristic: recommend whichever pillar has the
// fewest habits already going, so a "recommend one for me" tap nudges
// toward filling a gap rather than piling onto an area that's already
// covered. Ties keep PILLARS_CANONICAL's order.
function recommendPillar(habits) {
  const counts = {}
  PILLARS_CANONICAL.forEach((p) => {
    counts[p.id] = 0
  })
  habits.forEach((h) => {
    if (counts[h.pillarId] != null) counts[h.pillarId] += 1
  })
  return PILLARS_CANONICAL.reduce(
    (fewest, p) => (counts[p.id] < counts[fewest.id] ? p : fewest),
    PILLARS_CANONICAL[0],
  )
}

function AddHabitFlow({ onClose }) {
  const { answers } = useOnboarding()
  const { habits: allHabits, addHabit } = useHabits()
  const [stage, setStage] = useState('choosePillar') // 'choosePillar' | 'pick' | 'customize'
  const [pillarId, setPillarId] = useState(null)
  const [habitIndex, setHabitIndex] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)

  const pillar = PILLARS_CANONICAL.find((p) => p.id === pillarId) || PILLARS_CANONICAL[0]
  const { categoryLabel, habits } =
    RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating
  const habit = habits[habitIndex]
  const gradient = getHabitVisual(pillar.id, habit.id)

  const handleNext = () => setHabitIndex((i) => (i + 1) % habits.length)
  const handlePrev = () => setHabitIndex((i) => (i - 1 + habits.length) % habits.length)

  const handleChoosePillarContinue = () => {
    if (pillarId === RECOMMEND_ID) {
      setPillarId(recommendPillar(allHabits).id)
    }
    setStage('pick')
  }

  const handleFinalize = ({ moment, remindersOn }) => {
    const startingTierIndex = suggestTierIndex(pillar.id, answers, habit.tiers.length)
    addHabit({
      id: habit.id,
      title: habit.title,
      subtitle: habit.subtitle,
      pillarId: pillar.id,
      tier: habit.tiers[startingTierIndex].label,
      moment,
      remindersOn,
    })
    onClose()
  }

  return (
    <div className="add-habit-flow">
      <button
        type="button"
        className="add-habit-flow__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {stage === 'choosePillar' && (
        <>
          <h2 className="add-habit-flow__title">
            Which part of your health do you want to focus on?
          </h2>
          <div className="question-screen__options">
            {PILLARS_CANONICAL.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`question-screen__option${pillarId === p.id ? ' question-screen__option--selected' : ''}`}
                aria-pressed={pillarId === p.id}
                onClick={() => setPillarId(p.id)}
              >
                <span>{p.label}</span>
              </button>
            ))}
            <button
              type="button"
              className={`question-screen__option${pillarId === RECOMMEND_ID ? ' question-screen__option--selected' : ''}`}
              aria-pressed={pillarId === RECOMMEND_ID}
              onClick={() => setPillarId(RECOMMEND_ID)}
            >
              <span aria-hidden="true">✨</span>
              <span>Not sure? Recommend one for me</span>
            </button>
          </div>
          <button
            type="button"
            className="question-screen__continue"
            disabled={!pillarId}
            onClick={handleChoosePillarContinue}
          >
            Continue
          </button>
        </>
      )}

      {stage === 'pick' && (
        <>
          <h2 className="add-habit-flow__title">Pick a habit to start with</h2>
          <p className="question-screen__intro">Built for {pillar.label.toLowerCase()}.</p>

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
        </>
      )}

      {stage === 'customize' && (
        <CustomizeHabit
          habit={habit}
          embedded
          onBack={() => setStage('pick')}
          onSave={handleFinalize}
        />
      )}
    </div>
  )
}

export default AddHabitFlow
