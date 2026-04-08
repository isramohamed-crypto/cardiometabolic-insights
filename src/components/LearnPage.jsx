import React, { useState } from 'react'

const TYPE_COLORS = {
  'Swipe to learn':   { color: '#2A6B54', bg: 'rgba(42,107,84,0.12)' },
  'Micro-challenge':  { color: '#7D9E8E', bg: 'rgba(125,158,142,0.15)' },
  'Quiz':             { color: '#2060D4', bg: 'rgba(32,96,212,0.1)' },
  'Patient story':    { color: '#B5784A', bg: 'rgba(181,120,74,0.12)' },
  'Expert Q&A':       { color: '#2A6B54', bg: 'rgba(42,107,84,0.12)' },
  'Poll':             { color: '#B5784A', bg: 'rgba(181,120,74,0.12)' },
  'Tap to learn':     { color: '#2060D4', bg: 'rgba(32,96,212,0.1)' },
  'Step-by-step':     { color: '#B5784A', bg: 'rgba(181,120,74,0.12)' },
  'Article':          { color: '#2A6B54', bg: 'rgba(42,107,84,0.12)' },
}

const JOURNEYS = [
  {
    id: 'skincare',
    tag: 'Active · Skincare',
    tagColor: '#2A6B54',
    tagBg: 'rgba(42,107,84,0.12)',
    meta: '5 activities · 15 min',
    title: 'Skincare Basics for Eczema',
    desc: 'Build a simple routine that protects your skin barrier.',
    progress: 60,
    progressColor: 'var(--color-teal)',
    border: null,
    defaultOpen: false,
    activities: [
      { type: 'Swipe to learn', icon: '📖', name: 'Understanding your skin barrier', meta: '4 cards · 2 min', done: true },
      { type: 'Quiz',           icon: '🧩', name: 'Moisturizer myths',              meta: '3 questions · 1 min', done: true },
      { type: 'Step-by-step',   icon: '📋', name: 'Your patch-test routine',         meta: '4 steps · 3 min', done: true },
      { type: 'Expert Q&A',     icon: '🎬', name: 'Ceramides vs. steroids',          meta: '1:45 · Video', done: false },
      { type: 'Micro-challenge', icon: '⚡', name: 'The 3-minute moisturize window', meta: 'Try tonight · 3 min', done: false },
    ],
  },
  {
    id: 'stress',
    tag: 'Active · Stress',
    tagColor: '#6B4A7A',
    tagBg: 'rgba(107,74,122,0.12)',
    meta: '9 activities · 20 min',
    title: 'Stress + Skin Connection',
    desc: 'How cortisol drives flares and practical ways to break the cycle.',
    progress: 12,
    progressColor: '#6B4A7A',
    border: '#6B4A7A',
    defaultOpen: true,
    activities: [
      { type: 'Swipe to learn',  icon: '📖', name: 'The stress–flare connection',               meta: '5 cards · 2 min',  done: true },
      { type: 'Micro-challenge', icon: '🌬️', name: '3-minute breathing reset',                  meta: 'Try now · 3 min',  done: false },
      { type: 'Quiz',            icon: '🧩', name: 'Test: cortisol & your skin',                meta: '3 questions · 1 min', done: false },
      { type: 'Patient story',   icon: '🎬', name: "Sandra's stress-tracking breakthrough",     meta: '1:32 · Video',     done: false },
      { type: 'Expert Q&A',      icon: '🎬', name: 'Why stress shows up on skin 2 days later',  meta: '2:15 · Video',     done: false },
      { type: 'Poll',            icon: '📊', name: 'Your biggest stress trigger',               meta: 'Vote · 30 sec',    done: false },
      { type: 'Tap to learn',    icon: '👆', name: 'Where stress hits your skin',               meta: 'Interactive · 1 min', done: false },
      { type: 'Step-by-step',    icon: '📋', name: "Tonight's stress-recovery routine",         meta: '5 steps · 3 min',  done: false },
      { type: 'Article',         icon: '📰', name: 'Why eczema gets worse under stress',        meta: 'Key takeaways · 2 min', done: false },
    ],
  },
  {
    id: 'sleep',
    tag: 'Coming · Sleep',
    tagColor: '#999',
    tagBg: '#eee',
    meta: '6 activities · 14 min',
    title: 'Sleep + Skin Recovery',
    desc: 'Nighttime routines that reduce scratching and improve repair.',
    progress: 0,
    progressColor: '#ccc',
    border: null,
    locked: true,
    lockMsg: '🔒 Unlocks after Stress module',
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'nutrition',
    tag: 'Coming · Nutrition',
    tagColor: '#999',
    tagBg: '#eee',
    meta: '5 activities · 12 min',
    title: 'Anti-Inflammatory Eating',
    desc: 'Trigger foods, elimination diary basics, and meal ideas.',
    progress: 0,
    progressColor: '#ccc',
    locked: true,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'home',
    tag: 'Coming · Home',
    tagColor: '#999',
    tagBg: '#eee',
    meta: '4 activities · 10 min',
    title: 'Eczema-Proofing Your Home',
    desc: 'Humidity, detergents, sheets, air filters — the hidden triggers.',
    progress: 0,
    progressColor: '#ccc',
    locked: true,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'confidence',
    tag: 'Coming · Confidence',
    tagColor: '#999',
    tagBg: '#eee',
    meta: '4 activities · 10 min',
    title: 'Confidence + Appearance',
    desc: 'Managing visibility, makeup tips, and stories from women like you.',
    progress: 0,
    progressColor: '#ccc',
    locked: true,
    defaultOpen: false,
    activities: [],
  },
]

function Checkmark() {
  return (
    <span className="lp-activity__check lp-activity__check--done">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function JourneyCard({ journey }) {
  const [open, setOpen] = useState(journey.defaultOpen)
  const { tag, tagColor, tagBg, meta, title, desc, progress, progressColor, border, locked, lockMsg, activities } = journey

  return (
    <div
      className={`lp-journey${locked ? ' lp-journey--locked' : ''}`}
      style={border ? { borderColor: border, borderWidth: 2 } : {}}
    >
      <div className="lp-journey__top">
        <span className="lp-journey__tag" style={{ color: tagColor, background: tagBg }}>{tag}</span>
        <span className="lp-journey__meta">{meta}</span>
      </div>
      <div className="lp-journey__mid" onClick={() => !locked && setOpen(o => !o)}>
        <p className="lp-journey__title">{title}</p>
        <p className="lp-journey__desc">{desc}</p>
        <div className="lp-journey__bar">
          <div className="lp-journey__fill" style={{ width: `${progress}%`, background: progressColor }} />
        </div>
      </div>
      {!locked && activities.length > 0 && (
        <button className="lp-journey__toggle" onClick={() => setOpen(o => !o)}>
          {open ? 'Hide topics ▴' : 'Show topics ▾'}
        </button>
      )}
      {locked && lockMsg && (
        <p className="lp-journey__lock">{lockMsg}</p>
      )}
      {open && activities.length > 0 && (
        <div className="lp-journey__activities">
          {activities.map((a, i) => {
            const colors = TYPE_COLORS[a.type] || { color: '#666', bg: '#eee' }
            return (
              <div key={i} className="lp-activity">
                <div className="lp-activity__icon" style={{ background: colors.bg }}>{a.icon}</div>
                <div className="lp-activity__body">
                  <span className="lp-activity__type" style={{ color: colors.color }}>{a.type}</span>
                  <p className="lp-activity__name">{a.name}</p>
                  <span className="lp-activity__meta">{a.meta}</span>
                </div>
                {a.done
                  ? <Checkmark />
                  : <span className="lp-activity__check" />
                }
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function LearnPage() {
  return (
    <main className="main learn-page">
      <div className="lp-header">
        <p className="lp-header__eyebrow">Your curriculum</p>
        <h1 className="lp-header__title">Your journeys</h1>
        <p className="lp-header__sub">Interactive modules — pick up where you left off.</p>
      </div>
      <div className="lp-journeys">
        {JOURNEYS.map(j => <JourneyCard key={j.id} journey={j} />)}
      </div>
    </main>
  )
}
