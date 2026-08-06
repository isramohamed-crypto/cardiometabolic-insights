// The 5 pillars of health that drive the "what's already working" onboarding
// questions. Each pillar gets its own screen (step X of 5) instead of one
// combined list. Ids/labels come from the canonical list in domain/pillars.js
// — this file only adds the onboarding-specific copy (headline + options)
// on top of each one.
//
// headlineLines' second line generally follows a "working with X?" pattern,
// but 'moving' and 'social' break from it on purpose — "working with
// movement?" and "working with connection?" are long enough that on common
// phone widths (~360-390px) they wrap onto a 3rd line instead of the clean
// 2 every other pillar gets (line 1 alone already fills a whole line at
// this headline's font size, so there's no room left on it to absorb the
// overflow from a long line 2). "working out?" / "staying connected?" are
// short enough to reliably fit as one line instead.
import { PILLARS_CANONICAL } from '../../domain/pillars.js'

const ONBOARDING_COPY = {
  eating: {
    headlineLines: ['What\'s already', 'working with eating?'],
    options: [
      { id: 'more-veggies', label: 'Eating fruit or vegetables every day' },
      { id: 'cooking-at-home', label: 'Cooking at home' },
      { id: 'meal-prepping', label: 'Meal prepping' },
      { id: 'drinking-water', label: 'Drinking enough water' },
      { id: 'balanced-meals', label: 'Eating balanced meals' },
      { id: 'mindful-eating', label: 'Eating slower, more mindfully' },
    ],
  },
  moving: {
    headlineLines: ['What\'s already', 'working out?'],
    options: [
      { id: 'daily-walks', label: 'Daily walks' },
      { id: 'strength-training', label: 'Strength training' },
      { id: 'stretching-yoga', label: 'Stretching or yoga' },
      { id: 'taking-stairs', label: 'Taking the stairs when I can' },
      { id: 'recreational-sports', label: 'Recreational sports' },
      { id: 'moving-at-work', label: 'Standing or moving during work' },
    ],
  },
  sleep: {
    headlineLines: ['What\'s already', 'working with sleep?'],
    options: [
      { id: 'consistent-bedtime', label: 'A consistent bedtime' },
      { id: 'enough-hours', label: 'Getting 7+ hours a night' },
      { id: 'wind-down-routine', label: 'A wind-down routine' },
      { id: 'limiting-screens', label: 'Limiting screens before bed' },
      { id: 'sleep-environment', label: 'A comfortable sleep environment' },
      { id: 'cool-dark-room', label: 'A cool, dark room for sleep' },
    ],
  },
  stress: {
    headlineLines: ['What\'s already', 'working with stress?'],
    options: [
      { id: 'meditation-breathing', label: 'Meditation or breathing exercises' },
      { id: 'journaling', label: 'Journaling' },
      { id: 'time-in-nature', label: 'Time in nature' },
      { id: 'taking-breaks', label: 'Taking breaks during the day' },
      { id: 'talking-it-out', label: 'Talking it out with someone' },
      { id: 'clears-your-head', label: 'Something that clears your head — music, a walk, quiet' },
    ],
  },
  social: {
    headlineLines: ['What\'s already', 'staying connected?'],
    options: [
      { id: 'time-with-friends', label: 'Regular time with friends or family' },
      { id: 'community-groups', label: 'Community or group activities' },
      { id: 'staying-in-touch', label: 'Staying in touch remotely' },
      { id: 'volunteering', label: 'Volunteering' },
      { id: 'quality-time', label: 'Quality time with a partner or family' },
    ],
  },
}

export const PILLARS = PILLARS_CANONICAL.map((pillar) => ({
  ...pillar,
  ...ONBOARDING_COPY[pillar.id],
}))

export const BODY_COPY = "Everyone has habits that stick. Pick what's already on yours."

// Polite escape hatch appended to the bottom of every pillar's option list,
// for when none of the real options apply yet.
export const NONE_OPTION = { id: 'none', label: 'Still figuring this out' }

export function getPillarIndex(pillarId) {
  return PILLARS.findIndex((p) => p.id === pillarId)
}
