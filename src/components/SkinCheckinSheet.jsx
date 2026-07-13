import React, { useState, useEffect } from 'react'

const CHECKIN_KEY  = 'cardiometabolicLastCheckin'
const CHECKINS_KEY = 'cardiometabolicCheckins'

/* ── Personalization by condition ─────────────────────────────────── */

// Generic fallback scale, used only when a condition-specific playbook doesn't
// define its own severity options.
const FALLBACK_SEVERITY = [
  { e: '✨', l: 'Feeling great — lots of energy today' },
  { e: '🙂', l: 'Pretty good — minor tiredness or tension' },
  { e: '😐', l: 'So-so — low energy or a bit stressed' },
  { e: '😣', l: 'Rough day — hard to stay on track' },
  { e: '😫', l: 'Really struggling — need some support' },
]

const CONDITION_PLAYBOOKS = {
  'High cholesterol': {
    severityQ: 'How are you feeling about your cholesterol management today?',
    severitySub: 'Think about your habits, stress, and how in control you feel.',
    severityOpts: [
      { e: '✨', l: 'On track — sticking to my plan' },
      { e: '🙂', l: 'Pretty good — minor slip but nothing major' },
      { e: '😐', l: 'Mixed — some good choices, some not so much' },
      { e: '😣', l: 'Off track — struggling with diet or routine' },
      { e: '😔', l: 'Struggling — feel like I\'ve slipped a lot today' },
    ],
    symptomsQ: 'What\'s most on your mind about your heart health today?',
    symptomsSub: 'Pick what resonates most right now.',
    symptoms: [
      { e: '😌', l: 'Feeling good — no concerns today' },
      { e: '🧪', l: 'Worried about my last lab results' },
      { e: '🍔', l: 'Struggling with diet today' },
      { e: '💊', l: 'Skipped or forgot my medication' },
      { e: '😰', l: 'High stress or didn\'t sleep well' },
    ],
  },
  'High blood pressure': {
    severityQ: 'How is your blood pressure feeling today?',
    severitySub: 'Think about physical sensations, stress, and your readings if you have them.',
    severityOpts: [
      { e: '✨', l: 'Calm — feeling relaxed, readings look good' },
      { e: '🙂', l: 'Mostly okay — a little tension but manageable' },
      { e: '😐', l: 'Unsettled — some stress or a higher reading' },
      { e: '😣', l: 'Elevated — headache, tension, or a concerning reading' },
      { e: '🚨', l: 'Worried — symptoms feel significant today' },
    ],
    symptomsQ: 'What physical or emotional signs are you noticing today?',
    symptomsSub: 'Include how your body feels and your stress level.',
    symptoms: [
      { e: '😌', l: 'Feeling fine — no symptoms today' },
      { e: '🤕', l: 'Headache or pressure in my head' },
      { e: '😤', l: 'Tense, stressed, or on edge' },
      { e: '💊', l: 'Missed a dose of my medication' },
      { e: '🧂', l: 'Ate more salt than usual today' },
    ],
  },
  'Type 2 diabetes': {
    severityQ: 'How is your blood sugar management feeling today?',
    severitySub: 'Think about your energy, eating, and how in balance you feel.',
    severityOpts: [
      { e: '✨', l: 'Balanced — energy steady and on plan' },
      { e: '🙂', l: 'Pretty good — minor blips but overall okay' },
      { e: '😐', l: 'Uneven — energy dipping or choices were mixed' },
      { e: '😣', l: 'Off — noticeably high or low energy, struggled today' },
      { e: '😔', l: 'Really hard day — way off routine or unwell' },
    ],
    symptomsQ: 'What are you noticing most about your health today?',
    symptomsSub: 'How your body and energy feel matters — pick what fits.',
    symptoms: [
      { e: '😌', l: 'Feeling good — energy and mood are steady' },
      { e: '😴', l: 'Tired or sluggish after eating' },
      { e: '🍞', l: 'Ate more carbs or sugar than planned' },
      { e: '💊', l: 'Missed a dose of medication or insulin' },
      { e: '🧃', l: 'Had a low — needed to treat hypoglycemia' },
    ],
  },
  'Weight / metabolic health': {
    severityQ: 'How are you feeling about your health and habits today?',
    severitySub: 'This is about how you feel — not a number on a scale.',
    severityOpts: [
      { e: '✨', l: 'Great — motivated and making good choices' },
      { e: '🙂', l: 'Good — mostly on track today' },
      { e: '😐', l: 'Neutral — going through the motions' },
      { e: '😣', l: 'Struggling — cravings, low motivation, or stress eating' },
      { e: '😔', l: 'Really hard — feel like today was a step back' },
    ],
    symptomsQ: 'What feels most relevant to your wellbeing today?',
    symptomsSub: 'Pick what best describes your day so far.',
    symptoms: [
      { e: '😌', l: 'Feeling good — in a positive groove' },
      { e: '🏃', l: 'Was active or exercised today' },
      { e: '🍽️', l: 'Overate or emotional eating happened' },
      { e: '😴', l: 'Low energy or didn\'t move much' },
      { e: '😤', l: 'Stress made healthy choices harder' },
    ],
  },
  'Heart disease': {
    severityQ: 'How is your heart health feeling today?',
    severitySub: 'Think about physical comfort, energy, and your emotional state.',
    severityOpts: [
      { e: '✨', l: 'Comfortable — no symptoms, feeling well' },
      { e: '🙂', l: 'Good — slight tiredness but nothing concerning' },
      { e: '😐', l: 'Mixed — some discomfort or lower energy than usual' },
      { e: '😣', l: 'Concerning — symptoms I\'m aware of today' },
      { e: '🚨', l: 'Significant — symptoms that worry me' },
    ],
    symptomsQ: 'What are you noticing today?',
    symptomsSub: 'Physical and emotional — both count.',
    symptoms: [
      { e: '😌', l: 'Feeling well — no symptoms today' },
      { e: '😮‍💨', l: 'Breathlessness with normal activity' },
      { e: '😩', l: 'Unusual tiredness or fatigue' },
      { e: '💓', l: 'Chest discomfort or palpitations' },
      { e: '😟', l: 'Anxious or emotionally drained about my condition' },
    ],
  },
  'Recovery': {
    severityQ: 'How is your recovery going today?',
    severitySub: 'Think about how your body feels and how you\'re coping emotionally.',
    severityOpts: [
      { e: '✨', l: 'Great — feeling strong and confident' },
      { e: '🙂', l: 'Good — steady progress, a few hard moments' },
      { e: '😐', l: 'Mixed — okay physically but emotionally tiring' },
      { e: '😣', l: 'Tough day — setbacks or symptoms affecting me' },
      { e: '😔', l: 'Really hard — physically or emotionally overwhelmed' },
    ],
    symptomsQ: 'What\'s most present for you today?',
    symptomsSub: 'Both physical and emotional are worth logging.',
    symptoms: [
      { e: '😌', l: 'Feeling good — a strong recovery day' },
      { e: '😩', l: 'More fatigue than expected' },
      { e: '💓', l: 'Heart or chest awareness today' },
      { e: '😟', l: 'Feeling anxious or worried about my health' },
      { e: '💊', l: 'Medication side effects or questions came up' },
    ],
  },
  'Family history': {
    severityQ: 'How are you feeling about your cardiovascular health today?',
    severitySub: 'Managing risk with family history is an ongoing effort — how\'s today going?',
    severityOpts: [
      { e: '✨', l: 'On it — making proactive choices today' },
      { e: '🙂', l: 'Pretty good — mostly following my plan' },
      { e: '😐', l: 'Neutral — not bad, but not my best effort' },
      { e: '😣', l: 'Off track — stress or habits working against me' },
      { e: '😔', l: 'Worried — anxiety about risk is weighing on me' },
    ],
    symptomsQ: 'What\'s on your mind about your health today?',
    symptomsSub: 'Log what\'s most present — physical or emotional.',
    symptoms: [
      { e: '😌', l: 'Feeling good — no concerns today' },
      { e: '🧪', l: 'Thinking about upcoming tests or results' },
      { e: '🏃', l: 'Got some exercise in — felt good' },
      { e: '😰', l: 'Anxious about my family history today' },
      { e: '🍽️', l: 'Struggled with heart-healthy eating' },
    ],
  },
  'Prevention focused': {
    severityQ: 'How are your prevention habits feeling today?',
    severitySub: 'Staying ahead of risk takes consistency — how\'s today looking?',
    severityOpts: [
      { e: '✨', l: 'Excellent — all my healthy habits in place' },
      { e: '🙂', l: 'Good — mostly on track today' },
      { e: '😐', l: 'Okay — some habits slipped a little' },
      { e: '😣', l: 'Struggling — hard to stay consistent today' },
      { e: '😔', l: 'Off — lots of habits missed, need a reset' },
    ],
    symptomsQ: 'What\'s most relevant to your health today?',
    symptomsSub: 'Pick what fits your day best.',
    symptoms: [
      { e: '😌', l: 'Feeling well — energy and mood are good' },
      { e: '🏃', l: 'Was active — got movement in today' },
      { e: '🥗', l: 'Ate well — mostly whole foods' },
      { e: '😴', l: 'Slept poorly or feeling run down' },
      { e: '😤', l: 'Stressful day — harder to stick to good habits' },
    ],
  },
}

// Shared physical-symptom list used by the generic step-3 question — kept
// separate from the per-condition CONDITION_PLAYBOOKS symptom lists (those
// mix physical + emotional and are only used to label historical per-
// condition answers). Order must match TrackPage.jsx's SYMPTOM_LABELS.
const PHYSICAL_SYMPTOMS = [
  { e: '😌', l: 'Feeling fine — no symptoms' },
  { e: '😩', l: 'Fatigue or low energy' },
  { e: '🤕', l: 'Headache or head pressure' },
  { e: '😣', l: 'Cramps or abdominal discomfort' },
  { e: '💓', l: 'Heart racing or palpitations' },
  { e: '😮‍💨', l: 'Shortness of breath' },
  { e: '🌡️', l: 'Dizziness or lightheadedness' },
  { e: '🔥', l: 'Hot flashes or night sweats' },
  { e: '😟', l: 'Chest tightness or discomfort' },
]

// Resolves a stored symptoms value (array of indices — or, for older saved
// check-ins, a single index) into an array of labels.
function resolveSymptomLabels(val) {
  const idxs = Array.isArray(val) ? val : (val != null ? [val] : [])
  return idxs.map(i => PHYSICAL_SYMPTOMS[i]?.l).filter(Boolean)
}

const GENERIC_PLAYBOOK = {
  severityQ: 'How are you feeling about your health today?',
  severitySub: 'A quick read on your energy, mood, and how in control you feel.',
  severityOpts: FALLBACK_SEVERITY,
  symptomsQ: 'What\'s most on your mind about your health today?',
  symptomsSub: 'Pick the most prominent thing.',
  symptoms: [
    { e: '😌', l: 'Feeling good — no real concerns' },
    { e: '😴', l: 'Tired or low energy' },
    { e: '😤', l: 'Stressed or emotionally drained' },
    { e: '💊', l: 'Medication or treatment question came up' },
    { e: '🍽️', l: 'Struggled with healthy eating or habits' },
  ],
}

// Each option can have a `detail` follow-up that appears below when it's
// selected, so the user can capture specifics (which product, what food, etc).
// Common treatments + products. Used to autosuggest as the user types. The
// user can also enter freeform text. Grouped roughly by category so the
// suggestion list feels relevant. Not meant to be exhaustive — a starter set.
const COMMON_TREATMENTS = [
  'Atorvastatin (Lipitor)', 'Rosuvastatin (Crestor)', 'Simvastatin (Zocor)',
  'Pravastatin (Pravachol)', 'Lovastatin', 'Fluvastatin',
  'Ezetimibe (Zetia)', 'Fenofibrate', 'Niacin (extended release)',
  'Evolocumab (Repatha)', 'Alirocumab (Praluent)', 'Inclisiran (Leqvio)',
  'Lisinopril', 'Amlodipine (Norvasc)', 'Losartan (Cozaar)',
  'Metoprolol succinate', 'Metoprolol tartrate', 'Atenolol',
  'Hydrochlorothiazide (HCTZ)', 'Chlorthalidone', 'Valsartan (Diovan)',
  'Ramipril', 'Carvedilol', 'Spironolactone',
  'Metformin', 'Semaglutide (Ozempic / Wegovy)', 'Liraglutide (Victoza)',
  'Empagliflozin (Jardiance)', 'Dapagliflozin (Farxiga)', 'Canagliflozin (Invokana)',
  'Sitagliptin (Januvia)', 'Pioglitazone (Actos)', 'Glipizide', 'Glimepiride',
  'Insulin glargine (Lantus / Basaglar)', 'Insulin aspart (NovoLog)', 'Insulin lispro (Humalog)',
  'Aspirin 81mg', 'Clopidogrel (Plavix)', 'Ticagrelor (Brilinta)',
  'Warfarin (Coumadin)', 'Apixaban (Eliquis)', 'Rivaroxaban (Xarelto)',
  'Digoxin', 'Amiodarone', 'Sacubitril/valsartan (Entresto)',
  'Estradiol', 'Progesterone', 'Estradiol patch', 'Vaginal estrogen',
  'Tirzepatide (Mounjaro / Zepbound)', 'Naltrexone/bupropion (Contrave)', 'Orlistat (Xenical)',
  'Omega-3 / fish oil', 'CoQ10', 'Berberine', 'Magnesium glycinate',
  'Vitamin D', 'Vitamin K2', 'Psyllium husk', 'Red yeast rice',
  'Mediterranean diet', 'DASH diet', 'Cardiac rehab program',
  'Continuous glucose monitor (CGM)', 'Daily blood pressure monitor',
]

// Category lookup — maps keywords in a treatment name to a display category
const TREATMENT_CATEGORY_RULES = [
  { cat: '💊 Cholesterol',        keys: ['statin','lipitor','crestor','zocor','pravachol','lovastatin','fluvastatin','zetia','ezetimibe','fenofibrate','niacin','repatha','evolocumab','praluent','alirocumab','leqvio','inclisiran','fish oil','omega-3','red yeast','psyllium','berberine'] },
  { cat: '🫀 Blood pressure',     keys: ['lisinopril','amlodipine','norvasc','losartan','cozaar','metoprolol','atenolol','hctz','hydrochlorothiazide','chlorthalidone','valsartan','diovan','ramipril','carvedilol','spironolactone'] },
  { cat: '🩸 Blood sugar',        keys: ['metformin','ozempic','wegovy','semaglutide','liraglutide','victoza','jardiance','empagliflozin','farxiga','dapagliflozin','invokana','canagliflozin','januvia','sitagliptin','actos','pioglitazone','glipizide','glimepiride','insulin','cgm','glucose monitor'] },
  { cat: '⚖️ Weight management',  keys: ['mounjaro','zepbound','tirzepatide','contrave','naltrexone','bupropion','orlistat','xenical'] },
  { cat: '🌸 Hormones',           keys: ['estradiol','progesterone','estrogen','vaginal','hormone','hrt'] },
  { cat: '❤️ Heart & circulation',keys: ['aspirin','clopidogrel','plavix','ticagrelor','brilinta','warfarin','coumadin','apixaban','eliquis','rivaroxaban','xarelto','digoxin','amiodarone','entresto','sacubitril','cardiac rehab'] },
  { cat: '🥗 Lifestyle & diet',   keys: ['mediterranean','dash diet','coq10','magnesium','vitamin d','vitamin k','blood pressure monitor'] },
]

function categoryFor(name) {
  const lower = name.toLowerCase()
  for (const rule of TREATMENT_CATEGORY_RULES) {
    if (rule.keys.some(k => lower.includes(k))) return rule.cat
  }
  return '📋 Other'
}

function groupByCategory(names) {
  const map = {}
  for (const name of names) {
    const cat = categoryFor(name)
    if (!map[cat]) map[cat] = []
    map[cat].push(name)
  }
  return map
}

const DAY_CONTEXT = [
  { e: '😰', l: 'Stressful day',    detail: { prompt: 'What was stressful?',             placeholder: 'Work, family, finances…' } },
  { e: '😴', l: 'Rough night',      detail: { prompt: 'What was off?',                   placeholder: 'Couldn\'t sleep, woke up a lot…' } },
  { e: '🍔', l: 'Ate off plan',     detail: { prompt: 'What did you eat?',               placeholder: 'Fast food, salty meal, alcohol…' } },
  { e: '🏃', l: 'Exercised today',  detail: { prompt: 'What did you do?',                placeholder: 'Walk, gym, swimming, cycling…' } },
  { e: '💊', l: 'Missed a dose',    detail: { prompt: 'Which medication?',               placeholder: 'Statin, blood pressure, diabetes med…' } },
  { e: '🧪', l: 'Got lab results',  detail: { prompt: 'What came back?',                 placeholder: 'Cholesterol, A1C, blood pressure reading…' } },
  { e: '👍', l: 'Normal day', wide: true },
]

/* ── Storage helpers ──────────────────────────────────────────────── */

function readProfile() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch (_) { return {} }
}
function readCheckins() {
  try { return JSON.parse(localStorage.getItem(CHECKINS_KEY) || '[]') } catch (_) { return [] }
}
function writeCheckin(c) {
  try { localStorage.setItem(CHECKIN_KEY, JSON.stringify(c)) } catch (_) {}
  try {
    const arr = readCheckins()
    const today = new Date(c.date).toDateString()
    const idx = arr.findIndex(x => x?.date && new Date(x.date).toDateString() === today)
    if (idx >= 0) arr[idx] = c; else arr.push(c)
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(arr))
  } catch (_) {}
}

function playbookFor(condition) {
  if (!condition) return { pb: GENERIC_PLAYBOOK, label: 'health' }
  const pb = CONDITION_PLAYBOOKS[condition]
  return pb ? { pb, label: condition.toLowerCase() } : { pb: GENERIC_PLAYBOOK, label: 'health' }
}

// All onboarding-tracked conditions that have a dedicated playbook. If none,
// we use a single 'generic' entry so the rest of the flow still works.
function trackedConditionsFor(profile) {
  const raw = Array.isArray(profile?.condition) ? profile.condition : (profile?.condition ? [profile.condition] : [])
  const tracked = raw.filter(c => CONDITION_PLAYBOOKS[c])
  return tracked.length > 0 ? tracked : ['__generic']
}

function daysAgo(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate); const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.round((a - b) / (1000 * 60 * 60 * 24))
}
function lastCheckinLabel(isoDate) {
  const d = daysAgo(isoDate)
  if (d === null) return 'Start your first check-in'
  if (d === 0)    return '✓ Checked in today'
  if (d === 1)    return 'Last check-in: yesterday'
  if (d < 7)      return `Last check-in: ${d} days ago`
  if (d < 14)     return 'Last check-in: a week ago — time for another'
  if (d < 30)     return `Last check-in: ${Math.floor(d/7)} weeks ago — time for another`
  return 'It\'s been over a month — let\'s check in again'
}

/* ── Sheet component ──────────────────────────────────────────────── */

export default function SkinCheckinSheet({ open, onClose, onComplete, onViewTrack }) {
  const [step, setStep]       = useState(0)
  const [sleep, setSleep]     = useState(null)   // 'well' | 'okay' | 'poorly'
  const [stress, setStress]   = useState(null)   // 1–5
  const [movement, setMovement] = useState(null) // 'yes' | 'little' | 'not-yet'
  const [symptoms, setSymptoms] = useState([])
  const [wearableSynced, setWearableSynced] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [showSymptoms, setShowSymptoms] = useState(false)

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return }
    setSleep(null); setStress(null); setMovement(null)
    setSymptoms([]); setWearableSynced(false); setShowSymptoms(false)
    document.body.style.overflow = 'hidden'

    let last = null
    try { last = JSON.parse(localStorage.getItem(CHECKIN_KEY) || 'null') } catch (_) {}
    const todayLogged = last && new Date(last.date).toDateString() === new Date().toDateString()
    if (todayLogged) { setViewing(last); setStep(6) }
    else { setViewing(null); setStep(0) }

    return () => { document.body.style.overflow = '' }
  }, [open])

  const progressPct = ((step / 3) * 100)

  function toggleSymptom(i) {
    setSymptoms(prev => {
      if (i === 0) return prev.includes(0) ? [] : [0]
      const withoutFine = prev.filter(x => x !== 0)
      return withoutFine.includes(i) ? withoutFine.filter(x => x !== i) : [...withoutFine, i]
    })
  }

  // Suggest a ritual based on what was just logged, if user doesn't already have it
  function getRitualNudge() {
    try {
      const selected = JSON.parse(localStorage.getItem('vitalistMyRituals2') || '[]')
      const hasMovement = selected.some(id => ['hl_walk','hl_strength','hl_dinner_walk','hl_stretch'].includes(id))
      const hasMind = selected.some(id => ['hl_breathe','hl_grateful'].includes(id))
      const hasSleep = selected.includes('hl_sleep')
      if ((movement === 'not-yet' || movement === 'little') && !hasMovement)
        return { emoji: '🚶', text: "You haven't moved much today — want to make it a daily habit?", cta: 'Add a movement ritual' }
      if (stress >= 4 && !hasMind)
        return { emoji: '💨', text: "High stress logged — a short breathing ritual can help buffer it.", cta: 'Add a breathing ritual' }
      if (sleep === 'poorly' && !hasSleep)
        return { emoji: '😴', text: "Poor sleep logged — tracking it as a ritual helps surface patterns.", cta: 'Add a sleep ritual' }
    } catch (_) {}
    return null
  }

  function finish() {
    const checkin = {
      date: new Date().toISOString(),
      sleep, stress, movement, symptoms,
      wearableSynced,
      // backwards-compat fields for TrackPage
      severity: stress != null ? stress - 1 : null,
      skinScore: stress != null ? 6 - stress : null,
      conditionLabel: 'health',
      contextLabels: stress >= 4 ? ['Stressful day'] : movement === 'yes' ? ['Exercised today'] : [],
    }
    writeCheckin(checkin)
    onComplete?.(checkin)
    setStep(5)
  }

  if (!open) return null

  // Insight copy driven by the new signals
  let insightIcon = '📊', insightHead = '', insightBody = ''
  if (stress >= 4) {
    insightIcon = '⚠️'
    insightHead = 'Stress + a harder day — worth keeping an eye on'
    insightBody = 'Stress can raise blood pressure and blood sugar and make it harder to stick to your routine. A short wind-down tonight can help your body recover.'
  } else if (stress === 3) {
    insightHead = 'Moderate stress logged — we\'ll keep watching'
    insightBody = 'Chronic stress is a real cardiovascular risk factor. Even a 10-minute walk or breathing exercise can take the edge off.'
  } else if (sleep === 'poorly') {
    insightIcon = '😴'
    insightHead = 'Poor sleep logged — it shows up in your numbers'
    insightBody = 'Sleep under 6 hours is linked to elevated blood pressure and blood sugar the following day. Your trends on Track capture this pattern.'
  } else if (movement === 'yes' && (sleep === 'well' || stress <= 2)) {
    insightIcon = '✅'
    insightHead = 'Strong day logged — this is what progress looks like'
    insightBody = 'Movement + good sleep are the two highest-impact habits for long-term cardiometabolic health. Consistency is the work.'
  } else {
    insightHead = 'Check-in logged — patterns take shape over time'
    insightBody = 'Every check-in adds to your health story. We\'ll flag patterns as they emerge.'
  }

  const lastDateStr = lastCheckinLabel(readCheckins().slice(-1)[0]?.date)
  const nudge = step === 5 ? getRitualNudge() : null

  return (
    <div className="ci-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ci-sheet">

        {step === 0 && (
          <>
            <div className="ci-header">
              <span className="ci-label">{lastDateStr}</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '0%' }} /></div>
            <h2 className="ci-title">How are you feeling today?</h2>
            <p className="ci-sub">Three quick questions. Your answers connect how you feel to what your numbers show.</p>

            <div className="ci-start-list">
              <button className={`ci-start-card${wearableSynced ? ' ci-start-card--done' : ''}`} type="button" onClick={() => { setWearableSynced(true); setStep(1) }}>
                <span className="ci-start-card__icon">⌚</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Sync wearable</span>
                  <span className="ci-start-card__desc">Apple Watch, Oura, Whoop — pull in sleep, HRV, and activity.</span>
                </span>
                <span className="ci-start-card__arrow">{wearableSynced ? '✓' : '›'}</span>
              </button>
              <button className="ci-start-card ci-start-card--ghost" type="button" onClick={() => setStep(1)}>
                <span className="ci-start-card__icon">✏️</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Just answer a few questions</span>
                  <span className="ci-start-card__desc">Quick and manual — no devices needed.</span>
                </span>
                <span className="ci-start-card__arrow">›</span>
              </button>
            </div>
          </>
        )}

        {/* Step 1 — Sleep */}
        {step === 1 && (
          <>
            <div className="ci-header">
              <span className="ci-label">1 of 3</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '33%' }} /></div>
            <h2 className="ci-title">How did you sleep last night?</h2>
            <p className="ci-sub">Sleep quality is one of the strongest predictors of how your numbers behave the next day.</p>
            <div className="ci-opts ci-opts--list">
              {[
                { v: 'well',   e: '😴', l: 'Well — felt rested and recovered' },
                { v: 'okay',   e: '🙂', l: 'Okay — decent but not great' },
                { v: 'poorly', e: '😩', l: 'Poorly — tired, restless, or too little' },
              ].map(opt => (
                <button key={opt.v} className={`ci-opt ci-opt--row${sleep === opt.v ? ' ci-opt--sel' : ''}`} onClick={() => setSleep(opt.v)}>
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>
            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(0)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={() => setStep(2)}>{sleep ? 'Continue →' : 'Skip →'}</button>
            </div>
          </>
        )}

        {/* Step 2 — Stress */}
        {step === 2 && (
          <>
            <div className="ci-header">
              <span className="ci-label">2 of 3</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '66%' }} /></div>
            <h2 className="ci-title">How's your stress today?</h2>
            <p className="ci-sub">High stress is one of the biggest drivers of blood pressure and blood sugar spikes — it usually shows up in your numbers 24–48 hours later.</p>
            <div className="ci-opts ci-opts--list">
              {[
                { v: 1, e: '😌', l: 'Very low — calm and in control' },
                { v: 2, e: '🙂', l: 'Low — mostly relaxed' },
                { v: 3, e: '😐', l: 'Moderate — some tension' },
                { v: 4, e: '😤', l: 'High — noticeably stressed' },
                { v: 5, e: '😫', l: 'Very high — overwhelmed or anxious' },
              ].map(opt => (
                <button key={opt.v} className={`ci-opt ci-opt--row${stress === opt.v ? ' ci-opt--sel' : ''}`} onClick={() => setStress(opt.v)}>
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>
            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(1)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={() => setStep(3)}>{stress ? 'Continue →' : 'Skip →'}</button>
            </div>
          </>
        )}

        {/* Step 3 — Movement */}
        {step === 3 && (
          <>
            <div className="ci-header">
              <span className="ci-label">3 of 3</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '100%' }} /></div>
            <h2 className="ci-title">Have you moved today?</h2>
            <p className="ci-sub">Even a short walk counts — movement is one of the most direct levers for your cardiometabolic health.</p>
            <div className="ci-opts ci-opts--list">
              {[
                { v: 'yes',     e: '🏃', l: 'Yes — got a good workout or walk in' },
                { v: 'little',  e: '🚶', l: 'A little — some light movement' },
                { v: 'not-yet', e: '🛋️', l: 'Not yet today' },
              ].map(opt => (
                <button key={opt.v} className={`ci-opt ci-opt--row${movement === opt.v ? ' ci-opt--sel' : ''}`} onClick={() => setMovement(opt.v)}>
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>

            {/* Optional symptoms — collapsed by default */}
            <button
              type="button"
              onClick={() => setShowSymptoms(s => !s)}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '8px 0 0', textAlign: 'left' }}
            >
              {showSymptoms ? '▾' : '▸'} Any physical symptoms? (optional)
            </button>
            {showSymptoms && (
              <div className="ci-opts ci-opts--list" style={{ marginTop: 8 }}>
                {PHYSICAL_SYMPTOMS.map((opt, i) => (
                  <button key={i} className={`ci-opt ci-opt--row${symptoms.includes(i) ? ' ci-opt--sel' : ''}`} onClick={() => toggleSymptom(i)}>
                    <span className="ci-opt__emoji">{opt.e}</span>
                    <span className="ci-opt__label">{opt.l}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(2)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={finish}>{movement ? 'Log check-in →' : 'Skip & log →'}</button>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="ci-done">
            <button className="ci-close" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
            <div className="ci-done__emoji">🎉</div>
            <h3 className="ci-done__title">Check-in logged.</h3>
            <p className="ci-done__sub">
              We saved how you're feeling and what's going on today.
              {wearableSynced && <> Wearable data synced.</>}
            </p>
            <div className="ci-insight">
              <div className="ci-insight__tag"><span className="ci-insight__dot" />Insight · Based on your check-in</div>
              <h4 className="ci-insight__heading">{insightIcon} {insightHead}</h4>
              <p className="ci-insight__body">{insightBody}</p>
            </div>
            <p className="ci-done__where">
              📊 Your check-ins build your trends, triggers, and patterns on <strong>Track</strong>.
            </p>
            {nudge && (
              <div style={{ background: '#f0faf8', border: '1px solid #c0e8df', borderRadius: 12, padding: '12px 14px', marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{nudge.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, color: '#1a4a3a', lineHeight: 1.45, marginBottom: 4 }}>{nudge.text}</div>
                  <button type="button" onClick={onClose} style={{ fontSize: 12, fontWeight: 700, color: '#2D9B83', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    {nudge.cta} →
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <button type="button" onClick={() => setStep(0)} style={{
                background: 'none', border: 'none',
                color: '#94a3b8', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', padding: '8px 0',
              }}>Re-do today's</button>
              {onViewTrack && (
                <button type="button" onClick={onViewTrack} style={{
                  background: 'none', border: '1.5px solid #2D9B83',
                  color: '#2D9B83', borderRadius: 99, padding: '8px 18px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>View more on Track →</button>
              )}
            </div>
          </div>
        )}

        {step === 6 && viewing && (() => {
          // Re-derive insight from saved check-in data
          const vStress = (viewing.contextLabels || []).some(l => l?.toLowerCase().includes('stress'))
          const vNormal = (viewing.contextLabels || []).some(l => l?.toLowerCase().includes('normal'))
          const vSev = viewing.severity
          let vIcon = '📊', vHead = '', vBody = ''
          if (vStress && vSev != null && vSev >= 2) {
            vIcon = '⚠️'
            vHead = 'Stress + a harder day — worth keeping an eye on'
            vBody = 'Stress can raise blood pressure and blood sugar, and make it harder to stick to your routine. A short wind-down tonight can help your body recover.'
          } else if (vStress) {
            vHead = "Stressful day logged — we'll keep watching"
            vBody = 'Chronic stress is a real cardiovascular risk factor. Even a 10-minute walk or breathing exercise can take the edge off.'
          } else if (vNormal || vSev === 0) {
            vIcon = '✅'
            vHead = 'Steady day logged — consistency is the work'
            vBody = 'Consistent check-ins reveal the patterns that matter most for long-term cardiometabolic health.'
          } else {
            vHead = 'Check-in logged — patterns take shape over time'
            vBody = "Every check-in adds to your health story. We'll flag patterns as they emerge."
          }

          return (
            <div className="ci-done">
              <button className="ci-close" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
              <div className="ci-done__emoji">🎉</div>
              <h3 className="ci-done__title">Check-in logged.</h3>
              <p className="ci-done__sub">
                We saved how you're feeling and what's going on today.
                {viewing.wearableSynced && <> Wearable data synced.</>}
              </p>
              <div className="ci-insight">
                <div className="ci-insight__tag"><span className="ci-insight__dot" />Insight · Based on your check-in</div>
                <h4 className="ci-insight__heading">{vIcon} {vHead}</h4>
                <p className="ci-insight__body">{vBody}</p>
              </div>
              <p className="ci-done__where">
                📊 Your check-ins build your trends, triggers, and patterns on <strong>Track</strong>.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <button type="button" onClick={() => { setViewing(null); setStep(0) }} style={{
                  background: 'none', border: 'none',
                  color: '#94a3b8', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', padding: '8px 0',
                }}>Re-do today's</button>
                {onViewTrack && (
                  <button type="button" onClick={onViewTrack} style={{
                    background: 'none', border: '1.5px solid #2D9B83',
                    color: '#2D9B83', borderRadius: 99, padding: '8px 18px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>View more on Track →</button>
                )}
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}
