import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { PILLARS, BODY_COPY, NONE_OPTION, getPillarIndex } from './pillars.js'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

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
    setSelected((prev) => {
      if (id === NONE_OPTION.id) {
        // Selecting "still figuring this out" clears everything else;
        // clicking it again just deselects it.
        return prev.includes(id) ? [] : [id]
      }
      // Picking a real option overrides "still figuring this out".
      const withoutNone = prev.filter((item) => item !== NONE_OPTION.id)
      return withoutNone.includes(id)
        ? withoutNone.filter((item) => item !== id)
        : [...withoutNone, id]
    })
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
    navigate(prev ? `/onboarding/habits/${prev.id}` : '/onboarding/name')
  }

  const body = isFirst && name ? `Hi ${name} — ${BODY_COPY.toLowerCase()}` : BODY_COPY

  return (
    <QuestionScreen
      key={pillar.id}
      eyebrow="The list"
      step={index + 1}
      totalSteps={PILLARS.length}
      headlineLines={pillar.headlineLines}
      body={body}
      options={[...pillar.options, NONE_OPTION]}
      selected={selected}
      onToggle={toggleOption}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  )
}

export default PillarQuestion
