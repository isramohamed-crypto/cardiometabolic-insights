import React, { useState, useEffect, useMemo, useRef } from 'react'

const CHECKIN_KEY  = 'skinsightsLastCheckin'
const CHECKINS_KEY = 'skinsightsCheckins'

/* ── Personalization by condition ─────────────────────────────────── */

// Generic fallback scale, used only when a condition-specific playbook doesn't
// define its own severity options.
const FALLBACK_SEVERITY = [
  { e: '✨', l: 'Clear — skin looks normal' },
  { e: '🙂', l: 'Mild — minor dryness or irritation' },
  { e: '😐', l: 'Moderate — noticeable in spots' },
  { e: '😣', l: 'Bad — affecting how I feel today' },
  { e: '🔥', l: 'Severe — flaring or painful' },
]

const CONDITION_PLAYBOOKS = {
  'Eczema': {
    severityQ: 'How is your eczema today?',
    severitySub: 'Pick what best matches your usual problem areas right now.',
    severityOpts: [
      { e: '✨', l: 'Clear — eczema isn\'t visible today' },
      { e: '🙂', l: 'Mild eczema — slight dryness, no real itch' },
      { e: '😐', l: 'Moderate eczema — itchy patches in usual spots' },
      { e: '😣', l: 'Bad eczema — large red areas, frequent itch' },
      { e: '🔥', l: 'Severe eczema flare — bleeding, weeping, or constant itch' },
    ],
    symptomsQ: 'How bothered were you by eczema itch in the last 24 hours?',
    symptomsSub: 'Include both daytime and overnight itching.',
    symptoms: [
      { e: '😌', l: 'I didn\'t really itch' },
      { e: '🤏', l: 'A few brief moments of itching' },
      { e: '😬', l: 'Itched several times — distracting' },
      { e: '😖', l: 'Constant itch most of the day' },
      { e: '😫', l: 'Itch woke me up or kept me from sleeping' },
    ],
  },
  'Psoriasis': {
    severityQ: 'How is your psoriasis today?',
    severitySub: 'Look at your usual plaque areas.',
    severityOpts: [
      { e: '✨', l: 'Clear — no visible plaques today' },
      { e: '🙂', l: 'Mild psoriasis — flat, faintly pink areas' },
      { e: '😐', l: 'Moderate psoriasis — raised, scaly plaques' },
      { e: '😣', l: 'Bad psoriasis — thicker plaques, itch or burn' },
      { e: '🔥', l: 'Severe psoriasis flare — spreading, cracking, or bleeding' },
    ],
    symptomsQ: 'What\'s bothering you most about your psoriasis today?',
    symptomsSub: 'Pick the most prominent issue right now.',
    symptoms: [
      { e: '😌', l: 'Nothing in particular' },
      { e: '🩹', l: 'Visible scaling or flaking on plaques' },
      { e: '🔥', l: 'Burning or stinging on the patches' },
      { e: '😣', l: 'Itching that won\'t quit' },
      { e: '🦴', l: 'Joint pain or stiffness too' },
    ],
  },
  'Rosacea': {
    severityQ: 'How is your rosacea today?',
    severitySub: 'Cheeks, nose, forehead, chin.',
    severityOpts: [
      { e: '✨', l: 'Calm — no visible flushing today' },
      { e: '🙂', l: 'Mild rosacea — slight warmth or pinkness' },
      { e: '😐', l: 'Moderate rosacea — visible redness' },
      { e: '😣', l: 'Bad rosacea — persistent redness with bumps' },
      { e: '🔥', l: 'Severe rosacea flare — burning, stinging, or strong flushing' },
    ],
    symptomsQ: 'What rosacea symptoms are you noticing today?',
    symptomsSub: 'Pick the most prominent.',
    symptoms: [
      { e: '😌', l: 'Skin feels fine' },
      { e: '🌡️', l: 'Warmth or flushing in patches' },
      { e: '🫧', l: 'Bumps or pustules visible' },
      { e: '🔥', l: 'Burning or stinging on touch' },
      { e: '👁️', l: 'Eye irritation or dryness too' },
    ],
  },
  'Acne': {
    severityQ: 'How is your acne today?',
    severitySub: 'Active breakouts and overall condition.',
    severityOpts: [
      { e: '✨', l: 'Clear — no active acne today' },
      { e: '🙂', l: 'Mild acne — a few small spots or blackheads' },
      { e: '😐', l: 'Moderate acne — several active pimples' },
      { e: '😣', l: 'Bad acne — multiple inflamed lesions' },
      { e: '🔥', l: 'Severe acne — painful or cystic breakout' },
    ],
    symptomsQ: 'Where are you seeing the most acne breakouts today?',
    symptomsSub: 'Helps us spot what areas are reacting.',
    symptoms: [
      { e: '😌', l: 'Nothing today' },
      { e: '🙂', l: 'One area — chin or T-zone' },
      { e: '😐', l: 'Spread across face' },
      { e: '😣', l: 'Face + body (chest, back, shoulders)' },
      { e: '🔴', l: 'Painful or deep cystic spots' },
    ],
  },

  /* ─── Non-diagnosis concerns (from onboarding "Not yet / not sure" branch) ─── */
  'Redness or irritation': {
    severityQ: 'How is your redness or irritation today?',
    severitySub: 'Look at usual reactive spots.',
    severityOpts: [
      { e: '✨', l: 'Clear — no visible redness' },
      { e: '🙂', l: 'Mild — slight pinkness in spots' },
      { e: '😐', l: 'Moderate — visible redness across areas' },
      { e: '😣', l: 'Significant — large red, irritated areas' },
      { e: '🔥', l: 'Severe — angry, inflamed skin' },
    ],
    symptomsQ: 'How does the redness feel today?',
    symptomsSub: 'Pick the most prominent sensation.',
    symptoms: [
      { e: '😌', l: 'Just looks red — feels fine' },
      { e: '🌡️', l: 'Warmth or flushing' },
      { e: '🔥', l: 'Burning or stinging' },
      { e: '😖', l: 'Tight, sensitive, or painful' },
      { e: '👁️', l: 'Reactive to products or environment' },
    ],
  },
  'Dryness or flaking': {
    severityQ: 'How dry is your skin today?',
    severitySub: 'Across your usual problem areas.',
    severityOpts: [
      { e: '✨', l: 'Hydrated — skin feels comfortable' },
      { e: '🙂', l: 'Mild dryness — tight after washing' },
      { e: '😐', l: 'Moderate — visible flaking or rough patches' },
      { e: '😣', l: 'Significant — cracking or peeling' },
      { e: '🔥', l: 'Severe — bleeding cracks or raw areas' },
    ],
    symptomsQ: 'What goes with the dryness?',
    symptomsSub: 'Pick the most prominent.',
    symptoms: [
      { e: '😌', l: 'Just dry — nothing else' },
      { e: '🤏', l: 'Tightness when I move' },
      { e: '😬', l: 'Itching from dryness' },
      { e: '😖', l: 'Stinging or burning' },
      { e: '🩸', l: 'Cracks that bleed or weep' },
    ],
  },
  'Itching or sensitivity': {
    severityQ: 'How is your itch or sensitivity today?',
    severitySub: 'Include both day and overnight.',
    severityOpts: [
      { e: '😌', l: 'No itch — skin feels calm' },
      { e: '🙂', l: 'Mild — occasional, easy to ignore' },
      { e: '😐', l: 'Moderate — distracting, multiple times' },
      { e: '😣', l: 'Severe — constant, hard to focus' },
      { e: '🔥', l: 'Disruptive — interfering with sleep or daily life' },
    ],
    symptomsQ: 'What seems to set it off today?',
    symptomsSub: 'The closest trigger you noticed.',
    symptoms: [
      { e: '😌', l: 'Nothing in particular' },
      { e: '🧴', l: 'Products or fragrance' },
      { e: '🌡️', l: 'Heat or sweat' },
      { e: '🥶', l: 'Cold or dry air' },
      { e: '🤔', l: 'Random — no clear cause' },
    ],
  },
  'Breakouts or bumps': {
    severityQ: 'How many breakouts today?',
    severitySub: 'Pimples, cysts, painful spots.',
    severityOpts: [
      { e: '✨', l: 'None today' },
      { e: '🙂', l: 'One or two small spots' },
      { e: '😐', l: 'A handful of active pimples' },
      { e: '😣', l: 'Multiple, including inflamed ones' },
      { e: '🔥', l: 'Painful or cystic breakout' },
    ],
    symptomsQ: 'Where are the breakouts today?',
    symptomsSub: 'Helps spot what areas are reacting.',
    symptoms: [
      { e: '😌', l: 'Nothing notable' },
      { e: '🙂', l: 'One area — chin or T-zone' },
      { e: '😐', l: 'Spread across face' },
      { e: '😣', l: 'Face + body (chest, back, shoulders)' },
      { e: '🔴', l: 'Painful or cystic spots' },
    ],
  },
  'Unpredictable flare-ups': {
    severityQ: 'Are you in a flare right now?',
    severitySub: 'Right now, not necessarily yesterday.',
    severityOpts: [
      { e: '✨', l: 'Calm — no flare today' },
      { e: '🙂', l: 'Slight irritation — might be starting' },
      { e: '😐', l: 'Moderate flare in progress' },
      { e: '😣', l: 'Strong flare — affecting daily life' },
      { e: '🔥', l: 'Major flare — worst it gets' },
    ],
    symptomsQ: 'What does this flare look like?',
    symptomsSub: 'Most prominent symptom right now.',
    symptoms: [
      { e: '😌', l: 'Nothing visible — just feels off' },
      { e: '🌡️', l: 'Redness and warmth' },
      { e: '🩹', l: 'Dryness or scaling' },
      { e: '😣', l: 'Itching that won\'t stop' },
      { e: '🔥', l: 'Burning, stinging, or bleeding' },
    ],
  },
}

const GENERIC_PLAYBOOK = {
  severityQ: 'How is your skin today?',
  severitySub: 'A quick overall read of how it looks and feels.',
  severityOpts: FALLBACK_SEVERITY,
  symptomsQ: 'What are you experiencing today?',
  symptomsSub: 'Pick the most prominent thing.',
  symptoms: [
    { e: '😌', l: 'Nothing notable' },
    { e: '🤏', l: 'Some dryness or tightness' },
    { e: '🌶️', l: 'Stinging or burning' },
    { e: '😬', l: 'Persistent itch' },
    { e: '🩸', l: 'Visible damage (cracking, bleeding)' },
  ],
}

// Each option can have a `detail` follow-up that appears below when it's
// selected, so the user can capture specifics (which product, what food, etc).
// Common treatments + products. Used to autosuggest as the user types. The
// user can also enter freeform text. Grouped roughly by category so the
// suggestion list feels relevant. Not meant to be exhaustive — a starter set.
const COMMON_TREATMENTS = [
  // Moisturizers / barrier
  'CeraVe Moisturizing Cream', 'CeraVe Hydrating Cleanser', 'Cetaphil Moisturizing Cream',
  'Vanicream Moisturizing Cream', 'Aquaphor Healing Ointment', 'Eucerin Advanced Repair',
  'La Roche-Posay Lipikar', 'Aveeno Eczema Therapy', 'Vaseline',
  // Rx topicals — eczema/psoriasis
  'Hydrocortisone 1%', 'Hydrocortisone 2.5%', 'Triamcinolone 0.1%',
  'Clobetasol propionate', 'Betamethasone', 'Tacrolimus (Protopic)',
  'Pimecrolimus (Elidel)', 'Crisaborole (Eucrisa)', 'Ruxolitinib (Opzelura)',
  'Calcipotriene (Dovonex)',
  // Biologics / systemic
  'Dupixent (dupilumab)', 'Adbry (tralokinumab)', 'Cibinqo (abrocitinib)',
  'Rinvoq (upadacitinib)', 'Skyrizi (risankizumab)', 'Cosentyx (secukinumab)',
  'Humira (adalimumab)',
  // Acne
  'Tretinoin 0.025%', 'Tretinoin 0.05%', 'Adapalene (Differin) 0.1%',
  'Benzoyl peroxide 2.5%', 'Benzoyl peroxide 10%', 'Clindamycin gel',
  'Salicylic acid', 'Azelaic acid', 'Spironolactone', 'Isotretinoin (Accutane)',
  // Rosacea
  'Metronidazole gel', 'Ivermectin (Soolantra)', 'Brimonidine (Mirvaso)',
  'Oxymetazoline (Rhofade)', 'Doxycycline',
  // Cleansers / actives
  'Niacinamide serum', 'Hyaluronic acid serum', 'Vitamin C serum',
  // Sun
  'SPF 30 sunscreen', 'SPF 50 sunscreen', 'EltaMD UV Clear',
  // Supplements
  'Omega-3 / fish oil', 'Vitamin D', 'Probiotics', 'Zinc',
]

const DAY_CONTEXT = [
  { e: '😰', l: 'Stressful day',   detail: { prompt: 'What was stressful?',          placeholder: 'Work, family, deadline…' } },
  { e: '😴', l: 'Rough night',     detail: { prompt: 'What was off?',                 placeholder: 'Couldn\'t sleep, itched all night…' } },
  { e: '🌤️', l: 'Weather change',  detail: { prompt: 'What changed?',                 placeholder: 'Got hot/cold/humid/dry…' } },
  { e: '🍽️', l: 'New food',        detail: { prompt: 'Which food?',                   placeholder: 'Dairy, gluten, citrus, alcohol…' } },
  { e: '🧴', l: 'Tried new product', detail: { prompt: 'Which product did you try for the first time today?', placeholder: 'Detergent, soap, sunscreen…' } },
  { e: '🏃', l: 'Routine changed', detail: { prompt: 'What changed?',                 placeholder: 'Workout, travel, schedule…' } },
  { e: '👍', l: 'Normal day', wide: true },
]

/* ── Storage helpers ──────────────────────────────────────────────── */

function readProfile() {
  try { return JSON.parse(localStorage.getItem('skinsightsProfile') || '{}') } catch (_) { return {} }
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
  if (!condition) return { pb: GENERIC_PLAYBOOK, label: 'skin' }
  const pb = CONDITION_PLAYBOOKS[condition]
  return pb ? { pb, label: condition.toLowerCase() } : { pb: GENERIC_PLAYBOOK, label: 'skin' }
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
  // Treatments & products (Q1 — per-condition for multi-condition users)
  // { [conditionName]: [productName, ...] }
  const [treatmentsByCond, setTreatmentsByCond] = useState({})
  const [treatmentInput, setTreatmentInput] = useState('')
  const fileRef = useRef(null)

  // Prototype: when the user taps "Upload a skin photo", auto-load this
  // bundled demo image instead of opening a file picker. Swap the path
  // here for a different photo if you want.
  const DEMO_PHOTO = '/abby-tai-eczema.webp'

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

    // Pick the first tracked condition as active by default
    const profile = readProfile()
    const conds = trackedConditionsFor(profile)
    setActiveCondition(conds[0])
    // Pre-load saved treatments, grouped by condition. Legacy items
    // (strings or {name} without condition) get assigned to the first tracked condition.
    const saved = profile.treatmentList || []
    const byCond = {}
    for (const c of conds) byCond[c] = []
    for (const item of saved) {
      const name = typeof item === 'string' ? item : item?.name
      if (!name) continue
      const tagged = (typeof item === 'object' && item?.condition && byCond[item.condition] != null)
        ? item.condition
        : conds[0]
      byCond[tagged] = (byCond[tagged] || []).concat(name)
    }
    setTreatmentsByCond(byCond)

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
    if (!activeCondition || activeCondition === '__generic') return { pb: GENERIC_PLAYBOOK, label: 'skin' }
    return playbookFor(activeCondition)
  }, [activeCondition])

  // Convenience for the currently active condition's answers
  const severity   = activeCondition ? severityByCond[activeCondition] ?? null : null
  const severityAi = activeCondition ? !!severityAiByCond[activeCondition]     : false
  const symptoms   = activeCondition ? symptomsByCond[activeCondition] ?? null : null

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
    if (!activeCondition) return
    setSeverityByCond(s => ({ ...s, [activeCondition]: i }))
    setSeverityAiByCond(s => ({ ...s, [activeCondition]: false }))
  }
  function pickSymptoms(i) {
    if (!activeCondition) return
    setSymptomsByCond(s => ({ ...s, [activeCondition]: i }))
  }

  // At least one condition has an answer
  const anySeverityAnswered = Object.values(severityByCond).some(v => v != null)
  const anySymptomsAnswered = Object.values(symptomsByCond).some(v => v != null)
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

  // Active-condition slice of the treatments map. All add/remove flows through here.
  const treatments = (activeCondition && treatmentsByCond[activeCondition]) || []

  function addTreatment(name) {
    if (!activeCondition) return
    const v = (name ?? treatmentInput).trim()
    if (!v) return
    setTreatmentsByCond(prev => {
      const current = prev[activeCondition] || []
      if (current.includes(v)) return prev
      return { ...prev, [activeCondition]: [...current, v] }
    })
    setTreatmentInput('')
  }
  function removeTreatment(name) {
    if (!activeCondition) return
    setTreatmentsByCond(prev => ({
      ...prev,
      [activeCondition]: (prev[activeCondition] || []).filter(x => x !== name),
    }))
  }
  // Filter common-treatments suggestions by current input
  const treatmentSuggestions = (treatmentInput.trim().length >= 1
    ? COMMON_TREATMENTS.filter(t =>
        t.toLowerCase().includes(treatmentInput.trim().toLowerCase()) && !treatments.includes(t)
      ).slice(0, 6)
    : []
  )

  function finish() {
    const contextLabels = (context || []).map(i => DAY_CONTEXT[i]?.l).filter(Boolean)
    const contextEntries = (context || []).map(i => ({
      label: DAY_CONTEXT[i]?.l,
      detail: (contextDetails[i] || '').trim() || null,
    })).filter(x => x.label)

    // Build per-condition answer list (only conditions that got at least one answer)
    const conditionAnswers = conditions
      .filter(c => severityByCond[c] != null || symptomsByCond[c] != null)
      .map(c => ({
        condition: c === '__generic' ? null : c,
        severity:    severityByCond[c] ?? null,
        severityAi:  !!severityAiByCond[c],
        symptoms:    symptomsByCond[c] ?? null,
      }))

    // Pick the first answered condition for top-level fields (backwards compat
    // with the Track page's skinScore reading + the summary view)
    const primaryC = conditions.find(c => severityByCond[c] != null) || conditions[0]
    const topSeverity = severityByCond[primaryC] ?? null
    const topSymptoms = symptomsByCond[primaryC] ?? null
    const topSeverityAi = !!severityAiByCond[primaryC]
    const skinScore = topSeverity == null ? null : (5 - topSeverity)
    const primaryLabel = (primaryC && primaryC !== '__generic') ? primaryC.toLowerCase() : 'skin'

    // Flatten the per-condition map into a single array of tagged items
    const allTreatments = []
    for (const [cond, names] of Object.entries(treatmentsByCond)) {
      for (const name of names) {
        allTreatments.push({ name, condition: cond === '__generic' ? null : cond })
      }
    }

    const checkin = {
      date: new Date().toISOString(),
      // top-level (back-compat)
      severity: topSeverity, severityAi: topSeverityAi, skinScore,
      symptoms: topSymptoms,
      conditionLabel: primaryLabel,
      // per-condition
      conditionAnswers,
      contextLabels,
      contextEntries,
      treatments: allTreatments.map(t => t.name),  // flat list — back-compat for summary view
      treatmentsByCondition: allTreatments,        // richer per-condition list
      photoAttached: !!photoUrl,
      wearableSynced,
    }
    writeCheckin(checkin)

    // Persist to profile.treatmentList as tagged items, preserving any existing
    // rich detail (dose/freq) the user added in their profile.
    try {
      const profile = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
      const existingMap = new Map(
        (profile.treatmentList || []).map(t => {
          const n = typeof t === 'string' ? t : t?.name
          const c = (typeof t === 'object' ? t?.condition : null) || ''
          return [`${c}::${n}`, t]
        })
      )
      profile.treatmentList = allTreatments.map(({ name, condition }) => {
        const key = `${condition || ''}::${name}`
        return existingMap.get(key) || { name, condition, addedAt: new Date().toISOString() }
      })
      localStorage.setItem('skinsightsProfile', JSON.stringify(profile))
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
    insightHead = 'Stress + moderate skin — your 48-hour window is open'
    insightBody = `Stress can flare ${conditionLabel} 24–48 hours later. A short wind-down tonight + moisturizing within 3 minutes of showering tomorrow tends to help.`
  } else if (stressDay) {
    insightHead = 'Stressful day logged — we\'ll watch the next 48 hours'
    insightBody = 'A short wind-down routine tonight can lower tomorrow\'s flare risk.'
  } else if (normalDay || severity === 0) {
    insightIcon = '✅'
    insightHead = 'Calm day logged — your record keeps building'
    insightBody = 'Consistent check-ins build the trigger map your derm actually wants to see.'
  } else {
    insightHead = 'Check-in logged — patterns take shape over time'
    insightBody = 'Every check-in adds to your skin story. We\'ll flag patterns as they emerge.'
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
            <h2 className="ci-title">Let's check in on your skin.</h2>
            <p className="ci-sub">Add a photo or sync a wearable to make this faster — or skip and just answer a few questions.</p>

            <div className="ci-start-list">
              <button className="ci-start-card" type="button" onClick={useDemoPhoto}>
                <span className="ci-start-card__icon">📷</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Upload a skin photo</span>
                  <span className="ci-start-card__desc">Our AI will pre-fill what it sees so you can adjust.</span>
                </span>
                <span className="ci-start-card__arrow">›</span>
              </button>
              {/* Hidden file picker kept for future real uploads */}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />

              <button className={`ci-start-card${wearableSynced ? ' ci-start-card--done' : ''}`} type="button" onClick={syncWearable}>
                <span className="ci-start-card__icon">⌚</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Sync wearable</span>
                  <span className="ci-start-card__desc">Oura, Apple Watch, Whoop — pull in sleep, HRV, stress.</span>
                </span>
                <span className="ci-start-card__arrow">{wearableSynced ? '✓' : '›'}</span>
              </button>

              <button className="ci-start-card ci-start-card--ghost" type="button" onClick={skipExtras}>
                <span className="ci-start-card__icon">✏️</span>
                <span className="ci-start-card__body">
                  <span className="ci-start-card__title">Just answer questions</span>
                  <span className="ci-start-card__desc">No photo, no wearable — quick and manual.</span>
                </span>
                <span className="ci-start-card__arrow">›</span>
              </button>
            </div>

            {analyzing && (
              <div className="ci-analyzing">
                <span className="ci-analyzing__spinner" />
                AI is analyzing your photo…
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 2 of 4</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>

            {/* Condition toggle — only renders for users with 2+ tracked conditions */}
            {conditions.length > 1 && (
              <div className="ci-cond-toggle" role="tablist">
                {conditions.map(c => {
                  const answered = severityByCond[c] != null
                  const sel = c === activeCondition
                  return (
                    <button
                      key={c}
                      role="tab"
                      type="button"
                      aria-selected={sel}
                      className={`ci-cond-toggle__btn${sel ? ' ci-cond-toggle__btn--active' : ''}`}
                      onClick={() => setActiveCondition(c)}
                    >
                      {c === '__generic' ? 'Skin' : c}
                      {answered && <span className="ci-cond-toggle__dot" aria-hidden="true">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Single-condition users: small chip so the condition name is visible */}
            {conditions.length === 1 && activeCondition && activeCondition !== '__generic' && (
              <div className="ci-cond-chip">Tracking your {activeCondition.toLowerCase()}</div>
            )}

            <h2 className="ci-title">{pb.severityQ}</h2>
            <p className="ci-sub">{pb.severitySub}</p>

            {photoUrl && (
              <div className="ci-photo-pill">
                <img src={photoUrl} alt="" />
                <span>Your photo</span>
              </div>
            )}
            {severityAi && severity != null && (
              <div className="ci-ai-note">
                <span className="ci-ai-note__icon">✨</span>
                <span>
                  Based on your photo, AI thinks your {conditionLabel} looks like {' '}
                  <strong>{pb.severityOpts[severity].l.split('—')[0].trim()}</strong>. {' '}
                  Tap a different option if you disagree.
                </span>
              </div>
            )}

            <div className="ci-opts ci-opts--list">
              {pb.severityOpts.map((opt, i) => (
                <button
                  key={i}
                  className={`ci-opt ci-opt--row${severity === i ? ' ci-opt--sel' : ''}${severityAi && severity === i ? ' ci-opt--ai' : ''}`}
                  onClick={() => pickSeverity(i)}
                >
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                  {severityAi && severity === i && <span className="ci-opt__ai-tag">✨ AI</span>}
                </button>
              ))}
            </div>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(1)}>← Back</button>
              <button className="ci-btn ci-btn--inline" disabled={!anySeverityAnswered} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 3 of 4</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>

            {conditions.length > 1 && (
              <div className="ci-cond-toggle" role="tablist">
                {conditions.map(c => {
                  const answered = symptomsByCond[c] != null
                  const sel = c === activeCondition
                  return (
                    <button
                      key={c}
                      role="tab"
                      type="button"
                      aria-selected={sel}
                      className={`ci-cond-toggle__btn${sel ? ' ci-cond-toggle__btn--active' : ''}`}
                      onClick={() => setActiveCondition(c)}
                    >
                      {c === '__generic' ? 'Skin' : c}
                      {answered && <span className="ci-cond-toggle__dot" aria-hidden="true">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {conditions.length === 1 && activeCondition && activeCondition !== '__generic' && (
              <div className="ci-cond-chip">Tracking your {activeCondition.toLowerCase()}</div>
            )}

            <h2 className="ci-title">{pb.symptomsQ}</h2>
            <p className="ci-sub">{pb.symptomsSub}</p>

            <div className="ci-opts ci-opts--list">
              {pb.symptoms.map((opt, i) => (
                <button
                  key={i}
                  className={`ci-opt ci-opt--row${symptoms === i ? ' ci-opt--sel' : ''}`}
                  onClick={() => pickSymptoms(i)}
                >
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(2)}>← Back</button>
              <button className="ci-btn ci-btn--inline" disabled={!anySymptomsAnswered} onClick={() => setStep(4)}>Continue →</button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 4 of 4</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
            <h2 className="ci-title">What's been going on today?</h2>
            <p className="ci-sub">Select all that apply — we'll help you spot patterns over time.</p>

            <div className="ci-opts ci-opts--grid">
              {DAY_CONTEXT.map((opt, i) => (
                <button
                  key={i}
                  className={`ci-opt ci-opt--chip${opt.wide ? ' ci-opt--wide' : ''}${context.includes(i) ? ' ci-opt--sel' : ''}`}
                  onClick={() => toggleContext(i)}
                >
                  <span className="ci-opt__emoji">{opt.e}</span>
                  <span className="ci-opt__label">{opt.l}</span>
                </button>
              ))}
            </div>

            {/* Detail inputs for selected chips that have a follow-up prompt */}
            {context.some(i => DAY_CONTEXT[i]?.detail) && (
              <div className="ci-detail-list">
                {context.filter(i => DAY_CONTEXT[i]?.detail).map(i => {
                  const opt = DAY_CONTEXT[i]
                  return (
                    <div className="ci-detail" key={i}>
                      <label className="ci-detail__label">
                        <span className="ci-detail__emoji">{opt.e}</span>
                        {opt.detail.prompt}
                      </label>
                      <input
                        className="ci-detail__input"
                        type="text"
                        placeholder={opt.detail.placeholder}
                        value={contextDetails[i] || ''}
                        onChange={e => setContextDetail(i, e.target.value)}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(3)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={finish}>
                {context.length === 0 ? 'Skip & log →' : 'Log check-in →'}
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="ci-header">
              <span className="ci-label">Question 1 of 4 · Treatments</span>
              <button className="ci-close" onClick={onClose}>✕</button>
            </div>
            <div className="ci-progress"><div className="ci-fill" style={{ width: '25%' }} /></div>

            {/* Condition toggle — same pattern as severity / symptoms screens */}
            {conditions.length > 1 && (
              <div className="ci-cond-toggle" role="tablist">
                {conditions.map(c => {
                  const sel = c === activeCondition
                  return (
                    <button
                      key={c}
                      role="tab"
                      type="button"
                      aria-selected={sel}
                      className={`ci-cond-toggle__btn${sel ? ' ci-cond-toggle__btn--active' : ''}`}
                      onClick={() => setActiveCondition(c)}
                    >
                      {c === '__generic' ? 'Skin' : c}
                    </button>
                  )
                })}
              </div>
            )}
            {conditions.length === 1 && activeCondition && activeCondition !== '__generic' && (
              <div className="ci-cond-chip">Tracking your {activeCondition.toLowerCase()}</div>
            )}

            <h2 className="ci-title">
              {treatments.length === 0
                ? (conditions.length > 1
                    ? `What are you using for your ${(activeCondition || 'skin').toLowerCase()}?`
                    : 'What are you using to treat your skin?')
                : 'Still using these treatments?'}
            </h2>
            <p className="ci-sub">
              {treatments.length === 0
                ? <>Search common products below, or <strong>type your own</strong> and add it as a chip. Next time you check in, you'll just confirm this list — no need to re-enter.</>
                : 'Confirm what\'s still active, remove anything you\'ve stopped, or add something new.'}
            </p>

            {treatments.length > 0 && (
              <div className="ci-tx-chips">
                {treatments.map(name => (
                  <span key={name} className="ci-tx-chip">
                    <span className="ci-tx-chip__name">{name}</span>
                    <button
                      type="button"
                      className="ci-tx-chip__x"
                      aria-label={`Remove ${name}`}
                      onClick={() => removeTreatment(name)}
                    >✕</button>
                  </span>
                ))}
              </div>
            )}

            <div className="ci-tx-input-wrap">
              <input
                className="ci-tx-input"
                type="text"
                placeholder="Type a product, medication, or brand…"
                value={treatmentInput}
                onChange={e => setTreatmentInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTreatment() } }}
              />
              {treatmentInput.trim() && (
                <button
                  type="button"
                  className="ci-tx-add"
                  onClick={() => addTreatment()}
                >+ Add "{treatmentInput.trim()}"</button>
              )}
              {treatmentSuggestions.length > 0 && (
                <ul className="ci-tx-suggest">
                  {treatmentSuggestions.map(s => (
                    <li key={s}>
                      <button type="button" className="ci-tx-suggest__btn" onClick={() => addTreatment(s)}>
                        <span className="ci-tx-suggest__plus">+</span>{s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="ci-done__where" style={{ marginTop: 12 }}>
              💡 Don't see it? Just type the name and tap <strong>Add</strong>. You can add dose &amp; frequency in your <strong>profile</strong> later.
            </p>

            <div className="ci-nav-row">
              <button className="ci-back" onClick={() => setStep(0)}>← Back</button>
              <button className="ci-btn ci-btn--inline" onClick={() => setStep(2)}>
                {treatments.length === 0 ? 'Skip → next' : 'Continue →'}
              </button>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="ci-done">
            <div className="ci-done__emoji">🎉</div>
            <h3 className="ci-done__title">Check-in logged.</h3>
            <p className="ci-done__sub">
              We saved your skin status, symptoms, and what's going on today.
              {wearableSynced && <> Wearable data synced.</>}
              {photoUrl && <> Photo attached for AI reference.</>}
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
                const symp = ca.symptoms != null ? cpb.symptoms[ca.symptoms]?.l : null
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
                      const sympLabel = viewing.symptoms != null && pb.symptoms[viewing.symptoms]
                        ? pb.symptoms[viewing.symptoms].l : null
                      return (
                        <>
                          {sevLabel && (
                            <div className="ci-summary-row">
                              <div className="ci-summary-row__key">{viewing.conditionLabel ? `Your ${viewing.conditionLabel}` : 'Your skin'}</div>
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
                {viewing.treatments?.length > 0 && (
                  <div className="ci-summary-row">
                    <div className="ci-summary-row__key">Active treatments</div>
                    <div className="ci-summary-row__val">{viewing.treatments.join(', ')}</div>
                  </div>
                )}
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
