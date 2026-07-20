// Synthetic check-in history for the "established user" demo stage.
//
// Real check-ins (from SkinCheckinSheet) are never touched by this file —
// components that want a lived-in-looking history for a mature user merge
// this generated array with whatever real check-ins exist, the same
// non-destructive "effective data" pattern used elsewhere for the mature
// stage (see DashboardTiles' MATURE_SAMPLE_READINGS).
//
// Shape matches what SkinCheckinSheet.finish() writes, so every existing
// consumer (TrackPage triggers/mood-trend/recent-check-ins, the Today
// check-in streak dots) can read it without special-casing.

// Context labels, taken from SkinCheckinSheet's DAY_CONTEXT — kept as exact
// string matches so "What's been going on" trigger counting picks them up.
const CONTEXT_STRESSFUL = 'Stressful day'
const CONTEXT_ROUGH_NIGHT = 'Rough night'
const CONTEXT_NORMAL = 'Normal day'
const CONTEXT_OTHER = ['Ate off plan', 'Exercised today', 'Missed a dose', 'Got lab results']

// Physical symptom indices — index 0 is "Feeling fine", matching
// SkinCheckinSheet's PHYSICAL_SYMPTOMS / TrackPage's SYMPTOM_LABELS order.
const SYMPTOM_FATIGUE = 1
const SYMPTOM_HEADACHE = 2
const SYMPTOM_OTHER = [3, 4, 5, 6, 7, 8]

// Tiny seeded PRNG (mulberry32) so the generated history is stable across
// re-renders/components instead of reshuffling on every call.
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DAYS_BACK = 56       // 8 weeks of potential history
const INCLUDE_RATE = 0.72  // "most days, not every day"

/**
 * Returns a deterministic array of synthetic check-ins spanning the past
 * ~8 weeks, up to (but not including) today — so a live demo check-in still
 * feels like the "next" entry rather than a duplicate. Roughly 70% of days
 * are filled in, and severity is nudged worse ~2 days after a stressful or
 * poor-sleep day so the existing "stress shows up 48 hrs later" AI insight
 * has real data backing it up instead of being purely aspirational copy.
 */
export function generateHistoricCheckins() {
  const rand = mulberry32(20260101)
  const now = new Date()
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // First pass: decide which days are logged + their context label.
  const days = []
  for (let offset = DAYS_BACK; offset >= 1; offset--) {
    const included = rand() < INCLUDE_RATE
    let contextLabel = null
    if (included) {
      const r = rand()
      if (r < 0.28) contextLabel = CONTEXT_STRESSFUL
      else if (r < 0.42) contextLabel = CONTEXT_ROUGH_NIGHT
      else if (r < 0.58) contextLabel = CONTEXT_NORMAL
      else contextLabel = CONTEXT_OTHER[Math.floor(rand() * CONTEXT_OTHER.length)]
    }
    days.push({ offset, included, contextLabel })
  }

  const checkins = []
  for (let i = 0; i < days.length; i++) {
    const day = days[i]
    if (!day.included) continue

    // Look back ~2 days for a stressful/rough-night trigger to worsen today.
    const laggedTrigger = days.slice(Math.max(0, i - 2), i).some(
      d => d.included && (d.contextLabel === CONTEXT_STRESSFUL || d.contextLabel === CONTEXT_ROUGH_NIGHT)
    )

    let severity = Math.floor(rand() * 3) // baseline: mostly good-to-neutral (0-2)
    if (laggedTrigger && rand() < 0.7) severity = Math.min(4, severity + 1 + Math.floor(rand() * 2))

    let symptoms
    if (severity <= 1) {
      symptoms = rand() < 0.85 ? [0] : [SYMPTOM_OTHER[Math.floor(rand() * SYMPTOM_OTHER.length)]]
    } else {
      const picks = new Set()
      picks.add(rand() < 0.6 ? SYMPTOM_FATIGUE : SYMPTOM_HEADACHE)
      if (rand() < 0.35) picks.add(SYMPTOM_OTHER[Math.floor(rand() * SYMPTOM_OTHER.length)])
      symptoms = Array.from(picks)
    }

    const d = new Date(today0)
    d.setDate(today0.getDate() - day.offset)
    d.setHours(19 + Math.floor(rand() * 3), Math.floor(rand() * 60), 0, 0)

    // New format fields (matches SkinCheckinSheet.finish())
    const stress = Math.min(5, severity + 1) // severity 0-4 → stress 1-5
    const sleep = day.contextLabel === CONTEXT_ROUGH_NIGHT
      ? 'poorly'
      : (rand() < 0.55 ? 'well' : 'okay')
    const movement = day.contextLabel === 'Exercised today'
      ? 'yes'
      : (rand() < 0.4 ? 'yes' : (rand() < 0.55 ? 'a little' : 'not-yet'))

    checkins.push({
      date: d.toISOString(),
      // New format
      stress,
      sleep,
      movement,
      // Old format (backwards compat — TrackPage reads these too)
      severity,
      severityAi: false,
      skinScore: 5 - severity,
      symptoms,
      conditionLabel: 'health',
      conditionAnswers: [],
      contextLabels: day.contextLabel ? [day.contextLabel] : [],
      contextEntries: day.contextLabel ? [{ label: day.contextLabel, detail: null }] : [],
      treatments: [],
      photoAttached: false,
      wearableSynced: rand() < 0.3,
    })
  }

  return checkins
}
