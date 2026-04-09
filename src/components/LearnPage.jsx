import React, { useState } from 'react'

const TYPE_COLORS = {
  'Swipe to learn':   { color: '#5D2DE6', bg: 'rgba(93,45,230,0.1)' },
  'Interactive':      { color: '#1C5FF1', bg: 'rgba(28,95,241,0.1)' },
  'Quiz':             { color: '#1C5FF1', bg: 'rgba(28,95,241,0.1)' },
  'Step-by-step':     { color: '#F64C22', bg: 'rgba(246,76,34,0.1)' },
  'Patient story':    { color: '#F64C22', bg: 'rgba(246,76,34,0.1)' },
  'Expert Q&A':       { color: '#5D2DE6', bg: 'rgba(93,45,230,0.1)' },
  'Micro-challenge':  { color: '#2ED1CB', bg: 'rgba(46,209,203,0.15)' },
  'Poll':             { color: '#F64C22', bg: 'rgba(246,76,34,0.1)' },
  'Tap to learn':     { color: '#1C5FF1', bg: 'rgba(28,95,241,0.1)' },
  'Article':          { color: '#5D2DE6', bg: 'rgba(93,45,230,0.1)' },
}

const JOURNEYS = [
  {
    id: 'skincare',
    tag: 'In progress',
    tagColor: '#2ED1CB',
    tagBg: 'rgba(46,209,203,0.12)',
    meta: '5 activities · 15 min',
    title: 'Skincare Basics for Eczema',
    desc: 'Build a simple routine that protects your skin barrier.',
    progress: 60,
    progressColor: '#2ED1CB',
    border: null,
    locked: false,
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
    tag: 'In progress',
    tagColor: '#2ED1CB',
    tagBg: 'rgba(46,209,203,0.12)',
    meta: '6 activities · 15 min',
    title: 'Stress + Skin Connection',
    desc: 'How cortisol drives flares and practical ways to break the cycle.',
    progress: 17,
    progressColor: '#2ED1CB',
    border: null,
    locked: false,
    defaultOpen: true,
    activities: [
      { type: 'Swipe to learn',  icon: '📖', name: 'The stress\u2013flare connection',                        meta: '5 cards · 2 min',  done: true },
      { type: 'Micro-challenge', icon: '🌬️', name: '3-minute breathing reset',                               meta: 'Try now · 3 min',  done: false },
      { type: 'Expert Q&A',      icon: '🎬', name: 'Ask the expert: how lifestyle factors impact eczema',    meta: '2:30 · Video',     done: false },
      { type: 'Patient story',   icon: '🎬', name: 'Sandra\u2019s stress-tracking breakthrough',             meta: '1:32 · Video',     done: false },
      { type: 'Swipe to learn',  icon: '🧘', name: '5 meditation techniques to get you started',             meta: '5 cards · 2 min',  done: false },
      { type: 'Micro-challenge', icon: '🧘', name: '3-minute guided meditation',                             meta: 'Try now · 3 min',  done: false },
    ],
  },
  {
    id: 'triggers',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '7 activities · 18 min',
    title: 'Find Your Triggers',
    desc: 'Most patients blame the wrong thing. Learn to investigate your triggers systematically \u2014 and use your tracking data to prove what\u2019s actually causing your flares.',
    progress: 0,
    progressColor: '#1C5FF1',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [
      { type: 'Swipe to learn', icon: '📖', name: 'Why you haven\u2019t found your triggers yet', meta: '5 cards · 2 min', done: false },
      { type: 'Interactive',    icon: '👆', name: 'The 5 trigger categories',                    meta: 'Tap to explore · 2 min', done: false },
      { type: 'Quiz',           icon: '🧩', name: 'Myth vs. evidence',                           meta: '4 questions · 2 min', done: false },
      { type: 'Step-by-step',   icon: '📋', name: 'How to run a single-variable test',           meta: '5 steps · 3 min', done: false },
      { type: 'Patient story',  icon: '🎬', name: 'How I found my hidden trigger',               meta: '1:30 · Video', done: false },
      { type: 'Micro-challenge', icon: '⚡', name: 'Start your 14-day test tonight',             meta: 'Pick a trigger · 3 min', done: false },
      { type: 'Swipe to learn', icon: '📊', name: 'Reading your trigger data',                   meta: '4 cards · 2 min', done: false },
    ],
  },
  {
    id: 'sleep',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '6 activities · 14 min',
    title: 'Sleep + Skin Recovery',
    desc: 'Nighttime routines that reduce scratching and improve skin repair.',
    progress: 0,
    progressColor: '#E4DDF5',
    border: null,
    lockMsg: null,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'nutrition',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '5 activities · 12 min',
    title: 'Anti-Inflammatory Eating',
    desc: 'Trigger foods, elimination diary basics, and meal ideas that support your skin.',
    progress: 0,
    progressColor: '#E4DDF5',
    border: null,
    lockMsg: null,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'home',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '4 activities · 10 min',
    title: 'Eczema-Proofing Your Home',
    desc: 'Humidity, detergents, sheets, air filters \u2014 the hidden environmental triggers.',
    progress: 0,
    progressColor: '#E4DDF5',
    border: null,
    lockMsg: null,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'confidence',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '4 activities · 10 min',
    title: 'Confidence + Appearance',
    desc: 'Managing visibility, what to say when people ask, and stories from people like you.',
    progress: 0,
    progressColor: '#E4DDF5',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'hcp',
    tag: 'Up next',
    tagColor: '#9B8BB8',
    tagBg: '#EDE8F8',
    meta: '4 activities · 10 min',
    title: 'Preparing for Your Doctor',
    desc: 'How to make the most of your next dermatologist appointment \u2014 with data they can actually use.',
    progress: 0,
    progressColor: '#E4DDF5',
    border: null,
    locked: false,
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
      className={`lp-journey${locked ? ' lp-journey--locked' : ''}${open ? ' lp-journey--open' : ''}`}
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
      {!locked && (
        <button className="lp-journey__toggle" onClick={() => setOpen(o => !o)}>
          {open ? 'Hide activities \u25B4' : 'Show activities \u25BE'}
        </button>
      )}
      {locked && lockMsg && (
        <p className="lp-journey__lock">{lockMsg}</p>
      )}
      {locked && !lockMsg && (
        <p className="lp-journey__lock">\uD83D\uDD12 Coming soon</p>
      )}
      {open && activities.length === 0 && (
        <div className="lp-journey__activities">
          <p className="lp-journey__lock" style={{ textAlign: 'center', padding: '16px 18px' }}>Topics coming soon</p>
        </div>
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
        <h1 className="lp-header__title">All about eczema</h1>
        <p className="lp-header__sub">Dive deep into how skin conditions can effect your entire life.</p>
      </div>
      <div className="lp-journeys">
        {JOURNEYS.map(j => <JourneyCard key={j.id} journey={j} />)}
      </div>
    </main>
  )
}
