import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
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
      <p className="page__lead">
        {answers.name ? `${answers.name}'s profile.` : 'Your profile.'}
      </p>
    </div>
  )
}

export default Me
