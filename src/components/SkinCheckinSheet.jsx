import React, { useState, useEffect, useMemo, useRef } from 'react'

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
  const [step, setStep]         = useState(0)
  // Per-condition answers. Single-condition users still see this as a single-state UI;
  // multi-condition users get a toggle to switch which condition they're answering for.
  const [severityByCond, setSeverityByCond] = useState({})
  const [severityAiByCond, setSeverityAiByCond] = useState({})
  const [symptomsByCond, setSymptomsByCond] = useState({})
  const [activeCondition, setActiveCondition] = useState(null)
  const [context, setContext]   = useState([])
  const [contextDetails, setContextDetails] = useState({})    // { [optIndex]: free text }
  const [photoUrl, setPhotoUrl] = useState('')
  const [wearableSynced, setWearableSynced] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [viewing, setViewing]   = useState(null)              // saved record shown in summary-view mode
  const [treatments, setTreatments] = useState([])
  const [treatmentInput, setTreatmentInput] = useState('')
  const fileRef = useRef(null)

  const DEMO_PHOTO = null

  // Reset whenever the sheet opens. If today's check-in already exists,
  // open in summary-view mode so the user can see what they logged.
  useEffect(() => {
    if (!open) {
      // Always release the body scroll lock when the sheet is closed,
      // regardless of where the close came from. (Earlier cleanup only
      // ran in stale closures, leaving Track unscrollable after a log.)
      document.body.style.overflow = ''
      return
    }

    // Sheet is opening
    setSeverityByCond({}); setSeverityAiByCond({}); setSymptomsByCond({})
    setContext([]); setContextDetails({})
    setPhotoUrl(''); setWearableSynced(false); setAnalyzing(false)
    setTreatmentInput('')
    document.body.style.overflow = 'hidden'

    const profile = readProfile()
    const conds = trackedConditionsFor(profile)
    setActiveCondition(conds[0])
    // Pre-load saved treatments as a flat list
    const saved = profile.treatmentList || []
    const flat = saved.map(t => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
    setTreatments([...new Set(flat)])

    let last = null
    try { last = JSON.parse(localStorage.getItem(CHECKIN_KEY) || 'null') } catch (_) {}
    const todayLogged = last && new Date(last.date).toDateString() === new Date().toDateString()

    if (todayLogged) {
      setViewing(last)
      setStep(6)
    } else {
      setViewing(null)
      setStep(0)
    }

    // Cleanup always restores scroll, in case the component unmounts mid-flow
    return () => { document.body.style.overflow = '' }
  }, [open])

  const profile = useMemo(() => open ? readProfile() : {}, [open])
  const conditions = useMemo(() => trackedConditionsFor(profile), [profile])
  // Resolve current playbook based on the active condition
  const { pb, label: conditionLabel } = useMemo(() => {
    if (!activeCondition || activeCondition === '__generic') return { pb: GENERIC_PLAYBOOK, label: 'health' }
    return playbookFor(activeCondition)
  }, [activeCondition])

  // Convenience for the currently active condition's answers
  const severity   = activeCondition ? severityByCond[activeCondition] ?? null : null
  const severityAi = activeCondition ? !!severityAiByCond[activeCondition]     : false
  const symptoms   = activeCondition && Array.isArray(symptomsByCond[activeCondition]) ? symptomsByCond[activeCondition] : []

  const totalSteps = 5
  const progressPct = ((step + 1) / totalSteps) * 100

  // Prototype upload: skips the file picker and loads a bundled demo image.
  // Same mock-AI behavior as a real upload (spinner → pre-fill severity).
  function useDemoPhoto() {
    setPhotoUrl(DEMO_PHOTO)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      // Pre-fill the active condition with a plausible AI guess
      const c = activeCondition || trackedConditionsFor(readProfile())[0]
      setSeverityByCond(s => ({ ...s, [c]: 2 }))
      setSeverityAiByCond(s => ({ ...s, [c]: true }))
      setStep(1)
    }, 1800)
  }

  function onPickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please choose an image.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Please keep it under 5 MB.'); return }
    const reader = new FileReader()
    reader.onload = ev => {
      const url = String(ev.target?.result || '')
      setPhotoUrl(url)
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        const c = activeCondition || trackedConditionsFor(readProfile())[0]
        setSeverityByCond(s => ({ ...s, [c]: 2 }))
        setSeverityAiByCond(s => ({ ...s, [c]: true }))
        setStep(1)
      }, 1800)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  function syncWearable() { setWearableSynced(true); setStep(1) }
  function skipExtras()   { setStep(1) }
  function pickSeverity(i) {
    const key = activeCondition || '__generic'
    setSeverityByCond(s => ({ ...s, [key]: i }))
    setSeverityAiByCond(s => ({ ...s, [key]: false }))
  }
  // Multi-select: toggles a symptom in/out of the active condition's list.
  // "Feeling fine" (index 0) is exclusive — picking it clears everything
  // else, and picking any real symptom clears "feeling fine".
  function toggleSymptom(i) {
    const key = activeCondition || '__generic'
    setSymptomsByCond(s => {
      const current = Array.isArray(s[key]) ? s[key] : []
      let next
      if (i === 0) {
        next = current.includes(0) ? [] : [0]
      } else {
        const withoutFine = current.filter(x => x !== 0)
        next = withoutFine.includes(i) ? withoutFine.filter(x => x !== i) : [...withoutFine, i]
      }
      return { ...s, [key]: next }
    })
  }

  // At least one condition has an answer
  const anySeverityAnswered = Object.values(severityByCond).some(v => v != null)
  const anySymptomsAnswered = Object.values(symptomsByCond).some(v => Array.isArray(v) && v.length > 0)
  function toggleContext(i) {
    setContext(prev => {
      const has = prev.includes(i)
      // If deselecting, also drop its captured detail
      if (has) {
        setContextDetails(d => { const n = { ...d }; delete n[i]; return n })
        return prev.filter(x => x !== i)
      }
      return [...prev, i]
    })
  }
  function setContextDetail(i, val) {
    setContextDetails(d => ({ ...d, [i]: val }))
  }

  function addTreatment(name) {
    const v = (name ?? treatmentInput).trim()
    if (!v) return
    setTreatments(prev => prev.includes(v) ? prev : [...prev, v])
    setTreatmentInput('')
  }
  function removeTreatment(name) {
    setTreatments(prev => prev.filter(x => x !== name))
  }
  const treatmentSuggestions = treatmentInput.trim().length >= 1
    ? COMMON_TREATMENTS.filter(t =>
        t.toLowerCase().includes(treatmentInput.trim().toLowerCase()) && !treatments.includes(t)
      ).slice(0, 6)
    : []

  function finish() {
    const contextLabels = (context || []).map(i => DAY_CONTEXT[i]?.l).filter(Boolean)
    const contextEntries = (context || []).map(i => ({
      label: DAY_CONTEXT[i]?.l,
      detail: (contextDetails[i] || '').trim() || null,
    })).filter(x => x.label)

    // Build per-condition answer list (only conditions that got at least one answer)
    const conditionAnswers = conditions
      .filter(c => severityByCond[c] != null || (Array.isArray(symptomsByCond[c]) && symptomsByCond[c].length > 0))
      .map(c => ({
        condition: c === '__generic' ? null : c,
        severity:    severityByCond[c] ?? null,
        severityAi:  !!severityAiByCond[c],
        symptoms:    Array.isArray(symptomsByCond[c]) ? symptomsByCond[c] : [],
      }))

    // Pick the first answered condition for top-level fields (backwards compat
    // with the Track page's skinScore reading + the summary view)
    const primaryC = conditions.find(c => severityByCond[c] != null) || conditions[0]
    const topSeverity = severityByCond[primaryC] ?? null
    const topSymptoms = Array.isArray(symptomsByCond[primaryC]) ? symptomsByCond[primaryC] : []
    const topSeverityAi = !!severityAiByCond[primaryC]
    const skinScore = topSeverity == null ? null : (5 - topSeverity)
    const primaryLabel = (primaryC && primaryC !== '__generic') ? primaryC.toLowerCase() : 'health'

    const checkin = {
      date: new Date().toISOString(),
      severity: topSeverity, severityAi: topSeverityAi, skinScore,
      symptoms: topSymptoms,
      conditionLabel: primaryLabel,
      conditionAnswers,
      contextLabels,
      contextEntries,
      treatments,
      photoAttached: false,
      wearableSynced,
    }
    writeCheckin(checkin)

    try {
      const profile = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
      profile.treatmentList = treatments.map(name => ({ name, category: categoryFor(name), addedAt: new Date().toISOString() }))
      localStorage.setItem('cardiometabolicProfile', JSON.stringify(profile))
    } catch (_) {}

    onComplete?.(checkin)
    setStep(5)
  }

  if (!open) return null

  const stressDay = context.includes(0)
  const normalDay = context.includes(6)
  let insightIcon = '📊', insightHead = '', insightBody = ''
  if (stressDay && severity != null && severity >= 2) {
    insightIcon = '⚠️'
    insightHead = 'Stress + a harder day — worth keeping an eye on'
    insightBody = `Stress can raise blood pressure and blood sugar, and make it harder to stick to your routine. A short wind-down tonight can help your body recover.`
  } else if (stressDay) {
    insightHead = 'Stressful day logged — we\'ll keep watching'
    insightBody = 'Chronic stress is a real cardiovascular risk factor. Even a 10-minute walk or breathing exercise can take the edge off.'
  } else if (normalDay || severity === 0) {
    insightIcon = '✅'
    insightHead = 'Steady day logged — consistency is the work'
    insightBody = 'Consistent check-ins reveal the patterns that matter most for long-term cardiometabolic health.'
  } else {
    insightHead = 'Check-in logged — patterns take shape over time'
    insightBody = 'Every check-in adds to your health story. We\'ll flag patterns as they emerge.'
  }

  const lastDateStr = lastCheckinLabel(readCheckins().slice(-1)[0]?.date)

  return (
    <div className="ci-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ci-sheet">

        {step === 0 && (
          <>
            <div className="ci-header">
              <span className="ci-label">{lastDateStr}</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
            <h2 className="ci-title">How are you feeling today?</h2>
            <p className="ci-sub">Takes about a minute. Your symptoms and habits help us connect the dots between how you feel and what your numbers show.</p>

            <div className="ci-start-list">
              <button className={`ci-start-card${wearableSynced ? ' ci-start-card--done' : ''}`} type="button" onClick={syncWearable}>
                <span className="ci-start-card__icon">⌚</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Sync wearable</span>
                  <span className="ci-start-card__desc">Apple Watch, Oura, Whoop — pull in sleep, HRV, and activity.</span>
                </span>
                <span className="ci-start-card__arrow">{wearableSynced ? '✓' : '›'}</span>
              </button>

              <button className="ci-start-card ci-start-card--ghost" type="button" onClick={skipExtras}>
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

        {step === 2 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 2 of 3</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>

            <h2 className="ci-title">How has your mood been today?</h2>
            <p className="ci-sub">Your emotional state is part of your health picture — stress and anxiety can directly affect your numbers.</p>

            <div className="ci-opts ci-opts--list">
              {[
                { e: '😄', l: 'Great — feeling positive and energized' },
                { e: '🙂', l: 'Good — mostly fine, nothing major' },
                { e: '😐', l: 'Neutral — getting through the day' },
                { e: '😔', l: 'Low — stressed, anxious, or drained' },
                { e: '😫', l: 'Rough — really struggling today' },
              ].map((opt, i) => (
                <button
                  key={i}
                  className={`ci-opt ci-opt--row${severity === i ? ' ci-opt--sel' : ''}`}
                  onClick={() => pickSeverity(i)}
                >
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(1)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={() => setStep(3)}>
                {anySeverityAnswered ? 'Continue →' : 'Skip →'}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 3 of 3</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>

            <h2 className="ci-title">Any physical symptoms today?</h2>
            <p className="ci-sub">Pick as many as apply — focus on the ones that are most persistent, or nothing if you're feeling fine.</p>

            <div className="ci-opts ci-opts--list">
              {PHYSICAL_SYMPTOMS.map((opt, i) => (
                <button
                  key={i}
                  className={`ci-opt ci-opt--row${symptoms.includes(i) ? ' ci-opt--sel' : ''}`}
                  onClick={() => toggleSymptom(i)}
                >
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(2)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={finish}>
                {anySymptomsAnswered ? 'Log check-in →' : 'Skip & log →'}
              </button>
            </div>
          </>
        )}


        {step === 1 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 1 of 3 · My medications & products</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '25%' }} /></div>

            <h2 className="ci-title">
              {treatments.length === 0 ? 'What are you currently taking or using?' : 'Still using these?'}
            </h2>
            <p className="ci-sub">
              {treatments.length === 0
                ? <>Search by name or type your own. We'll organize them for you.</>
                : <>Confirm what's still active, remove anything you've stopped, or add something new.</>}
            </p>

            {/* Grouped display */}
            {treatments.length > 0 && (() => {
              const grouped = groupByCategory(treatments)
              return (
                <div style={{ marginBottom: 16 }}>
                  {Object.entries(grouped).map(([cat, names]) => (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: '0 0 6px' }}>{cat}</p>
                      <div className="ci-tx-chips">
                        {names.map(name => (
                          <span key={name} className="ci-tx-chip">
                            <span className="ci-tx-chip__name">{name}</span>
                            <button type="button" className="ci-tx-chip__x" aria-label={`Remove ${name}`} onClick={() => removeTreatment(name)}>✕</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}

            <div className="ci-tx-input-wrap">
              <input
                className="ci-tx-input"
                type="text"
                placeholder="Search medications, supplements, programs…"
                value={treatmentInput}
                onChange={e => setTreatmentInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTreatment() } }}
              />
              {treatmentInput.trim() && (
                <button type="button" className="ci-tx-add" onClick={() => addTreatment()}>
                  + Add "{treatmentInput.trim()}"
                </button>
              )}
              {treatmentSuggestions.length > 0 && (
                <ul className="ci-tx-suggest">
                  {treatmentSuggestions.map(s => (
                    <li key={s}>
                      <button type="button" className="ci-tx-suggest__btn" onClick={() => addTreatment(s)}>
                        <span className="ci-tx-suggest__plus">+</span>{s}
                        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 6 }}>{categoryFor(s)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(0)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={() => setStep(2)}>
                {treatments.length === 0 ? 'Skip →' : 'Continue →'}
              </button>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="ci-done">
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
            <div className="ci-nav-row" style={{ marginTop: 0 }}>
              <button className="ci-back" type="button" onClick={onClose}>Back to feed</button>
              {onViewTrack && (
                <button className="ci-btn ci-btn--inline" type="button" onClick={onViewTrack}>
                  View on Track →
                </button>
              )}
            </div>
          </div>
        )}

        {step === 6 && viewing && (() => {
          const entries = viewing.contextEntries
            || (viewing.contextLabels || []).map(l => ({ label: l, detail: null }))
          const ts = new Date(viewing.date)
          const timeStr = ts.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

          // New-format: per-condition answers
          const perCond = Array.isArray(viewing.conditionAnswers) && viewing.conditionAnswers.length > 0
            ? viewing.conditionAnswers
            : null
          // Resolve label/symptom strings per condition for display
          const renderCondRows = perCond
            ? perCond.map(ca => {
                const condName = ca.condition || 'Skin'
                const cpb = ca.condition && CONDITION_PLAYBOOKS[ca.condition] ? CONDITION_PLAYBOOKS[ca.condition] : GENERIC_PLAYBOOK
                const sev  = ca.severity != null ? cpb.severityOpts[ca.severity]?.l : null
                const sympLabels = resolveSymptomLabels(ca.symptoms)
                const symp = sympLabels.length > 0 ? sympLabels.join(', ') : null
                return { condName, sev, symp }
              })
            : null

          return (
            <div className="ci-done">
              <div className="ci-done__emoji" style={{ background: 'linear-gradient(135deg, var(--color-sage), #44E2DC)' }}>✓</div>
              <h3 className="ci-done__title">Today's check-in</h3>
              <p className="ci-done__sub">Logged at {timeStr}.</p>
              <div className="ci-summary-card">
                {renderCondRows
                  ? renderCondRows.map((r, idx) => (
                      <React.Fragment key={idx}>
                        {r.sev && (
                          <div className="ci-summary-row">
                            <div className="ci-summary-row__key">{r.condName}</div>
                            <div className="ci-summary-row__val">{r.sev}</div>
                          </div>
                        )}
                        {r.symp && (
                          <div className="ci-summary-row">
                            <div className="ci-summary-row__key">{r.condName} symptoms</div>
                            <div className="ci-summary-row__val">{r.symp}</div>
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  : (() => {
                      // Legacy single-condition format
                      const sevLabel = viewing.severity != null && pb.severityOpts[viewing.severity]
                        ? pb.severityOpts[viewing.severity].l : null
                      const legacySympLabels = resolveSymptomLabels(viewing.symptoms)
                      const sympLabel = legacySympLabels.length > 0 ? legacySympLabels.join(', ') : null
                      return (
                        <>
                          {sevLabel && (
                            <div className="ci-summary-row">
                              <div className="ci-summary-row__key">{viewing.conditionLabel ? `Your ${viewing.conditionLabel}` : 'Your health'}</div>
                              <div className="ci-summary-row__val">{sevLabel}</div>
                            </div>
                          )}
                          {sympLabel && (
                            <div className="ci-summary-row">
                              <div className="ci-summary-row__key">Symptoms</div>
                              <div className="ci-summary-row__val">{sympLabel}</div>
                            </div>
                          )}
                        </>
                      )
                    })()
                }
                {entries.length > 0 && (
                  <div className="ci-summary-row">
                    <div className="ci-summary-row__key">What's going on</div>
                    <div className="ci-summary-row__val">
                      {entries.map((e, i) => (
                        <div key={i} className="ci-summary-entry">
                          <strong>{e.label}</strong>{e.detail ? <span className="ci-summary-entry__detail"> — {e.detail}</span> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {viewing.treatments?.length > 0 && (() => {
                  const grouped = groupByCategory(viewing.treatments)
                  return Object.entries(grouped).map(([cat, names]) => (
                    <div key={cat} className="ci-summary-row">
                      <div className="ci-summary-row__key">{cat}</div>
                      <div className="ci-summary-row__val">{names.join(', ')}</div>
                    </div>
                  ))
                })()}
                {viewing.photoAttached && (
                  <div className="ci-summary-row">
                    <div className="ci-summary-row__key">Photo</div>
                    <div className="ci-summary-row__val">Attached for AI reference</div>
                  </div>
                )}
                {viewing.wearableSynced && (
                  <div className="ci-summary-row">
                    <div className="ci-summary-row__key">Wearable</div>
                    <div className="ci-summary-row__val">Synced</div>
                  </div>
                )}
              </div>
              <p className="ci-done__where">
                📊 Your trends, triggers, and patterns live on <strong>Track</strong>.
              </p>
              <div className="ci-nav-row" style={{ marginTop: 0 }}>
                <button className="ci-back" type="button" onClick={() => { setViewing(null); setStep(0) }}>
                  Re-do today's
                </button>
                {onViewTrack
                  ? <button className="ci-btn ci-btn--inline" onClick={onViewTrack}>View on Track →</button>
                  : <button className="ci-btn ci-btn--inline" onClick={onClose}>Back to feed</button>}
              </div>
            </div>
          )
        })()}

      </div>
    </div>
  )
}
