import { useNavigate } from 'react-router-dom'
import heroPhoto from '../assets/onboarding/hero-photo.jpg'
import DemoProfileMenu from '../demo/DemoProfileMenu.jsx'
import './Onboarding.css'

// Publishers featured in the masthead ticker — now pointing at their real
// logo files under public/logos/ (the same asset set domain/brandLogos.js
// draws from for content brand labels) instead of the four one-off exports
// under assets/onboarding/ this used to import plus seven bare wordmarks.
// This uses each brand's white fill variant specifically, not the
// color-preferred pick brandLogos.js makes — this ticker sits over a dark
// photo/scrim, where a full-color logo (designed for a white card) would
// read poorly, but every one of these brands does have a white variant.
// Every publisher in the original masthead has a real asset now, so the
// wordmark-text fallback in PublisherLogo is unused today but kept for
// whichever publisher gets added next without one.
const TICKER_LOGOS = {
  PEOPLE: encodeURI('/logos/people/Style=solid, Fill=white.svg'),
  Health: encodeURI('/logos/health/Fill=white.svg'),
  EatingWell: encodeURI('/logos/eating-well/Layout=horiz, Fill=white.svg'),
  'Verywell Health': encodeURI('/logos/verywell-health/Fill=white.svg'),
  'Real Simple': encodeURI('/logos/real-simple/Color=white, Layout=horiz.svg'),
  Allrecipes: encodeURI('/logos/allrecipes/Fill=white.svg'),
  'Verywell Mind': encodeURI('/logos/verywell-mind/Fill=white.svg'),
  'Simply Recipes': encodeURI('/logos/simply-recipes/Fill=white.svg'),
  'Southern Living': encodeURI('/logos/southern-living/Fill=white, Layout=horiz.svg'),
  'Verywell Fit': encodeURI('/logos/verywell-fit/Fill=white.svg'),
  Parents: encodeURI('/logos/parents/Fill=white, Layout=horiz.svg'),
}

const PUBLISHERS = Object.keys(TICKER_LOGOS).map((name) => ({ name }))

// No more per-brand hand-tuned width overrides (the old four entries each
// carried one, sized to match that specific hand-exported asset) — every
// logo here is a real brand file with its own correct aspect ratio, so
// height (set in CSS) plus width: auto scales every one of them
// proportionately without needing a bespoke width per brand.
function PublisherLogo({ name }) {
  const logo = TICKER_LOGOS[name]
  if (logo) {
    return <img src={logo} alt={name} className="onboarding-ticker__logo" />
  }
  return <span className="onboarding-ticker__wordmark">{name}</span>
}

function Onboarding() {
  const navigate = useNavigate()

  return (
    <main className="onboarding">
      <div className="onboarding__scrim" />
      <img src={heroPhoto} alt="" className="onboarding__photo" />
      <div className="onboarding__bottom-scrim" />
      <DemoProfileMenu />

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
