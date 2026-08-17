// The daily check-in's answers. Each maps to a pillar, which is what lets the
// response reuse the habit content already in the app rather than needing its
// own copy — see components/CheckInSheet.jsx.
//
// `spoken` is the keyword list the voice path matches a transcript against.
// Deliberately plain words people actually say out loud ("wound up", "knackered")
// rather than the app's own vocabulary, and matching is a simple substring
// test: no interpretation, and anything unmatched falls back to asking them
// to pick, rather than guessing.
export const CHECK_IN_NEEDS = [
  {
    id: 'destress',
    label: 'De-stress',
    blurb: 'Wind down, get out of your head',
    pillarId: 'stress',
    optionKey: 'stress:clears-your-head',
    spoken: ['stress', 'stressed', 'destress', 'de-stress', 'anxious', 'anxiety', 'wound up', 'overwhelmed', 'calm', 'relax', 'unwind'],
    reply: 'Let’s take the pressure down a notch.',
  },
  {
    id: 'eat-better',
    label: 'Eat better',
    blurb: 'Something steadier than what you had planned',
    pillarId: 'eating',
    optionKey: 'eating:more-veggies',
    spoken: ['eat', 'eating', 'food', 'diet', 'meal', 'meals', 'snack', 'cook', 'cooking', 'hungry', 'nutrition'],
    reply: 'One small swap is enough to count.',
  },
  {
    id: 'sleep-on-time',
    label: 'Go to bed on time',
    blurb: 'Get the night started earlier',
    pillarId: 'sleep',
    optionKey: 'sleep:cool-dark-room',
    spoken: ['sleep', 'sleeping', 'bed', 'bedtime', 'tired', 'exhausted', 'knackered', 'insomnia', 'rest', 'early night'],
    reply: 'Earlier tonight beats perfect tonight.',
  },
]

export function getNeed(id) {
  return CHECK_IN_NEEDS.find((need) => need.id === id) || null
}

// Matches a spoken phrase to one of the needs. Returns null when nothing
// matches — the caller asks rather than picking something plausible.
export function matchSpokenNeed(transcript = '') {
  const said = transcript.toLowerCase()
  return (
    CHECK_IN_NEEDS.find((need) => need.spoken.some((word) => said.includes(word))) || null
  )
}
