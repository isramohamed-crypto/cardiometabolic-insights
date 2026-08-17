// One piece of real content to sit under each insight on the Today page.
//
// TITLES — the four externally-supplied links below were sent as URLs only.
// Their publishers block automated fetching, so the display titles here are
// derived from each URL's own slug rather than read off the live page. They
// are almost certainly right, but they have not been verified against the
// article, so treat them as pending a human check. The URLs themselves are
// exactly as supplied and are what a tap actually opens.
//
// Everything not supplied externally is an existing entry from
// domain/habitContent.js — already sourced, already used elsewhere in the
// app — reused here rather than invented.
//
// EatingWell has an article on stretching too
// (eatingwell.com/benefits-of-stretching-11745346). It's kept as a fallback
// rather than a default: EatingWell already fronts a lot of this app's
// content, and the movement pillar has two non-EatingWell options.
const SUPPLIED = {
  walkingAfterEating: {
    id: 'ic-walking-after-eating',
    brand: 'Verywell Health',
    title: 'Walking After Eating',
    url: 'https://www.verywellhealth.com/walking-after-eating-8697719',
  },
  morningStretches: {
    id: 'ic-morning-stretches',
    brand: 'Health',
    title: 'Morning Stretches to Ease Stiff Joints',
    url: 'https://www.health.com/morning-stretches-to-ease-stiff-joints-11948810',
  },
  mindfulness: {
    id: 'ic-mindfulness',
    brand: 'Martha Stewart',
    title: 'Ways to Practice Mindfulness',
    url: 'https://www.marthastewart.com/ways-to-practice-mindfulness-8763903',
  },
  // Fallback only — see the note above.
  stretchingBenefits: {
    id: 'ic-stretching-benefits',
    brand: 'EatingWell',
    title: 'The Benefits of Stretching',
    url: 'https://www.eatingwell.com/benefits-of-stretching-11745346',
  },
}

// Reused from habitContent.js's CONTENT_POOL — same ids, so a piece saved
// from here is the same object as the one saved from the Read tab.
const EXISTING = {
  eatMoreVeg: {
    id: 'ev-1',
    brand: 'Allrecipes',
    title: '5 Easy Steps to Eat More Healthfully',
    url: 'https://www.allrecipes.com/article/5-easy-steps-to-eat-more-healthfully/',
  },
  mealPlanning: {
    id: 'pl-1',
    brand: 'Better Homes & Gardens',
    title: 'Meal Planning Ideas: A Complete Guide',
    url: 'https://www.bhg.com/recipes/healthy/meal-planning-ideas/',
  },
  blackoutCurtains: {
    id: 'cd-1',
    brand: 'Better Homes & Gardens',
    title: 'The 9 Best Blackout Curtains, According to Testing',
    url: 'https://www.bhg.com/best-blackout-curtains-6822097',
  },
  sleepAndMood: {
    id: 'ns-1',
    brand: 'Parents',
    title: 'Sleep-Deprived Parents Aren’t Just Cranky',
    url: 'https://www.parents.com/sleep-deprived-kids-and-parents-aren-t-just-cranky-their-mental-health-is-suffering-11696629',
  },
  socialSupport: {
    id: 'tf-1',
    brand: 'Verywell Mind',
    title: 'The 4 Types of Social Support (and Why They All Matter)',
    url: 'https://www.verywellmind.com/types-of-social-support-3144960',
  },
}

// Most specific wins: an exact `${pillarId}:${optionId}` match first, then
// the pillar's default.
const BY_OPTION = {
  'moving:stretching-yoga': SUPPLIED.morningStretches,
  'moving:daily-walks': SUPPLIED.walkingAfterEating,
  'moving:taking-stairs': SUPPLIED.walkingAfterEating,
  'eating:meal-prepping': EXISTING.mealPlanning,
  'sleep:limiting-screens': EXISTING.sleepAndMood,
  'sleep:wind-down-routine': EXISTING.sleepAndMood,
  'stress:meditation-breathing': SUPPLIED.mindfulness,
}

const BY_PILLAR = {
  eating: EXISTING.eatMoreVeg,
  moving: SUPPLIED.walkingAfterEating,
  sleep: EXISTING.blackoutCurtains,
  stress: SUPPLIED.mindfulness,
  social: EXISTING.socialSupport,
}

// The piece to show under an insight. Returns null when there's nothing
// genuinely relevant — the caller renders no row rather than filling the
// space with something off-topic.
export function getInsightContent(row) {
  if (!row) return null
  return BY_OPTION[row.key] || BY_PILLAR[row.pillarId] || null
}
