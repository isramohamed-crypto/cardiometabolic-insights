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
    id: 'move-more',
    label: 'Move more',
    blurb: 'Get out of the chair for a bit',
    pillarId: 'moving',
    optionKey: 'moving:daily-walks',
    spoken: ['move', 'moving', 'walk', 'walking', 'exercise', 'workout', 'active', 'steps', 'stiff', 'sitting'],
    reply: 'A short one counts as a real one.',
  },
  {
    id: 'stay-connected',
    label: 'Stay connected',
    blurb: 'Reach someone you meant to',
    pillarId: 'social',
    optionKey: 'social:time-with-friends',
    spoken: ['lonely', 'alone', 'friend', 'friends', 'family', 'connect', 'connected', 'isolated', 'talk to someone'],
    reply: 'One message is a whole thing.',
  },
  {
    id: 'drink-water',
    label: 'Drink more water',
    blurb: 'Catch up before the afternoon',
    pillarId: 'eating',
    optionKey: 'eating:drinking-water',
    spoken: ['water', 'hydrate', 'hydrated', 'hydration', 'thirsty', 'headache', 'dehydrated'],
    reply: 'Start with the next glass, not the whole day.',
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

// Typed or spoken input that doesn't match any of the needs above is kept
// as-is rather than being forced into the nearest one — guessing that
// "my back hurts" means "de-stress" would put words in someone's mouth and
// then serve content off that guess. The check-in still records what they
// said; it just asks them to point at the closest need instead of picking
// for them.
export const UNMATCHED_NEED = {
  id: 'unmatched',
  label: 'Something else',
  pillarId: null,
  reply: 'Noted for today.',
}

export function getNeed(id) {
  if (id === UNMATCHED_NEED.id) return UNMATCHED_NEED
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
