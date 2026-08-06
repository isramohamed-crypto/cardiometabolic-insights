import { useMemo, useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { ACTIVE_OWNERSHIP_STATES } from '../../domain/habit.js'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from '../onboarding/recommendedHabits.js'
import { WHY_CAROUSEL_CONTENT } from '../onboarding/whyCarouselContent.js'
import HabitPickCard from '../onboarding/HabitPickCard.jsx'
import WhyThisMattersTray from '../onboarding/WhyThisMattersTray.jsx'
import WhyCarousel from '../onboarding/WhyCarousel.jsx'
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
  const { habits: allHabits, addHabit } = useHabits()
  const [stage, setStage] = useState('choosePillar') // 'choosePillar' | 'pick' | 'customize'
  const [pillarId, setPillarId] = useState(null)
  const [habitIndex, setHabitIndex] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)

  const pillar = PILLARS_CANONICAL.find((p) => p.id === pillarId) || PILLARS_CANONICAL[0]
  const { categoryLabel, habits: pillarHabits } =
    RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating

  // Unlike onboarding's Recommendations (which only ever runs before any
  // habit exists, so there's nothing yet to exclude), this flow is reached
  // by someone who may already be trialing or have adopted one of a
  // pillar's own recommended habits — recommending it back to them a
  // second time would just be noise. Abandoned habits are deliberately
  // NOT excluded — that's a real "pick this back up" candidate, not
  // something already covered.
  const activeHabitIds = useMemo(
    () =>
      new Set(
        allHabits
          .filter((h) => ACTIVE_OWNERSHIP_STATES.includes(h.ownershipState))
          .map((h) => h.id),
      ),
    [allHabits],
  )
  const habits = pillarHabits.filter((h) => !activeHabitIds.has(h.id))
  const habit = habits[habitIndex]
  const gradient = habit ? getHabitVisual(pillar.id, habit.id) : null
  // See Recommendations.jsx's identical check — habits with real sourced
  // "why this one" content get the richer WhyCarousel instead of the
  // generic WhyThisMattersTray.
  const carouselContent = habit ? WHY_CAROUSEL_CONTENT[habit.id] : null

  const handleNext = () => setHabitIndex((i) => (i + 1) % habits.length)
  const handlePrev = () => setHabitIndex((i) => (i - 1 + habits.length) % habits.length)

  const handleChoosePillarContinue = () => {
    if (pillarId === RECOMMEND_ID) {
      setPillarId(recommendPillar(allHabits).id)
    }
    // Reset back to the first (remaining) habit for whichever pillar was
    // just chosen — carrying over an index from a previously-viewed pillar
    // could otherwise point past the end of a shorter, already-filtered list.
    setHabitIndex(0)
    setStage('pick')
  }

  const handleFinalize = ({ tier, moment, remindersOn }) => {
    addHabit({
      id: habit.id,
      title: habit.title,
      subtitle: habit.subtitle,
      pillarId: pillar.id,
      tier: tier.label,
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

      {stage === 'pick' && habits.length === 0 && (
        // Every habit this pillar recommends is already trialed/adopted —
        // rather than crash on an empty pick list, send them back to try a
        // different focus area.
        <>
          <h2 className="add-habit-flow__title">You're already on every {pillar.label.toLowerCase()} habit we recommend</h2>
          <p className="question-screen__intro">Try a different focus area instead.</p>
          <button
            type="button"
            className="question-screen__continue"
            onClick={() => setStage('choosePillar')}
          >
            Choose another area
          </button>
        </>
      )}

      {stage === 'pick' && habits.length > 0 && (
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
