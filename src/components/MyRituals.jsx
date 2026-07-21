import React, { useState, useEffect } from 'react'
import { useProfileStage } from '../context/ProfileStageContext'
import './MyRituals.css'

// ── Category colours ───────────────────────────────────────────────────────────
const CAT = {
  Move:    { bg: '#e6f7f4', text: '#2D9B83' },
  Nourish: { bg: '#fef3ec', text: '#E07B4A' },
  Hydrate: { bg: '#eff6ff', text: '#3B82F6' },
  Rest:    { bg: '#f5f3ff', text: '#8B5CF6' },
  Mind:    { bg: '#fdf2f8', text: '#EC4899' },
  Monitor: { bg: '#fffbeb', text: '#F59E0B' },
}

// ── Habit library ──────────────────────────────────────────────────────────────
const HABIT_LIBRARY = [
  {
    id: 'hl_walk', icon: '🚶', label: '10-min walk', category: 'Move',
    desc: 'After meals is best',
    hook: 'Drops blood sugar 22% — no medication needed',
    stat: '22%', statLabel: 'DROP IN POST-MEAL GLUCOSE', statColor: '#2D9B83',
    body: 'Even a brief walk after eating blunts the blood sugar spike by up to 22% — without any medication. It also lowers resting BP by 4–9 mmHg over weeks of consistency.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/walking-after-meals-blood-sugar-5092879',
    conditions: ['High blood pressure', 'Type 2 diabetes', 'Weight / metabolic health', 'Weight concerns', 'High cholesterol', 'Heart disease'],
    tiers: [
      { level: 1, label: '10-min walk', desc: 'After meals is best' },
      { level: 2, label: '20-min walk', desc: 'Morning or evening works well' },
      { level: 3, label: '10,000 steps/day', desc: 'Move throughout the whole day' },
    ],
  },
  {
    id: 'hl_bp_med', icon: '💊', label: 'Take BP medication', category: 'Monitor',
    desc: 'Same time every day',
    hook: 'Missing 2 doses a week can push BP back up 10 mmHg',
    stat: '#1', statLabel: 'FACTOR IN BLOOD PRESSURE CONTROL', statColor: '#F59E0B',
    body: 'Consistency is the single biggest driver of results with antihypertensives. Missing even 2 doses per week can push systolic readings back up by 6–10 mmHg.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/condition/heart-disease/why-you-must-take-blood-pressure-medication-consistently',
    conditions: ['High blood pressure'],
    tiers: [
      { level: 1, label: 'Take BP medication', desc: 'Same time every day' },
      { level: 2, label: 'Track dose timing', desc: 'Log when you take it and any missed days' },
      { level: 3, label: 'Share log with care team', desc: 'Bring your adherence data to your visit' },
    ],
  },
  {
    id: 'hl_chol_med', icon: '💊', label: 'Take cholesterol medication', category: 'Monitor',
    desc: 'Statins work on a schedule',
    hook: 'Taken consistently, statins cut LDL by up to 35%',
    stat: '35%', statLabel: 'AVERAGE LDL REDUCTION ON STATINS', statColor: '#F59E0B',
    body: 'Statins are most effective when taken at the same time daily — many work best at night when your liver produces the most cholesterol. Skipping days reduces efficacy.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/how-to-take-statins-697482',
    conditions: ['High cholesterol'],
    tiers: [
      { level: 1, label: 'Take cholesterol medication', desc: 'Statins work on a schedule' },
      { level: 2, label: 'Track dose timing + meals', desc: 'Note if taken with or without food' },
      { level: 3, label: 'Share adherence with care team', desc: 'Bring your log to every appointment' },
    ],
  },
  {
    id: 'hl_dm_med', icon: '💊', label: 'Take diabetes medication', category: 'Monitor',
    desc: 'Timing is everything for glucose control',
    hook: 'Consistent timing is as important as the dose itself',
    stat: '1.5%', statLabel: 'A1C REDUCTION WITH CONSISTENT METFORMIN', statColor: '#F59E0B',
    body: 'Metformin and GLP-1 medications both depend on consistent daily timing to maintain steady drug levels and sustained glucose control throughout the day.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/metformin-oral-5214490',
    conditions: ['Type 2 diabetes'],
    tiers: [
      { level: 1, label: 'Take diabetes medication', desc: 'Timing is everything for glucose control' },
      { level: 2, label: 'Track dose + glucose response', desc: 'Note blood sugar around your dose timing' },
      { level: 3, label: 'Share adherence + glucose log', desc: 'Connect the data at your next visit' },
    ],
  },
  {
    id: 'hl_meno_hrt', icon: '💊', label: 'Take HRT or supplements', category: 'Monitor',
    desc: 'Supports heart health during transition',
    hook: 'Started early, HRT can lower cardiovascular risk by 30%',
    stat: '30%', statLabel: 'LOWER CARDIOVASCULAR RISK ON HRT', statColor: '#F59E0B',
    body: 'When started within 10 years of menopause, hormone therapy reduces cardiovascular events by up to 30% — and lowers LDL and insulin resistance over time.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/menopause/hormone-replacement-therapy-heart-disease',
    conditions: ['Menopause / hormonal changes'],
    tiers: [
      { level: 1, label: 'Take HRT or supplements', desc: 'Supports heart health during transition' },
      { level: 2, label: 'Track timing + symptoms', desc: 'Note how you feel each day' },
      { level: 3, label: 'Share symptom log with care team', desc: 'Help your doctor optimize your protocol' },
    ],
  },
  {
    id: 'hl_bg_check', icon: '🔬', label: 'Check blood sugar', category: 'Monitor',
    desc: 'Fasting gives the clearest baseline',
    hook: 'People who track are 2× more likely to hit their A1C target',
    stat: '2×', statLabel: 'MORE LIKELY TO HIT TARGETS WHEN TRACKING', statColor: '#F59E0B',
    body: 'A fasting glucose reading before food gives your clearest daily signal. People who check regularly are twice as likely to meet their A1C goals at their next visit.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/how-to-check-blood-sugar-5119956',
    conditions: ['Type 2 diabetes'],
    tiers: [
      { level: 1, label: 'Check blood sugar', desc: 'Fasting gives the clearest baseline' },
      { level: 2, label: 'Check + log the pattern', desc: 'Track morning and after-meal readings' },
      { level: 3, label: 'Share glucose data with care team', desc: 'Bring your log to every visit' },
    ],
  },
  {
    id: 'hl_fiber', icon: '🥣', label: 'Eat a fiber-rich breakfast', category: 'Nourish',
    desc: 'Oats and legumes bind LDL in the gut',
    hook: 'Oat fiber binds LDL before it ever reaches your bloodstream',
    stat: '15%', statLabel: 'LDL REDUCTION FROM DAILY OAT FIBER', statColor: '#E07B4A',
    body: 'Beta-glucan fiber found in oats and legumes physically binds LDL cholesterol in your gut before it enters your bloodstream — lowering it 10–15% over 8 weeks.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/nutrition/oatmeal-and-cholesterol',
    conditions: ['High cholesterol'],
    tiers: [
      { level: 1, label: 'Fiber-rich breakfast', desc: 'Oats and legumes bind LDL in the gut' },
      { level: 2, label: 'Fiber at 2 meals', desc: 'Lunch counts — add beans, veg, or whole grains' },
      { level: 3, label: '25g fiber daily', desc: 'Your daily LDL-lowering dose' },
    ],
  },
  {
    id: 'hl_sodium', icon: '🧂', label: 'Limit sodium today', category: 'Nourish',
    desc: 'Under 1,500 mg makes a measurable difference',
    hook: 'Cutting sodium is as powerful as adding a blood pressure med',
    stat: '5 mmHg', statLabel: 'AVERAGE SYSTOLIC DROP ON LOW-SODIUM DIET', statColor: '#E07B4A',
    body: 'Reducing sodium below 1,500 mg/day lowers systolic BP by an average of 5 mmHg — equivalent to adding one blood pressure medication for many people.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/condition/heart-disease/how-much-sodium-per-day',
    conditions: ['High blood pressure', 'Heart disease'],
    tiers: [
      { level: 1, label: 'Notice sodium labels', desc: 'Start reading what you eat' },
      { level: 2, label: 'Stay under 2,000mg sodium', desc: 'Track and aim for the daily target' },
      { level: 3, label: 'Full DASH diet', desc: 'A proven protocol for blood pressure — under 1,500mg' },
    ],
  },
  {
    id: 'hl_strength', icon: '🏋️', label: '15-min strength training', category: 'Move',
    desc: 'Builds bone and metabolic resilience',
    hook: 'Weights protect the bone density menopause quietly steals',
    stat: '3%', statLabel: 'BONE DENSITY PRESERVED PER YEAR', statColor: '#2D9B83',
    body: 'During and after menopause, estrogen decline accelerates bone loss. Resistance training preserves bone density and keeps resting metabolic rate from dropping.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/strength-training-during-menopause-8407019',
    conditions: ['Menopause / hormonal changes'],
    tiers: [
      { level: 1, label: '15-min bodyweight', desc: 'Builds bone and metabolic resilience' },
      { level: 2, label: '30-min strength session', desc: 'Add load — heavier is better for bone' },
      { level: 3, label: '3× week strength program', desc: 'The minimum effective dose for lasting change' },
    ],
  },
  {
    id: 'hl_dinner_walk', icon: '🌆', label: '10-min post-dinner walk', category: 'Move',
    desc: 'Blunts the evening glucose spike',
    hook: "Your biggest glucose spike of the day happens right after dinner",
    stat: '22%', statLabel: 'LOWER POST-MEAL GLUCOSE', statColor: '#2D9B83',
    body: "A 10-minute walk within 30 minutes of eating can lower your post-meal blood sugar spike by 22%. The evening meal typically produces the day's largest spike.",
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/walking-after-meals-blood-sugar-5092879',
    conditions: ['Type 2 diabetes', 'Weight / metabolic health', 'Weight concerns'],
    tiers: [
      { level: 1, label: '10-min post-dinner walk', desc: 'Blunts the evening glucose spike' },
      { level: 2, label: '20-min post-dinner walk', desc: 'Doubles the blood sugar benefit' },
      { level: 3, label: 'Walk + bodyweight resistance', desc: 'Squats or wall sits after dinner — strongest glucose response' },
    ],
  },
  {
    id: 'hl_protein', icon: '🥚', label: 'Eat a protein-rich breakfast', category: 'Nourish',
    desc: 'Reduces hunger hormones all day',
    hook: 'Cuts hunger hormones 25% — critical on GLP-1 meds',
    stat: '25%', statLabel: 'REDUCTION IN HUNGER HORMONE (GHRELIN)', statColor: '#E07B4A',
    body: 'A high-protein breakfast reduces ghrelin — the hunger hormone — by up to 25% for the rest of the day. Especially important on GLP-1 medications to maintain muscle.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/nutrition/high-protein-breakfast',
    conditions: ['Weight / metabolic health', 'Weight concerns', 'Weight loss medication (GLP-1)'],
    tiers: [
      { level: 1, label: 'Protein-rich breakfast', desc: 'Reduces hunger hormones all day' },
      { level: 2, label: 'Protein at every meal', desc: 'Spread intake for better muscle synthesis' },
      { level: 3, label: '30g protein per meal', desc: 'The clinical threshold for muscle protein synthesis' },
    ],
  },
  {
    id: 'hl_glp1', icon: '💉', label: 'Log your weekly GLP-1 dose', category: 'Monitor',
    desc: 'Most missed doses go unnoticed',
    hook: '89% of missed doses go undetected without a log',
    stat: '89%', statLabel: 'OF MISSED DOSES GO UNDETECTED WITHOUT A LOG', statColor: '#F59E0B',
    body: 'GLP-1 medications are once-weekly injections — easy to lose track of. Patients who log their doses are significantly more consistent and see better outcomes.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/ozempic-what-happens-if-you-miss-a-dose-8418828',
    conditions: ['Weight loss medication (GLP-1)'],
    tiers: [
      { level: 1, label: 'Log your weekly GLP-1 dose', desc: 'Most missed doses go unnoticed' },
      { level: 2, label: 'Log dose + weekly symptoms', desc: 'Track nausea, appetite, and energy' },
      { level: 3, label: 'Share log with prescriber', desc: 'Optimize your protocol at every visit' },
    ],
  },
  {
    id: 'hl_symptoms', icon: '🩺', label: 'Note any symptoms today', category: 'Monitor',
    desc: 'Logs help your care team see patterns',
    hook: 'A week of notes is 3× more useful than verbal recall at your visit',
    stat: '3×', statLabel: 'MORE CLINICALLY USEFUL THAN VERBAL RECALL', statColor: '#F59E0B',
    body: 'A week of symptom logs is three times more useful to a clinician than a verbal summary. Patterns you miss day-to-day become obvious across a week.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/how-to-track-your-symptoms-5200441',
    conditions: ['Heart disease', 'Recovery'],
    tiers: [
      { level: 1, label: 'Note any symptoms today', desc: 'Logs help your care team see patterns' },
      { level: 2, label: 'Note symptoms + vitals', desc: 'Add BP or glucose readings alongside' },
      { level: 3, label: 'Prepare a health summary', desc: 'Bring a structured summary to your visit' },
    ],
  },
  {
    id: 'hl_breathe', icon: '💨', label: '5-min deep breathing', category: 'Mind',
    desc: 'Interrupts the stress-to-numbers pipeline',
    hook: "Today's stress shows up in your BP numbers 48 hours from now",
    stat: '48h', statLabel: 'LAG BETWEEN STRESS AND BP/GLUCOSE SPIKE', statColor: '#EC4899',
    body: 'Stress elevates cortisol, which raises blood pressure and blood sugar — but the spike typically arrives 48 hours later. Daily breathing practice blunts cortisol before it compounds.',
    source: 'Verywell Mind', sourceUrl: 'https://www.verywellmind.com/abdominal-breathing-2584115',
    conditions: [],
    tiers: [
      { level: 1, label: '5-min deep breathing', desc: 'Interrupts the stress-to-numbers pipeline' },
      { level: 2, label: '10-min guided meditation', desc: 'Deeper cortisol reset, daily' },
      { level: 3, label: 'Daily mindfulness practice', desc: '20+ min — proven dose for lasting HRV improvement' },
    ],
  },
  {
    id: 'hl_sleep', icon: '😴', label: 'Aim for 7+ hours sleep', category: 'Rest',
    desc: 'Sleep deprivation worsens every condition',
    hook: 'One bad week raises insulin resistance 37% — even without changing your diet',
    stat: '37%', statLabel: 'HIGHER INSULIN RESISTANCE AFTER POOR SLEEP', statColor: '#8B5CF6',
    body: 'Sleeping under 6 hours raises insulin resistance by 37%, elevates cortisol, and increases cardiovascular risk — even if everything else in your routine is perfect.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/sleep/sleep-and-heart-health',
    conditions: [],
    tiers: [
      { level: 1, label: 'Aim for 7+ hours sleep', desc: 'Sleep deprivation worsens every condition' },
      { level: 2, label: 'Consistent bedtime (±30 min)', desc: 'Regularity matters as much as duration' },
      { level: 3, label: 'Full sleep hygiene protocol', desc: 'Dark room, no screens, consistent wake time' },
    ],
  },
  {
    id: 'hl_water', icon: '💧', label: 'Drink 2 glasses of water', category: 'Hydrate',
    desc: 'Dehydration quietly raises BP',
    hook: 'Mild dehydration silently raises your blood pressure',
    stat: '8%', statLabel: 'BP RISE FROM MILD DEHYDRATION', statColor: '#3B82F6',
    body: 'Even mild dehydration raises blood pressure and puts extra strain on kidneys — especially important for people on blood pressure or diabetes medications.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/nutrition/dehydration-blood-pressure',
    conditions: [],
    tiers: [
      { level: 1, label: 'Drink 2 glasses of water', desc: 'Dehydration quietly raises BP' },
      { level: 2, label: '6 glasses throughout the day', desc: 'Space it out for better absorption' },
      { level: 3, label: '8 glasses daily', desc: 'The clinical target for kidney and BP health' },
    ],
  },
  {
    id: 'hl_log', icon: '📊', label: 'Log a health number', category: 'Monitor',
    desc: 'Tracking doubles your odds of hitting targets',
    hook: 'Trackers are 2× as likely to reach their health goals',
    stat: '2×', statLabel: 'MORE LIKELY TO HIT HEALTH TARGETS WHEN TRACKING', statColor: '#F59E0B',
    body: 'Patients who consistently log at least one health metric are twice as likely to reach their clinical targets — logging turns vague awareness into concrete feedback.',
    source: 'Verywell Health', sourceUrl: 'https://www.verywellhealth.com/self-monitoring-in-diabetes-5180895',
    conditions: [],
    tiers: [
      { level: 1, label: 'Log a health number', desc: 'Tracking doubles your odds of hitting targets' },
      { level: 2, label: 'Log daily without missing', desc: 'Consistency reveals the trend' },
      { level: 3, label: 'Review and reflect weekly', desc: 'Turn your data into decisions' },
    ],
  },
  {
    id: 'hl_grateful', icon: '📓', label: 'Write one gratitude note', category: 'Mind',
    desc: 'Lowers inflammatory markers over time',
    hook: 'Lowers cortisol 23% — which drives BP and blood sugar up',
    stat: '23%', statLabel: 'LOWER CORTISOL IN REGULAR GRATITUDE JOURNALERS', statColor: '#EC4899',
    body: 'Consistent gratitude journaling lowers cortisol by 23% and reduces inflammatory markers — two things that directly affect blood pressure and metabolic health.',
    source: 'Verywell Mind', sourceUrl: 'https://www.verywellmind.com/how-to-practice-gratitude-3144628',
    conditions: [],
    tiers: [
      { level: 1, label: 'Write one gratitude note', desc: 'Lowers inflammatory markers over time' },
      { level: 2, label: '3 gratitudes + a reflection', desc: 'Depth matters more than length' },
      { level: 3, label: 'Weekly life review', desc: 'A structured reflection on what\'s working and what isn\'t' },
    ],
  },
  {
    id: 'hl_stretch', icon: '🧘', label: 'Morning stretch', category: 'Move',
    desc: 'Starts circulation before your day begins',
    hook: 'Morning movement drops cortisol 15% before your day even starts',
    stat: '15%', statLabel: 'CORTISOL REDUCTION AFTER MORNING MOVEMENT', statColor: '#2D9B83',
    body: 'Morning movement — even gentle stretching — reduces cortisol by 15% and activates the parasympathetic nervous system, setting a lower stress baseline for the day.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/fitness/benefits-of-stretching',
    conditions: [],
    tiers: [
      { level: 1, label: 'Morning stretch', desc: 'Starts circulation before your day begins' },
      { level: 2, label: '15-min mobility routine', desc: 'Target tight hips, chest, and thoracic spine' },
      { level: 3, label: 'Yoga or Pilates session', desc: 'Full-body mobility with breath work — 30+ min' },
    ],
  },
  {
    id: 'hl_meds_gen', icon: '💊', label: 'Take all medications', category: 'Monitor',
    desc: 'Adherence is the #1 predictor of outcomes',
    hook: 'Adherence predicts your health more than diet or exercise combined',
    stat: '#1', statLabel: 'PREDICTOR OF HEALTH OUTCOMES ACROSS CHRONIC CONDITIONS', statColor: '#F59E0B',
    body: 'Medication adherence is the single strongest predictor of health outcomes across all chronic conditions — more than diet, exercise, or any other lifestyle factor.',
    source: 'Health.com', sourceUrl: 'https://www.health.com/mind-body/why-its-so-hard-to-take-medication-correctly',
    conditions: [],
    tiers: [
      { level: 1, label: 'Take all medications', desc: 'Adherence is the #1 predictor of outcomes' },
      { level: 2, label: 'Track timing + side effects', desc: 'Patterns you notice can change your protocol' },
      { level: 3, label: 'Share adherence log with care team', desc: 'Let your doctor see what you see' },
    ],
  },
]

const SELECTED_KEY    = 'vitalistMyRituals2'
const COMPLETIONS_KEY = 'vitalistMyRitualsCompletions'
const TRIALS_KEY      = 'vitalistMyRitualsTrials'
const MAX_SLOTS       = 3

// Mature demo starting habits — Walk T3/kept + Fiber T2/trial-complete
const MATURE_DEFAULT_IDS = ['hl_walk', 'hl_fiber']

function todayKey() { return new Date().toISOString().slice(0, 10) }

function readProfile() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch { return {} }
}

const DEFAULT_IDS = ['hl_walk', 'hl_water', 'hl_breathe']

// Medication-type ritual IDs — hidden from display in this demo
const MEDICATION_IDS = new Set(['hl_bp_med','hl_chol_med','hl_dm_med','hl_meno_hrt','hl_glp1','hl_meds_gen','hl_bg_check','hl_symptoms'])

// Unique count labels per habit — makes the count feel specific and real
const COUNT_LABELS = {
  hl_walk:        n => `${n} walks logged`,
  hl_dinner_walk: n => `${n} evening walks`,
  hl_strength:    n => `${n} strength sessions`,
  hl_stretch:     n => `${n} stretch sessions`,
  hl_water:       n => `${n} hydration days`,
  hl_breathe:     n => `${n} breathing sessions`,
  hl_grateful:    n => `${n} gratitude notes`,
  hl_sleep:       n => `${n} nights tracked`,
  hl_fiber:       n => `${n} fiber days`,
  hl_sodium:      n => `${n} low-sodium days`,
  hl_protein:     n => `${n} protein breakfasts`,
  hl_log:         n => `${n} numbers logged`,
}

function getDefaultIds(conditions) {
  const matches = HABIT_LIBRARY.filter(
    h => !MEDICATION_IDS.has(h.id) && h.conditions.length > 0 && h.conditions.some(c => conditions.includes(c))
  )
  if (matches.length === 0) return DEFAULT_IDS
  const seen = new Set(['hl_walk']); const result = ['hl_walk']
  for (const h of matches) {
    if (!seen.has(h.id)) { seen.add(h.id); result.push(h.id) }
    if (result.length === 3) break
  }
  for (const id of ['hl_water', 'hl_breathe']) {
    if (result.length >= 3) break
    if (!seen.has(id)) result.push(id)
  }
  return result
}

function readSelectedIds() {
  try { const s = localStorage.getItem(SELECTED_KEY); return s ? JSON.parse(s) : null } catch { return null }
}

function saveSelectedIds(ids) {
  try { localStorage.setItem(SELECTED_KEY, JSON.stringify(ids)) } catch {}
}

function readTrials() {
  try { return JSON.parse(localStorage.getItem(TRIALS_KEY) || '{}') } catch { return {} }
}

function saveTrials(t) {
  try { localStorage.setItem(TRIALS_KEY, JSON.stringify(t)) } catch {}
}

// Slot unlock: habit must be kept AND at tier 2+
function getSucceededCount(trials) {
  return Object.values(trials).filter(t =>
    t.status === 'kept' && (t.tier || 1) >= 2
  ).length
}

// Returns 1-based day number since the habit was added (1 = added today)
function dateNDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function trialDay(addedAt) {
  if (!addedAt) return 1
  const start = new Date(addedAt)
  const today = new Date()
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const b = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  return Math.max(1, Math.round((a - b) / (1000 * 60 * 60 * 24)) + 1)
}

function readCompletionLog() {
  try { return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '{}') } catch { return {} }
}

function markDone(id) {
  const log = readCompletionLog()
  const key = todayKey()
  const cur = new Set(log[key] || [])
  cur.add(id)
  log[key] = [...cur]
  try { localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(log)) } catch {}
  return log[key]
}

function unmarkDone(id) {
  const log = readCompletionLog()
  const key = todayKey()
  const cur = new Set(log[key] || [])
  cur.delete(id)
  log[key] = [...cur]
  try { localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(log)) } catch {}
  return log[key]
}

function readTodayCompletions() { return readCompletionLog()[todayKey()] || [] }

function getTotalCount(id) {
  return Object.values(readCompletionLog()).filter(arr => arr.includes(id)).length
}

function getLastN(id, n) {
  const log = readCompletionLog()
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (n - 1 - i))
    return (log[d.toISOString().slice(0, 10)] || []).includes(id)
  })
}

const QUOTES = [
  "Small actions, compounded daily, change everything.",
  "You don't rise to your goals — you fall to your habits.",
  "Every completion is a vote for who you're becoming.",
  "Motivation starts it. Habit sustains it.",
  "What you do today is who you become tomorrow.",
  "The secret of your future is hidden in your daily routine.",
  "Identity is built one action at a time.",
]

function todayQuote() {
  const day = new Date().getDay()
  return QUOTES[day % QUOTES.length]
}

// ── Established-user mock dot history ─────────────────────────────────────────
// For each habit, generate a plausible 7-day history as if user logged
// inconsistently over 2 months (some days yes, some no).
const MATURE_DOT_PATTERNS = {
  hl_walk:     [true, true, false, true, true, false, true],
  hl_sleep:    [true, false, true, true, false, true, true],
  hl_water:    [true, true, true, false, true, true, false],
  hl_bp_med:   [true, true, true, true, false, true, true],
  hl_chol_med: [true, true, false, true, true, true, false],
  hl_dm_med:   [true, true, true, true, true, false, true],
  default:     [true, false, true, true, false, false, true],
}

// Realistic varied completion counts for established users (past ~30 days)
const MATURE_COUNTS = {
  hl_walk:     22,
  hl_sleep:    17,
  hl_water:    24,
  hl_bp_med:   28,
  hl_chol_med: 26,
  hl_dm_med:   29,
  hl_breathe:  14,
  hl_stretch:  11,
  hl_journal:  9,
  hl_steps:    20,
  default:     16,
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function MyRituals({ onAskAI }) {
  const { stage } = useProfileStage()
  const isMature  = stage === 'mature'

  const profile    = readProfile()
  const conditions = Array.isArray(profile.condition) ? profile.condition : []

  const [selectedIds, setSelectedIds] = useState(() => {
    if (isMature) {
      saveSelectedIds(MATURE_DEFAULT_IDS)
      return MATURE_DEFAULT_IDS
    }
    const saved = readSelectedIds()
    const defaults = getDefaultIds(conditions)
    return saved || defaults.slice(0, 1)
  })
  const [trials, setTrials] = useState(() => {
    if (isMature) {
      const matureTrials = {
        hl_walk:  { addedAt: dateNDaysAgo(40), status: 'kept',  tier: 3 },
        hl_fiber: { addedAt: dateNDaysAgo(14), status: 'trial', tier: 2 },
      }
      saveTrials(matureTrials)
      return matureTrials
    }
    const saved = readTrials()
    const defaults = getDefaultIds(conditions)
    const currentIds = readSelectedIds() || defaults.slice(0, 1)
    const updated = { ...saved }
    let changed = false
    for (const id of currentIds) {
      if (!updated[id]) {
        updated[id] = { addedAt: todayKey(), status: 'trial', tier: 1 }
        changed = true
      } else if (!updated[id].tier) {
        updated[id] = { ...updated[id], tier: 1 }
        changed = true
      }
    }
    if (changed) saveTrials(updated)
    return updated
  })
  const [completions, setCompletions] = useState(readTodayCompletions)
  const [showPicker, setShowPicker]   = useState(false)
  const [pickerCat, setPickerCat]     = useState('Move')
  const [justDone, setJustDone]       = useState(new Set())

  // Re-seed state whenever the profile stage toggles
  useEffect(() => {
    if (isMature) {
      const matureTrials = {
        hl_walk:  { addedAt: dateNDaysAgo(40), status: 'kept',  tier: 3 },
        hl_fiber: { addedAt: dateNDaysAgo(14), status: 'trial', tier: 2 },
      }
      saveSelectedIds(MATURE_DEFAULT_IDS)
      saveTrials(matureTrials)
      setSelectedIds(MATURE_DEFAULT_IDS)
      setTrials(matureTrials)
    } else {
      const cleanIds = getDefaultIds(conditions).slice(0, 1)
      const newTrials = { [cleanIds[0]]: { addedAt: todayKey(), status: 'trial', tier: 1 } }
      saveSelectedIds(cleanIds)
      saveTrials(newTrials)
      setSelectedIds(cleanIds)
      setTrials(newTrials)
    }
    setShowPicker(false)
    setCompletions(readTodayCompletions())
  }, [isMature])

  const personalizedIds = new Set(
    HABIT_LIBRARY
      .filter(h => h.conditions.length > 0 && h.conditions.some(c => conditions.includes(c)))
      .map(h => h.id)
  )

  const selectedHabits = selectedIds.map(id => HABIT_LIBRARY.find(h => h.id === id)).filter(h => h && !MEDICATION_IDS.has(h.id))
  const availableToAdd = HABIT_LIBRARY.filter(h => !selectedIds.includes(h.id))
  const doneToday      = completions.filter(id => selectedIds.includes(id)).length
  const allDone        = selectedHabits.length > 0 && doneToday === selectedHabits.length

  // Slot locking: start with 1 unlocked; each kept T2+ habit unlocks the next
  const succeededCount       = getSucceededCount(trials)
  const unlockedSlots        = Math.min(MAX_SLOTS, 1 + succeededCount)
  const lockedSlots          = MAX_SLOTS - unlockedSlots
  const openSlots            = Math.max(0, unlockedSlots - selectedHabits.length)
  const hasUnresolvedComplete = Object.entries(trials).some(
    ([, t]) => t.status === 'trial' && trialDay(t.addedAt) >= 15
  )

  const pickerFiltered = pickerCat === 'All'
    ? availableToAdd
    : availableToAdd.filter(h => h.category === pickerCat)

  function handleCheck(id) {
    if (completions.includes(id)) {
      // Allow unchecking today's completion
      const newCompletions = unmarkDone(id)
      setCompletions(newCompletions)
      return
    }
    const newCompletions = markDone(id)
    setCompletions(newCompletions)
    setJustDone(prev => new Set([...prev, id]))
    setTimeout(() => setJustDone(prev => { const n = new Set(prev); n.delete(id); return n }), 700)
  }

  function handleAdd(id) {
    if (selectedIds.length >= unlockedSlots) return
    const updated = [...selectedIds, id]
    setSelectedIds(updated); saveSelectedIds(updated)
    const updatedTrials = { ...trials, [id]: { addedAt: todayKey(), status: 'trial', tier: 1 } }
    setTrials(updatedTrials); saveTrials(updatedTrials)
    setShowPicker(false)
  }

  function handleKeep(id) {
    const updatedTrials = { ...trials, [id]: { ...trials[id], status: 'kept' } }
    setTrials(updatedTrials); saveTrials(updatedTrials)
  }

  function handleLevelUp(id) {
    const habit = HABIT_LIBRARY.find(h => h.id === id)
    const currentTier = trials[id]?.tier || 1
    const maxTier = habit?.tiers?.length || 1
    const nextTier = Math.min(currentTier + 1, maxTier)
    const updatedTrials = { ...trials, [id]: { addedAt: todayKey(), status: 'kept', tier: nextTier } }
    setTrials(updatedTrials); saveTrials(updatedTrials)
  }

  function handleSwap(id) {
    const updatedIds = selectedIds.filter(s => s !== id)
    setSelectedIds(updatedIds); saveSelectedIds(updatedIds)
    const updatedTrials = { ...trials }
    delete updatedTrials[id]
    setTrials(updatedTrials); saveTrials(updatedTrials)
    setShowPicker(true)
  }

  function handleRemove(e, id) {
    e.stopPropagation()
    const updated = selectedIds.filter(s => s !== id)
    setSelectedIds(updated); saveSelectedIds(updated)
    const updatedTrials = { ...trials }
    delete updatedTrials[id]
    setTrials(updatedTrials); saveTrials(updatedTrials)
  }

  return (
    <section className="mr-section">

      {/* Header */}
      <div className="mr-header">
        <div>
          <p className="mr-eyebrow">My Habits</p>
          <h2 className="mr-title">Complete your habits</h2>
        </div>
        <div className="mr-header__right">
          {selectedHabits.length > 0 && (
            <div className={`mr-score${allDone ? ' mr-score--done' : ''}`}>
              {allDone && <span className="mr-score__fire">🔥</span>}
              <span className="mr-score__done">{doneToday}</span>
              <span className="mr-score__sep">/</span>
              <span className="mr-score__total">{selectedHabits.length}</span>
            </div>
          )}
          <button
            className={`mr-plus-btn${showPicker ? ' mr-plus-btn--open' : ''}${selectedHabits.length >= unlockedSlots ? ' mr-plus-btn--full' : ''}`}
            onClick={() => selectedHabits.length < unlockedSlots && setShowPicker(s => !s)}
            aria-label={showPicker ? 'Close' : selectedHabits.length >= unlockedSlots ? 'All unlocked slots filled' : 'Add habit'}
            disabled={selectedHabits.length >= unlockedSlots && !showPicker}
          >
            {showPicker ? '✕' : '+'}
          </button>
        </div>
      </div>

      {/* Slot row */}
      <div className="mr-slots-row">
        <div className="mr-slots">
          {Array.from({ length: MAX_SLOTS }).map((_, i) => (
            <div
              key={i}
              className={[
                'mr-slot',
                i < selectedHabits.length ? 'mr-slot--filled' : '',
                i >= unlockedSlots ? 'mr-slot--locked' : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>
        <span className="mr-slots__label">
          {selectedHabits.length >= unlockedSlots && lockedSlots === 0
            ? 'All 3 slots active'
            : selectedHabits.length === 0
              ? 'Add your first habit to begin'
              : openSlots > 0
                ? `${openSlots} slot${openSlots !== 1 ? 's' : ''} open`
                : lockedSlots > 0
                  ? 'Complete your trial week to unlock next slot'
                  : 'All slots active'}
        </span>
        <span className="mr-slots__tag">2 weeks to make it stick</span>
      </div>

      {/* Habit picker — right below + button so it's immediately visible */}
      {showPicker && (
        <div className="mr-picker">
          <div className="mr-picker__tabs">
            {['All', ...Object.keys(CAT)].map(cat => (
              <button
                key={cat}
                className={`mr-picker__tab${pickerCat === cat ? ' mr-picker__tab--active' : ''}`}
                onClick={() => setPickerCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="mr-picker__heading">
            {pickerFiltered.length === 0 ? 'All habits in this category are added' : 'Add a habit'}
          </p>
          <div className="mr-picker__list">
            {pickerFiltered.map(habit => {
              const isPersonal  = personalizedIds.has(habit.id) || habit.conditions.length > 0
              const t1          = habit.tiers?.[0] || { label: habit.label, desc: habit.desc }
              return (
                <button key={habit.id} className="mr-picker__item" onClick={() => handleAdd(habit.id)}>
                  <span className="mr-picker__icon">{habit.icon}</span>
                  <span className="mr-picker__body">
                    <span className="mr-picker__label">
                      <span className="mr-picker__tier-badge">T1</span>
                      {t1.label}
                      {isPersonal && <span className="mr-picker__foryou">✨ Recommended</span>}
                    </span>
                    <span className="mr-picker__desc">{t1.desc}</span>
                  </span>
                  <span className="mr-picker__plus">+</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* All-done celebration */}
      {allDone && (
        <div className="mr-celebration">
          <span className="mr-celebration__quote">"{todayQuote()}"</span>
        </div>
      )}

      {/* Habit cards */}
      <div className="mr-list">
        {selectedHabits.length === 0 && (
          <p className="mr-empty">Tap + to add your first habit.</p>
        )}
        {selectedHabits.map(habit => {
          const isDone     = completions.includes(habit.id)
          const isPersonal = personalizedIds.has(habit.id) || habit.conditions.length > 0
          const count      = getTotalCount(habit.id)
          const isPopping  = justDone.has(habit.id)
          const catStyle   = CAT[habit.category] || {}

          const matureDots = MATURE_DOT_PATTERNS[habit.id] || MATURE_DOT_PATTERNS.default
          const realDots   = getLastN(habit.id, 7)
          const todayDots  = [...realDots.slice(0, 6), isDone]
          const dots         = isMature ? (isDone ? [...matureDots.slice(0, 6), true] : matureDots) : todayDots
          const baseCount    = MATURE_COUNTS[habit.id] ?? MATURE_COUNTS.default
          const displayCount = isMature ? (isDone ? baseCount + 1 : baseCount) : count

          // Tier-aware display
          const currentTier  = trials[habit.id]?.tier || 1
          const tierData     = habit.tiers?.[currentTier - 1] || { label: habit.label, desc: habit.desc }

          return (
            <div
              key={habit.id}
              className={[
                'mr-card',
                isDone     ? 'mr-card--done'     : '',
                isPopping  ? 'mr-card--pop'      : '',
                isPersonal ? 'mr-card--personal' : '',
              ].filter(Boolean).join(' ')}
            >
              {/* Main row */}
              <div className="mr-card__main">
                <div
                  className={`mr-card__icon-wrap${isPopping ? ' mr-card__icon-wrap--bounce' : ''}`}
                  style={{ background: isDone ? '#d1fae5' : catStyle.bg }}
                >
                  <span className="mr-card__icon">{habit.icon}</span>
                </div>
                <div className="mr-card__body">
                  <div className="mr-card__meta">
                    <span className={`mr-recommended-pill${isPersonal ? '' : ' mr-recommended-pill--hidden'}`}>✨ Recommended</span>
                    <span className="mr-tier-badge">T{currentTier}</span>
                  </div>
                  <span className="mr-card__label">{tierData.label}</span>
                  <p className="mr-card__subdesc">{tierData.desc}</p>
                </div>
                {!isDone ? (
                  <button className="mr-log-btn" onClick={() => handleCheck(habit.id)}>Log it</button>
                ) : (
                  <button className="mr-logged-badge" onClick={() => handleCheck(habit.id)}>Logged</button>
                )}
              </div>

              {/* Trial section */}
              {trials[habit.id]?.status === 'trial' && (() => {
                const day        = trialDay(trials[habit.id]?.addedAt)
                const isComplete = day >= 15
                const currentTier = trials[habit.id]?.tier || 1
                const maxTier     = habit.tiers?.length || 1
                const nextTierData = habit.tiers?.[currentTier] // index = currentTier (0-based = next level)
                return (
                  <div className={`mr-trial${isComplete ? ' mr-trial--complete' : ''}`}>
                    {isComplete ? (
                      <>
                        <div className="mr-trial__complete-text">
                          {currentTier < maxTier
                            ? `2 weeks in — ready to level up?`
                            : `2 weeks done — keep it or try something new?`}
                        </div>
                        <div className="mr-trial__actions">
                          {currentTier < maxTier && nextTierData && (
                            <button className="mr-levelup-btn" onClick={() => handleLevelUp(habit.id)}>
                              Level up → {nextTierData.label}
                            </button>
                          )}
                          <button className="mr-keep-btn" onClick={() => handleKeep(habit.id)}>Keep it here ✓</button>
                          <button className="mr-swap-btn" onClick={() => handleSwap(habit.id)}>Swap it ↺</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mr-trial__header">
                          <span className="mr-trial__label">2-week trial · Day {day} of 14</span>
                        </div>
                        <div className="mr-trial__bar">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className={`mr-trial__seg${i < day ? ' mr-trial__seg--filled' : ''}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })()}

              {/* Progress footer */}
              <div className="mr-card__footer">
                <div className="mr-dots">
                  {dots.map((d, i) => (
                    <div key={i} className={`mr-dot${d ? ' mr-dot--done' : ''}`} />
                  ))}
                </div>
                <div className="mr-card__footer-right">
                  <span className="mr-card__count">
                    {displayCount > 0 ? (COUNT_LABELS[habit.id] ? COUNT_LABELS[habit.id](displayCount) : `${displayCount} completions`) : 'Start today'}
                  </span>
                </div>
                <button className="mr-card__remove" onClick={e => handleRemove(e, habit.id)}>Remove</button>
              </div>

              {/* Ask AI entry */}
              {onAskAI && (
                <button className="mr-ask-ai-btn" onClick={() => onAskAI(habit)}>
                  ✨ Ask Vitalist AI about this habit
                </button>
              )}
            </div>
          )
        })}

        {/* Open empty slot cards — unlocked and available */}
        {Array.from({ length: openSlots }).map((_, i) => (
          <button key={`slot-open-${i}`} className="mr-empty-slot" onClick={() => setShowPicker(true)} aria-label="Add a habit">
            <div className="mr-empty-slot__plus">+</div>
            <div className="mr-empty-slot__label">Add a habit</div>
            <div className="mr-empty-slot__sub">Try it for 2 weeks</div>
          </button>
        ))}

        {/* Locked slot cards */}
        {Array.from({ length: lockedSlots }).map((_, i) => (
          <div key={`slot-locked-${i}`} className="mr-empty-slot mr-empty-slot--locked" aria-label="Locked slot">
            <div className="mr-empty-slot__lock">🔒</div>
            <div className="mr-empty-slot__label">Slot locked</div>
            <div className="mr-empty-slot__sub">
              {hasUnresolvedComplete ? 'Level up a habit to unlock' : 'Establish a habit to unlock more'}
            </div>
          </div>
        ))}
      </div>


    </section>
  )
}
