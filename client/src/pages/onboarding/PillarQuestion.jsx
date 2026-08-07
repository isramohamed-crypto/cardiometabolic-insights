import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import {
  PILLARS,
  BODY_COPY,
  FOUNDATION_HEADLINE_LINES,
  SOMETHING_ELSE_OPTION,
  NONE_OF_THESE_OPTION,
  getPillarIndex,
  getPillarEyebrow,
} from './pillars.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

// One ACLM pillar icon per progress-bar segment, in the same order as
// PILLARS — see domain/aclmIcons.js for the source files and the
// licensing caveat on using them at all.
const PROGRESS_ICONS = PILLARS.map((pillar) => getAclmIcon(pillar.id))

// Renders one of the 5 "what's already working" pillar screens
// (eating / moving / sleep / stress / social) based on the :pillar route
// param, and advances to the next pillar (or the placeholder dashboard
// after the last one).
function PillarQuestion() {
  const { pillar: pillarId } = useParams()
  const navigate = useNavigate()
  const { answers, setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  const index = getPillarIndex(pillarId)
  const pillar = PILLARS[index]

  // Route re-renders reuse this component instance across pillars — when
  // the pillar in the URL changes, load any answer already given for it
  // (e.g. after hitting Back) instead of always starting empty.
  useEffect(() => {
    setSelected(answers.habitsWorking?.[pillarId] || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillarId])

  if (!pillar) {
    return null
  }

  const isFirst = index === 0
  const name = answers.name

  const toggleOption = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const handleContinue = () => {
    setAnswer('habitsWorking', {
      ...answers.habitsWorking,
      [pillar.id]: selected,
    })

    const next = PILLARS[index + 1]
    navigate(next ? `/onboarding/habits/${next.id}` : '/onboarding/summary')
  }

  const handleBack = () => {
    // Preserve whatever's selected so far on this pillar before leaving.
    setAnswer('habitsWorking', {
      ...answers.habitsWorking,
      [pillar.id]: selected,
    })

    const prev = PILLARS[index - 1]
    navigate(prev ? `/onboarding/habits/${prev.id}` : '/onboarding/habits-intro')
  }

  // Only the join word right after the em dash gets lowercased, so "Hi
  // {name} — everyone has..." still reads as one flowing sentence — full
  // BODY_COPY.toLowerCase() was lowercasing the whole string, which broke
  // sentence case on the second sentence too ("pick what's..." instead of
  // "Pick what's..."). Only ever hit on the eating screen in practice
  // (pillars.js index 0 = isFirst), since that's the only pillar visited
  // with a name already on hand.
  const body = isFirst && name
    ? `Hi ${name} — ${BODY_COPY.charAt(0).toLowerCase()}${BODY_COPY.slice(1)}`
    : BODY_COPY

  // Always appended after the pillar's own real options — see
  // SOMETHING_ELSE_OPTION/NONE_OF_THESE_OPTION in pillars.js for why
  // there are two instead of reviving the old single "Skip".
  const options = [...pillar.options, SOMETHING_ELSE_OPTION, NONE_OF_THESE_OPTION]

  return (
    <QuestionScreen
      key={pillar.id}
      eyebrow={getPillarEyebrow(pillar.label)}
      step={index + 1}
      totalSteps={PILLARS.length}
      progressIcons={PROGRESS_ICONS}
      headlineLines={FOUNDATION_HEADLINE_LINES}
      body={body}
      options={options}
      selected={selected}
      onToggle={toggleOption}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  )
}

export default PillarQuestion
