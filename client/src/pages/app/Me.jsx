import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS, NONE_OPTION } from '../onboarding/pillars.js'
import './page.css'

function Me() {
  const { answers } = useOnboarding()
  const habitsWorking = answers.habitsWorking || {}

  return (
    <div className="page">
      <p className="page__lead">
        {answers.name ? `${answers.name}'s profile.` : 'Your profile.'}
      </p>

      <section>
        <h2>Your foundation</h2>
        <ul className="page__list">
          {PILLARS.map((pillar) => {
            const ids = (habitsWorking[pillar.id] || []).filter(
              (id) => id !== NONE_OPTION.id,
            )
            const labels = pillar.options
              .filter((option) => ids.includes(option.id))
              .map((option) => option.label)

            return (
              <li key={pillar.id}>
                <p className="page__list-title">{pillar.label}</p>
                <p className="page__list-meta">
                  {labels.length > 0 ? labels.join(' · ') : 'Nothing marked yet'}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default Me
