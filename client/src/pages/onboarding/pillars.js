// The 5 pillars of health that drive the "what's already working" onboarding
// questions. Each pillar gets its own screen (step X of 5) instead of one
// combined list. Ids/labels come from the canonical list in domain/pillars.js
// — this file only adds the onboarding-specific copy (options) on top of
// each one.
//
// Every pillar screen used to have its own headline ("What's already
// working with sleep?" etc.) — replaced with one shared headline
// (FOUNDATION_HEADLINE_LINES below) read off the eyebrow instead ("Your
// Foundation: {pillar label}" — see PillarQuestion.jsx), so there's no
// more per-pillar headlineLines to keep here.
import { PILLARS_CANONICAL } from '../../domain/pillars.js'

const ONBOARDING_COPY = {
  eating: {
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

// Shared across every pillar screen now (see PillarQuestion.jsx) instead
// of each pillar having its own "What's already working with X?" —
// eyebrow now carries which pillar via getPillarEyebrow below, so the
// headline no longer needs to name it too.
export const FOUNDATION_HEADLINE_LINES = ["Let's start with what's already", 'working.']

export function getPillarEyebrow(pillarLabel) {
  return `Your Foundation: ${pillarLabel}`
}

// Used to be a "Skip" escape hatch appended to the bottom of every
// pillar's option list — removed along with every other explicit skip
// affordance in onboarding, so each pillar screen required picking at
// least one real option for a while. Re-added in a different shape (see
// SOMETHING_ELSE_OPTION/NONE_OF_THESE_OPTION below) rather than revived
// as-is, since "Skip" collapsed two different situations (there IS
// something, it's just not listed vs. there's genuinely nothing yet) into
// one option. Summary.jsx/Collection.jsx still import this to filter it
// out of any answer data that predates the change; kept here so those
// imports don't break.
export const NONE_OPTION = { id: 'none', label: 'Skip' }

// Appended to the bottom of every pillar's option list (see
// PillarQuestion.jsx) so there's always a way to say "something's working
// here, just not one of these" without forcing a pick from the fixed
// list, and a separate, explicit way to say "nothing here yet" instead of
// silently picking nothing (QuestionScreen's requireSelection would just
// block Continue in that case, which reads as broken rather than as a
// real answer). Neither corresponds to a real catalog habit or a real
// "brought with you" fact, so both get filtered out the same way
// NONE_OPTION's id already was wherever habitsWorking answers turn into
// on-screen habit rows (Summary.jsx, Collection.jsx's foundationRows) —
// see NON_HABIT_OPTION_IDS below.
export const SOMETHING_ELSE_OPTION = { id: 'something-else', label: 'Something else' }
export const NONE_OF_THESE_OPTION = { id: 'none-of-these', label: 'None of these' }

// Every option id that isn't a real "brought with you" fact — combine
// with .filter((id) => !NON_HABIT_OPTION_IDS.includes(id)) anywhere
// habitsWorking answers get turned into real habit rows.
export const NON_HABIT_OPTION_IDS = [
  NONE_OPTION.id,
  SOMETHING_ELSE_OPTION.id,
  NONE_OF_THESE_OPTION.id,
]

export function getPillarIndex(pillarId) {
  return PILLARS.findIndex((p) => p.id === pillarId)
}
