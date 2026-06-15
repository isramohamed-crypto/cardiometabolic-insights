import React, { useState, useMemo, useEffect, useRef } from 'react'
import SponsorBanner from './SponsorBanner'

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

const TX_CATEGORY_RULES = [
  { cat: '💊 Cholesterol',        keys: ['statin','lipitor','crestor','zocor','pravachol','lovastatin','fluvastatin','zetia','ezetimibe','fenofibrate','niacin','repatha','evolocumab','praluent','alirocumab','leqvio','inclisiran','fish oil','omega-3','red yeast','psyllium','berberine'] },
  { cat: '🫀 Blood pressure',     keys: ['lisinopril','amlodipine','norvasc','losartan','cozaar','metoprolol','atenolol','hctz','hydrochlorothiazide','chlorthalidone','valsartan','diovan','ramipril','carvedilol','spironolactone'] },
  { cat: '🩸 Blood sugar',        keys: ['metformin','ozempic','wegovy','semaglutide','liraglutide','victoza','jardiance','empagliflozin','farxiga','dapagliflozin','invokana','canagliflozin','januvia','sitagliptin','actos','pioglitazone','glipizide','glimepiride','insulin','cgm','glucose monitor'] },
  { cat: '⚖️ Weight management',  keys: ['mounjaro','zepbound','tirzepatide','contrave','naltrexone','bupropion','orlistat','xenical'] },
  { cat: '🌸 Hormones',           keys: ['estradiol','progesterone','estrogen','vaginal','hormone','hrt'] },
  { cat: '❤️ Heart & circulation',keys: ['aspirin','clopidogrel','plavix','ticagrelor','brilinta','warfarin','coumadin','apixaban','eliquis','rivaroxaban','xarelto','digoxin','amiodarone','entresto','sacubitril','cardiac rehab'] },
  { cat: '🥗 Lifestyle & diet',   keys: ['mediterranean','dash diet','coq10','magnesium','vitamin d','vitamin k','blood pressure monitor'] },
]

function categoryForTx(name) {
  const lower = name.toLowerCase()
  for (const rule of TX_CATEGORY_RULES) {
    if (rule.keys.some(k => lower.includes(k))) return rule.cat
  }
  return '📋 Other'
}

function groupTxByCategory(names) {
  const map = {}
  for (const name of names) {
    const cat = categoryForTx(name)
    if (!map[cat]) map[cat] = []
    map[cat].push(name)
  }
  return map
}

// All available tile types for My Numbers
const ALL_TILE_DEFS = [
  { id: 'ldl',     label: 'LDL Cholesterol', icon: '🫀' },
  { id: 'bp',      label: 'Blood Pressure',  icon: '💉' },
  { id: 'glucose', label: 'Blood Sugar',      icon: '🔬' },
  { id: 'weight',  label: 'Weight',           icon: '⚖️' },
  { id: 'a1c',     label: 'A1C',              icon: '🩸' },
  { id: 'cycle',   label: 'Cycle',            icon: '🌸' },
]

function readTileConfig() {
  try { return JSON.parse(localStorage.getItem('aheadTileConfig') || 'null') } catch (_) { return null }
}
function saveTileConfig(ids) {
  try { localStorage.setItem('aheadTileConfig', JSON.stringify(ids)) } catch (_) {}
}

function readCheckins() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicCheckins') || '[]') } catch (_) { return [] }
}

const CHART_DATA = {
  '14 days': {
    skin:   [2,2,3,3,2,4,3,2,2,3,2,4,3,2],
    stress: [6,5,7,4,5,3,7,6,5,8,4,3,7,6],
    sleep:  [72,68,65,74,70,58,62,75,71,60,73,78,64,72],
    days:   ['Mar 25','31','Apr 7'],
    note:   'Pattern detected: health score peaks on Apr 1 and Apr 6 — both follow high-stress days with low sleep scores.',
  },
  '30 days': {
    skin:   [3,2,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2,1,2,3,2,4,3,2,2,3,2],
    stress: [4,5,6,5,7,4,5,3,7,6,5,8,4,3,7,6,5,4,6,5,7,4,5,3,7,6,5,8,4,3],
    sleep:  [74,72,68,65,74,70,58,62,75,71,60,73,78,64,72,70,68,65,74,70,58,62,75,71,60,73,78,64,72,70],
    days:   ['Mar 8','Mar 22','Apr 7'],
    note:   'Pattern detected: stress spikes in weeks 2 and 4 consistently follow sleep scores below 65.',
  },
  '90 days': {
    skin:   [3,3,2,3,4,3,2,2,3,2,4,3,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2],
    stress: [3,4,5,4,6,5,7,4,5,3,7,6,5,8,4,3,7,6,5,4,6,5,7,4,5,3,7,6,5,8],
    sleep:  [76,75,72,68,65,74,70,58,62,75,71,60,73,78,64,72,70,68,65,74,70,58,62,75,71,60,73,78,64,70],
    days:   ['Jan 7','Feb 21','Apr 7'],
    note:   'Long-term pattern: stress is your #1 predictor. Health scores trend better in weeks with consistent sleep above 70.',
  },
}

const SKIN_DATA    = CHART_DATA['14 days'].skin
const STRESS_DATA  = CHART_DATA['14 days'].stress
const SLEEP_DATA   = CHART_DATA['14 days'].sleep
const DAYS         = ['Mar 25','26','27','28','29','30','31','Apr 1','2','3','4','5','6','7']

/**
 * Per-condition skin-score mock data. Stress and sleep are body-wide so they
 * stay shared. Each condition gets its own plausible curve + a pattern note.
 * When user toggles between conditions on Track, the trend chart pulls
 * `skin` and `note` from here keyed by the active condition label.
 */
const CONDITION_TREND_OVERRIDES = {
  'High cholesterol': {
    '14 days': { skin: [2,2,3,3,2,4,3,2,2,3,2,4,3,2], note: 'Cholesterol-related health scores elevated on Apr 1 and Apr 6 — both follow high-stress days with low sleep scores.' },
    '30 days': { skin: [3,2,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2,1,2,3,2,4,3,2,2,3,2], note: 'Cholesterol health scores worsen on weeks where stress > 6 and sleep < 65.' },
    '90 days': { skin: [3,3,2,3,4,3,2,2,3,2,4,3,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2], note: 'Cholesterol trend improves in weeks with consistent sleep above 70.' },
  },
  'High blood pressure': {
    '14 days': { skin: [3,3,3,3,2,2,2,3,3,3,3,4,3,3], note: 'Blood pressure readings have been steady — slight worsening late this week.' },
    '30 days': { skin: [3,3,3,3,3,2,2,2,3,3,3,4,3,3,3,3,3,3,3,3,2,2,2,3,3,3,4,3,3,3], note: 'Blood pressure is slow-changing — improvements visible across 4-week intervals.' },
    '90 days': { skin: [4,4,3,3,3,3,3,3,3,2,2,2,3,3,3,3,3,3,3,3,3,3,3,2,2,2,3,3,3,3], note: 'Blood pressure has gradually improved over the quarter — consistent treatment showing.' },
  },
  'Type 2 diabetes': {
    '14 days': { skin: [1,2,3,2,3,4,3,2,1,2,3,3,2,2], note: 'Blood sugar spikes on Mar 30 and Apr 4 — both high-stress, low-activity days.' },
    '30 days': { skin: [2,1,2,3,2,3,4,3,2,1,2,3,3,2,2,3,2,1,2,3,2,3,4,3,2,1,2,3,3,2], note: 'Blood sugar is reactive to dietary changes and stress this month.' },
    '90 days': { skin: [2,2,3,2,1,2,3,2,3,4,3,2,1,2,3,3,2,2,3,2,1,2,3,2,3,4,3,2,3,3], note: 'Blood sugar volatility highest in high-stress periods.' },
  },
  'Heart disease': {
    '14 days': { skin: [2,2,2,3,3,4,4,3,2,2,1,1,2,2], note: 'Cardiac health scores elevated Mar 30–Apr 1, then improved as stress reduced.' },
    '30 days': { skin: [2,3,3,4,4,3,2,2,1,1,2,2,2,3,3,4,4,3,2,2,1,1,2,2,2,3,3,4,3,2], note: 'Cardiac health shows a stress-driven pattern — roughly correlating with work week stress.' },
    '90 days': { skin: [3,3,4,4,3,2,2,1,1,2,2,3,3,4,4,3,2,2,1,1,2,2,3,3,4,4,3,2,2,1], note: 'Cardiac health scores follow a recurring pattern tied to activity and stress cycles.' },
  },
  'Weight / metabolic health': {
    '14 days': { skin: [2,3,2,3,4,3,2,2,3,4,3,2,3,2], note: 'Metabolic health scores elevated on Mar 29 and Apr 3 — both after low-activity days.' },
    '30 days': { skin: [3,2,3,2,3,4,3,2,2,3,4,3,2,3,2,3,2,3,2,3,4,3,2,2,3,4,3,2,3,2], note: 'Metabolic health tied to activity levels and dietary choices this month.' },
    '90 days': { skin: [3,3,2,3,2,3,4,3,2,2,3,4,3,2,3,2,3,3,2,3,2,3,4,3,2,2,3,4,3,2], note: 'Metabolic health reactive to sustained lifestyle changes.' },
  },
  'Family history': {
    '14 days': { skin: [3,3,4,3,3,4,4,3,3,3,2,3,3,3], note: 'Preventive health scores highest on high-stress, low-activity days.' },
    '30 days': { skin: [3,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4], note: 'Health scores fluctuate with lifestyle consistency — best in lower-stress weeks.' },
    '90 days': { skin: [4,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4,3,3,4,4,3,3,3,2,3,3,3,3,4,4], note: 'Health scores have slowly improved with consistent lifestyle changes.' },
  },
  'Borderline numbers': {
    '14 days': { skin: [3,2,3,3,4,3,2,3,3,3,2,3,3,2], note: 'Borderline readings spike on high-stress nights — strong correlation with sleep < 65.' },
    '30 days': { skin: [3,3,2,3,3,4,3,2,3,3,3,2,3,3,2,3,3,2,3,3,4,3,2,3,3,3,2,3,3,2], note: 'Borderline numbers worst on poor-sleep nights — strong correlation with sleep < 65.' },
    '90 days': { skin: [3,3,3,3,2,3,3,4,3,2,3,3,3,2,3,3,2,3,3,3,2,3,3,4,3,2,3,3,3,2], note: 'Health trends improve in weeks with regular sleep schedule.' },
  },
  'Recovery': {
    '14 days': { skin: [2,2,3,3,4,4,3,3,2,2,1,2,2,2], note: 'Recovery scores peaked early in the period, then improved with rest.' },
    '30 days': { skin: [3,2,2,3,3,4,4,3,3,2,2,1,2,2,2,3,2,2,3,3,4,4,3,3,2,2,1,2,2,2], note: 'Recovery shows a cyclical pattern tied to activity and stress levels.' },
    '90 days': { skin: [3,3,4,4,3,3,2,2,1,2,2,2,3,3,4,4,3,3,2,2,1,2,2,2,3,3,4,4,3,3], note: 'Recovery following a gradual improvement trend with consistent management.' },
  },
  'Prevention focused': {
    '14 days': { skin: [1,2,4,2,1,3,4,2,1,3,2,4,2,1], note: 'Health scores vary — no clear weekly pattern, but stress days correlate strongly.' },
    '30 days': { skin: [2,1,2,4,2,1,3,4,2,1,3,2,4,2,1,3,2,1,2,4,2,1,3,4,2,1,3,2,4,2], note: 'Variable health pattern — stress is the strongest single contributing factor.' },
    '90 days': { skin: [3,2,1,2,4,2,1,3,4,2,1,3,2,4,2,1,3,3,2,1,2,4,2,1,3,4,2,1,3,2], note: 'Even across 90 days, the only consistent health predictor is your stress level.' },
  },
}

// Resolve trend data: stress/sleep always shared, skin/note pulled from
// condition-specific overrides when available.
function trendDataFor(condition, range) {
  const shared = CHART_DATA[range]
  const override = condition ? CONDITION_TREND_OVERRIDES[condition]?.[range] : null
  return {
    skin: override?.skin || shared.skin,
    stress: shared.stress,
    sleep: shared.sleep,
    days: shared.days,
    note: override?.note || shared.note,
  }
}

// Mock fallback when the user has 0 check-ins. Once they start logging,
// these percentages are computed from actual check-in history.
const TRIGGERS_MOCK = [
  { e: '😰', l: 'Stressful day',      p: 45, c: 'var(--color-teal)' },
  { e: '😴', l: 'Rough night',        p: 25, c: 'var(--color-blue)' },
  { e: '🌤️', l: 'Weather change',     p: 10, c: 'var(--color-sage)' },
  { e: '🍽️', l: 'New food',           p:  5, c: 'var(--color-warm)' },
  { e: '🧴', l: 'Tried new product',  p:  0, c: 'var(--color-coral)' },
  { e: '🏃', l: 'Routine changed',    p:  0, c: 'var(--color-lime)' },
  { e: '👍', l: 'Normal day',         p: 15, c: 'var(--color-text-muted)' },
]

// Compute trigger percentages from the user's check-in history. Each check-in
// can have multiple context labels — we count occurrences across all check-ins
// and normalize to total tag mentions.
function computeTriggers(checkins) {
  if (!checkins || checkins.length === 0) return { rows: TRIGGERS_MOCK, isReal: false }
  const counts = Object.fromEntries(TRIGGERS_MOCK.map(t => [t.l, 0]))
  let total = 0
  for (const c of checkins) {
    const labels = c.contextLabels || []
    for (const l of labels) {
      if (counts[l] != null) { counts[l]++; total++ }
    }
  }
  const rows = TRIGGERS_MOCK.map(t => ({
    ...t,
    p: total === 0 ? 0 : Math.round((counts[t.l] / total) * 100),
  }))
  return { rows, isReal: true }
}

const ACTIONS = [
  { icon: '🌬️', bg: 'rgba(0, 185, 226,.12)', tag: 'STRESS · TONIGHT', tagC: '#0D7C8F', title: '3-min breathing before bed', body: 'Your HRV is 15% below baseline. Breathwork tonight can interrupt the stress → elevated readings cascade.', cta: 'Start now →', ctaBg: 'var(--color-teal)', ctaC: '#fff' },
  { icon: '💊', bg: 'rgba(27, 188, 60,.1)',    tag: 'MEDICATIONS · ROUTINE', tagC: 'var(--color-teal)', title: 'Add medication timing to your daily checklist', body: 'You log your medications 5/7 days. Consistent daily timing could improve your health score average.', cta: 'Add to checklist', ctaBg: 'rgba(27, 188, 60,.1)', ctaC: 'var(--color-teal)' },
  { icon: '📖', bg: 'rgba(0, 83, 226,.1)',    tag: 'LEARN · NEXT MODULE', tagC: '#0053E2', title: 'Continue: Stress + Heart Health journey', body: "You're 12% through. Next up: the 3-minute breathing reset micro-challenge.", cta: 'Continue →', ctaBg: 'rgba(0, 83, 226,.1)', ctaC: '#0053E2' },
  { icon: '🥗', bg: 'rgba(232, 239, 101,.15)',  tag: 'NUTRITION · FOR YOU', tagC: '#8A7A30', title: 'Anti-inflammatory dinner tonight', body: 'Omega-3s + turmeric support barrier repair. One-pan salmon, 25 minutes.', cta: 'See recipe →', ctaBg: 'rgba(232, 239, 101,.15)', ctaC: '#8A7A30' },
]

const METRICS = [
  { e: '😴', l: 'Sleep',       v: '72', u: '/100', d: '6h 23m · 45m deep',    tc: 'var(--color-teal)',   tl: '↑ +4 vs wk',  sp: SLEEP_DATA },
  { e: '😰', l: 'Stress',      v: 'Med-Hi', u: '', d: '3.2hrs high stress',   tc: 'var(--color-warm)',   tl: '↓ worse',     sp: STRESS_DATA.map(v => v * 10) },
  { e: '⚡',  l: 'Readiness',  v: '62', u: '/100', d: 'Temp +0.3°C',          tc: 'var(--color-text-muted)', tl: '→ stable', sp: [68,65,62,70,66,55,58,72,68,58,70,74,60,62] },
  { e: '💓', l: 'HRV',         v: '38', u: 'ms',   d: '15% below baseline',   tc: 'var(--color-warm)',   tl: '↓ -6 vs avg', sp: [42,40,38,45,41,35,36,44,42,34,43,46,37,38] },
  { e: '❤️', l: 'Resting HR',  v: '64', u: 'bpm',  d: 'vs. 60 baseline',      tc: '#E8EF65',             tl: '↑ +4 bpm',    sp: [60,61,63,59,62,65,64,60,61,66,60,58,64,64] },
  { e: '🛡️', l: 'Resilience',  v: 'Mod', u: '',    d: 'Recovery: 62',         tc: 'var(--color-text-muted)', tl: '→ stable', sp: [55,58,52,65,60,48,50,65,58,45,62,68,52,55] },
]

const EPROS = [
  { icon: '📋', iconBg: 'rgba(27, 188, 60,.1)',   title: 'HRQOL — Quality of Life',    sub: 'How your condition impacts your daily life. 10 questions, ~2 min.', pill: 'Recommended', pillBg: 'rgba(27, 188, 60,.1)', pillC: 'var(--color-teal)', last: 'Mar 24' },
  { icon: '📊', iconBg: 'rgba(0, 185, 226,.12)', title: 'PHQ-9 — Symptom Severity',   sub: 'Track how you\'ve been feeling over the past week. 7 questions.',    pill: 'Recommended', pillBg: 'rgba(0, 185, 226,.12)', pillC: '#0D7C8F', last: 'Apr 3' },
  { icon: '🧠', iconBg: 'rgba(246,76,34,.1)',   title: 'HADS — Anxiety & Mood',     sub: 'Understand the emotional side of managing a chronic condition.',       pill: 'Recommended', pillBg: 'rgba(246,76,34,.1)', pillC: 'var(--color-warm)', last: 'Mar 10' },
]

const MOOD_LABELS = [
  { e: '😄', l: 'Great' },
  { e: '🙂', l: 'Good' },
  { e: '😐', l: 'Neutral' },
  { e: '😔', l: 'Low' },
  { e: '😫', l: 'Rough day' },
]
const SYMPTOM_LABELS = [
  { e: '😌', l: 'No symptoms' },
  { e: '😩', l: 'Fatigue' },
  { e: '🤕', l: 'Headache' },
  { e: '😣', l: 'Cramps' },
  { e: '💓', l: 'Palpitations' },
  { e: '😮‍💨', l: 'Shortness of breath' },
  { e: '🌡️', l: 'Dizziness' },
  { e: '🔥', l: 'Hot flashes' },
  { e: '😟', l: 'Chest tightness' },
]

function formatCheckinDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Sparkline({ data, color }) {
  const W = 80, H = 24
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="tp-sparkline" style={{ display: 'block', width: '100%', height: 24 }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  )
}

function TrendChart({ range, condition }) {
  const W = 300, H = 80
  const d = trendDataFor(condition, range)
  const skinPts   = d.skin.map((v, i)   => `${(i / (d.skin.length - 1)) * W},${H - (v / 5) * H}`).join(' ')
  const stressPts = d.stress.map((v, i) => `${(i / (d.stress.length - 1)) * W},${H - (v / 10) * H}`).join(' ')
  const sleepPts  = d.sleep.map((v, i)  => `${(i / (d.sleep.length - 1)) * W},${H - (v / 100) * H}`).join(' ')

  return (
    <div className="tp-chart-wrap">
      <div className="tp-chart-legend">
        <span className="tp-leg"><span className="tp-leg-dot" style={{ background: 'var(--color-sage)' }} />Health score</span>
        <span className="tp-leg"><span className="tp-leg-dot" style={{ background: 'var(--color-warm)' }} />Stress</span>
        <span className="tp-leg"><span className="tp-leg-dot" style={{ background: 'var(--color-teal)' }} />Sleep</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <polyline points={sleepPts}  fill="none" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={stressPts} fill="none" stroke="var(--color-warm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
        <polyline points={skinPts}   fill="none" stroke="var(--color-sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="tp-chart-days">
        {d.days.map(day => <span key={day}>{day}</span>)}
      </div>
      <div className="tp-chart-note">
        <strong>Pattern detected:</strong> {d.note.replace('Pattern detected: ', '')}
      </div>
    </div>
  )
}

function readLastCheckin() {
  try { return JSON.parse(localStorage.getItem('cardiometabolicLastCheckin') || 'null') } catch (_) { return null }
}

function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    const raw = Array.isArray(p.condition) ? p.condition : (p.condition ? [p.condition] : [])
    return raw.filter(Boolean)
  } catch (_) { return [] }
}

// Mock sparkline fallback trends per tile (shows a plausible recent trend)
const TILE_MOCK_TRENDS = {
  ldl:     [145,142,140,138,141,137,135,132,130,128,132,129,126,124],
  bp:      [135,133,130,128,132,129,127,125,128,124,122,126,123,120],
  glucose: [112,108,115,110,107,113,109,105,111,108,104,110,107,103],
  weight:  [175,174,174,173,174,173,172,173,172,171,172,171,170,170],
  a1c:     [7.2,7.1,7.1,7.0,7.0,6.9,6.9,6.8,6.8,6.8,6.7,6.7,6.6,6.6],
  cycle:   [3,4,3,2,3,4,3,3,2,3,4,3,2,3],
}

function readMyNumbers() {
  try {
    const readings = JSON.parse(localStorage.getItem('aheadReadings') || '{}')
    const config = JSON.parse(localStorage.getItem('aheadTileConfig') || 'null')
    const TILE_META = {
      ldl:     { label: 'LDL Cholesterol', icon: '🫀', unit: 'mg/dL', periodic: true },
      bp:      { label: 'Blood Pressure',  icon: '💉', unit: '',      periodic: false },
      glucose: { label: 'Blood Sugar',     icon: '🔬', unit: 'mg/dL', periodic: false },
      weight:  { label: 'Weight',          icon: '⚖️', unit: 'lbs',   periodic: false },
      a1c:     { label: 'A1C',             icon: '🩸', unit: '%',     periodic: true },
      cycle:   { label: 'Cycle',           icon: '🌸', unit: '',      periodic: false },
    }
    const activeIds = config || ['ldl', 'bp']
    return activeIds
      .filter(id => readings[id]?.value)
      .map(id => {
        const meta = TILE_META[id] || { label: id, icon: '📊', unit: '' }
        const r = readings[id]
        let display = r.value
        let numericVal = null
        if (id === 'cycle') {
          try { const p = JSON.parse(r.value); display = p.flow ? `${p.flow} flow` : `${p.symptoms?.length || 0} symptoms` } catch (_) {}
        } else if (id === 'glucose') {
          try { const p = JSON.parse(r.value); numericVal = p.reading; display = `${p.reading} mg/dL · ${p.meal === 'after' ? 'After meal' : 'Before meal'}` } catch (_) {}
        } else if (id === 'bp') {
          // use systolic for sparkline
          const m = String(r.value).match(/(\d+)/)
          if (m) numericVal = Number(m[1])
        } else {
          numericVal = parseFloat(r.value)
        }
        // Build sparkline data: real history values if available, else mock trend
        const rawHistory = Array.isArray(r.history) ? r.history : []
        const sparkData = rawHistory.length >= 3
          ? rawHistory.map(h => {
              if (id === 'glucose') { try { return JSON.parse(h.value).reading } catch (_) { return parseFloat(h.value) || 0 } }
              if (id === 'bp') { const m = String(h.value).match(/(\d+)/); return m ? Number(m[1]) : 0 }
              return parseFloat(h.value) || 0
            })
          : (TILE_MOCK_TRENDS[id] || [50,52,49,53,51,55,53,57,54,58,55,59,56,60])
        // Append current numeric value to end of mock if using mock (so the last point matches current)
        const finalSparkData = rawHistory.length >= 3
          ? sparkData
          : [...sparkData.slice(0, -1), numericVal ?? sparkData[sparkData.length - 1]]
        return { id, ...meta, value: display, date: r.date, sparkData: finalSparkData }
      })
  } catch (_) { return [] }
}

function readTreatments() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    const raw = Array.isArray(p.treatmentList) ? p.treatmentList : []
    return raw.map(t => typeof t === 'string' ? { name: t } : t).filter(t => t?.name)
  } catch (_) { return [] }
}

function daysSinceUtil(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate); const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.max(0, Math.round((a - b) / (1000 * 60 * 60 * 24)))
}
function daysAgoUtil(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate); const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  return Math.round((a - b) / (1000 * 60 * 60 * 24))
}

export default function TrackPage({ onOpenCheckin, checkinTick = 0 }) {
  const [timeRange, setTimeRange] = useState('14 days')
  const [checkins, setCheckins] = useState(() => readCheckins())
  const [lastCheckin, setLastCheckin] = useState(() => readLastCheckin())
  const [conditions, setConditions] = useState(() => readConditions())
  const [activeCondition, setActiveCondition] = useState(() => readConditions()[0] || null)
  const [treatments, setTreatments] = useState(() => readTreatments())
  const [myNumbers, setMyNumbers] = useState(() => readMyNumbers())
  const [tileConfig, setTileConfig] = useState(() => readTileConfig() || ['ldl', 'bp'])
  const [addingTile, setAddingTile] = useState(false)
  const [addingTx, setAddingTx] = useState(false)
  const [txInput, setTxInput] = useState('')
  const txInputRef = useRef(null)

  function saveTreatmentList(list) {
    try {
      const profile = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
      profile.treatmentList = list
      localStorage.setItem('cardiometabolicProfile', JSON.stringify(profile))
      setTreatments(readTreatments())
    } catch (_) {}
  }
  function addTreatment(name) {
    if (!name.trim()) return
    const current = readTreatments()
    if (current.some(t => t.name.toLowerCase() === name.trim().toLowerCase())) return
    saveTreatmentList([...current, { name: name.trim(), addedAt: new Date().toISOString() }])
    setTxInput('')
    setAddingTx(false)
  }
  function removeTreatment(name) {
    const current = readTreatments()
    saveTreatmentList(current.filter(t => t.name !== name))
  }

  function toggleTile(id) {
    const current = tileConfig
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    saveTileConfig(next)
    setTileConfig(next)
    setMyNumbers(readMyNumbers())
  }

  const txSuggestions = txInput.length >= 1
    ? COMMON_TREATMENTS.filter(t => t.toLowerCase().includes(txInput.toLowerCase())).slice(0, 5)
    : []

  // Re-read whenever a new check-in is logged (parent bumps checkinTick) or on focus
  useEffect(() => {
    function refresh() {
      setCheckins(readCheckins())
      setLastCheckin(readLastCheckin())
      setTreatments(readTreatments())
      setMyNumbers(readMyNumbers())
      const conds = readConditions()
      setConditions(conds)
      // Keep activeCondition in sync if it's no longer in the list
      setActiveCondition(prev => (prev && conds.includes(prev)) ? prev : (conds[0] || null))
    }
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [checkinTick])

  // AI Insights expand/collapse state (always visible, just toggleable)
  const [aiOpen, setAiOpen] = useState(false)

  const { rows: triggerRows, isReal: triggersReal } = useMemo(() => computeTriggers(checkins), [checkins])
  // Days tracked = baseline mock (21) + actual check-ins logged
  const daysTracked = 21 + checkins.length
  const topPattern = useMemo(() => {
    const top = [...triggerRows].sort((a, b) => b.p - a.p)[0]
    return top?.p > 0 ? top.l.replace('Stressful day', 'Stress').replace(' day', '') : 'Stress'
  }, [triggerRows])

  return (
    <main className="main learn-page track-page">
      <div className="pp-hero tp-hero">
        <p className="pp-hero-eyebrow">Your health log</p>
        <h1 className="pp-hero-title">What your data is telling you</h1>
        <p className="pp-hero-sub">Log how you're feeling to help identify the patterns behind your health trends.</p>
      </div>

      {/* Check-in prompt banner — right below the hero copy */}
      {(() => {
        const d = daysAgoUtil(lastCheckin?.date)
        const todayDone = d === 0
        return (
          <button
            className={`tp-checkin-banner${todayDone ? ' tp-checkin-banner--done' : ''}`}
            type="button"
            onClick={() => onOpenCheckin?.()}
          >
            <span className="tp-checkin-banner__icon">{todayDone ? '✓' : '📋'}</span>
            <span className="tp-checkin-banner__body">
              <span className="tp-checkin-banner__title">
                {todayDone
                  ? 'Logged today — tap to view or update'
                  : (d == null
                      ? 'Start your first health check-in'
                      : d === 1
                        ? 'Log today\'s check-in'
                        : `Log today\'s check-in — it\'s been ${d} days`)}
              </span>
              <span className="tp-checkin-banner__sub">
                {todayDone
                  ? 'Your trend is up to date. Tap to see today\'s summary.'
                  : 'Adds to your trend, triggers, and pattern detection.'}
              </span>
            </span>
            <span className="tp-checkin-banner__arrow">→</span>
          </button>
        )
      })()}

      {/* AI Insights — compact, expandable */}
      <div className={`tp-ai-summary${aiOpen ? ' tp-ai-summary--open' : ''}`}>
        <button
          type="button"
          className="tp-ai-summary__head"
          onClick={() => setAiOpen(o => !o)}
          aria-expanded={aiOpen}
        >
          <span className="tp-ai-summary__badge">✨ AI Insights</span>
          <span className="tp-ai-summary__teaser">
            {aiOpen ? 'Tap to collapse' : '3 patterns to know'}
          </span>
          <span className="tp-ai-summary__chev" aria-hidden="true">{aiOpen ? '▴' : '▾'}</span>
        </button>
          {aiOpen && (
            <ul className="tp-ai-summary__list">
              {conditions.length >= 2 ? (
                <>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-teal)' }} />
                    <span><strong>Stress is your strongest trigger across both.</strong> Both worsen 24–48 hrs after stressful days.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-warm)' }} />
                    <span><strong>Sleep under 65 hits both equally.</strong> Worst days follow shortest nights.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-sage)' }} />
                    <span><strong>They don't peak together.</strong> When your {conditions[0]?.toLowerCase()} is worst, your {conditions[1]?.toLowerCase()} is often calmer.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-teal)' }} />
                    <span><strong>Stress predicts health changes.</strong> Your {(conditions[0] || 'condition').toLowerCase()} worsens 24–48 hrs after high-stress days.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-warm)' }} />
                    <span><strong>Sleep quality matters.</strong> Nights under 65 are followed by visibly worse days.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-sage)' }} />
                    <span><strong>Medication timing matters.</strong> Days you log consistent medication use trend better.</span>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

      {/* ── My Numbers ── */}
      <div className="tp-section">
        <div className="tp-sec-head" style={{ marginBottom: 10 }}>
          <h2 className="tp-sec-title">My Numbers</h2>
          <button
            style={{ background: 'var(--color-teal)', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setAddingTile(o => !o)}
          >{addingTile ? 'Done' : '+ Add'}</button>
        </div>

        {/* Tile picker */}
        {addingTile && (
          <div className="tp-card" style={{ padding: '12px 14px', marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10, marginTop: 0 }}>Choose which numbers to track — checked tiles appear on your home screen and here.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ALL_TILE_DEFS.map(td => {
                const on = tileConfig.includes(td.id)
                return (
                  <button key={td.id} onClick={() => toggleTile(td.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: on ? 'rgba(27,188,60,.08)' : 'var(--color-surface)',
                    border: `1.5px solid ${on ? 'var(--color-teal)' : 'var(--color-border)'}`,
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: 18, width: 24 }}>{td.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{td.label}</span>
                    <span style={{ fontSize: 16, color: on ? 'var(--color-teal)' : 'var(--color-border)' }}>{on ? '✓' : '+'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {myNumbers.length === 0 && !addingTile ? (
          <div className="tp-card" style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 16px' }}>
            Tap <strong>+ Add</strong> to choose which numbers to track.
          </div>
        ) : myNumbers.length > 0 ? (
          <div style={{ display: 'flex', overflowX: 'auto', gap: 10, paddingBottom: 4, marginLeft: -4, paddingLeft: 4 }}>
            {myNumbers.map((n) => (
              <div key={n.id} style={{
                minWidth: 150, maxWidth: 165, flexShrink: 0,
                background: 'var(--color-surface)', borderRadius: 16, padding: '14px 14px 10px',
                border: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{n.icon}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, lineHeight: 1.2 }}>{n.label}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1, marginBottom: 2 }}>
                  {n.value.split('·')[0].trim()}
                </div>
                {n.value.includes('·') && (
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    {n.value.split('·').slice(1).join('·').trim()}
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                  {n.periodic ? 'Periodic reading' : formatCheckinDate(n.date)}
                </div>
                {n.sparkData && n.sparkData.length >= 3 && (
                  <div style={{ marginTop: 'auto' }}>
                    <Sparkline data={n.sparkData} color="var(--color-teal)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Recent check-ins */}
      {checkins.length > 0 && (
        <div className="tp-section">
          <div className="tp-sec-head">
            <h2 className="tp-sec-title">Recent check-ins</h2>
            <span className="tp-sec-badge" style={{ background: 'rgba(27,188,60,.1)', color: 'var(--color-teal)' }}>
              {checkins.length} logged
            </span>
          </div>
          <div className="tp-card" style={{ padding: 0, overflow: 'hidden' }}>
            {[...checkins].reverse().slice(0, 5).map((c, i) => {
              const primary = Array.isArray(c.conditionAnswers) && c.conditionAnswers[0]
              const sevIdx = primary?.severity ?? c.severity ?? null
              const sympIdx = primary?.symptoms ?? c.symptoms ?? null
              const mood = sevIdx != null ? MOOD_LABELS[sevIdx] : null
              const symp = sympIdx != null ? SYMPTOM_LABELS[sympIdx] : null
              const txCount = c.treatments?.length || 0
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>
                    {mood?.e || '📋'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                        {mood?.l || 'Logged'}
                      </span>
                      {symp && symp.l !== 'No symptoms' && (
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '1px 7px', borderRadius: 10 }}>
                          {symp.e} {symp.l}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {txCount > 0 ? `${txCount} medication${txCount > 1 ? 's' : ''} active` : 'No medications logged'}
                      {c.wearableSynced ? ' · Wearable synced' : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    {formatCheckinDate(c.date)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mood trend chart */}
      {checkins.length >= 3 && (
        <div className="tp-section">
          <div className="tp-sec-head">
            <h2 className="tp-sec-title">Mood trend</h2>
            <span className="tp-sec-badge" style={{ background: 'rgba(0, 185, 226,.12)', color: 'var(--color-teal)' }}>From check-ins</span>
          </div>
          <div className="tp-card">
            {(() => {
              const recent = [...checkins].reverse().slice(0, 14)
              const moodVals = recent.map(c => {
                const primary = Array.isArray(c.conditionAnswers) && c.conditionAnswers[0]
                const sevIdx = primary?.severity ?? c.severity ?? null
                return sevIdx != null ? (4 - sevIdx) : null // invert so higher = better mood
              }).filter(v => v !== null)
              if (moodVals.length < 3) return <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '8px 0' }}>Log more check-ins to see your mood trend.</div>
              return <Sparkline data={moodVals} color="var(--color-sage)" />
            })()}
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Higher = better mood · last {Math.min(checkins.length, 14)} check-ins</div>
          </div>
        </div>
      )}

      {/* What's been going on */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">What's been going on</h2>
          {triggersReal && (
            <span className="tp-sec-badge" style={{ background: 'rgba(46,209,203,.12)', color: 'var(--color-teal)' }}>
              From your check-ins
            </span>
          )}
        </div>
        <div className="tp-card">
          {triggerRows.map((t, i) => (
            <div key={i} className="tp-trig-row">
              <span className="tp-trig-emoji">{t.e}</span>
              <span className="tp-trig-label">{t.l}</span>
              <div className="tp-trig-bar-wrap"><div className="tp-trig-bar" style={{ width: `${t.p}%`, background: t.c }} /></div>
              <span className="tp-trig-pct" style={{ color: t.c }}>{t.p}%</span>
            </div>
          ))}
          <div className="tp-insight">
            <div className="tp-insight-tag" style={{ color: 'var(--color-teal)' }}>
              <span className="tp-insight-dot" style={{ background: 'var(--color-teal)' }} />
              Pattern detected
            </div>
            <div className="tp-insight-title">Stressful days show up in your health metrics ~48 hours later</div>
            <div className="tp-insight-body">When you report a stressful day, your health score worsens 2 days afterward — confirmed 3 of 4 weeks. Your Oura HRV data backs this up.</div>
          </div>
        </div>
      </div>

      {/* My medications & products */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">My medications &amp; products</h2>
        </div>

        <div className="tp-card" style={{ padding: '16px' }}>
          {/* Title / sub copy */}
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: 'var(--color-text)' }}>
            {treatments.length === 0 ? 'What are you currently taking or using?' : 'Still using these?'}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
            {treatments.length === 0
              ? 'Search by name or type your own. We\'ll organize them for you.'
              : 'Remove anything you\'ve stopped, or add something new.'}
          </p>

          {/* Grouped chip display */}
          {treatments.length > 0 && (() => {
            const grouped = groupTxByCategory(treatments.map(t => t.name))
            return (
              <div style={{ marginBottom: 14 }}>
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

          {/* Typeahead input */}
          <div className="ci-tx-input-wrap">
            <input
              ref={txInputRef}
              className="ci-tx-input"
              type="text"
              placeholder="Search medications, supplements, programs…"
              value={txInput}
              onChange={e => setTxInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && txInput.trim()) { addTreatment(txInput) } }}
            />
            {txInput.trim() && (
              <button type="button" className="ci-tx-add" onClick={() => addTreatment(txInput)}>
                + Add "{txInput.trim()}"
              </button>
            )}
            {txSuggestions.length > 0 && (
              <ul className="ci-tx-suggest">
                {txSuggestions.map(s => (
                  <li key={s}>
                    <button type="button" className="ci-tx-suggest__btn" onClick={() => addTreatment(s)}>
                      <span className="ci-tx-suggest__plus">+</span>{s}
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 6 }}>{categoryForTx(s)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="sponsor-card-wrap">
        <SponsorBanner variant="card" />
      </div>

      {/* Recommended for you */}
      <div className="tp-section">
        <div className="tp-sec-head"><h2 className="tp-sec-title">Recommended for you</h2></div>
        <div className="tp-action-scroll">
          {ACTIONS.map((a, i) => (
            <div key={i} className="tp-action-card">
              <div className="tp-ac-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div className="tp-ac-tag" style={{ color: a.tagC }}>{a.tag}</div>
              <div className="tp-ac-title">{a.title}</div>
              <div className="tp-ac-body">{a.body}</div>
              <span className="tp-ac-cta" style={{ background: a.ctaBg, color: a.ctaC }}>{a.cta}</span>
            </div>
          ))}
          <div style={{ minWidth: 'var(--space-4)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Body signals */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">Your body signals</h2>
          <span className="tp-sec-badge" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Not connected</span>
        </div>
        <div className="tp-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⌚</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>Sync your device</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
            Connect Apple Watch, Oura, or Whoop to see sleep, HRV, stress, and readiness alongside your check-ins.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', opacity: 0.35, marginBottom: 20 }}>
            {METRICS.map((m, i) => (
              <div key={i} style={{ background: 'var(--color-surface)', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>{m.e}</span><span>{m.l}</span>
              </div>
            ))}
          </div>
          <button style={{ background: 'var(--color-teal)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Connect a device →
          </button>
        </div>
      </div>

      {/* Health assessments */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">Health assessments</h2>
          <span className="tp-sec-badge" style={{ background: 'rgba(27, 188, 60,.1)', color: 'var(--color-teal)' }}>ePRO</span>
        </div>
        {EPROS.map((ep, i) => (
          <div key={i} className="tp-epro-card">
            <div className="tp-epro-icon" style={{ background: ep.iconBg }}>{ep.icon}</div>
            <div className="tp-epro-body">
              <div className="tp-epro-title">{ep.title}</div>
              <div className="tp-epro-sub">{ep.sub}</div>
              <div className="tp-epro-meta">
                <span className="tp-epro-pill" style={{ background: ep.pillBg, color: ep.pillC }}>{ep.pill}</span>
                <span className="tp-epro-last">Last completed: {ep.last}</span>
              </div>
            </div>
            <div className="tp-epro-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        ))}
      </div>

      <SponsorBanner />

      {/* DLQI Results */}
      <div className="tp-section" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">Your assessment results</h2>
          <span className="tp-sec-badge" style={{ background: 'rgba(0, 185, 226,.12)', color: 'var(--color-teal)' }}>Trend</span>
        </div>
        <div className="tp-card">
          <div className="tp-er-header"><span className="tp-er-title">DLQI — Quality of Life</span></div>
          <div className="tp-er-score-row">
            <div className="tp-er-ring">
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0 }}>
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-border)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-teal)" strokeWidth="4" strokeDasharray="176" strokeDashoffset={176 - (176 * 9 / 30)} strokeLinecap="round" transform="rotate(-90 32 32)" />
              </svg>
              <span className="tp-er-val">9</span>
              <span className="tp-er-max">/30</span>
            </div>
            <div className="tp-er-score-body">
              <div className="tp-er-score-label">Moderate impact</div>
              <div className="tp-er-score-interp">Your {activeCondition || 'health condition'} has a moderate effect on daily life. Sleep, energy, and daily activity are most affected.</div>
            </div>
          </div>
          <div className="tp-er-trend">
            <span className="tp-er-trend-arrow">📉</span>
            <span className="tp-er-trend-text"><strong>Improving:</strong> Score dropped from 16 (Jan) → 12 (Feb) → 9 (Apr). Your routine is working.</span>
          </div>
          <div className="tp-er-history">
            {[{d:'Apr 3',s:9,pct:30},{d:'Feb 22',s:12,pct:40},{d:'Jan 10',s:16,pct:53}].map((r,i) => (
              <div key={i} className="tp-er-hist-row">
                <span className="tp-er-hist-date">{r.d}</span>
                <div className="tp-er-hist-bar"><div className="tp-er-hist-fill" style={{ width: `${r.pct}%`, background: 'var(--color-teal)' }} /></div>
                <span className="tp-er-hist-score" style={{ color: 'var(--color-teal)' }}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  )
}
