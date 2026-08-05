import { Link } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { pickActiveHabits } from '../../domain/profileInsights.js'
import DemoProfileMenu from '../../demo/DemoProfileMenu.jsx'
import HabitProgressCard from './HabitProgressCard.jsx'
import Pill from '../../components/Pill.jsx'
import './page.css'
import './Me.css'

// "Your foundation" — the habits brought in at onboarding — used to live
// here as its own list. It's moved to the Collection tab now, merged into
// the "Already yours" list alongside habits graduated from a trial (see
// Collection.jsx) — Collection is where everything you already own lives,
// so foundation habits belong there rather than on this profile screen.
function Me() {
  const { answers } = useOnboarding()
  const { habits } = useHabits()

  // Built from a "CONCEPT · DIRECTION ONLY" mockup for a "how it's actually
  // going" section — the pill badge and the doctor-summary card's literal
  // "[SWAP: concept — the bridge to the doctor]" body text were the
  // designer's own notes-to-self, not real UI copy, so neither is carried
  // over verbatim: the badge is dropped (Me's own nav context already says
  // where we are) and that card ships as a real "Coming soon" teaser
  // instead of the bracketed placeholder.
  //
  // One card per active habit, not just one overall — a fresh profile with
  // a single habit just gets a single card; once a second slot's graduated
  // (typically a few weeks in — see profiles.js's '3-weeks-in' persona)
  // each habit gets its own tracker instead of only the oldest one.
  const activeHabits = pickActiveHabits(habits)

  return (
    <div className="page">
      <div className="page__title-row">
        <p className="page__lead">
          {answers.name ? `${answers.name}'s profile.` : 'Your profile.'}
        </p>

        {/* Same demo-only kebab shortcut as the onboarding landing page
            (see DemoProfileMenu.jsx) — switching profiles from inside the
            app itself, not just before it, since Me is the one screen
            that's "about" the current profile. `inline` keeps it sitting
            next to the title instead of floating in the corner. */}
        <DemoProfileMenu inline />
      </div>

      <section className="progress-section">
        <h1 className="progress-section__title">
          How it's <span className="progress-section__accent">actually</span> going.
        </h1>

        {activeHabits.length > 0 ? (
          <>
            {activeHabits.map((habit) => (
              <HabitProgressCard key={habit.id} habit={habit} />
            ))}

            <div className="doctor-summary-card">
              <div className="doctor-summary-card__header">
                <h3 className="doctor-summary-card__title">Your doctor summary</h3>
                <Pill label="Coming soon" />
              </div>
              <p className="doctor-summary-card__body">
                A one-page recap of what you've been doing, for your next visit.
              </p>
            </div>
          </>
        ) : (
          // Blank state: no habit has ever been active enough to feature
          // (a brand-new profile, or one where everything's been let go).
          // Same dashed-frame treatment HabitProgressCard uses for "not
          // enough history yet," since this is the more extreme version of
          // that same idea — there's no grid to even half-draw yet.
          <div className="progress-card progress-card--getting-started">
            <p className="progress-card__empty-title">Nothing to show yet</p>
            <p className="progress-card__empty-body">
              Start a habit in <Link to="/routine">Routine</Link> and this is where
              you'll see how it's actually going.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Me
