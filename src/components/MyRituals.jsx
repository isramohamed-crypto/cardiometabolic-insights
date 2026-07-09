import React, { useState } from 'react'
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
    source: 'American Diabetes Association Clinical Guidelines, 2023',
    conditions: ['High blood pressure', 'Type 2 diabetes', 'Weight / metabolic health', 'Weight concerns', 'High cholesterol', 'Heart disease'],
  },
  {
    id: 'hl_bp_med', icon: '💊', label: 'Take BP medication', category: 'Monitor',
    desc: 'Same time every day',
    hook: 'Missing 2 doses a week can push BP back up 10 mmHg',
    stat: '#1', statLabel: 'FACTOR IN BLOOD PRESSURE CONTROL', statColor: '#F59E0B',
    body: 'Consistency is the single biggest driver of results with antihypertensives. Missing even 2 doses per week can push systolic readings back up by 6–10 mmHg.',
    source: 'ACC/AHA Hypertension Guidelines, 2023',
    conditions: ['High blood pressure'],
  },
  {
    id: 'hl_chol_med', icon: '💊', label: 'Take cholesterol medication', category: 'Monitor',
    desc: 'Statins work on a schedule',
    hook: 'Taken consistently, statins cut LDL by up to 35%',
    stat: '35%', statLabel: 'AVERAGE LDL REDUCTION ON STATINS', statColor: '#F59E0B',
    body: 'Statins are most effective when taken at the same time daily — many work best at night when your liver produces the most cholesterol. Skipping days reduces efficacy.',
    source: 'NEJM, JUPITER Trial; ACC Cholesterol Guidelines',
    conditions: ['High cholesterol'],
  },
  {
    id: 'hl_dm_med', icon: '💊', label: 'Take diabetes medication', category: 'Monitor',
    desc: 'Timing is everything for glucose control',
    hook: 'Consistent timing is as important as the dose itself',
    stat: '1.5%', statLabel: 'A1C REDUCTION WITH CONSISTENT METFORMIN', statColor: '#F59E0B',
    body: 'Metformin and GLP-1 medications both depend on consistent daily timing to maintain steady drug levels and sustained glucose control throughout the day.',
    source: 'ADA Standards of Care, 2024',
    conditions: ['Type 2 diabetes'],
  },
  {
    id: 'hl_meno_hrt', icon: '💊', label: 'Take HRT or supplements', category: 'Monitor',
    desc: 'Supports heart health during transition',
    hook: 'Started early, HRT can lower cardiovascular risk by 30%',
    stat: '30%', statLabel: 'LOWER CARDIOVASCULAR RISK ON HRT', statColor: '#F59E0B',
    body: 'When started within 10 years of menopause, hormone therapy reduces cardiovascular events by up to 30% — and lowers LDL and insulin resistance over time.',
    source: 'WHI Study re-analysis, 2022; NAMS Position Statement',
    conditions: ['Menopause / hormonal changes'],
  },
  {
    id: 'hl_bg_check', icon: '🔬', label: 'Check blood sugar', category: 'Monitor',
    desc: 'Fasting gives the clearest baseline',
    hook: 'People who track are 2× more likely to hit their A1C target',
    stat: '2×', statLabel: 'MORE LIKELY TO HIT TARGETS WHEN TRACKING', statColor: '#F59E0B',
    body: 'A fasting glucose reading before food gives your clearest daily signal. People who check regularly are twice as likely to meet their A1C goals at their next visit.',
    source: 'ADA Diabetes Care Journal, 2023',
    conditions: ['Type 2 diabetes'],
  },
  {
    id: 'hl_fiber', icon: '🥣', label: 'Eat a fiber-rich breakfast', category: 'Nourish',
    desc: 'Oats and legumes bind LDL in the gut',
    hook: 'Oat fiber binds LDL before it ever reaches your bloodstream',
    stat: '15%', statLabel: 'LDL REDUCTION FROM DAILY OAT FIBER', statColor: '#E07B4A',
    body: 'Beta-glucan fiber found in oats and legumes physically binds LDL cholesterol in your gut before it enters your bloodstream — lowering it 10–15% over 8 weeks.',
    source: 'American Heart Journal; Harvard T.H. Chan School of Public Health',
    conditions: ['High cholesterol'],
  },
  {
    id: 'hl_sodium', icon: '🧂', label: 'Limit sodium today', category: 'Nourish',
    desc: 'Under 1,500 mg makes a measurable difference',
    hook: 'Cutting sodium is as powerful as adding a blood pressure med',
    stat: '5 mmHg', statLabel: 'AVERAGE SYSTOLIC DROP ON LOW-SODIUM DIET', statColor: '#E07B4A',
    body: 'Reducing sodium below 1,500 mg/day lowers systolic BP by an average of 5 mmHg — equivalent to adding one blood pressure medication for many people.',
    source: 'DASH-Sodium Trial; AHA Dietary Guidelines',
    conditions: ['High blood pressure', 'Heart disease'],
  },
  {
    id: 'hl_strength', icon: '🏋️', label: '15-min strength training', category: 'Move',
    desc: 'Builds bone and metabolic resilience',
    hook: 'Weights protect the bone density menopause quietly steals',
    stat: '3%', statLabel: 'BONE DENSITY PRESERVED PER YEAR', statColor: '#2D9B83',
    body: 'During and after menopause, estrogen decline accelerates bone loss. Resistance training preserves bone density and keeps resting metabolic rate from dropping.',
    source: 'JAMA Internal Medicine; National Osteoporosis Foundation',
    conditions: ['Menopause / hormonal changes'],
  },
  {
    id: 'hl_dinner_walk', icon: '🌆', label: '10-min post-dinner walk', category: 'Move',
    desc: 'Blunts the evening glucose spike',
    hook: "Your biggest glucose spike of the day happens right after dinner",
    stat: '22%', statLabel: 'LOWER POST-MEAL GLUCOSE', statColor: '#2D9B83',
    body: "A 10-minute walk within 30 minutes of eating can lower your post-meal blood sugar spike by 22%. The evening meal typically produces the day's largest spike.",
    source: 'ADA Clinical Guidelines; Sports Medicine Journal, 2022',
    conditions: ['Type 2 diabetes', 'Weight / metabolic health', 'Weight concerns'],
  },
  {
    id: 'hl_protein', icon: '🥚', label: 'Eat a protein-rich breakfast', category: 'Nourish',
    desc: 'Reduces hunger hormones all day',
    hook: 'Cuts hunger hormones 25% — critical on GLP-1 meds',
    stat: '25%', statLabel: 'REDUCTION IN HUNGER HORMONE (GHRELIN)', statColor: '#E07B4A',
    body: 'A high-protein breakfast reduces ghrelin — the hunger hormone — by up to 25% for the rest of the day. Especially important on GLP-1 medications to maintain muscle.',
    source: 'American Journal of Clinical Nutrition, 2023',
    conditions: ['Weight / metabolic health', 'Weight concerns', 'Weight loss medication (GLP-1)'],
  },
  {
    id: 'hl_glp1', icon: '💉', label: 'Log your weekly GLP-1 dose', category: 'Monitor',
    desc: 'Most missed doses go unnoticed',
    hook: '89% of missed doses go undetected without a log',
    stat: '89%', statLabel: 'OF MISSED DOSES GO UNDETECTED WITHOUT A LOG', statColor: '#F59E0B',
    body: 'GLP-1 medications are once-weekly injections — easy to lose track of. Patients who log their doses are significantly more consistent and see better outcomes.',
    source: 'Medication Adherence Research Group, 2022',
    conditions: ['Weight loss medication (GLP-1)'],
  },
  {
    id: 'hl_symptoms', icon: '🩺', label: 'Note any symptoms today', category: 'Monitor',
    desc: 'Logs help your care team see patterns',
    hook: 'A week of notes is 3× more useful than verbal recall at your visit',
    stat: '3×', statLabel: 'MORE CLINICALLY USEFUL THAN VERBAL RECALL', statColor: '#F59E0B',
    body: 'A week of symptom logs is three times more useful to a clinician than a verbal summary. Patterns you miss day-to-day become obvious across a week.',
    source: 'JAMA Patient Communication, 2021',
    conditions: ['Heart disease', 'Recovery'],
  },
  {
    id: 'hl_breathe', icon: '💨', label: '5-min deep breathing', category: 'Mind',
    desc: 'Interrupts the stress-to-numbers pipeline',
    hook: "Today's stress shows up in your BP numbers 48 hours from now",
    stat: '48h', statLabel: 'LAG BETWEEN STRESS AND BP/GLUCOSE SPIKE', statColor: '#EC4899',
    body: 'Stress elevates cortisol, which raises blood pressure and blood sugar — but the spike typically arrives 48 hours later. Daily breathing practice blunts cortisol before it compounds.',
    source: 'Journal of Hypertension; Psychosomatic Medicine',
    conditions: [],
  },
  {
    id: 'hl_sleep', icon: '😴', label: 'Aim for 7+ hours sleep', category: 'Rest',
    desc: 'Sleep deprivation worsens every condition',
    hook: 'One bad week raises insulin resistance 37% — even without changing your diet',
    stat: '37%', statLabel: 'HIGHER INSULIN RESISTANCE AFTER POOR SLEEP', statColor: '#8B5CF6',
    body: 'Sleeping under 6 hours raises insulin resistance by 37%, elevates cortisol, and increases cardiovascular risk — even if everything else in your routine is perfect.',
    source: 'Annals of Internal Medicine; Sleep Research Society',
    conditions: [],
  },
  {
    id: 'hl_water', icon: '💧', label: 'Drink 2 glasses of water', category: 'Hydrate',
    desc: 'Dehydration quietly raises BP',
    hook: 'Mild dehydration silently raises your blood pressure',
    stat: '8%', statLabel: 'BP RISE FROM MILD DEHYDRATION', statColor: '#3B82F6',
    body: 'Even mild dehydration raises blood pressure and puts extra strain on kidneys — especially important for people on blood pressure or diabetes medications.',
    source: 'European Journal of Nutrition; AHA Hydration Guidelines',
    conditions: [],
  },
  {
    id: 'hl_log', icon: '📊', label: 'Log a health number', category: 'Monitor',
    desc: 'Tracking doubles your odds of hitting targets',
    hook: 'Trackers are 2× as likely to reach their health goals',
    stat: '2×', statLabel: 'MORE LIKELY TO HIT HEALTH TARGETS WHEN TRACKING', statColor: '#F59E0B',
    body: 'Patients who consistently log at least one health metric are twice as likely to reach their clinical targets — logging turns vague awareness into concrete feedback.',
    source: 'ADA Diabetes Care Journal, 2023; Journal of Medical Internet Research',
    conditions: [],
  },
  {
    id: 'hl_grateful', icon: '📓', label: 'Write one gratitude note', category: 'Mind',
    desc: 'Lowers inflammatory markers over time',
    hook: 'Lowers cortisol 23% — which drives BP and blood sugar up',
    stat: '23%', statLabel: 'LOWER CORTISOL IN REGULAR GRATITUDE JOURNALERS', statColor: '#EC4899',
    body: 'Consistent gratitude journaling lowers cortisol by 23% and reduces inflammatory markers — two things that directly affect blood pressure and metabolic health.',
    source: 'Journal of Psychosomatic Research, 2021',
    conditions: [],
  },
  {
    id: 'hl_stretch', icon: '🧘', label: 'Morning stretch', category: 'Move',
    desc: 'Starts circulation before your day begins',
    hook: 'Morning movement drops cortisol 15% before your day even starts',
    stat: '15%', statLabel: 'CORTISOL REDUCTION AFTER MORNING MOVEMENT', statColor: '#2D9B83',
    body: 'Morning movement — even gentle stretching — reduces cortisol by 15% and activates the parasympathetic nervous system, setting a lower stress baseline for the day.',
    source: 'Journal of Behavioral Medicine; Applied Physiology',
    conditions: [],
  },
  {
    id: 'hl_meds_gen', icon: '💊', label: 'Take all medications', category: 'Monitor',
    desc: 'Adherence is the #1 predictor of outcomes',
    hook: 'Adherence predicts your health more than diet or exercise combined',
    stat: '#1', statLabel: 'PREDICTOR OF HEALTH OUTCOMES ACROSS CHRONIC CONDITIONS', statColor: '#F59E0B',
    body: 'Medication adherence is the single strongest predictor of health outcomes across all chronic conditions — more than diet, exercise, or any other lifestyle factor.',
    source: 'WHO Global Adherence Report; NEJM',
    conditions: [],
  },
]

const SELECTED_KEY    = 'vitalistMyRituals2'
const COMPLETIONS_KEY = 'vitalistMyRitualsCompletions'

function todayKey() { return new Date().toISOString().slice(0, 10) }

function readProfile() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}') } catch { return {} }
}

const DEFAULT_IDS = ['hl_walk', 'hl_sleep', 'hl_water']

function getDefaultIds(conditions) {
  const matches = HABIT_LIBRARY.filter(
    h => h.conditions.length > 0 && h.conditions.some(c => conditions.includes(c))
  )
  if (matches.length === 0) return DEFAULT_IDS
  const seen = new Set(['hl_walk']); const result = ['hl_walk']
  for (const h of matches) {
    if (!seen.has(h.id)) { seen.add(h.id); result.push(h.id) }
    if (result.length === 3) break
  }
  for (const id of ['hl_sleep', 'hl_water']) {
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

// ── Component ──────────────────────────────────────────────────────────────────
export default function MyRituals() {
  const { stage } = useProfileStage()
  const isMature  = stage === 'mature'

  const profile    = readProfile()
  const conditions = Array.isArray(profile.condition) ? profile.condition : []

  const [selectedIds, setSelectedIds] = useState(() => {
    const saved = readSelectedIds()
    return saved || getDefaultIds(conditions)
  })
  const [completions, setCompletions] = useState(readTodayCompletions)
  const [showPicker, setShowPicker]   = useState(false)
  const [pickerCat, setPickerCat]     = useState('Move')
  const [expandedWhy, setExpandedWhy] = useState(new Set())
  const [justDone, setJustDone]       = useState(new Set())

  const personalizedIds = new Set(
    HABIT_LIBRARY
      .filter(h => h.conditions.length > 0 && h.conditions.some(c => conditions.includes(c)))
      .map(h => h.id)
  )

  const selectedHabits = selectedIds.map(id => HABIT_LIBRARY.find(h => h.id === id)).filter(Boolean)
  const availableToAdd = HABIT_LIBRARY.filter(h => !selectedIds.includes(h.id))
  const doneToday      = completions.filter(id => selectedIds.includes(id)).length
  const allDone        = selectedHabits.length > 0 && doneToday === selectedHabits.length

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
    const updated = [...selectedIds, id]
    setSelectedIds(updated); saveSelectedIds(updated)
    setShowPicker(false)
  }

  function handleRemove(e, id) {
    e.stopPropagation()
    const updated = selectedIds.filter(s => s !== id)
    setSelectedIds(updated); saveSelectedIds(updated)
  }

  function toggleWhy(e, id) {
    e.stopPropagation()
    setExpandedWhy(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <section className="mr-section">

      {/* Header */}
      <div className="mr-header">
        <div>
          <p className="mr-eyebrow">Daily rituals</p>
          <h2 className="mr-title">Complete your rituals</h2>
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
            className={`mr-plus-btn${showPicker ? ' mr-plus-btn--open' : ''}`}
            onClick={() => setShowPicker(s => !s)}
            aria-label={showPicker ? 'Close' : 'Add ritual'}
          >
            {showPicker ? '✕' : '+'}
          </button>
        </div>
      </div>

      {/* All-done celebration */}
      {allDone && (
        <div className="mr-celebration">
          <span className="mr-celebration__quote">"{todayQuote()}"</span>
        </div>
      )}

      {/* Habit cards */}
      <div className="mr-list">
        {selectedHabits.length === 0 && (
          <p className="mr-empty">Tap + to add your first ritual.</p>
        )}
        {selectedHabits.map(habit => {
          const isDone     = completions.includes(habit.id)
          const isPersonal = personalizedIds.has(habit.id) || habit.conditions.length > 0
          const count      = getTotalCount(habit.id)
          const isExpanded = expandedWhy.has(habit.id)
          const isPopping  = justDone.has(habit.id)
          const catStyle   = CAT[habit.category] || {}

          // Dots: for established user show canned history pattern; for new user show real log
          const matureDots = MATURE_DOT_PATTERNS[habit.id] || MATURE_DOT_PATTERNS.default
          const realDots   = getLastN(habit.id, 7)
          // If logged today, set last dot to true
          const todayDots  = [...realDots.slice(0, 6), isDone]
          const dots         = isMature ? (isDone ? [...matureDots.slice(0, 6), true] : matureDots) : todayDots
          const displayCount = isMature ? (isDone ? 19 : 18) : count

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

              {/* Main row: icon | label + desc | Log it */}
              <div className="mr-card__main">
                <div
                  className={`mr-card__icon-wrap${isPopping ? ' mr-card__icon-wrap--bounce' : ''}`}
                  style={{ background: isDone ? '#d1fae5' : catStyle.bg }}
                >
                  <span className="mr-card__icon">{habit.icon}</span>
                </div>
                <div className="mr-card__body">
                  {isPersonal && (
                    <span className="mr-recommended-pill">✨ Recommended</span>
                  )}
                  <span className="mr-card__label">{habit.label}</span>
                  <p className="mr-card__subdesc">{habit.desc}</p>
                </div>
                {!isDone ? (
                  <button className="mr-log-btn" onClick={() => handleCheck(habit.id)}>
                    Log it
                  </button>
                ) : (
                  <button className="mr-logged-badge" onClick={() => handleCheck(habit.id)}>
                    Logged
                  </button>
                )}
              </div>

              {/* Why row: category chip + hook teaser + chevron */}
              <div className="mr-why" onClick={e => toggleWhy(e, habit.id)}>
                <div className="mr-why__header">
                  <span className="mr-cat-chip" style={{ background: catStyle.bg, color: catStyle.text }}>
                    {habit.category}
                  </span>
                  <span className="mr-why__hook">{habit.hook}</span>
                  <span className="mr-why__chevron">{isExpanded ? '▲' : '▼'}</span>
                </div>
                {isExpanded && (
                  <div className="mr-why__expanded" onClick={e => e.stopPropagation()}>
                    <div className="mr-why__stat-row">
                      <span className="mr-why__stat" style={{ color: habit.statColor }}>{habit.stat}</span>
                      <span className="mr-why__stat-label">{habit.statLabel}</span>
                    </div>
                    <p className="mr-why__body">{habit.body}</p>
                    <p className="mr-why__source">{habit.source}</p>
                  </div>
                )}
              </div>

              {/* Progress footer */}
              <div className="mr-card__footer">
                <div className="mr-dots">
                  {dots.map((d, i) => (
                    <div key={i} className={`mr-dot${d ? ' mr-dot--done' : ''}`} />
                  ))}
                </div>
                <div className="mr-card__footer-right">
                  <span className="mr-card__count">
                    {displayCount > 0 ? `${displayCount} times` : 'Start today'}
                  </span>
                </div>
                <button className="mr-card__remove" onClick={e => handleRemove(e, habit.id)}>Remove</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Habit picker */}
      {showPicker && (
        <div className="mr-picker">
          {/* Category filter tabs */}
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
            {pickerFiltered.length === 0 ? 'All rituals in this category are added' : 'Add a ritual'}
          </p>

          <div className="mr-picker__list">
            {pickerFiltered.map(habit => {
              const isPersonal = personalizedIds.has(habit.id) || habit.conditions.length > 0
              const catStyle   = CAT[habit.category] || {}
              return (
                <button key={habit.id} className="mr-picker__item" onClick={() => handleAdd(habit.id)}>
                  <span className="mr-picker__icon">{habit.icon}</span>
                  <span className="mr-picker__body">
                    <span className="mr-picker__label">
                      {habit.label}
                      {isPersonal && (
                        <span className="mr-picker__foryou">✨ Recommended</span>
                      )}
                    </span>
                    <span className="mr-picker__desc">{habit.desc}</span>
                  </span>
                  <span className="mr-cat-chip" style={{ background: catStyle.bg, color: catStyle.text, marginRight: 6 }}>
                    {habit.category}
                  </span>
                  <span className="mr-picker__plus">+</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
