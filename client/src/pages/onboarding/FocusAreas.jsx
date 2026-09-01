import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import './FocusAreas.css'

// Was a temporary launch restriction limiting this to just "moving" —
// every pillar is a real focus area now. Left as null (rather than
// deleting the guard in selectOption below) so restricting to a subset
// again later, if that's ever needed, is just setting this back to an
// id array — no markup/CSS changes either way, since nothing about how
// an option looks was ever touched.
const ONLY_SELECTABLE_IDS = null

// Each option gets its pillar's real ACLM icon at the left of its label
// (see QuestionScreen.jsx's optional `icon` field, and domain/aclmIcons.js
// for the source files + the licensing caveat on using them at all — same
// asset set PillarQuestion's progress bar already draws on). Computed
// once at module scope since PILLARS_CANONICAL is static.
const FOCUS_OPTIONS = PILLARS_CANONICAL.map((pillar) => ({
  ...pillar,
  icon: getAclmIcon(pillar.id),
}))

// Final onboarding question — which single pillar (category) the user
// wants to focus on first. Single-select on purpose: staying focused on
// one area builds momentum, and more can be added later. Options come
// straight from the canonical pillar list so this stays in sync with
// domain/pillars.js automatically. The "focus-areas" className is just an
// anchor for FocusAreas.css to scope a bigger/brighter Continue button to
// this one screen — see that file for why.
function FocusAreas() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  // Single-select: picking a new option always replaces the current one.
  // See ONLY_SELECTABLE_IDS above — a tap on anything else just no-ops.
  const selectOption = (id) => {
    if (ONLY_SELECTABLE_IDS && !ONLY_SELECTABLE_IDS.includes(id)) return
    setSelected([id])
  }

  const handleBack = () => navigate('/onboarding/health-conditions')

  const handleContinue = () => {
    setAnswer('focusPillars', selected)
    navigate('/onboarding/recommendations')
  }

  return (
    <QuestionScreen
      eyebrow="Your focus"
      headlineLines={['Which area do you', 'want to focus on?']}
      body="Each is a pillar of the American College of Lifestyle Medicine. You can add more later — staying focused on one first helps you build momentum."
      options={FOCUS_OPTIONS}
      selected={selected}
      onToggle={selectOption}
      onContinue={handleContinue}
      onBack={handleBack}
      continueLabel="See my plan"
      multiSelect={false}
      className="focus-areas"
    />
  )
}

export default FocusAreas
