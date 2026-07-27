import React, { useState, useRef, useCallback, useEffect } from 'react'
import './FocusCarousel.css'

const TODAY = new Date().toISOString().slice(0, 10)
const STORAGE_KEY = `vitalistExp_completions_${TODAY}`

function readDone() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function writeDone(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch {}
}
function readHabits() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_habits') || 'null') } catch { return null }
}
function readName() {
  try { return localStorage.getItem('vitalistExp_name') || '' } catch { return '' }
}
function readPrimary() {
  try { return localStorage.getItem('vitalistExp_primary') || '' } catch { return '' }
}

// Editorial imagery per goal — atmospheric placeholder photography (stable per seed).
// Swap these URLs for Mark's real content shots when they land.
const IMAGERY = {
  move:   '/forest.jpg',
  strong: 'https://picsum.photos/seed/vitalist-strong/900/1200',
  eat:    'https://picsum.photos/seed/vitalist-eat/900/1200',
  water:  'https://picsum.photos/seed/vitalist-water/900/1200',
  sleep:  'https://picsum.photos/seed/vitalist-sleep/900/1200',
  stress: 'https://picsum.photos/seed/vitalist-stress/900/1200',
}
function photoFor(habit) {
  return IMAGERY[habit.goalId] || `https://picsum.photos/seed/vitalist-${habit.goalId || 'default'}/900/1200`
}

// ── Wearable / tracker sources ──────────────────────────────────────────────
const WEARABLE = {
  move:   { source: 'steps',    label: 'Steps' },
  sleep:  { source: 'sleep',    label: 'Sleep' },
  strong: { source: 'workouts', label: 'Workouts' },
  stress: { source: 'hrv',      label: 'HRV' },
}
function readSources() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_sources') || '[]') } catch { return [] }
}
function writeSources(s) {
  try { localStorage.setItem('vitalistExp_sources', JSON.stringify(s)) } catch {}
}
const WatchIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5.5"/><path d="M8.5 3.5 9 8M15.5 3.5 15 8M8.5 20.5 9 16M15.5 20.5 15 16M12 9.5V12l1.8 1"/></svg>
)
// AI indicator glyph (sparkles) — no emoji
const SparkIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.1L19 8.8l-5.3 1.7L12 16l-1.7-5.5L5 8.8l5.3-1.7L12 2z"/><path d="M18.5 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" opacity=".65"/></svg>
)

function CardWearable({ habit, sources, onConnect }) {
  const w = WEARABLE[habit.goalId]
  if (!w) return null
  const on = sources.includes(w.source)
  if (on) {
    return <span className="fc-wear fc-wear--on">{WatchIcon} Auto · {w.label}</span>
  }
  return (
    <button
      className="fc-wear fc-wear--off"
      onClick={e => { e.stopPropagation(); onConnect(w.source) }}
    >
      {WatchIcon} Attach {w.label} tracker
    </button>
  )
}

// ── Editorial content teed up per habit (from the Read library) ─────────────
const CONTENT = {
  move: {
    source: 'EatingWell', read: '4 min', eye: 'Movement & metabolism',
    hed: 'The nighttime walk that may balance blood sugar',
    body: [
      'A short walk after dinner is one of the most studied — and most underrated — things you can do for your metabolism. When you move right after eating, your muscles pull glucose out of your bloodstream for fuel, blunting the post-meal spike that would otherwise strain your body over time.',
      'The research puts it at up to a 22% smaller rise in blood sugar, and you don\'t need a workout to get it. Ten minutes after dinner is plenty. The point isn\'t intensity — it\'s timing.',
      'That\'s why Vitalist ties this one to dinner: the habit rides on something you already do every night, so it asks almost nothing of you and compounds quietly on its own.',
    ],
  },
  strong: {
    source: 'Verywell Health', read: '5 min', eye: 'Strength & longevity',
    hed: 'How weekly strength training helps you live longer',
    body: [
      'Strength isn\'t about aesthetics — it\'s one of the clearest predictors of how well you age. Muscle is metabolically active tissue that helps regulate blood sugar, supports your joints, and keeps you independent decades from now.',
      'The encouraging part: you don\'t need a gym or heavy weights. Bodyweight movements done consistently — a set of squats before your shower — deliver most of the benefit. Consistency beats intensity every time.',
    ],
  },
  sleep: {
    source: 'Verywell Health', read: '4 min', eye: 'Sleep science',
    hed: 'Wake at the same time every day',
    body: [
      'Sleep scientists largely agree on the single most effective lever for better sleep, and it\'s probably not what you\'d guess. It isn\'t total hours — it\'s the consistency of your wake time.',
      'A steady wake time anchors your circadian rhythm, so your body starts to feel sleepy and alert at predictable times. Over a couple of weeks, falling asleep gets easier without any extra effort at night.',
      'That\'s why this habit focuses on the morning, not bedtime — the lever that actually moves the system.',
    ],
  },
  stress: {
    source: 'Verywell Mind', read: '4 min', eye: 'Stress & the nervous system',
    hed: 'The benefits of deep breathing',
    body: [
      'Five slow breaths can shift your body out of fight-or-flight faster than almost anything else. Long, slow exhales activate the parasympathetic nervous system — your body\'s built-in calm-down switch.',
      'The trick is to make the exhale longer than the inhale. That\'s the signal your nervous system reads as "safe." Done before you reach for your phone, it interrupts the stress-scroll loop before it starts.',
    ],
  },
  connect: {
    source: 'Verywell Mind', read: '5 min', eye: 'Connection & health',
    hed: 'How social isolation affects your health',
    body: [
      'Loneliness isn\'t only hard emotionally — researchers now treat chronic isolation as a physical health risk on par with smoking. Connection buffers stress, supports the heart, and even influences how long we live.',
      'The good news is that small, regular contact does most of the work: a standing weekly call, a short walk with a friend. It\'s frequency, not grand gestures, that builds belonging.',
    ],
  },
  eat: {
    source: 'EatingWell', read: '4 min', eye: 'Nutrition & glucose',
    hed: '5 best breakfast foods for blood sugar',
    body: [
      'What you eat first thing sets the tone for your glucose response all day. A breakfast anchored in protein and fiber — rather than fast carbs alone — flattens the morning spike and keeps energy steadier into the afternoon.',
      'Think eggs, Greek yogurt, oats, berries, and nuts. Small, repeatable choices beat any strict plan, which is exactly how Vitalist frames it.',
    ],
  },
  water: {
    source: 'Better Homes & Gardens', read: '3 min', eye: 'Mood & environment',
    hed: 'A simple morning reset',
    body: [
      'After seven or eight hours of sleep you wake up mildly dehydrated, and that alone can dull focus, mood, and energy before the day even starts.',
      'One glass of water before your coffee rehydrates you and sets a calm baseline. It\'s a tiny anchor habit — easy to start, easy to keep.',
    ],
  },
}

// ── First-run habit recommendations ─────────────────────────────────────────
const GRAD = {
  move:   'linear-gradient(155deg,#8a7565,#4a3b32)',
  sleep:  'linear-gradient(155deg,#6d7b6a,#3a4436)',
  eat:    'linear-gradient(155deg,#8a6a5a,#5a3a2a)',
  water:  'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
  stress: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)',
  strong: 'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
}
const RECOMMEND = {
  move:   { goalId: 'move',   label: '10-minute walk after dinner',   headline: 'Ten minutes outside,', em: 'after dinner.',           tagline: "That's it.",              source: 'EatingWell' },
  sleep:  { goalId: 'sleep',  label: 'Lights low after 9',            headline: 'Lights low',           em: 'after 9.',                tagline: 'Just try it tonight.',    source: 'Sleep Foundation' },
  eat:    { goalId: 'eat',    label: 'Fork down between bites',       headline: 'Fork down',            em: 'between bites.',          tagline: 'At dinner tonight.',      source: 'EatingWell' },
  water:  { goalId: 'water',  label: 'A glass of water before coffee',headline: 'One glass of water,',  em: 'before coffee.',          tagline: "That's the whole thing.", source: 'Healthline' },
  stress: { goalId: 'stress', label: 'Five breaths before scrolling', headline: 'Five breaths',         em: 'before the first scroll.',tagline: "Five. That's it.",        source: 'Verywell Mind' },
  strong: { goalId: 'strong', label: 'Ten squats before the shower',  headline: 'Ten squats',           em: 'before the shower.',      tagline: 'Thirty seconds.',         source: 'Verywell Fit' },
}
const REC_ORDER = ['move', 'sleep', 'eat', 'water', 'stress', 'strong']

function FirstRun({ name, primary, onSelect }) {
  const order = [primary, ...REC_ORDER.filter(g => g !== primary)].filter(g => RECOMMEND[g])
  const list  = order.length ? order : REC_ORDER
  const [i, setI]           = useState(0)
  const [leaving, setLeaving] = useState(false)
  const rec = RECOMMEND[list[i % list.length]] || RECOMMEND.move

  function choose() {
    setLeaving(true)
    setTimeout(() => onSelect(rec), 640)
  }
  return (
    <div className="fr-root">
      <div className="fr-welcome">
        <p className="fr-brand">Vitalist</p>
        <h1 className="fr-hed">Welcome{name ? `, ${name}` : ''}.</h1>
        <p className="fr-sub">Here's one small thing to start with — swap it until one feels right.</p>
      </div>
      <div className={`fr-card${leaving ? ' fr-card--settle' : ''}`}>
        <div className="fr-card__bg" style={{ background: GRAD[rec.goalId] || rec.bg }} />
        <img
          className="fr-card__photo"
          src={IMAGERY[rec.goalId] || `https://picsum.photos/seed/vitalist-${rec.goalId}/900/1200`}
          alt="" draggable="false"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <span className="fr-card__flag">{rec.source}</span>
        <div className="fr-card__txt">
          <h2 className="fr-card__hed">{rec.headline} <em>{rec.em}</em></h2>
          <p className="fr-card__that">{rec.tagline}</p>
        </div>
      </div>
      <div className="fr-actions">
        <button className="fr-primary" onClick={choose}>I'll try it →</button>
        <button className="fr-link" onClick={() => setI(i + 1)}>Show me another</button>
      </div>
    </div>
  )
}

function PostConfirm({ habit, sources, onConnect, onClose }) {
  const w = WEARABLE[habit.goalId]
  const connected = w && sources.includes(w.source)
  const [notif, setNotif] = useState(false)
  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />
        <p className="fc-pc__hed">Nice — it's yours.</p>
        <p className="fc-pc__sub">Make it effortless:</p>
        {w && (
          <button className={`fc-pc__opt${connected ? ' on' : ''}`} onClick={() => { if (!connected) onConnect(w.source) }}>
            <span>{connected ? `Auto-tracking with ${w.label} — nothing to log` : `Connect ${w.label} — logs itself`}</span>
            <span className="fc-pc__check">{connected ? '✓' : '+'}</span>
          </button>
        )}
        <button
          className={`fc-pc__opt${notif ? ' on' : ''}`}
          onClick={() => { setNotif(v => !v); try { localStorage.setItem('vitalistExp_notif', notif ? '0' : '1') } catch (_) {} }}
        >
          <span>{notif ? 'Daily nudge on — one a day, max' : 'Turn on a daily nudge'}</span>
          <span className="fc-pc__check">{notif ? '✓' : '+'}</span>
        </button>
        <button className="fc-ai-sheet__close" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}

function Reader({ content, habit, onClose }) {
  return (
    <div className="fc-reader">
      <div className="fc-reader__hero">
        <img className="fc-reader__photo" src={photoFor(habit)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
        <div className="fc-reader__hero-bg" style={{ background: habit.bg }} />
        <button className="fc-reader__back" onClick={onClose} aria-label="Back">←</button>
        <div className="fc-reader__hero-txt">
          <span className="fc-reader__eye">{content.eye}</span>
          <h1 className="fc-reader__hed">{content.hed}</h1>
          <span className="fc-reader__meta">{content.source} · {content.read} read</span>
        </div>
      </div>
      <div className="fc-reader__body">
        {content.body.map((p, i) => <p key={i}>{p}</p>)}
        <p className="fc-reader__foot">Curated for your habit · Vitalist by People Inc.</p>
        <button className="fc-reader__done" onClick={onClose}>Back to today</button>
      </div>
    </div>
  )
}

// ── Trial-week daily content (walk) — a piece waits beside the habit ────────
const DAILY = {
  1: {
    label: 'Day 1 · Starting tonight',
    reinforce: { hed: 'The hardest part may be starting.', body: "After a meal, staying where you are often feels easier. You don't need to feel motivated before you begin — starting slowly is enough." },
    support: {
      tag: 'Why walking is great', source: 'Verywell Health', read: '4 min',
      hed: '8 benefits of walking every day', dek: 'Walking daily benefits your body, mind, and emotions — and may even help extend your life.',
      body: [
        'A daily walk is one of the most studied — and least demanding — things you can do for your health. It supports your heart, helps steady blood sugar, lifts your mood, and is linked to a longer life.',
        "You don't need distance or speed for the benefit; regularity is what pays off. A short walk right after a meal counts, and it compounds quietly over weeks.",
      ],
    },
    enjoy: {
      tag: 'Read in Entertainment', source: 'PEOPLE', read: '3 min',
      hed: 'Hugh Jackman & Sutton Foster — the latest', dek: 'A little celebrity distraction to keep you company on your walk.',
      body: [
        'You told us you like a bit of celebrity news — so here\'s something easy and feel-good to read while you move.',
        'Queue it up, head out the door, and let the ten minutes take care of themselves.',
      ],
    },
  },
  2: {
    label: 'Day 2 · Keeping it light',
    reinforce: { hed: "This doesn't need to feel like exercise.", body: 'No pace target. No step goal. No need to work up a sweat. The habit is simply adding a little movement after a meal.' },
    support: {
      tag: 'Stay in today', source: 'Real Simple', read: '4 min',
      hed: 'Walk from room to room for ten minutes', dek: 'No sidewalk, no problem — an easy way to move at home.',
      body: [
        'No sidewalk or bad weather? You can still get the same small win by walking from room to room for ten minutes.',
        'Have stairs? One easy trip up and down every few minutes adds gentle intensity without turning it into a workout.',
      ],
    },
    enjoy: {
      tag: 'Listen', source: 'Verywell Mind', read: '12 min',
      hed: '3 mistakes to avoid when creating goals', dek: 'A short podcast that pairs perfectly with your walk.',
      body: [
        'Most habits stall for the same few reasons — aiming too big, moving too fast, or leaning on willpower alone. This short podcast walks through three common mistakes and how to sidestep them.',
        'Pop in your earbuds and listen while you walk; twelve minutes is just about right.',
      ],
    },
  },
  7: {
    label: 'Day 7 · It becomes yours',
    reinforce: { hed: "You're making movement part of an ordinary day.", body: "This isn't a major fitness program or a test of discipline. It's a small way of caring for yourself after a meal — and each time you return to it, it becomes more recognizably yours." },
    support: {
      tag: 'No pace goal', source: 'Real Simple', read: '4 min',
      hed: 'The passeggiata — a walk with nowhere to be', dek: 'Walk slowly. Look around. Enjoy the transition out of your day.',
      body: [
        'The Italian passeggiata is a slow, social evening stroll with no destination and no pace goal — the whole point is to enjoy the transition out of your day.',
        'Walk slowly, look around, invite someone along. After a week, your after-dinner walk can become exactly this: yours.',
      ],
    },
    enjoy: {
      tag: 'Wear', source: 'Health', read: '5 min',
      hed: 'The most comfortable walking shoes', dek: 'The right shoe changes how a walk feels — and whether you keep it up.',
      body: [
        'A comfortable, supportive shoe can spare your feet, knees, and back by the end of the day — and make the habit something you actually look forward to.',
        "A quick look at what makes a good everyday walking shoe, so the habit stays easy on your body.",
      ],
    },
  },
}
function dayOf(habit) {
  if (!habit || !habit.addedAt) return 1
  return Math.max(1, Math.floor((Date.now() - new Date(habit.addedAt).getTime()) / 86400000) + 1)
}
function dailyFor(habit) {
  if (!habit || habit.goalId !== 'move') return null
  const day = dayOf(habit)
  if (DAILY[day]) return { day, ...DAILY[day] }
  if (day >= 7) return { day, ...DAILY[7] }
  return null
}

function DailyView({ data, habit, onClose }) {
  const [piece, setPiece] = useState(null)
  if (piece) {
    return (
      <div className="fc-reader">
        <div className="fc-reader__hero">
          <div className="fc-reader__hero-bg" style={{ background: habit.bg }} />
          <img className="fc-reader__photo" src={photoFor(habit)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
          <button className="fc-reader__back" onClick={() => setPiece(null)} aria-label="Back">←</button>
          <div className="fc-reader__hero-txt">
            <span className="fc-reader__eye">{piece.tag}</span>
            <h1 className="fc-reader__hed">{piece.hed}</h1>
            <span className="fc-reader__meta">{piece.source} · {piece.read} read</span>
          </div>
        </div>
        <div className="fc-reader__body">
          {piece.body.map((p, i) => <p key={i}>{p}</p>)}
          <p className="fc-reader__foot">Curated for your walk · Vitalist by People Inc.</p>
          <button className="fc-reader__done" onClick={() => setPiece(null)}>Back to today</button>
        </div>
      </div>
    )
  }
  return (
    <div className="fc-reader">
      <div className="fc-daily__top" style={{ background: habit.bg }}>
        <button className="fc-reader__back" onClick={onClose} aria-label="Back">←</button>
        <p className="fc-daily__eye">{data.label}</p>
        <h1 className="fc-daily__hed">Beside your walk today</h1>
      </div>
      <div className="fc-reader__body">
        <div className="fc-daily__reinforce">
          <p className="fc-daily__rlabel">A note from Vita</p>
          <h2 className="fc-daily__rh">{data.reinforce.hed}</h2>
          <p className="fc-daily__rb">{data.reinforce.body}</p>
        </div>
        <button className="fc-daily__piece" onClick={() => setPiece(data.support)}>
          <p className="fc-daily__ptag">{data.support.tag} · {data.support.source}</p>
          <h3 className="fc-daily__ph">{data.support.hed}</h3>
          <p className="fc-daily__pb">{data.support.dek}</p>
          <span className="fc-daily__go">Read →</span>
        </button>
        <button className="fc-daily__piece" onClick={() => setPiece(data.enjoy)}>
          <p className="fc-daily__ptag">{data.enjoy.tag} · {data.enjoy.source}</p>
          <h3 className="fc-daily__ph">{data.enjoy.hed}</h3>
          <p className="fc-daily__pb">{data.enjoy.dek}</p>
          <span className="fc-daily__go">Open →</span>
        </button>
        <button className="fc-reader__done" onClick={onClose}>Back to today</button>
      </div>
    </div>
  )
}

function NextSlotCard({ width, unlocked }) {
  return (
    <div className="fc-card fc-card--next" style={{ width }}>
      <div className="fc-next__inner">
        <div className="fc-next__mark">+</div>
        {unlocked ? (
          <>
            <h3 className="fc-next__hed">A slot just opened.</h3>
            <p className="fc-next__body">
              Your walk is sticking — that earned room for one more. Add your
              next habit whenever you're ready.
            </p>
          </>
        ) : (
          <>
            <h3 className="fc-next__hed">One habit at a time.</h3>
            <p className="fc-next__body">
              Your next slot opens once this one feels automatic — earned, not
              assigned. No rush.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function daysIn(habit) {
  const added = habit.addedAt || TODAY
  return Math.max(0, Math.floor((Date.now() - new Date(added).getTime()) / 86400000))
}

function streakLabel(habit) {
  if (habit.status === 'kept' || habit.status === 'my_habit' || habit.status === 'established') {
    const d = daysIn(habit)
    const weeks = Math.floor(d / 7) || habit.tier || 1
    return `${weeks} week${weeks !== 1 ? 's' : ''} strong`
  }
  if (habit.status === 'adopted') {
    const d = daysIn(habit)
    const weeks = Math.floor(d / 7)
    if (weeks < 1) return 'Building'
    return `${weeks} week${weeks !== 1 ? 's' : ''} building`
  }
  const days = daysIn(habit)
  if (days === 0) return 'Starting today'
  return `Day ${days + 1} of your trial`
}

// Demo "detected from tracker" readouts per goal
const DETECT = { move: '6,300 steps', sleep: '7h 20m', strong: '2 sessions', stress: 'HRV steady' }
function trackerConnected(habit, sources) {
  const w = WEARABLE[habit.goalId]
  return !!(w && sources && sources.includes(w.source))
}

// Contextual sub-text — tracker-aware
function habitSubText(habit, done, sources) {
  if (done) return null
  if (trackerConnected(habit, sources)) return "Nothing to log — we'll track this automatically."
  if (WEARABLE[habit.goalId]) return 'Attach a tracker and this logs itself.'
  if (habit.status === 'kept') return `Settling in — ${streakLabel(habit)}.`
  return 'Tap when you\'ve done it.'
}

function doneLabel(habit, done, sources) {
  const connected = trackerConnected(habit, sources)
  if (done) {
    if (connected) return `Detected from your tracker · ${DETECT[habit.goalId] || 'logged'}`
    const now = new Date()
    const h = now.getHours()
    const m = String(now.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'pm' : 'am'
    const hh = h % 12 || 12
    return `Seen today · ${hh}:${m}${ampm}`
  }
  if (connected) return "We'll log this automatically"
  return 'Tap when it\'s done'
}

// Split headline — bold first, italic last N words
function HeadLine({ label }) {
  // Find natural italic break — after first comma if present, else last 2 words
  const commaIdx = label.indexOf(',')
  let main, italic
  if (commaIdx > 0) {
    main   = label.slice(0, commaIdx + 1)
    italic = label.slice(commaIdx + 1).trim()
  } else {
    const words = label.split(' ')
    const split = Math.max(1, words.length - 2)
    main   = words.slice(0, split).join(' ')
    italic = words.slice(split).join(' ')
  }
  return (
    <h2 className="fc-card__hed">
      {main} {italic && <em>{italic}</em>}
    </h2>
  )
}

function Card({ habit, done, onDone, sources, onConnect, onRead, onDaily, width }) {
  const sub     = habitSubText(habit, done, sources)
  const chip    = doneLabel(habit, done, sources)
  const content = CONTENT[habit.goalId]
  const daily   = dailyFor(habit)

  return (
    <div className="fc-card" style={{ width }}>
      {/* Full-bleed gradient background (fallback under the photo) */}
      <div className="fc-card__bg" style={{ background: habit.bg }} />

      {/* Editorial imagery — full-bleed photo + brand duotone + motif */}
      <div className="fc-card__editorial">
        <img
          className="fc-card__photo"
          src={photoFor(habit)}
          alt=""
          draggable="false"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <div className="fc-card__duotone" style={{ background: habit.bg }} />
        <div className="fc-card__motif" />
      </div>

      {/* Stacked cards over the image — habit + editorial, one connected unit */}
      <div className="fc-card__stack">
        <div className="fc-hcard">
          {habit.source && <p className="fc-hcard__source">{habit.source}</p>}
          <HeadLine label={habit.label} />
          {sub && <p className="fc-card__sub">{sub}</p>}
          <CardWearable habit={habit} sources={sources} onConnect={onConnect} />
          <div
            className={`fc-done-chip${done ? ' done' : ''}`}
            onClick={() => onDone(habit.id)}
          >
            <div className="fc-done-chip__circle">{done ? '✓' : ''}</div>
            <span className="fc-done-chip__label">{chip}</span>
          </div>
        </div>

        {daily ? (
          <button className="fc-ecard" onClick={() => onDaily && onDaily(daily, habit)}>
            <span className="fc-ecard__tag">Today · Day {daily.day}</span>
            <span className="fc-ecard__hed">{daily.support.hed}</span>
            <span className="fc-ecard__meta">Content beside your walk <span className="fc-ecard__go">→</span></span>
          </button>
        ) : content ? (
          <button className="fc-ecard" onClick={() => onRead && onRead(content, habit)}>
            <span className="fc-ecard__tag">Related read</span>
            <span className="fc-ecard__hed">{content.hed}</span>
            <span className="fc-ecard__meta">{content.source} · {content.read} read <span className="fc-ecard__go">→</span></span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

// Vita — the in-habit coach. Warm, specific, never clinical. (Demo: scripted.)
function vitaReply(text, habit) {
  const t = (text || '').toLowerCase()
  const g = habit && habit.goalId
  const whyByGoal = {
    move: 'A short walk after eating pulls glucose out of your bloodstream for fuel, so it blunts the post-meal spike — no gym, no gear. Ten minutes is plenty; the point is timing.',
    sleep: 'Dimmer light and a steadier wind-down in the last stretch before bed let your body make melatonin on schedule, so you fall asleep more easily. Consistency matters more than perfection.',
    eat: 'Front-loading fiber and protein flattens your glucose response and keeps you full longer — small, repeatable choices beat any strict plan.',
    stress: 'Long, slow exhales flip on your parasympathetic nervous system — the body\'s calm-down switch. A few breaths can interrupt the spiral before it builds.',
    strong: 'Standing and lifting work your largest muscles, which steadies blood sugar and keeps you strong and independent as you age.',
    connect: 'Small, regular contact does most of the work of connection — and connection is a genuine health factor, not a nice-to-have.',
  }
  // medical guardrail
  if (/\b(dose|dosage|medication|prescription|symptom|pain|diagnos|blood pressure reading|a1c)\b/.test(t))
    return "That's one for your doctor — I can't weigh in on medical specifics. What I can do is help you build the habit around it. Want to bring it to your next visit? Your care summary can hold it."
  // the coach scene: phone must stay by the bed
  if (/(phone|by the bed|bedside|call|mom|mother|reach|emergenc)/.test(t) && (g === 'sleep' || /sleep|wind ?down|bed|night/.test(t)))
    return "Keeping your phone close for your mom comes first — that's not up for debate. The wind-down was never about banishing the phone, just softening its pull. Try this tonight: set it to Do Not Disturb but add your mom as an allowed contact, so only her call gets through. Flip on the warm night screen and turn it face-down. You still wind down, you're still reachable — and that counts as done. I've left a short read on gentle wind-downs in your feed for whenever you want it."
  if (/why|work|science|help/.test(t)) return (whyByGoal[g] || 'The short version: it earns its place. Kept small and tied to a moment you already have, it sticks — and it compounds on its own.') + (g ? ' There\'s a short read waiting on your card for the details.' : '')
  if (/miss|skip|slip|off day|fail|behind/.test(t)) return "A missed day isn't a broken streak — there are no streaks here. Just pick it up tomorrow. The habit is the direction, not a perfect record."
  if (/easier|stick|hard|forget|remember|struggl/.test(t)) return "Make it smaller and pin it to something you already do — right after dinner, when the TV goes off. Shrink it until it feels almost too easy, then let it grow once it's automatic."
  if (/add|new habit|another/.test(t)) return "You can add one anytime from your Yours page — want me to take you there?"
  if (/focus|next|more/.test(t)) return "Let's stay with this one for now. A second habit opens up once this feels automatic — earned, not assigned. No rush."
  return "Good question. Honestly: keep it small, tie it to a moment you already have, and let your phone confirm it so there's nothing to log. Want me to break any part of that down?"
}

function AISheet({ habit, onClose, onAddHabit }) {
  const [msgs, setMsgs] = useState(() => [{ role: 'vita', text: `Hi, I'm Vita. Ask me anything about ${habit ? `"${habit.label}"` : 'your habits'} — even the messy, real-life stuff.` }])
  const [input, setInput] = useState('')
  const started = msgs.some(m => m.role === 'user')
  const scroller = useRef(null)
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight }, [msgs])

  function send(text) {
    const clean = (text || '').trim()
    if (!clean) return
    if (/add|new habit/i.test(clean) && onAddHabit) {
      setMsgs(m => [...m, { role: 'user', text: clean }, { role: 'vita', text: 'Taking you to your habits now…' }])
      setTimeout(onAddHabit, 600)
      setInput('')
      return
    }
    setMsgs(m => [...m, { role: 'user', text: clean }, { role: 'vita', text: vitaReply(clean, habit) }])
    setInput('')
  }

  return (
    <div className="fc-ai-sheet" onClick={onClose}>
      <div className="fc-ai-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="fc-ai-sheet__handle" />
        <div className="fc-ai-sheet__intro">
          <div className="fc-ai-sheet__avatar">{SparkIcon}</div>
          <div>
            <p className="fc-ai-sheet__hi">Vita</p>
            <p className="fc-ai-sheet__sub">{habit ? `Here for "${habit.label}"` : 'Your Vitalist coach'}</p>
          </div>
        </div>

        <div className="vita-msgs" ref={scroller}>
          {msgs.map((m, i) => (
            <div key={i} className={`vita-msg vita-msg--${m.role}`}>{m.text}</div>
          ))}
        </div>

        {!started && (
          <div className="vita-chips">
            {habit && <button className="fc-ai-chip" onClick={() => send('Why does this actually work?')}>Why does this actually work?</button>}
            {habit && <button className="fc-ai-chip" onClick={() => send('How do I make it easier to stick to?')}>How do I make it easier to stick to?</button>}
            <button className="fc-ai-chip" onClick={() => send('What if I miss a day?')}>What if I miss a day?</button>
            <button className="fc-ai-chip" onClick={() => send('How do I add a new habit?')}>How do I add a new habit?</button>
          </div>
        )}

        <div className="fc-ai-sheet__composer">
          <input
            className="fc-ai-input"
            placeholder="Ask Vita…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input) }}
          />
          <button className="fc-ai-send" aria-label="Send" onClick={() => send(input)}>↑</button>
        </div>
      </div>
    </div>
  )
}

function MyHabitsSection({ habits, done, onToggleDone }) {
  return (
    <div className="fc-my-habits">
      <p className="fc-my-habits__label">My habits</p>
      {habits.map(h => {
        const isDone = done.includes(h.id)
        return (
          <div key={h.id} className="fc-my-habit-row">
            <div className="fc-my-habit-row__swatch" style={{ background: h.bg }} />
            <div className="fc-my-habit-row__body">
              <p className="fc-my-habit-row__name">{h.label}</p>
              <p className="fc-my-habit-row__meta">{streakLabel(h)}</p>
            </div>
            <button
              className={`fc-my-habit-row__check${isDone ? ' done' : ''}`}
              onClick={() => onToggleDone(h.id)}
            >
              {isDone ? '✓' : ''}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function Overview({ habits, done, onSelect, onClose, onToggleDone }) {
  const doneSet  = new Set(done)
  const doneCount = habits.filter(h => doneSet.has(h.id)).length
  return (
    <div className="fc-overview">
      <button className="fc-overview__close" onClick={onClose}>✕</button>
      <div className="fc-overview__header">
        <p className="fc-overview__eye">What you're building</p>
        <h2 className="fc-overview__title">
          {doneCount === habits.length && habits.length > 0
            ? 'All done today.'
            : `${doneCount} of ${habits.length} today`}
        </h2>
        <p className="fc-overview__sub">Tap any habit to focus on it.</p>
      </div>
      <div className="fc-overview__grid">
        {habits.map((h, i) => {
          const isDone = doneSet.has(h.id)
          return (
            <div key={h.id} className="fc-ov-row" onClick={() => onSelect(i)}>
              <div className="fc-ov-row__swatch" style={{ background: h.bg }} />
              <div className="fc-ov-row__body">
                <div className="fc-ov-row__label">{h.label}</div>
                <div className="fc-ov-row__meta">{streakLabel(h)}</div>
              </div>
              <span className={`fc-ov-row__status${h.status === 'kept' ? ' kept' : ''}`}>
                {h.status === 'kept' ? 'Kept' : 'Trial'}
              </span>
              <div
                className={`fc-ov-row__check${isDone ? ' done' : ''}`}
                onClick={e => { e.stopPropagation(); onToggleDone(h.id) }}
              >
                {isDone ? '✓' : ''}
              </div>
            </div>
          )
        })}
        <div className="fc-add-row">
          <div className="fc-add-row__icon">+</div>
          Add another habit
        </div>
      </div>
    </div>
  )
}

export default function FocusCarousel({ onNavigate, onLogoClick, onMenu }) {
  const name            = readName()
  const [habits, setHabits] = useState(() => readHabits() || [])
  const [firstRun, setFirstRun] = useState(() => { try { return localStorage.getItem('vitalistExp_firstrun') === '1' } catch { return false } })
  const [postConfirm, setPostConfirm] = useState(null)
  const [done, setDone] = useState(() => readDone())
  const [idx, setIdx]   = useState(0)
  const [overview, setOverview] = useState(false)
  const [askHabit, setAskHabit] = useState(null)
  const [reading, setReading]   = useState(null)
  const [readingDay, setReadingDay] = useState(null)
  const [showHint, setShowHint] = useState(habits.length > 1)
  const [sources, setSources]   = useState(() => readSources())

  const working     = habits.filter(h => h.status === 'trial' || h.status === 'adopted')
  const established = habits.filter(h => h.status === 'kept' || h.status === 'my_habit' || h.status === 'established')

  const connectSource = useCallback((source) => {
    setSources(prev => {
      if (prev.includes(source)) return prev
      const next = [...prev, source]
      writeSources(next)
      return next
    })
  }, [])

  function onSelectRecommendation(rec) {
    const today = new Date().toISOString().slice(0, 10)
    const habit = {
      id: rec.goalId + '_' + Date.now(),
      goalId: rec.goalId,
      label: rec.label,
      bg: GRAD[rec.goalId] || rec.bg,
      source: rec.source,
      status: 'trial',
      addedAt: today,
      tier: 1,
      anchor: null,
    }
    const next = [habit]
    try {
      localStorage.setItem('vitalistExp_habits', JSON.stringify(next))
      localStorage.removeItem('vitalistExp_firstrun')
    } catch (_) {}
    setHabits(next)
    setFirstRun(false)
    setPostConfirm(habit)
  }

  const dragStartX = useRef(null)
  const dragCurrX  = useRef(null)
  const dragging   = useRef(false)
  const [dragX, setDragX] = useState(0)

  useEffect(() => { writeDone(done) }, [done])
  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(() => setShowHint(false), 3000)
    return () => clearTimeout(t)
  }, [showHint])

  const toggleDone = useCallback((id) => {
    setDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  function startDrag(x) { dragStartX.current = x; dragCurrX.current = x; dragging.current = true }
  function moveDrag(x)  { if (!dragging.current) return; dragCurrX.current = x; setDragX(x - dragStartX.current) }
  function endDrag() {
    if (!dragging.current) return
    dragging.current = false
    const delta = dragCurrX.current - dragStartX.current
    if (Math.abs(delta) > 50) {
      if (delta < 0 && idx < working.length) { setIdx(i => i + 1); setShowHint(false) }
      else if (delta > 0 && idx > 0) setIdx(i => i - 1)
    }
    setDragX(0)
  }

  useEffect(() => {
    const mm = e => { if (dragging.current) moveDrag(e.clientX) }
    const mu = () => endDrag()
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu)
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu) }
  })

  if (firstRun) {
    return (
      <div className="fc-root">
        <FirstRun name={name} primary={readPrimary()} onSelect={onSelectRecommendation} />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="fc-empty">
        <h2 className="fc-empty__hed">Nothing here yet.</h2>
        <p className="fc-empty__body">Complete onboarding to add your first habit, or start fresh.</p>
        <button className="fc-empty__btn" onClick={() => {
          try { Object.keys(localStorage).forEach(k => { if (k.startsWith('vitalistExp_')) localStorage.removeItem(k) }) } catch {}
          window.location.reload()
        }}>Start fresh</button>
      </div>
    )
  }

  const pageCount   = working.length + 1 // working habits + "next slot" card
  const vw          = typeof window !== 'undefined' ? window.innerWidth : 390
  const translatePx = -(idx * vw) + dragX
  const isActiveDrag = dragging.current && Math.abs(dragX) > 2

  return (
    <div className="fc-root">
      {/* Top bar */}
      <div className="fc-topbar">
        <div className="fc-logo-row">
          <button className="fc-logo-btn" onClick={onLogoClick}>
            Vitalist<span className="fc-logo-btn__by">by People Inc.</span>
          </button>
          <button className="fc-hamburger" onClick={() => (onMenu ? onMenu() : onNavigate('Me'))}>
            <span/><span/><span/>
          </button>
        </div>
        <div className="fc-eyebrow-row">
          <span className="fc-eyebrow">{name ? `Welcome back, ${name}` : 'Your daily routine'}</span>
        </div>
      </div>

      {/* Scrollable content — "Working on it" carousel + "My habits" list */}
      <div className="fc-page-scroll">
        {/* Working on it — swipe carousel */}
        <div className="fc-routine">
          <div
            className="fc-stage"
            onTouchStart={e => startDrag(e.touches[0].clientX)}
            onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX) }}
            onTouchEnd={endDrag}
            onMouseDown={e => { e.preventDefault(); startDrag(e.clientX) }}
            style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
          >
            <div
              className="fc-strip"
              style={{
                transform: `translateX(${translatePx}px)`,
                transition: isActiveDrag ? 'none' : 'transform .32s cubic-bezier(.42,0,.22,1)',
              }}
            >
              {working.map(h => (
                <Card
                  key={h.id}
                  habit={h}
                  width={vw}
                  done={done.includes(h.id)}
                  onDone={toggleDone}
                  sources={sources}
                  onConnect={connectSource}
                  onRead={(content, habit) => setReading({ content, habit })}
                  onDaily={(data, habit) => setReadingDay({ data, habit })}
                />
              ))}
              <NextSlotCard width={vw} unlocked={working.some(h => dayOf(h) >= 7)} />
            </div>
          </div>
        </div>

        {/* My habits — established habits scroll below the carousel */}
        {established.length > 0 && (
          <MyHabitsSection habits={established} done={done} onToggleDone={toggleDone} />
        )}

        {/* Bottom padding clears fixed nav */}
        <div style={{ height: 103 }} />
      </div>

      {pageCount > 1 && (
        <div className="fc-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <div key={i} className={`fc-dot${i === idx ? ' on' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
      {showHint && <div className="fc-swipe-hint">swipe to see all</div>}

      {/* Vita — app-level coach bar */}
      {working.length > 0 && (
        <button
          className="fc-ai-fab"
          aria-label="Ask Vita"
          onClick={() => setAskHabit(working[Math.min(idx, working.length - 1)])}
        >
          <span className="fc-ai-fab__spark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 5.1L19 8.8l-5.3 1.7L12 16l-1.7-5.5L5 8.8l5.3-1.7L12 2z"/><path d="M18.5 13.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" opacity=".7"/></svg>
          </span>
          <span className="fc-ai-fab__txt">
            <span className="fc-ai-fab__name">Ask Vita</span>
            <span className="fc-ai-fab__hint">Stuck tonight? I can help with this habit.</span>
          </span>
          <span className="fc-ai-fab__go" aria-hidden="true">→</span>
        </button>
      )}

      {overview && (
        <Overview
          habits={working}
          done={done}
          onSelect={i => { setIdx(i); setOverview(false) }}
          onClose={() => setOverview(false)}
          onToggleDone={toggleDone}
        />
      )}
      {askHabit && (
        <AISheet
          habit={askHabit}
          onClose={() => setAskHabit(null)}
          onAddHabit={() => { setAskHabit(null); onNavigate('Yours') }}
        />
      )}
      {reading && (
        <Reader content={reading.content} habit={reading.habit} onClose={() => setReading(null)} />
      )}
      {readingDay && (
        <DailyView data={readingDay.data} habit={readingDay.habit} onClose={() => setReadingDay(null)} />
      )}
      {postConfirm && (
        <PostConfirm habit={postConfirm} sources={sources} onConnect={connectSource} onClose={() => setPostConfirm(null)} />
      )}
    </div>
  )
}
