import { Link } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { pickActiveHabits } from '../../domain/profileInsights.js'
import { getHolisticInsights } from '../../domain/holisticInsights.js'
import { useOwnedChecklist } from '../../habits/OwnedChecklistContext.jsx'
import { useFavorites } from '../../content/FavoritesContext.jsx'
import { useReactions } from '../../content/ReactionsContext.jsx'
import SparkleIcon from '../../components/SparkleIcon.jsx'
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
  const { marks } = useOwnedChecklist()
  const { favorites } = useFavorites()
  const { tried } = useReactions()

  // The Today tab's insights react to a single habit just marked; these read
  // across everything at once — what was brought in versus built, how the
  // week actually went, what's oldest. See domain/holisticInsights.js, which
  // omits any line it can't support with real data rather than padding.
  const holistic = getHolisticInsights({
    habits,
    answers,
    marks,
    savedCount: favorites.length,
    triedCount: tried.length,
  })

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

      </div>

      {holistic.length > 0 && (
        <section className="progress-insights">
          <h2 className="progress-insights__eyebrow">
            <span className="progress-insights__sparkle">
              <SparkleIcon />
            </span>
            Insights
          </h2>
          <ul className="progress-insights__list">
            {holistic.map((insight) => (
              <li className="progress-insight" key={insight.id}>
                <p className="progress-insight__lead">{insight.lead}</p>
                <p className="progress-insight__body">{insight.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

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
              Start a habit in <Link to="/today">Today</Link> and this is where
              you'll see how it's actually going.
            </p>
          </div>
        )}
      </section>

      {/* Account-level settings, separate from the "how it's going" habit
          content above — a plain list of rows rather than another card
          grid, since these are one-line destinations/toggles, not data to
          visualize. Connected devices is real (reuses the same
          onboarding.connectedTracker answer ConnectSteps.jsx writes, and
          links back to that same screen to change it) — notifications and
          password reset have no backend yet, so they're shown with the
          same "Coming soon" pill the doctor-summary card above uses,
          rather than as dead taps with no feedback. */}
      <section className="settings-section">
        <h2 className="settings-section__title">Settings</h2>

        <div className="settings-list">
          <Link to="/connect" className="settings-row">
            <div className="settings-row__text">
              <span className="settings-row__label">Connected devices</span>
              <span className="settings-row__value">
                {answers.connectedTracker || 'Not connected'}
              </span>
            </div>
            <span className="settings-row__chevron" aria-hidden="true">
              →
            </span>
          </Link>

          <div className="settings-row settings-row--static">
            <div className="settings-row__text">
              <span className="settings-row__label">Notifications</span>
              <span className="settings-row__value">Reminders and weekly check-ins</span>
            </div>
            <Pill label="Coming soon" />
          </div>

          <div className="settings-row settings-row--static">
            <div className="settings-row__text">
              <span className="settings-row__label">Password &amp; security</span>
              <span className="settings-row__value">Reset your password</span>
            </div>
            <Pill label="Coming soon" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Me
