import { useMemo, useRef, useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { ACTIVE_OWNERSHIP_STATES } from '../../domain/habit.js'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from '../onboarding/recommendedHabits.js'
import { getWhyCarouselContent } from '../onboarding/whyCarouselContent.js'
import { CONTENT_POOL } from '../../domain/habitContent.js'
import { prefersReducedMotion } from '../../utils/motion.js'
import HabitPickCard from '../onboarding/HabitPickCard.jsx'
import WhyThisMattersTray from '../onboarding/WhyThisMattersTray.jsx'
import WhyCarousel from '../onboarding/WhyCarousel.jsx'
import CustomizeHabit from '../onboarding/CustomizeHabit.jsx'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import '../onboarding/QuestionScreen.css'
import './AddHabitFlow.css'

// How long the confetti plays before this flow actually closes back out to
// Routine/Collection — onboarding's Recommendations uses the same value
// (CONFETTI_SETTLE_MS) for its own "let the burst settle" beat. This flow
// only gets a pop, not onboarding's full compiling-screen treatment, since
// it's a lighter-weight add from an already-set-up Routine, not a first-run
// moment.
const ADD_HABIT_CELEBRATION_MS = 700

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
// pillar, but resolved (see buildRecommendedMix) only once Continue is
// pressed, so the rest of the flow never has to know this option exists.
const RECOMMEND_ID = 'recommend'

// "Recommend one for me" used to resolve to a single pillar (whichever had
// the fewest habits already going) and hand back that one pillar's normal
// pick list. Now it builds its own cross-pillar list instead — one habit
// from each of the 5 pillars, so a "not sure" tap surfaces the full
// breadth of what's available rather than committing to one area sight
// unseen. Per pillar, picks the first of that pillar's recommended habits
// not already active (same exclusion rule the normal per-pillar pick list
// uses) — a pillar with nothing left to recommend is just skipped rather
// than forcing something already covered back into view.
function buildRecommendedMix(activeHabitIds) {
  return PILLARS_CANONICAL.map((pillar) => {
    const pool = RECOMMENDATIONS_BY_PILLAR[pillar.id]?.habits || []
    const habit = pool.find((h) => !activeHabitIds.has(h.id))
    return habit ? { pillar, habit } : null
  }).filter(Boolean)
}

function AddHabitFlow({ onClose }) {
  const { habits: allHabits, addHabit } = useHabits()
  const [stage, setStage] = useState('choosePillar') // 'choosePillar' | 'pick' | 'customize'
  const [pillarId, setPillarId] = useState(null)
  // Set only when "Not sure? Recommend one for me" was chosen — an array
  // of { pillar, habit } spanning up to all 5 pillars (see
  // buildRecommendedMix) instead of the normal single-pillar pick list.
  // null the rest of the time, including whenever a real pillar is picked
  // directly, so that path's derived values below stay exactly as they
  // were before this existed.
  const [recommendedMix, setRecommendedMix] = useState(null)
  const [habitIndex, setHabitIndex] = useState(0)
  const [trayOpen, setTrayOpen] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  // Save's still clickable underneath the confetti overlay for the brief
  // window before onClose actually unmounts this flow (the overlay itself
  // is pointer-events: none) — this guards against a second click in that
  // window adding the same habit twice.
  const finalizedRef = useRef(false)

  const isMix = Boolean(recommendedMix)

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

  // Single-pillar path (pillarId points at a real pillar): the classic
  // "every remaining habit from this one pillar" list.
  const chosenPillar = PILLARS_CANONICAL.find((p) => p.id === pillarId) || PILLARS_CANONICAL[0]
  const pillarHabits = (RECOMMENDATIONS_BY_PILLAR[chosenPillar.id] || RECOMMENDATIONS_BY_PILLAR.eating)
    .habits.filter((h) => !activeHabitIds.has(h.id))

  // Cross-pillar path (isMix): one entry per pillar instead, already
  // resolved once in handleChoosePillarContinue — pillar/categoryLabel/
  // gradient below track whichever entry is currently in view instead of
  // staying fixed to a single pillar for the whole pick stage.
  const habits = isMix ? recommendedMix.map((entry) => entry.habit) : pillarHabits
  const habit = habits[habitIndex]
  const pillar = isMix ? recommendedMix[habitIndex]?.pillar || chosenPillar : chosenPillar
  const categoryLabel = (RECOMMENDATIONS_BY_PILLAR[pillar.id] || RECOMMENDATIONS_BY_PILLAR.eating)
    .categoryLabel
  const gradient = habit ? getHabitVisual(pillar.id, habit.id) : null
  // See Recommendations.jsx's identical check — habits with real sourced
  // content (hand-authored or built from CONTENT_POOL) get the richer
  // WhyCarousel instead of the generic WhyThisMattersTray.
  const carouselContent = habit ? getWhyCarouselContent(habit.id, CONTENT_POOL) : null

  const handleNext = () => setHabitIndex((i) => (i + 1) % habits.length)
  const handlePrev = () => setHabitIndex((i) => (i - 1 + habits.length) % habits.length)

  const handleChoosePillarContinue = () => {
    setRecommendedMix(pillarId === RECOMMEND_ID ? buildRecommendedMix(activeHabitIds) : null)
    // Reset back to the first (remaining) habit for whichever pillar (or
    // cross-pillar mix) was just chosen — carrying over an index from a
    // previously-viewed list could otherwise point past the end of a
    // shorter, already-filtered one.
    setHabitIndex(0)
    setStage('pick')
  }

  const handleFinalize = ({ tier, moment, remindersOn }) => {
    if (finalizedRef.current) return
    finalizedRef.current = true

    addHabit({
      id: habit.id,
      title: habit.title,
      subtitle: habit.subtitle,
      pillarId: pillar.id,
      tier: tier.label,
      moment,
      remindersOn,
    })

    // Habit's added either way — reduced motion just skips straight to
    // closing instead of holding the flow open for a burst it won't show.
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    setCelebrating(true)
    setTimeout(onClose, ADD_HABIT_CELEBRATION_MS)
  }

  return (
    <div className="add-habit-flow">
      {/* Fixed to the viewport (not the flow's own box) so the burst reads
          as a whole-screen moment, same as onboarding's Recommendations —
          this is a real new habit landing on Routine, not a small in-card
          decision like HabitTrialPrompt's confetti. */}
      {celebrating && <ConfettiBurst count={30} />}

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

      {stage === 'pick' && habits.length === 0 && isMix && (
        // Every pillar's every habit is already trialed/adopted — the
        // cross-pillar mix came up completely empty, not just one pillar's
        // worth. Nowhere left to send them but back to choosePillar (which
        // would show this same outcome for any single pillar too, so it
        // still reads as informative) or straight out of the flow.
        <>
          <h2 className="add-habit-flow__title">You're already on every habit we recommend</h2>
          <p className="question-screen__intro">
            Nice work — there's nothing left to add across any of the 5 areas right now.
          </p>
          <button type="button" className="question-screen__continue" onClick={onClose}>
            Close
          </button>
        </>
      )}

      {stage === 'pick' && habits.length === 0 && !isMix && (
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
          <p className="question-screen__intro">
            {isMix ? 'One idea from each of the 5 areas.' : `Built for ${pillar.label.toLowerCase()}.`}
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
