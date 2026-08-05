import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import DemoProfileMenu from '../../demo/DemoProfileMenu.jsx'
import './page.css'

// "Your foundation" — the habits brought in at onboarding — used to live
// here as its own list. It's moved to the Collection tab now, merged into
// the "Already yours" list alongside habits graduated from a trial (see
// Collection.jsx) — Collection is where everything you already own lives,
// so foundation habits belong there rather than on this profile screen.
function Me() {
  const { answers } = useOnboarding()

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
    </div>
  )
}

export default Me
