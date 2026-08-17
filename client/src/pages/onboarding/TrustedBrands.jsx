import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { BRAND_LOGOS } from '../../domain/brandLogos.js'
import { PILLARS } from './pillars.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import './TrustedBrands.css'

// Sits between the name question and the first "what's already working"
// pillar question — the slot the gender question used to occupy. The ACLM
// framework cover page that used to follow it is gone too, so this leads
// straight into the questions.
//
// Ordered rather than read straight off BRAND_LOGOS: the first row is the
// three brands most on-point for a health app, so the grid opens with
// recognisable, relevant mastheads instead of alphabetical order's
// Allrecipes/Byrdie. Every brand here has a real logo asset in
// public/logos/ (see domain/brandLogos.js) — nothing is invented, and
// anything added to that file needs adding here too if it should be
// pickable.
const BRAND_ORDER = [
  'Health',
  'EatingWell',
  'Verywell Health',
  'Real Simple',
  'Allrecipes',
  'Food & Wine',
  'Verywell Mind',
  'Parents',
  'Simply Recipes',
  'Byrdie',
  'Martha Stewart',
  'The Spruce',
]

const BRANDS = BRAND_ORDER.filter((brand) => BRAND_LOGOS[brand])

function TrustedBrands() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  const toggle = (brand) =>
    setSelected((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand],
    )

  const handleContinue = () => {
    setAnswer('trustedBrands', selected)
    navigate(`/onboarding/habits/${PILLARS[0].id}`)
  }

  return (
    <QuestionScreen
      className="trusted-brands"
      eyebrow="Made for you"
      headlineLines={['The good part of the', 'internet — made for you.']}
      body="Pick the brands you already trust. We'll pull their best into your day — food, wellness, home, and everything in between."
      // The grid replaces the standard pill options rather than sitting
      // alongside them, so this screen passes none and renders its own.
      options={[]}
      selected={selected}
      onToggle={toggle}
      onContinue={handleContinue}
      onBack={() => navigate('/onboarding/name')}
      continueLabel="Next"
      footer="From People Inc. — the editors behind Health, EatingWell, Real Simple and more."
      extraContent={
        <div className="brand-grid" role="group" aria-label="Brands you trust">
          {BRANDS.map((brand) => {
            const isSelected = selected.includes(brand)
            return (
              <button
                key={brand}
                type="button"
                className={`brand-tile${isSelected ? ' brand-tile--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => toggle(brand)}
              >
                <img className="brand-tile__logo" src={BRAND_LOGOS[brand]} alt={brand} />
                {isSelected && (
                  <span className="brand-tile__check">
                    <CheckIcon checked />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      }
    />
  )
}

export default TrustedBrands
