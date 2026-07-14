import React, { useState, useMemo, useEffect, useRef } from 'react'
import SponsorBanner from './SponsorBanner'
import HabitSection from './HabitSection'
import HabitCheckinSheet from './HabitCheckinSheet'
import DashboardTiles from './DashboardTiles'
import { useProfileStage } from '../context/ProfileStageContext'
import { generateHistoricCheckins } from '../data/mockCheckins'

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

function readTopics() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return Array.isArray(p.topics) ? p.topics : []
  } catch (_) { return [] }
}

function readTileConfigTP() {
  try { return JSON.parse(localStorage.getItem('aheadTileConfig') || 'null') } catch (_) { return null }
}

const CHOLESTEROL_CONDITIONS_TP = ['High cholesterol', 'Borderline numbers']

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

// ── 2-month history data (established user demo) ─────────────────────────────
const HISTORY_METRICS = [
  {
    id: 'ldl', icon: '🫀', label: 'LDL Cholesterol', unit: 'mg/dL',
    color: '#2D9B83', target: 100, targetLabel: 'Optimal <100',
    lowerIsBetter: true,
    points: [
      { date: 'May 5', value: 142 }, { date: 'May 19', value: 138 },
      { date: 'Jun 2', value: 133 }, { date: 'Jun 16', value: 129 },
      { date: 'Jun 30', value: 124 }, { date: 'Jul 7', value: 118 },
    ],
  },
  {
    id: 'bp', icon: '🩺', label: 'Blood Pressure', unit: 'mmHg (systolic)',
    color: '#8B5CF6', target: 120, targetLabel: 'Normal <120',
    lowerIsBetter: true,
    points: [
      { date: 'May 5', value: 138 }, { date: 'May 12', value: 136 },
      { date: 'May 19', value: 133 }, { date: 'May 26', value: 130 },
      { date: 'Jun 2', value: 128 }, { date: 'Jun 9', value: 126 },
      { date: 'Jun 23', value: 124 }, { date: 'Jun 30', value: 123 },
      { date: 'Jul 7', value: 122 },
    ],
  },
  {
    id: 'glucose', icon: '🔬', label: 'Fasting Blood Sugar', unit: 'mg/dL',
    color: '#F59E0B', target: 100, targetLabel: 'Normal <100',
    lowerIsBetter: true,
    points: [
      { date: 'May 5', value: 112 }, { date: 'May 12', value: 110 },
      { date: 'May 19', value: 108 }, { date: 'May 26', value: 106 },
      { date: 'Jun 2', value: 105 }, { date: 'Jun 9', value: 103 },
      { date: 'Jun 16', value: 101 }, { date: 'Jun 23', value: 100 },
      { date: 'Jun 30', value: 99 }, { date: 'Jul 7', value: 98 },
    ],
  },
  {
    id: 'weight', icon: '⚖️', label: 'Weight', unit: 'lbs',
    color: '#3B82F6',
    lowerIsBetter: true,
    points: [
      { date: 'May 5', value: 178 }, { date: 'May 12', value: 176 },
      { date: 'May 19', value: 175 }, { date: 'May 26', value: 174 },
      { date: 'Jun 2', value: 173 }, { date: 'Jun 9', value: 171 },
      { date: 'Jun 16', value: 170 }, { date: 'Jun 23', value: 169 },
      { date: 'Jun 30', value: 169 }, { date: 'Jul 7', value: 168 },
    ],
  },
]

function NumberLineChart({ metric }) {
  const { points, unit, color, target, targetLabel, lowerIsBetter } = metric
  if (!points || points.length < 2) return null

  const W = 280, H = 72
  const values = points.map(p => p.value)
  const allVals = target ? [...values, target] : values
  const min = Math.min(...allVals) - (Math.max(...allVals) - Math.min(...allVals)) * 0.15
  const max = Math.max(...allVals) + (Math.max(...allVals) - Math.min(...allVals)) * 0.1
  const range = max - min || 1

  const toY = v => H - ((v - min) / range) * H
  const toX = i => (i / (points.length - 1)) * W

  const polylinePts = points.map((p, i) => `${toX(i)},${toY(p.value)}`).join(' ')

  const first = points[0]
  const last  = points[points.length - 1]
  const delta = last.value - first.value
  const deltaStr = delta > 0 ? `+${delta}` : String(delta)
  const deltaGood = lowerIsBetter ? delta < 0 : delta > 0
  const deltaColor = deltaGood ? '#2D9B83' : '#EF4444'

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{metric.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', flex: 1 }}>{metric.label}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{last.value}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{unit}</span>
      </div>
      <div style={{ position: 'relative', background: 'var(--color-surface)', borderRadius: 10, padding: '10px 12px 6px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
          {target && (
            <>
              <line x1={0} y1={toY(target)} x2={W} y2={toY(target)}
                stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x={W} y={toY(target) - 4} textAnchor="end"
                fontSize="8" fill="var(--color-text-muted)">{targetLabel}</text>
            </>
          )}
          <polyline points={polylinePts} fill="none" stroke={color}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={toX(i)} cy={toY(p.value)}
              r={i === points.length - 1 ? 4.5 : 2.5}
              fill={i === points.length - 1 ? color : 'var(--color-card)'}
              stroke={color} strokeWidth="1.5" />
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{first.date}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: deltaColor }}>
            {deltaStr} {unit.split(' ')[0]} since {first.date.split(' ')[0]}
          </span>
          <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{last.date}</span>
        </div>
      </div>
    </div>
  )
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

function ArchivedSection({ children }) {
  const [open, setOpen] = React.useState(false)
  return (
    <section className="archived-section" style={{ marginTop: 8 }}>
      <button
        className="archived-section__title"
        onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        Archived
        <span style={{ fontSize: 10, opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && children}
    </section>
  )
}

export default function TrackPage({ onOpenCheckin, checkinTick = 0 }) {
  const { isNew, isMature } = useProfileStage()
  const [timeRange, setTimeRange] = useState('14 days')
  const [checkins, setCheckins] = useState(() => readCheckins())
  // Established users get a lived-in-looking history (most days over the
  // past ~8 weeks, not every day) merged ahead of whatever real check-ins
  // exist — so trends/triggers/mood have real data to show instead of
  // relying purely on mock fallbacks. Real check-ins are never mutated.
  const displayCheckins = useMemo(
    () => (isMature ? [...generateHistoricCheckins(), ...checkins] : checkins),
    [isMature, checkins]
  )
  const [lastCheckin, setLastCheckin] = useState(() => readLastCheckin())
  const [conditions, setConditions] = useState(() => readConditions())
  const [activeCondition, setActiveCondition] = useState(() => readConditions()[0] || null)
  const [treatments, setTreatments] = useState(() => readTreatments())
  const [addingTx, setAddingTx] = useState(false)
  const [showHabitSheet, setShowHabitSheet] = useState(false)
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

  const txSuggestions = txInput.length >= 1
    ? COMMON_TREATMENTS.filter(t => t.toLowerCase().includes(txInput.toLowerCase())).slice(0, 5)
    : []

  // Re-read whenever a new check-in is logged (parent bumps checkinTick) or on focus
  useEffect(() => {
    function refresh() {
      setCheckins(readCheckins())
      setLastCheckin(readLastCheckin())
      setTreatments(readTreatments())
      const conds = readConditions()
      setConditions(conds)
      // Keep activeCondition in sync if it's no longer in the list
      setActiveCondition(prev => (prev && conds.includes(prev)) ? prev : (conds[0] || null))
    }
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [checkinTick])

  // AI Insights: collapsed by default for new users (no patterns yet), expanded for established
  const [aiOpen, setAiOpen] = useState(!isNew)

  const { rows: triggerRows, isReal: triggersReal } = useMemo(() => computeTriggers(displayCheckins), [displayCheckins])
  // Days tracked = baseline mock (21) + actual check-ins logged
  const daysTracked = 21 + displayCheckins.length
  const topPattern = useMemo(() => {
    const top = [...triggerRows].sort((a, b) => b.p - a.p)[0]
    return top?.p > 0 ? top.l.replace('Stressful day', 'Stress').replace(' day', '') : 'Stress'
  }, [triggerRows])

  // Perimenopause-cholesterol insight: show when user has a hormonal signal
  // (cycle tile on OR menopause topic selected) AND a cholesterol condition.
  const showPerimenopause = useMemo(() => {
    if (isNew) return false
    const topics     = readTopics()
    const tileConf   = readTileConfigTP()
    const hasHormone = topics.includes('Menopause & hormonal health') ||
                       (Array.isArray(tileConf) && tileConf.includes('cycle'))
    const hasChol    = conditions.some(c => CHOLESTEROL_CONDITIONS_TP.includes(c))
    return hasHormone && hasChol
  }, [isNew, conditions])

  return (
    <main className="main learn-page track-page">
      <div className="pp-hero tp-hero">
        <p className="pp-hero-eyebrow">Your health log</p>
        <h1 className="pp-hero-title">What your data is telling you</h1>
        <p className="pp-hero-sub">
          {isNew
            ? 'Start logging check-ins and readings — your patterns will show up here.'
            : "Log how you're feeling to help identify the patterns behind your health trends."}
        </p>
      </div>

      {/* AI Insights — always visible; collapsed for new users until patterns emerge */}
      <div className={`tp-ai-summary${aiOpen ? ' tp-ai-summary--open' : ''}`}>
        <button
          type="button"
          className="tp-ai-summary__head"
          onClick={() => setAiOpen(o => !o)}
          aria-expanded={aiOpen}
        >
          <span className="tp-ai-summary__badge">✨ AI Insights</span>
          <span className="tp-ai-summary__teaser">
            {isNew ? 'Patterns appear as you log' : (aiOpen ? 'Tap to collapse' : '3 patterns to know')}
          </span>
          <span className="tp-ai-summary__chev" aria-hidden="true">{aiOpen ? '▴' : '▾'}</span>
        </button>
        {aiOpen && (isNew ? (
          <ul className="tp-ai-summary__list">
            <li className="tp-ai-summary__item">
              <span className="tp-ai-summary__dot" style={{ background: 'var(--color-text-muted)' }} />
              <span>Log a few check-ins and readings — Vitalist AI will start surfacing patterns here.</span>
            </li>
          </ul>
        ) : (
          <ul className="tp-ai-summary__list">
            {conditions.length >= 2 ? (
              <>
                <li className="tp-ai-summary__item">
                  <span className="tp-ai-summary__dot" style={{ background: 'var(--color-teal)' }} />
                  <span><strong>Stress is your strongest trigger across all conditions.</strong> All worsen 24–48 hrs after stressful days.</span>
                </li>
                <li className="tp-ai-summary__item">
                  <span className="tp-ai-summary__dot" style={{ background: 'var(--color-warm)' }} />
                  <span><strong>Sleep under 65 hits every metric.</strong> Your worst days consistently follow your shortest nights.</span>
                </li>
                {showPerimenopause ? (
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: '#9B59B6' }} />
                    <span><strong>Perimenopause may be part of your LDL story.</strong> Estrogen decline directly affects lipid metabolism — this isn't just a diet problem.</span>
                  </li>
                ) : (
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-sage)' }} />
                    <span><strong>Conditions react differently to the same triggers.</strong> When {conditions[0]?.toLowerCase()} flares, {conditions[1]?.toLowerCase()} often holds — and vice versa.</span>
                  </li>
                )}
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
                {showPerimenopause ? (
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: '#9B59B6' }} />
                    <span><strong>Perimenopause may be part of your LDL story.</strong> Estrogen decline directly affects lipid metabolism — this isn't just a diet problem.</span>
                  </li>
                ) : (
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-sage)' }} />
                    <span><strong>Movement makes a difference.</strong> Days with logged activity trend 30% better across all metrics.</span>
                  </li>
                )}
              </>
            )}
          </ul>
        ))}
      </div>

      {/* ── My Numbers (full interactive tiles) ── */}
      <DashboardTiles tick={checkinTick} />
      {isNew && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', margin: '-4px 20px 8px', lineHeight: 1.5 }}>
          Log your numbers to see trends over time
        </p>
      )}

      {/* ── Numbers over time — established user only ── */}
      {!isNew && (
        <div className="tp-section">
          <div className="tp-sec-head">
            <h2 className="tp-sec-title">Numbers over time</h2>
            <span className="tp-sec-badge" style={{ background: 'rgba(27,188,60,.1)', color: 'var(--color-teal)' }}>
              2 months
            </span>
          </div>
          <div className="tp-card" style={{ padding: '16px' }}>
            {HISTORY_METRICS.map(m => (
              <NumberLineChart key={m.id} metric={m} />
            ))}
          </div>
        </div>
      )}

      {/* Check-in strip */}
      <div className="tp-section">
        {(() => {
          const STRESS_STYLE = [null,
            { e: '😄', bg: '#d1fae5' },
            { e: '🙂', bg: '#d1fae5' },
            { e: '😐', bg: '#fef3c7' },
            { e: '😔', bg: '#fee2e2' },
            { e: '😫', bg: '#fee2e2' },
          ]
          const STRESS_LABEL = ['', 'Great day', 'Good day', 'Moderate stress', 'High stress', 'Rough day']
          const sleepMap = { well: '😴 Slept well', okay: '💤 OK sleep', poorly: '😩 Poor sleep' }
          const movMap = { yes: '🏃 Active', 'a little': '🚶 Some movement', 'not-yet': '🛋️ Rest day' }

          const now = new Date()

          // Last 7 days (always a full window, oldest → today)
          const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now)
            d.setDate(now.getDate() - (6 - i))
            d.setHours(0, 0, 0, 0)
            return d
          })

          const DOW_FOR_DATE = d => ['S','M','T','W','T','F','S'][d.getDay()]

          const weekEntries = last7.map(day => ({
            day,
            isToday: day.toDateString() === now.toDateString(),
            checkin: displayCheckins.find(c => new Date(c.date).toDateString() === day.toDateString()) || null,
          }))

          const loggedCount = weekEntries.filter(e => e.checkin).length
          const todayEntry = weekEntries.find(e => e.isToday)
          const todayDone = !!todayEntry?.checkin
          const mostRecent = [...displayCheckins].sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null

          const recentStress = mostRecent?.stress ?? null
          const recentStyle = recentStress != null ? STRESS_STYLE[recentStress] : null
          const recentEmoji = recentStyle?.e || null
          const recentLabel = recentStress != null ? STRESS_LABEL[recentStress] : null
          const recentChips = [
            mostRecent?.sleep ? sleepMap[mostRecent.sleep] : null,
            mostRecent?.movement ? movMap[mostRecent.movement] : null,
          ].filter(Boolean)

          return (
            <div className="tp-card" style={{ padding: 0, overflow: 'hidden' }}>

              {/* Header — title left, check-in CTA right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>Last 7 days</span>
                <button
                  type="button"
                  onClick={() => onOpenCheckin?.()}
                  style={{
                    background: todayDone ? 'rgba(45,155,131,0.1)' : '#2D9B83',
                    color: todayDone ? '#2D9B83' : '#fff',
                    border: 'none', borderRadius: 99,
                    padding: '5px 12px', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {todayDone ? '✓ Logged today' : 'Log today →'}
                </button>
              </div>

              {/* Bubbles row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 14px' }}>
                {weekEntries.map(({ day, isToday, checkin }, i) => {
                  const s = checkin?.stress != null ? STRESS_STYLE[checkin.stress] : null
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{ fontSize: 10, color: isToday ? 'var(--color-teal)' : 'var(--color-text-muted)', fontWeight: isToday ? 700 : 400 }}>
                        {DOW_FOR_DATE(day)}
                      </div>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: s ? s.bg : 'var(--color-surface)',
                        border: isToday ? '2px solid #2D9B83' : '1.5px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: s ? 18 : 11,
                        color: 'var(--color-text-muted)',
                        opacity: !s && !isToday ? 0.35 : 1,
                      }}>
                        {s ? s.e : '·'}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Most recent entry detail */}
              {mostRecent && recentEmoji && (
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{recentEmoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: recentChips.length ? 5 : 0 }}>
                        {recentLabel && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{recentLabel}</span>}
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{formatCheckinDate(mostRecent.date)}</span>
                      </div>
                      {recentChips.length > 0 && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {recentChips.map((chip, ci) => (
                            <span key={ci} style={{ fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '2px 8px', borderRadius: 99 }}>
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pattern detected — established users only */}
              {!isNew && (
                <div className="tp-insight" style={{ margin: 0, borderTop: '1px solid var(--color-border)', borderRadius: 0 }}>
                  <div className="tp-insight-tag" style={{ color: 'var(--color-teal)' }}>
                    <span className="tp-insight-dot" style={{ background: 'var(--color-teal)' }} />
                    Pattern detected
                  </div>
                  <div className="tp-insight-title">Stressful days show up in your health metrics ~48 hours later</div>
                  <div className="tp-insight-body">When you report a stressful day, your readings worsen 2 days afterward — confirmed 3 of 4 weeks. Your check-in history backs this up.</div>
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Wellbeing trend chart */}
      {displayCheckins.length >= 3 && (
        <div className="tp-section">
          <div className="tp-sec-head">
            <h2 className="tp-sec-title">Wellbeing trend</h2>
            <span className="tp-sec-badge" style={{ background: 'rgba(0, 185, 226,.12)', color: 'var(--color-teal)' }}>From check-ins</span>
          </div>
          <div className="tp-card">
            {(() => {
              const recent = [...displayCheckins].reverse().slice(0, 14)
              const wellbeingVals = recent.map(c => {
                if (c.stress != null) return 6 - c.stress
                const primary = Array.isArray(c.conditionAnswers) && c.conditionAnswers[0]
                const sevIdx = primary?.severity ?? c.severity ?? null
                return sevIdx != null ? (4 - sevIdx) : null
              }).filter(v => v !== null)
              if (wellbeingVals.length < 3) return <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '8px 0' }}>Log more check-ins to see your wellbeing trend.</div>
              return <Sparkline data={wellbeingVals} color="var(--color-sage)" />
            })()}
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Higher = better wellbeing · last {Math.min(displayCheckins.length, 14)} check-ins</div>
          </div>
        </div>
      )}

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

      <SponsorBanner />

      {/* ── Archived (collapsed by default) ── */}
      <ArchivedSection>
        <HabitSection onOpenSheet={() => setShowHabitSheet(true)} />
        <HabitCheckinSheet
          open={showHabitSheet}
          onClose={() => setShowHabitSheet(false)}
          onComplete={() => setShowHabitSheet(false)}
        />

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

        {/* Assessment results */}
        <div className="tp-section" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="tp-sec-head">
            <h2 className="tp-sec-title">Your assessment results</h2>
            <span className="tp-sec-badge" style={{ background: isNew ? 'var(--color-border)' : 'rgba(0, 185, 226,.12)', color: isNew ? 'var(--color-text-muted)' : 'var(--color-teal)' }}>
              {isNew ? 'Not started' : 'Trend'}
            </span>
          </div>
          {isNew ? (
            <div className="tp-card" style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--color-text-muted)', fontSize: 13 }}>
              Complete a health assessment above to see your results and trend here.
            </div>
          ) : (
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
          )}
        </div>
      </ArchivedSection>

    </main>
  )
}
