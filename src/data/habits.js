// ── Condition → habit playbooks ──────────────────────────────────────────────
// Each condition maps to morning + evening habits.
// Conditions match the labels stored in cardiometabolicProfile.condition[].

const PLAYBOOKS = {
  'High blood pressure': {
    morning: [
      { id: 'bp_medication',  icon: '💊', label: 'Take BP medication',        desc: 'Consistency is the single biggest factor in BP control.' },
      { id: 'bp_morning_log', icon: '📊', label: 'Log morning BP reading',     desc: 'Morning readings before activity give the clearest baseline.' },
      { id: 'bp_walk',        icon: '🚶', label: '10-minute walk',             desc: 'Regular aerobic movement lowers systolic BP by 4–9 mmHg.' },
    ],
    evening: [
      { id: 'bp_sodium',      icon: '🧂', label: 'Limit sodium today',         desc: 'Under 1,500 mg/day is the hypertension target.' },
      { id: 'bp_alcohol',     icon: '🍷', label: 'Skip or limit alcohol',      desc: 'Even moderate drinking raises BP over time.' },
      { id: 'bp_wind_down',   icon: '😴', label: 'Wind-down before bed',       desc: 'Cortisol spikes from stress elevate blood pressure.' },
    ],
  },

  'High cholesterol': {
    morning: [
      { id: 'chol_medication',icon: '💊', label: 'Take cholesterol medication', desc: 'Statins work best taken consistently every day.' },
      { id: 'chol_fiber',     icon: '🥣', label: 'Eat a fiber-rich breakfast',  desc: 'Beta-glucan fiber in oats binds LDL in the gut.' },
      { id: 'chol_walk',      icon: '🚶', label: '20-minute walk',              desc: 'Aerobic exercise raises HDL ("good") cholesterol.' },
    ],
    evening: [
      { id: 'chol_sat_fat',   icon: '🥩', label: 'Limit saturated fat at dinner', desc: 'Replacing sat fat with unsaturated fat lowers LDL.' },
      { id: 'chol_log',       icon: '📊', label: 'Log your numbers',            desc: 'Tracking keeps patterns visible between lab visits.' },
      { id: 'chol_omega3',    icon: '🐟', label: 'Take omega-3 supplement',     desc: 'Fish oil reduces triglycerides and supports HDL.' },
    ],
  },

  'Type 2 diabetes': {
    morning: [
      { id: 'dm_bg_check',    icon: '🔬', label: 'Check blood sugar',           desc: 'Fasting readings before food give the cleanest signal.' },
      { id: 'dm_medication',  icon: '💊', label: 'Take diabetes medication',    desc: 'Metformin and GLP-1s depend on consistent timing.' },
      { id: 'dm_breakfast',   icon: '🥚', label: 'Eat a low-GI breakfast',      desc: 'Protein + fiber slow glucose absorption after meals.' },
    ],
    evening: [
      { id: 'dm_bg_evening',  icon: '📊', label: 'Log evening blood sugar',     desc: 'Post-dinner readings show how food affected you today.' },
      { id: 'dm_walk',        icon: '🚶', label: '10-min post-dinner walk',     desc: 'Even a short walk lowers post-meal glucose by ~22%.' },
      { id: 'dm_foot',        icon: '🦶', label: 'Check feet briefly',          desc: 'Daily foot checks catch early signs of neuropathy.' },
    ],
  },

  'Weight / metabolic health': {
    morning: [
      { id: 'wt_weigh',       icon: '⚖️', label: 'Weigh yourself',             desc: 'Daily weigh-ins help you spot trends, not just moments.' },
      { id: 'wt_protein',     icon: '🥚', label: 'Eat a protein-rich breakfast', desc: 'Protein at breakfast reduces hunger hormones all day.' },
      { id: 'wt_walk',        icon: '🚶', label: '15-minute walk',              desc: 'Morning movement primes metabolism for the day.' },
    ],
    evening: [
      { id: 'wt_track',       icon: '📋', label: 'Track your meals',            desc: 'People who log food lose twice as much weight on average.' },
      { id: 'wt_late_eat',    icon: '🌙', label: 'Stop eating 2 hrs before bed', desc: 'Late eating disrupts insulin sensitivity overnight.' },
      { id: 'wt_sleep',       icon: '😴', label: 'Aim for 7–8 hours sleep',     desc: 'Sleep deprivation raises ghrelin, the hunger hormone.' },
    ],
  },

  'Heart disease': {
    morning: [
      { id: 'hd_medication',  icon: '💊', label: 'Take cardiac medications',    desc: 'Beta-blockers and blood thinners require strict consistency.' },
      { id: 'hd_pulse',       icon: '❤️', label: 'Check pulse / heart rate',    desc: 'Resting HR outside your normal range is worth noting.' },
      { id: 'hd_walk',        icon: '🚶', label: '10-min gentle walk',          desc: 'Cardiac rehab-style movement is the strongest post-event intervention.' },
    ],
    evening: [
      { id: 'hd_symptoms',    icon: '🩺', label: 'Note any symptoms',           desc: 'Chest tightness, shortness of breath, or unusual fatigue.' },
      { id: 'hd_stress',      icon: '🧘', label: 'Log stress level (1–5)',      desc: 'Chronic stress is an independent risk factor for cardiac events.' },
      { id: 'hd_breathe',     icon: '💨', label: 'Practice deep breathing',     desc: '5 minutes of slow breathing lowers heart rate and anxiety.' },
    ],
  },

  'Menopause / hormonal changes': {
    morning: [
      { id: 'meno_hrt',       icon: '💊', label: 'Take HRT or supplements',     desc: 'Estrogen therapy significantly reduces cardiovascular risk in menopause.' },
      { id: 'meno_strength',  icon: '🏋️', label: '15-min strength training',   desc: 'Resistance training protects bone density and metabolic rate.' },
      { id: 'meno_hydrate',   icon: '💧', label: 'Drink 2 glasses of water',    desc: 'Hormonal shifts increase dehydration risk.' },
    ],
    evening: [
      { id: 'meno_cool',      icon: '❄️', label: 'Cool-down routine',           desc: 'A cooler bedroom (65–68°F) reduces hot flash disruption.' },
      { id: 'meno_alcohol',   icon: '🍷', label: 'Limit alcohol',               desc: 'Alcohol is a common hot flash and sleep disruption trigger.' },
      { id: 'meno_sleep',     icon: '😴', label: 'Consistent bedtime',          desc: 'Sleep regularity matters more in perimenopause.' },
    ],
  },

  'Weight loss medication (GLP-1)': {
    morning: [
      { id: 'glp1_dose',      icon: '💉', label: 'Log your weekly dose',        desc: 'Track injection day to maintain your schedule.' },
      { id: 'glp1_eat_slow',  icon: '🍽️', label: 'Eat slowly and mindfully',  desc: 'GLP-1s suppress appetite — slow eating prevents nausea.' },
      { id: 'glp1_hydrate',   icon: '💧', label: 'Drink water before meals',    desc: 'Hydration reduces GI side effects.' },
    ],
    evening: [
      { id: 'glp1_protein',   icon: '🥩', label: 'Hit protein target at dinner', desc: 'Maintaining muscle during rapid weight loss requires high protein.' },
      { id: 'glp1_log',       icon: '📋', label: 'Log meals and portions',      desc: 'GLP-1 users who track food lose ~30% more weight.' },
      { id: 'glp1_side_fx',   icon: '🩺', label: 'Check for side effects',      desc: 'Nausea, fatigue, or heartburn — worth noting for your provider.' },
    ],
  },

  'Recovery': {
    morning: [
      { id: 'rec_medication',  icon: '💊', label: 'Take all medications',        desc: 'Post-event medication adherence is the #1 predictor of outcomes.' },
      { id: 'rec_vitals',      icon: '📊', label: 'Log vitals',                  desc: 'BP, HR, or glucose — whichever your care team tracks.' },
      { id: 'rec_walk',        icon: '🚶', label: 'Rehabilitation walk',         desc: 'Gradual daily movement is the foundation of cardiac recovery.' },
    ],
    evening: [
      { id: 'rec_symptoms',    icon: '🩺', label: 'Note any symptoms',           desc: 'New or worsening symptoms should always go to your provider.' },
      { id: 'rec_breathe',     icon: '💨', label: 'Breathing exercise',          desc: 'Diaphragmatic breathing aids recovery and lowers BP.' },
      { id: 'rec_sleep',       icon: '😴', label: 'Prioritize 8 hours sleep',    desc: 'Sleep is when cardiac tissue repairs itself.' },
    ],
  },
}

// Fallback for users without a specific diagnosis
const DEFAULT_PLAYBOOK = {
  morning: [
    { id: 'gen_medication',  icon: '💊', label: 'Take medication (if any)',    desc: 'Consistency is everything with ongoing prescriptions.' },
    { id: 'gen_water',       icon: '💧', label: 'Drink a glass of water',      desc: 'Hydration supports blood pressure and metabolism.' },
    { id: 'gen_walk',        icon: '🚶', label: '10-minute walk',              desc: 'Even light movement lowers resting heart rate.' },
  ],
  evening: [
    { id: 'gen_log',         icon: '📊', label: 'Log your numbers',            desc: 'What gets tracked gets managed.' },
    { id: 'gen_sodium',      icon: '🧂', label: 'Limit sodium today',          desc: 'Under 1,500 mg/day is the cardiac health target.' },
    { id: 'gen_sleep',       icon: '😴', label: 'Wind down before bed',        desc: 'Poor sleep raises cortisol and blood pressure.' },
  ],
}

// Condition label → playbook key mapping
const CONDITION_MAP = {
  'High blood pressure':           'High blood pressure',
  'High cholesterol':              'High cholesterol',
  'Type 2 diabetes':               'Type 2 diabetes',
  'Weight / metabolic health':     'Weight / metabolic health',
  'Heart disease':                 'Heart disease',
  'Menopause / hormonal changes':  'Menopause / hormonal changes',
  'Weight loss medication (GLP-1)':'Weight loss medication (GLP-1)',
  'Recovery':                      'Recovery',
  // Non-diagnosis conditions fall back to default
  'Family history':                null,
  'Borderline numbers':            null,
  'Weight concerns':               'Weight / metabolic health',
  'Longevity & healthy aging':     null,
  'Prevention focused':            null,
}

// ── Interest → habit supplements ────────────────────────────────────────────
// Each interest topic can add up to one habit to the morning or evening routine.
// IDs are prefixed `int_` to avoid collision with condition habit IDs.
// `slot` tells us which routine to inject into.

const INTEREST_HABITS = {
  'Heart-healthy eating': {
    morning: { id: 'int_hhe_am', icon: '🥗', label: 'Eat vegetables at breakfast', desc: 'Leafy greens and fiber early lower LDL and blood sugar spikes.' },
    evening: { id: 'int_hhe_pm', icon: '🍽️', label: 'Cook a heart-healthy dinner', desc: 'Mediterranean-style meals cut cardiac events by up to 30%.' },
  },
  'Exercise & movement': {
    morning: { id: 'int_ex_am',  icon: '🏃', label: 'Complete your movement goal',  desc: 'Even 20 min of cardio meaningfully improves metabolic markers.' },
    evening: { id: 'int_ex_pm',  icon: '📋', label: 'Log today\'s activity',        desc: 'People who track exercise are 2× more likely to stay consistent.' },
  },
  'Sleep & rest': {
    morning: { id: 'int_sl_am',  icon: '⏰', label: 'Keep a consistent wake time',  desc: 'Circadian regularity improves blood pressure and glucose control.' },
    evening: { id: 'int_sl_pm',  icon: '📵', label: 'No screens 1 hr before bed',   desc: 'Blue light delays melatonin by up to 90 minutes.' },
  },
  'Stress & mental health': {
    morning: { id: 'int_st_am',  icon: '🧘', label: '5-min breathing exercise',     desc: 'Slow breathing activates the vagus nerve and lowers cortisol.' },
    evening: { id: 'int_st_pm',  icon: '📓', label: 'Write one thing you\'re grateful for', desc: 'Gratitude journaling lowers inflammatory markers over time.' },
  },
  'Weight management': {
    morning: { id: 'int_wm_am',  icon: '⚖️', label: 'Weigh yourself',              desc: 'Daily check-ins help you spot trends, not just moments.' },
    evening: { id: 'int_wm_pm',  icon: '📋', label: 'Track your meals',             desc: 'Food tracking doubles weight loss outcomes on average.' },
  },
  'Healthy aging & longevity': {
    morning: { id: 'int_la_am',  icon: '🏋️', label: '10-min strength training',    desc: 'Muscle mass is the strongest predictor of healthspan after 50.' },
    evening: { id: 'int_la_pm',  icon: '💊', label: 'Take longevity supplements',   desc: 'Vitamin D, magnesium, and omega-3 support cardiac and cellular health.' },
  },
  'Understanding my numbers': {
    morning: { id: 'int_un_am',  icon: '📊', label: 'Review last recorded reading', desc: 'Knowing your baseline makes new readings meaningful.' },
    evening: { id: 'int_un_pm',  icon: '✏️', label: 'Log one health number',        desc: 'What gets tracked gets managed.' },
  },
  'Preparing for appointments': {
    morning: { id: 'int_ap_am',  icon: '📋', label: 'Add a note for your provider', desc: 'Patients who bring notes get more actionable guidance.' },
    evening: { id: 'int_ap_pm',  icon: '🩺', label: 'Note any symptoms today',      desc: 'A week of symptom logs is worth more than a verbal summary.' },
  },
  'Alcohol & lifestyle': {
    morning: { id: 'int_al_am',  icon: '🌿', label: 'Set intention: limit alcohol', desc: 'Even 1–2 drinks/day raises blood pressure and triglycerides.' },
    evening: { id: 'int_al_pm',  icon: '✓',  label: 'Alcohol-free check-in',        desc: 'Tracking alcohol-free days builds long-term awareness.' },
  },
  'Cooking at home': {
    morning: { id: 'int_ck_am',  icon: '🗓️', label: 'Plan today\'s meals',         desc: 'Meal planning reduces impulsive high-sodium food choices.' },
    evening: { id: 'int_ck_pm',  icon: '🍳', label: 'Cook from scratch tonight',    desc: 'Home-cooked meals average 60% less sodium than restaurant food.' },
  },
  'Confidence & self-image': {
    morning: { id: 'int_ci_am',  icon: '✨', label: 'Set a positive intention',     desc: 'Self-efficacy beliefs directly predict health behavior success.' },
    evening: { id: 'int_ci_pm',  icon: '🏆', label: 'Note one thing you did well',  desc: 'Recognizing progress reinforces the habits that created it.' },
  },
  'Community & peer support': {
    morning: { id: 'int_cp_am',  icon: '🤝', label: 'Check in with your support network', desc: 'Social accountability doubles long-term habit adherence.' },
    evening: { id: 'int_cp_pm',  icon: '💬', label: 'Share a health win today',     desc: 'Vocalizing progress strengthens commitment.' },
  },
  'Family & caregiving': {
    morning: { id: 'int_fc_am',  icon: '👨‍👩‍👧', label: 'Share your health update',  desc: 'Keeping loved ones informed reduces caregiver stress on both sides.' },
    evening: { id: 'int_fc_pm',  icon: '🏠', label: 'Plan a heart-healthy family meal', desc: 'Shared healthy habits are more durable than solo ones.' },
  },
  'Work & daily life': {
    morning: { id: 'int_wl_am',  icon: '🗓️', label: 'Schedule a movement break',   desc: 'Blocking it like a meeting makes it 3× more likely to happen.' },
    evening: { id: 'int_wl_pm',  icon: '📊', label: 'Log your stress level (1–5)',  desc: 'Work stress is one of the strongest lifestyle drivers of BP.' },
  },
}

// Interests that overlap with condition playbooks — don't add duplicate habits
const CONDITION_INTEREST_OVERLAP = {
  'High blood pressure':           ['Blood pressure'],
  'High cholesterol':              [],
  'Type 2 diabetes':               ['Blood sugar'],
  'Weight / metabolic health':     ['Weight management'],
  'Heart disease':                 [],
  'Menopause / hormonal changes':  ['Menopause & hormonal health'],
  'Weight loss medication (GLP-1)':['GLP-1 & weight loss medications'],
  'Recovery':                      [],
}

// ── Build routines from profile ──────────────────────────────────────────────

function readProfile() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch (_) { return {} }
}

/**
 * Returns a flat list of habits tailored to the user's conditions + interests.
 * - Condition drives the core habits (up to 6).
 * - Up to 2 interest habits are appended (one per slot, deduped against condition).
 */
export function getHabits() {
  const profile    = readProfile()
  const conditions = Array.isArray(profile.condition) ? profile.condition : []
  const interests  = Array.isArray(profile.topics)    ? profile.topics    : []

  // 1. Find the first condition with a playbook
  let playbook = null
  let matchedCondition = null
  for (const c of conditions) {
    const key = CONDITION_MAP[c]
    if (key && PLAYBOOKS[key]) {
      playbook = PLAYBOOKS[key]
      matchedCondition = c
      break
    }
  }
  if (!playbook) playbook = DEFAULT_PLAYBOOK

  // 2. Base habits: condition playbook morning + evening merged flat
  const base = [...playbook.morning, ...playbook.evening]
  const usedIds = new Set(base.map(h => h.id))

  // 3. Overlap interests to skip
  const skipInterests = new Set(
    matchedCondition ? (CONDITION_INTEREST_OVERLAP[matchedCondition] || []) : []
  )

  // 4. Pick up to 2 interest habits (one morning slot, one evening slot)
  const interestExtras = []
  let gotMorning = false
  let gotEvening = false
  for (const topic of interests) {
    if (skipInterests.has(topic)) continue
    const entry = INTEREST_HABITS[topic]
    if (!entry) continue
    if (!gotMorning && entry.morning && !usedIds.has(entry.morning.id)) {
      interestExtras.push(entry.morning)
      usedIds.add(entry.morning.id)
      gotMorning = true
    }
    if (!gotEvening && entry.evening && !usedIds.has(entry.evening.id)) {
      interestExtras.push(entry.evening)
      usedIds.add(entry.evening.id)
      gotEvening = true
    }
    if (gotMorning && gotEvening) break
  }

  return [...base, ...interestExtras]
}

// ── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'vitalistHabits'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function readHabitLog() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch (_) { return {} }
}

export function saveHabitLog(log) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)) } catch (_) {}
}

export function readTodayCompletions() {
  return readHabitLog()[todayKey()] || []
}

export function toggleHabit(habitId) {
  const log = readHabitLog()
  const key = todayKey()
  const current = new Set(log[key] || [])
  if (current.has(habitId)) {
    current.delete(habitId)
  } else {
    current.add(habitId)
  }
  log[key] = [...current]
  saveHabitLog(log)
  return log[key]
}

// ── Streak calculation ───────────────────────────────────────────────────────

export const DAILY_MINIMUM = 2  // habits needed for a day to "count"

/** Streak = consecutive days where at least DAILY_MINIMUM habits were completed. */
export function computeStreak() {
  const log = readHabitLog()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const count = (log[key] || []).length
    if (count >= DAILY_MINIMUM) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

/** A "perfect day" = every habit completed. */
export function computePerfectDays() {
  const habits = getHabits()
  const allIds = new Set(habits.map(h => h.id))
  const log = readHabitLog()
  return Object.values(log).filter(arr => {
    const done = new Set(arr)
    return [...allIds].every(id => done.has(id))
  }).length
}

/** Streak for a single habit — consecutive days it was logged. */
export function computeHabitStreak(habitId) {
  const log = readHabitLog()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if ((log[key] || []).includes(habitId)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

/**
 * Returns true if the user broke their streak at some point but has now
 * logged at least 3 consecutive days back — i.e. a comeback is in progress.
 */
export function computeComeback() {
  const streak = computeStreak()
  if (streak < 3) return false
  // Check the day just before the current streak started
  const log = readHabitLog()
  const today = new Date()
  const gapDay = new Date(today)
  gapDay.setDate(today.getDate() - streak)
  const gapKey = gapDay.toISOString().slice(0, 10)
  return (log[gapKey] || []).length < DAILY_MINIMUM
}

export function computeTotalCompleted() {
  const log = readHabitLog()
  return Object.values(log).reduce((sum, arr) => sum + arr.length, 0)
}
