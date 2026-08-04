import { useNavigate } from 'react-router-dom'
import heroPhoto from '../assets/onboarding/hero-photo.jpg'
import logoPeople from '../assets/onboarding/logo-people.svg'
import logoHealth from '../assets/onboarding/logo-health.svg'
import logoEatingWell from '../assets/onboarding/logo-eatingwell.svg'
import logoVerywellHealth from '../assets/onboarding/logo-verywellhealth.svg'
import './Onboarding.css'

// Publishers featured in the Figma masthead ticker. The first four have
// exported logo assets; the rest didn't have an asset in the source file,
// so they render as wordmarks until real logos are supplied.
const PUBLISHERS = [
  { name: 'PEOPLE', logo: logoPeople, width: 70 },
  { name: 'Health', logo: logoHealth, width: 90 },
  { name: 'EatingWell', logo: logoEatingWell, width: 80 },
  { name: 'Verywell Health', logo: logoVerywellHealth, width: 120 },
  { name: 'Real Simple' },
  { name: 'Allrecipes' },
  { name: 'Verywell Mind' },
  { name: 'Simply Recipes' },
  { name: 'Southern Living' },
  { name: 'Verywell Fit' },
  { name: 'Parents' },
]

function PublisherLogo({ name, logo, width }) {
  if (logo) {
    return <img src={logo} alt={name} className="onboarding-ticker__logo" style={{ width }} />
  }
  return <span className="onboarding-ticker__wordmark">{name}</span>
}

function Onboarding() {
  const navigate = useNavigate()

  return (
    <main className="onboarding">
      <div className="onboarding__scrim" />
      <img src={heroPhoto} alt="" className="onboarding__photo" />

      <div className="onboarding__content">
        <div className="onboarding-ticker">
          <p className="onboarding-ticker__label">From the editors of</p>
          <div className="onboarding-ticker__track">
            <div className="onboarding-ticker__row" aria-hidden="false">
              {PUBLISHERS.map((pub) => (
                <PublisherLogo key={pub.name} {...pub} />
              ))}
            </div>
            <div className="onboarding-ticker__row" aria-hidden="true">
              {PUBLISHERS.map((pub) => (
                <PublisherLogo key={`${pub.name}-repeat`} {...pub} />
              ))}
            </div>
          </div>
        </div>

        <div className="onboarding__copy">
          <h1 className="onboarding__title">Vitalist</h1>
          <p className="onboarding__subtitle">
            Build healthier habits.
            <br />
            <span className="onboarding__subtitle-accent">Live longer and live well.</span>
          </p>

          <button
            type="button"
            className="onboarding__cta"
            onClick={() => navigate('/onboarding/name')}
          >
            Get started
          </button>
        </div>
      </div>
    </main>
  )
}

export default Onboarding
