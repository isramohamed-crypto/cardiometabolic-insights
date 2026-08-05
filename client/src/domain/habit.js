// ---------------------------------------------------------------------------
// Habit domain model
//
// This defines what a "habit" IS in Vitalist: the ownership lifecycle,
// content, and taxonomy vocabulary. It's a schema/types file, not UI — the
// Collection card (front + detail views) that reads this data is being
// built separately.
//
// Several fields below are marked "open" — they're modeled with a
// reasonable default so the rest of the app has something to build against,
// but should be revisited once the real behaviors sheet exists.
// ---------------------------------------------------------------------------

import { PILLARS_CANONICAL } from './pillars.js'

export const PILLARS = PILLARS_CANONICAL

// --- Ownership state ---------------------------------------------------------
// The lifecycle a habit instance moves through for a given user.
export const OWNERSHIP_STATE = {
  PRE_EXISTING: 'pre_existing', // captured at onboarding ("what's already working"); no content required
  UNADOPTED: 'unadopted', // exists in the catalog, user hasn't acted on it
  TRIALED: 'trialed', // tier one — actively trying it out
  ADOPTED: 'adopted', // past the trial, actively building it
  OWNED: 'owned', // graduated — fully ingrained
  ABANDONED: 'abandoned', // was active, stopped
  READOPTED: 'readopted', // picked back up after abandoning
}

// Allowed transitions, agreed as a linear progression:
// unadopted -> trialed -> adopted -> owned, abandon from any active state,
// readopt re-enters at trialed. Pre-existing has no outgoing edges — it's a
// snapshot from onboarding, not something that currently progresses through
// trial/adoption. (Open: should a user be able to formally "adopt" a
// pre-existing habit later? Not modeled yet — ask if that's needed.)
export const OWNERSHIP_TRANSITIONS = {
  [OWNERSHIP_STATE.PRE_EXISTING]: [],
  [OWNERSHIP_STATE.UNADOPTED]: [OWNERSHIP_STATE.TRIALED],
  [OWNERSHIP_STATE.TRIALED]: [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.ABANDONED],
  [OWNERSHIP_STATE.ADOPTED]: [OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.ABANDONED],
  [OWNERSHIP_STATE.OWNED]: [OWNERSHIP_STATE.ABANDONED],
  [OWNERSHIP_STATE.ABANDONED]: [OWNERSHIP_STATE.READOPTED],
  [OWNERSHIP_STATE.READOPTED]: [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.ABANDONED],
}

export function canTransition(from, to) {
  return OWNERSHIP_TRANSITIONS[from]?.includes(to) ?? false
}

// States eligible for daily done/to-do logging. Pre-existing, unadopted,
// and abandoned are not "active."
export const ACTIVE_OWNERSHIP_STATES = [
  OWNERSHIP_STATE.TRIALED,
  OWNERSHIP_STATE.ADOPTED,
  OWNERSHIP_STATE.OWNED,
  OWNERSHIP_STATE.READOPTED,
]

export function isActiveState(state) {
  return ACTIVE_OWNERSHIP_STATES.includes(state)
}

// --- Daily logging -----------------------------------------------------------
export const LOG_STATUS = {
  DONE: 'done',
  TO_DO: 'to_do',
}

export const LOG_METHOD = {
  PASSIVE: 'passive', // auto-tracked (e.g. step count from a sensor/integration)
  MANUAL: 'manual', // user marks it done themselves
}

/**
 * @typedef {Object} HabitLogEntry
 * @property {string} date - ISO date
 * @property {'done'|'to_do'} status
 * @property {'passive'|'manual'} method
 */

// --- Content ------------------------------------------------------------------
// Active (non pre-existing) habits carry up to 4 kinds of content, each
// attributed to a People Inc. publisher (Health, Verywell Mind, etc.) — the
// same brand family shown in the onboarding landing page ticker.
export const CONTENT_TYPE = {
  JUSTIFICATION: 'justification', // why this habit matters
  ENABLING: 'enabling', // supporting/how-to content
  REINFORCEMENT_DRIP: 'reinforcement_drip', // one surfaced per day, from a pool
  COMPANION: 'companion', // something to play/read during the habit itself (see HabitDetail's "While you ___")
}

/**
 * @typedef {Object} ContentItem
 * @property {string} id
 * @property {'justification'|'enabling'|'reinforcement_drip'|'companion'} type
 * @property {string} brand - attributed publisher, e.g. "Health", "Verywell Mind"
 * @property {string} title
 * @property {string} [url]
 */

// --- Grain / taxonomy -----------------------------------------------------------
// Coarse and fine versions of the same habit live in one taxonomy, as
// parent (coarse) and child (fine) nodes of the same action family. A
// claimability flag (from the eventual behaviors sheet) marks which nodes
// can be claimed directly at intake vs. only ever offered by the
// recommender.
export const GRAIN = {
  COARSE: 'coarse', // claimable at intake, banks into Collection as-is (e.g. onboarding's "Eating more vegetables")
  FINE: 'fine', // precise adoption version the recommender offers (e.g. "Add 1 cup leafy greens to lunch, daily")
}

// --- Tier -----------------------------------------------------------------------
// Tier is per-habit, not per ownership-state: it describes how ambitious a
// specific version of a habit is (tier 1 = "5-minute walk", tier 2 =
// "30-minute walk"), independent of whether that habit is trialed / adopted
// / owned. The version a user starts trialing is always tier 1 for that
// habit. (Open: exact tier ceiling per habit depends on the behaviors
// sheet — not enumerated here yet.)

// --- Habit shape ------------------------------------------------------------------
/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string[]} pillarIds - one or more ids from PILLARS_CANONICAL; a habit can span pillars
 * @property {string} actionFamily - sub-descriptor within a pillar, e.g. "cardio" under Moving (open: full taxonomy TBD)
 * @property {'coarse'|'fine'} grain
 * @property {string} [parentId] - the coarse habit this fine habit belongs to, when grain === 'fine'
 * @property {boolean} claimable - can be claimed directly at intake without the recommender
 * @property {string} ownershipState - one of OWNERSHIP_STATE
 * @property {number} [tier] - which version of the habit this is (1 = the trial version)
 * @property {string} [associatedMoment] - optional habit-stacking anchor, e.g. "after brushing teeth"
 * @property {boolean} saved - bookmarked for later, independent of ownershipState
 * @property {boolean} coachAccess - whether a coach has visibility/access to this habit (meaning open — confirm intent)
 * @property {ContentItem[]} content - empty for pre-existing habits
 * @property {HabitLogEntry[]} [log]
 */

export const HABIT_SHAPE_NOTES = `
See the Habit typedef above for the full field list. Open questions to
confirm before this is load-bearing:
  - actionFamily taxonomy per pillar (what the sub-families actually are)
  - coachAccess: boolean visibility flag, or a reference to a specific coach?
  - saved: is this a distinct "wishlist" state from unadopted, or the same thing?
  - associatedMoment: free text, an enum of day-parts, or a reference to another habitId (stacking)?
`
