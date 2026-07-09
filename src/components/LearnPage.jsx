import React, { useState } from 'react'
import SponsorBanner from './SponsorBanner'

const TYPE_COLORS = {
  'Swipe to learn':   { color: '#0E8C7F', bg: 'rgba(14, 140, 127,0.1)' },
  'Interactive':      { color: '#4A7C9E', bg: 'rgba(74, 124, 158,0.1)' },
  'Quiz':             { color: '#4A7C9E', bg: 'rgba(74, 124, 158,0.1)' },
  'Step-by-step':     { color: '#C2673A', bg: 'rgba(194, 103, 58,0.1)' },
  'Patient story':    { color: '#C2673A', bg: 'rgba(194, 103, 58,0.1)' },
  'Expert Q&A':       { color: '#0E8C7F', bg: 'rgba(14, 140, 127,0.1)' },
  'Micro-challenge':  { color: '#4A7C9E', bg: 'rgba(74, 124, 158,0.15)' },
  'Poll':             { color: '#C2673A', bg: 'rgba(194, 103, 58,0.1)' },
  'Tap to learn':     { color: '#4A7C9E', bg: 'rgba(74, 124, 158,0.1)' },
  'Article':          { color: '#0E8C7F', bg: 'rgba(14, 140, 127,0.1)' },
}

const JOURNEYS = [
  {
    id: 'numbers',
    tag: 'In progress',
    tagColor: '#4A7C9E',
    tagBg: 'rgba(74, 124, 158,0.12)',
    meta: '5 activities · 13 min',
    title: 'Understanding Your Numbers',
    desc: 'LDL, HDL, triglycerides, blood pressure, A1C — what they mean, what moves them, and what to ask your doctor.',
    progress: 60,
    progressColor: '#4A7C9E',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [
      { type: 'Swipe to learn', icon: '📖', name: 'What your lipid panel actually tells you', meta: '4 cards · 2 min', done: true },
      { type: 'Quiz',           icon: '🧩', name: 'Cholesterol myths vs. facts',              meta: '4 questions · 2 min', done: true },
      { type: 'Tap to learn',   icon: '👆', name: 'Reading your blood pressure reading',      meta: 'Interactive · 2 min', done: true },
      { type: 'Expert Q&A',     icon: '🎬', name: 'What your A1C means for heart risk',       meta: '2:10 · Video', done: false },
      { type: 'Step-by-step',   icon: '📋', name: 'How to prepare for your next lab test',    meta: '4 steps · 3 min', done: false },
    ],
  },
  {
    id: 'food',
    tag: 'In progress',
    tagColor: '#4A7C9E',
    tagBg: 'rgba(74, 124, 158,0.12)',
    meta: '6 activities · 15 min',
    title: 'Eating for Your Heart',
    desc: 'Practical food swaps that lower LDL and blood pressure — without overhauling your entire diet.',
    progress: 50,
    progressColor: '#4A7C9E',
    border: null,
    locked: false,
    defaultOpen: true,
    activities: [
      { type: 'Swipe to learn',  icon: '📖', name: 'The foods that actually move cholesterol',           meta: '5 cards · 2 min',  done: true },
      { type: 'Step-by-step',    icon: '📋', name: 'The Mediterranean swap method',                      meta: '4 steps · 3 min',  done: true },
      { type: 'Expert Q&A',      icon: '🎬', name: 'A dietitian answers: is fat bad for your heart?',   meta: '2:45 · Video',     done: true },
      { type: 'Patient story',   icon: '🎬', name: 'How Marcus cut his LDL by 30 points with food',     meta: '1:45 · Video',     done: false },
      { type: 'Swipe to learn',  icon: '📖', name: 'Reading food labels for heart health',              meta: '4 cards · 2 min',  done: false },
      { type: 'Micro-challenge', icon: '⚡',        name: 'Make one heart-healthy swap this week',             meta: 'Try now · 3 min',  done: false },
    ],
  },
  {
    id: 'movement',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '5 activities · 12 min',
    title: 'Movement That Works',
    desc: 'You don’t need a gym. Learn how different types of activity affect cholesterol, blood pressure, and blood sugar.',
    progress: 0,
    progressColor: '#EDE6D6',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [
      { type: 'Swipe to learn',  icon: '📖', name: 'How exercise changes your lipid profile',         meta: '4 cards · 2 min',      done: false },
      { type: 'Interactive',     icon: '👆', name: 'Find your activity level',                        meta: 'Tap to explore · 2 min', done: false },
      { type: 'Step-by-step',    icon: '📋', name: 'Building a 30-minute weekly walking habit',       meta: '5 steps · 3 min',      done: false },
      { type: 'Expert Q&A',      icon: '🎬', name: 'Cardio vs. strength training for heart health',   meta: '2:30 · Video',         done: false },
      { type: 'Micro-challenge', icon: '⚡',        name: 'Walk for 20 minutes today',                       meta: 'Try now',                   done: false },
    ],
  },
  {
    id: 'stress',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '6 activities · 13 min',
    title: 'Stress + Your Heart',
    desc: 'Chronic stress raises cortisol, which raises LDL and blood pressure. Here’s the science — and what to do about it.',
    progress: 0,
    progressColor: '#EDE6D6',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [
      { type: 'Swipe to learn',  icon: '📖', name: 'The stress-cortisol-cholesterol chain',                         meta: '5 cards · 2 min',  done: false },
      { type: 'Micro-challenge', icon: '⚡',        name: '3-minute breathing reset',                                       meta: 'Try now · 3 min',  done: false },
      { type: 'Expert Q&A',      icon: '🎬', name: 'How stress impacts cardiovascular risk',                         meta: '2:30 · Video',     done: false },
      { type: 'Patient story',   icon: '🎬', name: 'Diane on learning to manage stress alongside her diagnosis',     meta: '1:32 · Video',     done: false },
      { type: 'Swipe to learn',  icon: '📖', name: '5 evidence-backed ways to lower stress',                        meta: '5 cards · 2 min',  done: false },
      { type: 'Micro-challenge', icon: '🧘', name: '3-minute guided meditation',                                     meta: 'Try now · 3 min',  done: false },
    ],
  },
  {
    id: 'medications',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '',
    title: 'Understanding Your Medications',
    desc: 'Statins, ACE inhibitors, metformin — what they do, side effects to know, and how to talk to your doctor about them.',
    progress: 0,
    progressColor: '#EDE6D6',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'sleep',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '',
    title: 'Sleep + Heart Health',
    desc: 'Poor sleep raises blood pressure and disrupts blood sugar. Small improvements compound quickly.',
    progress: 0,
    progressColor: '#EDE6D6',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'comorbidities',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '',
    title: 'Managing Multiple Conditions',
    desc: 'When cholesterol, blood pressure, and blood sugar overlap — how they interact and how to address them together.',
    progress: 0,
    progressColor: '#EDE6D6',
    border: null,
    locked: false,
    defaultOpen: false,
    activities: [],
  },
  {
    id: 'hcp',
    tag: 'Up next',
    tagColor: '#8A8A8A',
    tagBg: '#F5EFE0',
    meta: '',
    title: 'Preparing for Your Care Team',
    desc: 'How to make the most of your next cardiology or GP appointment — with data they can actually use.',
    progress: 0,
    progressColor: '#EDE6D6',
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
          {open ? 'Hide activities ▴' : 'Show activities ▾'}
        </button>
      )}
      {locked && lockMsg && (
        <p className="lp-journey__lock">{lockMsg}</p>
      )}
      {locked && !lockMsg && (
        <p className="lp-journey__lock">🔒 Coming soon</p>
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
      <div className="pp-hero">
        <p className="pp-hero-eyebrow">Build your cardiometabolic knowledge</p>
        <h1 className="pp-hero-title">Pick a topic, go at your own pace</h1>
        <p className="pp-hero-sub">Short reads. Real answers. Jump back in anytime.</p>
      </div>
      <div className="lp-journeys">
        {JOURNEYS.map(j => (
          <React.Fragment key={j.id}>
            {j.id === 'sleep' && <SponsorBanner variant="card" />}
            {j.id === 'hcp' && <SponsorBanner />}
            <JourneyCard journey={j} />
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}
