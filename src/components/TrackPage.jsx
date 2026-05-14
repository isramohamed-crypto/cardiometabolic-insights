import React, { useState, useMemo, useEffect } from 'react'
import SponsorBanner from './SponsorBanner'

function readCheckins() {
  try { return JSON.parse(localStorage.getItem('skinsightsCheckins') || '[]') } catch (_) { return [] }
}

const CHART_DATA = {
  '14 days': {
    skin:   [2,2,3,3,2,4,3,2,2,3,2,4,3,2],
    stress: [6,5,7,4,5,3,7,6,5,8,4,3,7,6],
    sleep:  [72,68,65,74,70,58,62,75,71,60,73,78,64,72],
    days:   ['Mar 25','31','Apr 7'],
    note:   'Pattern detected: skin score peaks on Apr 1 and Apr 6 — both follow high-stress days with low sleep scores.',
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
    note:   'Long-term pattern: stress is your #1 predictor. Skin scores trend higher in weeks with consistent sleep above 70.',
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
  'Eczema': {
    '14 days': { skin: [2,2,3,3,2,4,3,2,2,3,2,4,3,2], note: 'Eczema flares on Apr 1 and Apr 6 — both follow high-stress days with low sleep scores.' },
    '30 days': { skin: [3,2,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2,1,2,3,2,4,3,2,2,3,2], note: 'Eczema worsens on weeks where stress > 6 and sleep < 65.' },
    '90 days': { skin: [3,3,2,3,4,3,2,2,3,2,4,3,2,3,2,1,2,3,4,3,2,2,3,2,4,3,2,3,3,2], note: 'Eczema trend improves in weeks with consistent sleep above 70.' },
  },
  'Psoriasis': {
    '14 days': { skin: [3,3,3,3,2,2,2,3,3,3,3,4,3,3], note: 'Psoriasis plaques have been steady — slight worsening late this week.' },
    '30 days': { skin: [3,3,3,3,3,2,2,2,3,3,3,4,3,3,3,3,3,3,3,3,2,2,2,3,3,3,4,3,3,3], note: 'Psoriasis is slow-changing — improvements visible across 4-week intervals.' },
    '90 days': { skin: [4,4,3,3,3,3,3,3,3,2,2,2,3,3,3,3,3,3,3,3,3,3,3,2,2,2,3,3,3,3], note: 'Psoriasis has gradually improved over the quarter — consistent treatment showing.' },
  },
  'Rosacea': {
    '14 days': { skin: [1,2,3,2,3,4,3,2,1,2,3,3,2,2], note: 'Rosacea flushing spikes on Mar 30 and Apr 4 — both warm/humid weather days.' },
    '30 days': { skin: [2,1,2,3,2,3,4,3,2,1,2,3,3,2,2,3,2,1,2,3,2,3,4,3,2,1,2,3,3,2], note: 'Rosacea is reactive to weather and new products this month.' },
    '90 days': { skin: [2,2,3,2,1,2,3,2,3,4,3,2,1,2,3,3,2,2,3,2,1,2,3,2,3,4,3,2,3,3], note: 'Rosacea volatility highest in transitional weather periods.' },
  },
  'Acne': {
    '14 days': { skin: [2,2,2,3,3,4,4,3,2,2,1,1,2,2], note: 'Acne breakouts peaked Mar 30–Apr 1, then cleared as the week went on.' },
    '30 days': { skin: [2,3,3,4,4,3,2,2,1,1,2,2,2,3,3,4,4,3,2,2,1,1,2,2,2,3,3,4,3,2], note: 'Acne shows a roughly 10-day cycle — likely hormonal.' },
    '90 days': { skin: [3,3,4,4,3,2,2,1,1,2,2,3,3,4,4,3,2,2,1,1,2,2,3,3,4,4,3,2,2,1], note: 'Acne breakouts follow a recurring monthly pattern.' },
  },
  'Redness or irritation': {
    '14 days': { skin: [2,3,2,3,4,3,2,2,3,4,3,2,3,2], note: 'Redness flared on Mar 29 and Apr 3 — both after trying a new product.' },
    '30 days': { skin: [3,2,3,2,3,4,3,2,2,3,4,3,2,3,2,3,2,3,2,3,4,3,2,2,3,4,3,2,3,2], note: 'Redness tied to product reactivity this month.' },
    '90 days': { skin: [3,3,2,3,2,3,4,3,2,2,3,4,3,2,3,2,3,3,2,3,2,3,4,3,2,2,3,4,3,2], note: 'Redness reactive to environmental and product changes.' },
  },
  'Dryness or flaking': {
    '14 days': { skin: [3,3,4,3,3,4,4,3,3,3,2,3,3,3], note: 'Dryness highest on cold/dry days — moisturizing within 3 min of showering helps.' },
    '30 days': { skin: [3,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4], note: 'Dryness fluctuates with humidity — trends drier in winter weeks.' },
    '90 days': { skin: [4,4,3,3,4,4,3,3,3,2,3,3,3,3,3,4,3,3,4,4,3,3,3,2,3,3,3,3,4,4], note: 'Dryness has slowly improved — barrier repair routine is working.' },
  },
  'Itching or sensitivity': {
    '14 days': { skin: [3,2,3,3,4,3,2,3,3,3,2,3,3,2], note: 'Itch spikes overnight on Mar 30 and Apr 3 — both after late caffeine/stress days.' },
    '30 days': { skin: [3,3,2,3,3,4,3,2,3,3,3,2,3,3,2,3,3,2,3,3,4,3,2,3,3,3,2,3,3,2], note: 'Itch worst on poor-sleep nights — strong correlation with sleep < 65.' },
    '90 days': { skin: [3,3,3,3,2,3,3,4,3,2,3,3,3,2,3,3,2,3,3,3,2,3,3,4,3,2,3,3,3,2], note: 'Itch trends improve in weeks with regular sleep schedule.' },
  },
  'Breakouts or bumps': {
    '14 days': { skin: [2,2,3,3,4,4,3,3,2,2,1,2,2,2], note: 'Breakouts peaked early in the cycle, then settled.' },
    '30 days': { skin: [3,2,2,3,3,4,4,3,3,2,2,1,2,2,2,3,2,2,3,3,4,4,3,3,2,2,1,2,2,2], note: 'Breakouts show a cyclical pattern, ~12 days apart.' },
    '90 days': { skin: [3,3,4,4,3,3,2,2,1,2,2,2,3,3,4,4,3,3,2,2,1,2,2,2,3,3,4,4,3,3], note: 'Breakouts following a recurring monthly cycle.' },
  },
  'Unpredictable flare-ups': {
    '14 days': { skin: [1,2,4,2,1,3,4,2,1,3,2,4,2,1], note: 'Flares are erratic — no clear weekly pattern, but stress days correlate strongly.' },
    '30 days': { skin: [2,1,2,4,2,1,3,4,2,1,3,2,4,2,1,3,2,1,2,4,2,1,3,4,2,1,3,2,4,2], note: 'Unpredictable flare pattern — stress is the strongest single trigger.' },
    '90 days': { skin: [3,2,1,2,4,2,1,3,4,2,1,3,2,4,2,1,3,3,2,1,2,4,2,1,3,4,2,1,3,2], note: 'Even across 90 days, the only consistent flare predictor is your stress level.' },
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
  { icon: '🌬️', bg: 'rgba(0, 185, 226,.12)', tag: 'STRESS · TONIGHT', tagC: '#0D7C8F', title: '3-min breathing before bed', body: 'Your HRV is 15% below baseline. Breathwork tonight can interrupt the stress → flare cascade.', cta: 'Start now →', ctaBg: 'var(--color-teal)', ctaC: '#fff' },
  { icon: '🧴', bg: 'rgba(27, 188, 60,.1)',    tag: 'SKINCARE · ROUTINE', tagC: 'var(--color-teal)', title: 'Add moisturizer timing to your daily checklist', body: 'You moisturize 4/7 nights. Making it 7/7 could improve your average skin score.', cta: 'Add to checklist', ctaBg: 'rgba(27, 188, 60,.1)', ctaC: 'var(--color-teal)' },
  { icon: '📖', bg: 'rgba(0, 83, 226,.1)',    tag: 'LEARN · NEXT MODULE', tagC: '#0053E2', title: 'Continue: Stress + Skin journey', body: "You're 12% through. Next up: the 3-minute breathing reset micro-challenge.", cta: 'Continue →', ctaBg: 'rgba(0, 83, 226,.1)', ctaC: '#0053E2' },
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
  { icon: '📋', iconBg: 'rgba(27, 188, 60,.1)',   title: 'DLQI — Quality of Life',    sub: 'How eczema impacts your daily life. 10 questions, ~2 min.', pill: 'Recommended', pillBg: 'rgba(27, 188, 60,.1)', pillC: 'var(--color-teal)', last: 'Mar 24' },
  { icon: '📊', iconBg: 'rgba(0, 185, 226,.12)', title: 'POEM — Symptom Severity',   sub: 'Track eczema severity over the past week. 7 questions.',    pill: 'Recommended', pillBg: 'rgba(0, 185, 226,.12)', pillC: '#0D7C8F', last: 'Apr 3' },
  { icon: '🧠', iconBg: 'rgba(246,76,34,.1)',   title: 'HADS — Anxiety & Mood',     sub: 'Understand the emotional side of your skin condition.',       pill: 'Recommended', pillBg: 'rgba(246,76,34,.1)', pillC: 'var(--color-warm)', last: 'Mar 10' },
]

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
        <span className="tp-leg"><span className="tp-leg-dot" style={{ background: 'var(--color-sage)' }} />Skin score</span>
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
  try { return JSON.parse(localStorage.getItem('skinsightsLastCheckin') || 'null') } catch (_) { return null }
}

function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
    const raw = Array.isArray(p.condition) ? p.condition : (p.condition ? [p.condition] : [])
    return raw.filter(Boolean)
  } catch (_) { return [] }
}

function readTreatments() {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
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
        <p className="pp-hero-eyebrow">Your skin diary</p>
        <h1 className="pp-hero-title">What your data is telling you</h1>
        <p className="pp-hero-sub">Log how you're feeling to help identify the patterns behind your flares.</p>
      </div>

      {/* Status strip — overlaps hero */}
      <div className="tp-status-strip">
        <div className="tp-sc"><div className="tp-sc-label">Days tracked</div><div className="tp-sc-val">{daysTracked}</div></div>
        <div className="tp-sc"><div className="tp-sc-label">Top pattern</div><div className="tp-sc-val" style={{ color: 'var(--color-teal)' }}>{topPattern}</div></div>
        <div className="tp-sc"><div className="tp-sc-label">Confidence</div><div className="tp-sc-val">82%</div></div>
      </div>

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
                    <span><strong>Stress predicts flares.</strong> Your {(conditions[0] || 'skin').toLowerCase()} worsens 24–48 hrs after high-stress days.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-warm)' }} />
                    <span><strong>Sleep quality matters.</strong> Nights under 65 are followed by visibly worse days.</span>
                  </li>
                  <li className="tp-ai-summary__item">
                    <span className="tp-ai-summary__dot" style={{ background: 'var(--color-sage)' }} />
                    <span><strong>Moisturizer timing matters.</strong> Days you log within-3-min moisturizing trend better.</span>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

      {/* Condition toggle — only renders for users with 2+ tracked conditions */}
      {conditions.length > 1 && (
        <div className="tp-cond-toggle" role="tablist">
          {conditions.map(c => (
            <button
              key={c}
              role="tab"
              type="button"
              aria-selected={c === activeCondition}
              className={`tp-cond-toggle__btn${c === activeCondition ? ' tp-cond-toggle__btn--active' : ''}`}
              onClick={() => setActiveCondition(c)}
            >{c}</button>
          ))}
        </div>
      )}

      {/* Check-in prompt banner */}
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
                      ? 'Start your first skin check-in'
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

      {/* Trend */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">{activeCondition ? `${activeCondition} trend` : 'Trend'}</h2>
          <span className="tp-sec-badge" style={{ background: 'rgba(0, 185, 226,.12)', color: 'var(--color-teal)' }}>Live</span>
        </div>
        <div className="tp-time-toggle">
          {['14 days','30 days','90 days'].map(t => (
            <button key={t} className={`tp-tt-btn${timeRange === t ? ' tp-tt-btn--on' : ''}`} onClick={() => setTimeRange(t)}>{t}</button>
          ))}
        </div>
        <div className="tp-card"><TrendChart range={timeRange} condition={activeCondition} /></div>
      </div>

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
            <div className="tp-insight-title">Stressful days show up on your skin ~48 hours later</div>
            <div className="tp-insight-body">When you report a stressful day, your skin score worsens 2 days afterward — confirmed 3 of 4 weeks. Your Oura HRV data backs this up.</div>
          </div>
        </div>
      </div>

      {/* Treatments & products — from check-in chips */}
      <div className="tp-section">
        <div className="tp-sec-head">
          <h2 className="tp-sec-title">Treatments &amp; products</h2>
          {treatments.length > 0 && (
            <span className="tp-sec-badge" style={{ background: 'var(--color-teal-light)', color: 'var(--color-teal)' }}>
              {treatments.length} active
            </span>
          )}
        </div>
        {treatments.length === 0 ? (
          <div className="tp-card">
            <div className="tp-tx-empty">
              <span className="tp-tx-empty__icon">🧴</span>
              <div>
                <div className="tp-tx-empty__title">Nothing logged yet</div>
                <div className="tp-tx-empty__sub">Add what you're using during your next skin check-in. It'll show up here.</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="tp-tx-scroll">
              {treatments.map(t => {
                const days = daysSinceUtil(t.addedAt)
                const cond = t.condition || null
                return (
                  <article key={`${cond || ''}::${t.name}`} className="tp-tx-card">
                    <div className="tp-tx-card__top">
                      {cond
                        ? <span className="tp-tx-card__tag">{cond}</span>
                        : <span className="tp-tx-card__tag tp-tx-card__tag--generic">General</span>}
                      <span className="tp-tx-card__status">●</span>
                    </div>
                    <div className="tp-tx-card__name">{t.name}</div>
                    <div className="tp-tx-card__meta">
                      <span className="tp-tx-card__meta-icon">⏱</span>
                      {days == null
                        ? 'Just added'
                        : days === 0 ? 'New today' : days === 1 ? '1 day active' : `${days} days active`}
                    </div>
                  </article>
                )
              })}
              <div style={{ minWidth: 'var(--space-4)', flexShrink: 0 }} />
            </div>
            <p className="tp-tx-note">
              💡 Add dose &amp; frequency in your <strong>profile</strong> to power adherence insights.
            </p>
          </>
        )}
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
          <span className="tp-sec-badge" style={{ background: 'rgba(0, 185, 226,.12)', color: 'var(--color-teal)' }}>Oura</span>
        </div>
        <div className="tp-metrics-grid">
          {METRICS.map((m, i) => (
            <div key={i} className="tp-metric-tile">
              <div className="tp-mt-header">
                <span className="tp-mt-emoji">{m.e}</span>
                <span className="tp-mt-label">{m.l}</span>
              </div>
              <div className="tp-mt-val">{m.v}<span className="tp-mt-unit">{m.u}</span></div>
              <div className="tp-mt-detail">{m.d}</div>
              <Sparkline data={m.sp} color={m.tc} />
              <div className="tp-mt-trend" style={{ color: m.tc }}>{m.tl}</div>
            </div>
          ))}
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
              <div className="tp-er-score-interp">Your {activeCondition || 'skin condition'} has a moderate effect on daily life. Sleep, leisure, and social activity are most affected.</div>
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
