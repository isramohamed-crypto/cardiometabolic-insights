import React, { useState, useRef, useEffect } from 'react'
import './CollectionPage.css'

// ── Categories (used for tags + filter pills) ───────────────────────────────
const CATEGORIES = [
  { id: 'movement',   label: 'Movement',   match: ['move', 'strong'],    color: '#8a6d4a' },
  { id: 'nutrition',  label: 'Nutrition',  match: ['eat', 'water'],      color: '#a15a3f' },
  { id: 'sleep',      label: 'Sleep',      match: ['sleep'],             color: '#5a7a6a' },
  { id: 'stress',     label: 'Stress',     match: ['stress'],            color: '#6a5a8a' },
  { id: 'connection', label: 'Connection', match: ['connect'],           color: '#3f6a8a' },
  { id: 'substances', label: 'Substances', match: ['alcohol', 'smoke'],  color: '#7a4a6a' },
]
function catFor(goalId) {
  return CATEGORIES.find(c => c.match.includes(goalId)) || { id: 'other', label: 'Other', color: '#8b8b90' }
}

// ── Gradient art per goal ───────────────────────────────────────────────────
const GRAD = {
  move:    'linear-gradient(155deg,#8a7565,#4a3b32)',
  strong:  'linear-gradient(155deg,#5a6a5a,#3a4a3a)',
  eat:     'linear-gradient(155deg,#8a6a5a,#5a3a2a)',
  water:   'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
  sleep:   'linear-gradient(155deg,#6d7b6a,#3a4436)',
  stress:  'linear-gradient(155deg,#7a6a8a,#4a3a5a)',
  connect: 'linear-gradient(155deg,#5a7a8a,#2d4a5a)',
  alcohol: 'linear-gradient(155deg,#6a5a7a,#3a2a5a)',
  smoke:   'linear-gradient(155deg,#6a5a7a,#3a2a5a)',
}
function gradFor(h) {
  return h.bg || GRAD[h.goalId] || 'linear-gradient(155deg,#9db4d6,#4a6a8a)'
}
// Thumbnail imagery — mirrors the Routine feed so photos stay consistent
const IMAGERY = { move: '/forest.jpg' }
function photoFor(h) {
  return IMAGERY[h.goalId] || `https://picsum.photos/seed/vitalist-${h.goalId || 'default'}/600/400`
}
// Sentinel id for the draggable "add" crest that lives in the grid
const ADD_ID = '__add'
// Persisted slot map for the drag-to-arrange crest grid (index -> habit id | null)
function readEstSlots() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_estSlots') || '[]') } catch { return [] }
}
function writeEstSlots(s) {
  try { localStorage.setItem('vitalistExp_estSlots', JSON.stringify(s)) } catch {}
}
// Reconcile saved slots with the current habits, then pad the grid so there are
// always a few empty slots to drag into (grows as the collection grows).
// Build a padded canvas: `sideCols` blank columns each side, `topRows`/`botRows`
// blank rows above and below the crests, so there's room to arrange in every
// direction. Fresh arrangements start centered in the content area.
function buildSlots(habitIds, saved, o) {
  const { cols, sideCols, topRows, botRows } = o
  const contentCols = cols - sideCols * 2
  if (!saved || saved.length === 0) {
    const rows = Math.max(1, Math.ceil(habitIds.length / contentCols))
    const totalRows = topRows + rows + botRows
    const slots = Array(totalRows * cols).fill(null)
    let placed = 0
    for (let r = 0; r < rows && placed < habitIds.length; r++) {
      const rowItems = Math.min(contentCols, habitIds.length - placed)
      const startCol = sideCols + Math.floor((contentCols - rowItems) / 2)
      for (let c = 0; c < rowItems; c++) slots[(topRows + r) * cols + startCol + c] = habitIds[placed++]
    }
    return slots
  }
  let slots = saved.map(id => (id && habitIds.includes(id) ? id : null))
  const placed = new Set(slots.filter(Boolean))
  habitIds.filter(id => !placed.has(id)).forEach(id => {
    const empty = slots.indexOf(null)
    if (empty === -1) slots.push(id)
    else slots[empty] = id
  })
  let last = -1
  slots.forEach((v, i) => { if (v) last = i })
  const need = last + 1 + botRows * cols
  const total = Math.ceil(need / cols) * cols
  while (slots.length < total) slots.push(null)
  return slots
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

// ── 30-day ownership check-in ───────────────────────────────────────────────
const CHECKIN_DAYS = 30
const ANSWER_LABEL = { automatic: 'Still automatic', slipping: 'Working on it', stopped: 'Set aside' }
function readCheckins() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_checkins') || '{}') } catch { return {} }
}
function writeCheckins(c) {
  try { localStorage.setItem('vitalistExp_checkins', JSON.stringify(c)) } catch {}
}
function daysSince(dateStr) {
  if (!dateStr) return Infinity
  const t = new Date(dateStr).getTime()
  return isNaN(t) ? Infinity : Math.floor((Date.now() - t) / 86400000)
}
const WatchIcon = <i className="fa-solid fa-stopwatch" aria-hidden="true" />

function WearableTag({ goalId, sources, onConnect }) {
  const w = WEARABLE[goalId]
  if (!w) return null
  const on = sources.includes(w.source)
  if (on) {
    return (
      <span className="cp-wear cp-wear--on">{WatchIcon} Auto · {w.label}</span>
    )
  }
  return (
    <button
      className="cp-wear cp-wear--off"
      onClick={e => { e.stopPropagation(); onConnect(w.source) }}
    >
      {WatchIcon} Connect {w.label}
    </button>
  )
}

// ── Library of habits you can add ("slots" to fill, grouped by category) ─────
// Starter habit catalogue — 10-14 per category (grows over time)
const LIBRARY = [
  // ── Movement (move / strong) ──
  { id: 'lib_walk10',    goalId: 'move',    label: '10-min walk daily' },
  { id: 'lib_stairs',    goalId: 'move',    label: 'Take the stairs' },
  { id: 'lib_walklunch', goalId: 'move',    label: 'Walk after lunch' },
  { id: 'lib_parkfar',   goalId: 'move',    label: 'Park farther away' },
  { id: 'lib_stand30',   goalId: 'move',    label: 'Stand up every 30 min' },
  { id: 'lib_stroll',    goalId: 'move',    label: 'Evening stroll' },
  { id: 'lib_walkmeet',  goalId: 'move',    label: 'Take calls on a walk' },
  { id: 'lib_squats',    goalId: 'strong',  label: '10 squats before the shower' },
  { id: 'lib_stretch',   goalId: 'strong',  label: 'Morning stretch' },
  { id: 'lib_pushups',   goalId: 'strong',  label: 'Wall push-ups' },
  { id: 'lib_sittostand',goalId: 'strong',  label: 'Sit-to-stands x10' },
  { id: 'lib_calf',      goalId: 'strong',  label: 'Calf raises at the sink' },
  { id: 'lib_carry',     goalId: 'strong',  label: 'Carry groceries in one trip' },

  // ── Nutrition (eat / water) ──
  { id: 'lib_veg',       goalId: 'eat',     label: 'Veg with every dinner' },
  { id: 'lib_slow',      goalId: 'eat',     label: 'Fork down between bites' },
  { id: 'lib_protein',   goalId: 'eat',     label: 'Protein at breakfast' },
  { id: 'lib_fruit',     goalId: 'eat',     label: 'Fruit instead of dessert' },
  { id: 'lib_halfplate', goalId: 'eat',     label: 'Half-plate vegetables' },
  { id: 'lib_cook',      goalId: 'eat',     label: 'Cook at home most nights' },
  { id: 'lib_smallplate',goalId: 'eat',     label: 'Smaller dinner plate' },
  { id: 'lib_noseconds', goalId: 'eat',     label: 'Skip seconds' },
  { id: 'lib_water',     goalId: 'water',   label: 'Glass of water before coffee' },
  { id: 'lib_waterdesk', goalId: 'water',   label: 'Water bottle on your desk' },
  { id: 'lib_watermeal', goalId: 'water',   label: 'Water before each meal' },
  { id: 'lib_herbaltea', goalId: 'water',   label: 'Herbal tea at night' },

  // ── Sleep ──
  { id: 'lib_lights',    goalId: 'sleep',   label: 'Lights low after 9' },
  { id: 'lib_wake',      goalId: 'sleep',   label: 'Same wake time' },
  { id: 'lib_noscreens', goalId: 'sleep',   label: 'No screens 30 min before bed' },
  { id: 'lib_cooldark',  goalId: 'sleep',   label: 'Cool, dark room' },
  { id: 'lib_caffeine',  goalId: 'sleep',   label: 'Caffeine before noon only' },
  { id: 'lib_winddown',  goalId: 'sleep',   label: 'Wind-down routine' },
  { id: 'lib_bedtime',   goalId: 'sleep',   label: 'Consistent bedtime' },
  { id: 'lib_nolatemeal',goalId: 'sleep',   label: 'No late-night meals' },
  { id: 'lib_amlight',   goalId: 'sleep',   label: 'Morning light within an hour' },
  { id: 'lib_phoneaway', goalId: 'sleep',   label: 'Phone across the room' },
  { id: 'lib_readbed',   goalId: 'sleep',   label: 'Read before bed' },

  // ── Stress ──
  { id: 'lib_breath',    goalId: 'stress',  label: '5 breaths before scrolling' },
  { id: 'lib_gratitude', goalId: 'stress',  label: 'One good thing at night' },
  { id: 'lib_outside',   goalId: 'stress',  label: '10 min outside midday' },
  { id: 'lib_box',       goalId: 'stress',  label: 'Box breathing' },
  { id: 'lib_singletask',goalId: 'stress',  label: 'Single-task for 25 min' },
  { id: 'lib_lunchoff',  goalId: 'stress',  label: 'Screen-free lunch' },
  { id: 'lib_journal',   goalId: 'stress',  label: 'Journal three lines' },
  { id: 'lib_sigh',      goalId: 'stress',  label: 'Stretch and sigh' },
  { id: 'lib_namefeel',  goalId: 'stress',  label: 'Name one feeling' },
  { id: 'lib_tidy2',     goalId: 'stress',  label: 'Two-minute tidy' },

  // ── Connection ──
  { id: 'lib_call',      goalId: 'connect', label: 'Call someone weekly' },
  { id: 'lib_goodmorn',  goalId: 'connect', label: 'Text a friend good morning' },
  { id: 'lib_dinnernop', goalId: 'connect', label: 'Family dinner, no phones' },
  { id: 'lib_coworker',  goalId: 'connect', label: 'Ask a coworker how they are' },
  { id: 'lib_meetup',    goalId: 'connect', label: 'One meetup a week' },
  { id: 'lib_voicenote', goalId: 'connect', label: 'Voice note instead of text' },
  { id: 'lib_compliment',goalId: 'connect', label: 'Compliment someone daily' },
  { id: 'lib_neighbor',  goalId: 'connect', label: 'Check in on a neighbor' },
  { id: 'lib_note',      goalId: 'connect', label: 'Send a handwritten note' },
  { id: 'lib_class',     goalId: 'connect', label: 'Join a class or group' },

  // ── Substances (alcohol / smoke) ──
  { id: 'lib_dryday',    goalId: 'alcohol', label: 'One dry day a week' },
  { id: 'lib_afweeknt',  goalId: 'alcohol', label: 'Alcohol-free weeknights' },
  { id: 'lib_waterbtwn', goalId: 'alcohol', label: 'Water between drinks' },
  { id: 'lib_capone',    goalId: 'alcohol', label: 'Cap it at one drink' },
  { id: 'lib_noalone',   goalId: 'alcohol', label: 'No drinking alone' },
  { id: 'lib_afbefore6', goalId: 'alcohol', label: 'Nothing before 6pm' },
  { id: 'lib_delayfirst',goalId: 'smoke',   label: 'Delay the first cigarette' },
  { id: 'lib_swapwalk',  goalId: 'smoke',   label: 'Swap one smoke for a walk' },
  { id: 'lib_smokefreeam',goalId: 'smoke',  label: 'Smoke-free mornings' },
  { id: 'lib_noindoors', goalId: 'smoke',   label: 'No smoking indoors' },
]

function readCollection() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_collection') || '[]') } catch { return [] }
}
function writeCollection(c) {
  try { localStorage.setItem('vitalistExp_collection', JSON.stringify(c)) } catch {}
}
function readActiveHabits() {
  try { return JSON.parse(localStorage.getItem('vitalistExp_habits') || '[]') } catch { return [] }
}
function writeActiveHabits(a) {
  try { localStorage.setItem('vitalistExp_habits', JSON.stringify(a)) } catch {}
}

export default function CollectionPage({ onOpenHabit }) {
  const [collection, setCollection] = useState(() => readCollection())
  const [filter, setFilter]         = useState('all')
  const [showAdd, setShowAdd]       = useState(false)
  const [sources, setSources]       = useState(() => readSources())
  const [checkins, setCheckins]     = useState(() => readCheckins())
  const [activeHabits, setActiveHabits] = useState(() => readActiveHabits())
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkInList, setCheckInList] = useState([])
  const [estSlots, setEstSlots] = useState(() => readEstSlots())
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedId, setSelectedId] = useState(null) // touch: tap to pick up, tap a slot to place
  const dragId = useRef(null)
  const gridScrollRef = useRef(null)
  // Center the horizontal canvas so the crests sit in the middle initially
  useEffect(() => {
    const el = gridScrollRef.current
    if (el) el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
  }, [filter])

  function connectSource(source) {
    if (sources.includes(source)) return
    const next = [...sources, source]
    setSources(next)
    writeSources(next)
  }
  function recordCheckin(habit, answer) {
    const today = new Date().toISOString().slice(0, 10)
    const nextChecks = { ...checkins, [habit.id]: { date: today, answer } }
    setCheckins(nextChecks)
    writeCheckins(nextChecks)

    if (answer === 'automatic') return // stays in My Habits

    // Remove from wherever it currently lives (kept in habits, or graduated in collection)
    const coll = collection.filter(h => h.id !== habit.id)
    let acts   = activeHabits.filter(h => h.id !== habit.id)

    if (answer === 'slipping') {
      // Back to "Working on it" as a fresh trial
      acts = [...acts, { ...habit, status: 'trial', tier: 1, addedAt: today }]
    }
    // 'stopped' → set aside: simply removed from both

    setCollection(coll);   writeCollection(coll)
    setActiveHabits(acts); writeActiveHabits(acts)
  }
  function isDue(h) {
    return daysSince(checkins[h.id]?.date || h.addedAt) >= CHECKIN_DAYS
  }

  const trialHabits  = activeHabits.filter(h => h.status === 'trial')
  const keptHabits   = activeHabits.filter(h => h.status === 'kept')
  const graduated    = collection.filter(h => h.status === 'graduated' || h.status === 'established')

  const myHabits     = [...graduated, ...keptHabits]
  const dueHabits    = myHabits.filter(isDue)
  const hasAnything  = trialHabits.length > 0 || myHabits.length > 0

  // Show every category as a filter so users can pick one, then add into it
  const filterCats = CATEGORIES
  const visibleHabits = filter === 'all'
    ? myHabits
    : myHabits.filter(h => catFor(h.goalId).id === filter)

  // Slot grid for the All-view crest wall. The add-crest is a placeable item too,
  // so it can be arranged anywhere alongside the habit crests. The grid is a
  // padded canvas (blank columns each side + blank rows top/bottom) that scrolls.
  const GRID = { cols: 8, sideCols: 2, topRows: 2, botRows: 2 }
  const habitById = Object.fromEntries(myHabits.map(h => [h.id, h]))
  const placeable = [...myHabits.map(h => h.id), ADD_ID]
  const slots = buildSlots(placeable, estSlots, GRID)

  // Core move: put `from` into `targetIdx`, swapping with whatever was there
  function moveIdToSlot(from, targetIdx) {
    if (!from) return
    const next = [...slots]
    const fromIdx = next.indexOf(from)
    const occupant = next[targetIdx]
    if (fromIdx === targetIdx) return
    next[targetIdx] = from
    if (fromIdx > -1) next[fromIdx] = occupant || null
    setEstSlots(next)
    writeEstSlots(next)
  }
  function dropIntoSlot(targetIdx) {
    const from = dragId.current
    dragId.current = null
    setDragOverIdx(null)
    setIsDragging(false)
    moveIdToSlot(from, targetIdx)
  }
  // Tap-to-place (touch-friendly): tap a crest to pick up, tap a slot to drop it
  function tapSlot(i, id) {
    if (selectedId) {
      if (id === selectedId) { setSelectedId(null); return }
      moveIdToSlot(selectedId, i)
      setSelectedId(null)
    } else if (id === ADD_ID) {
      setShowAdd(true)
    } else if (id) {
      setSelectedId(id)
    }
  }

  // Labels already in the collection or active — so the library can show "added"
  const ownedLabels = new Set([...myHabits, ...trialHabits].map(h => h.label))

  function addHabit(item) {
    if (ownedLabels.has(item.label)) return
    const next = [...collection, {
      id: item.id + '_' + Date.now(),
      goalId: item.goalId,
      label: item.label,
      bg: GRAD[item.goalId],
      status: 'established',
      addedAt: new Date().toISOString().slice(0, 10),
    }]
    setCollection(next)
    writeCollection(next)
  }

  if (!hasAnything) {
    return (
      <div className="cp-root">
        <div className="cp-header">
          <p className="cp-header__eye">Vitalist</p>
          <h1 className="cp-header__title">Yours</h1>
        </div>
        <div className="cp-empty">
          <h2 className="cp-empty__hed">Your collection starts here.</h2>
          <p className="cp-empty__body">
            When a habit feels automatic — part of your days, not something you're tracking — it lands here. That's the goal.
          </p>
          <button className="cp-empty__cta" onClick={() => setShowAdd(true)}>Browse habits →</button>
        </div>
        {showAdd && (
          <AddSheet ownedLabels={ownedLabels} onAdd={addHabit} onClose={() => setShowAdd(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="cp-root">
      <div className="cp-header">
        <p className="cp-header__eye">Your collection</p>
        <h1 className="cp-header__title">The person you're <em>becoming.</em></h1>
      </div>

      {/* 30-day ownership check-in nudge */}
      {dueHabits.length > 0 && (
        <button className="cp-checkin-nudge" onClick={() => { setCheckInList(dueHabits); setCheckInOpen(true) }}>
          <span className="cp-checkin-nudge__dot" />
          <div className="cp-checkin-nudge__txt">
            <p className="cp-checkin-nudge__hed">Still yours?</p>
            <p className="cp-checkin-nudge__sub">
              {dueHabits.length} habit{dueHabits.length > 1 ? 's' : ''} due for a quick 30-day check-in.
            </p>
          </div>
          <span className="cp-checkin-nudge__go">→</span>
        </button>
      )}

      {/* My Routine — the habits she's actively building (trial) */}
      {trialHabits.length > 0 && (
        <div className="cp-section">
          <p className="cp-section__label">My Routine</p>
          <p className="cp-section__note">The habits you're building right now. Tap one to open it. Stick with it for 2 weeks and it graduates to your established habits.</p>
          <div className="cp-trial-list">
            {trialHabits.map(h => {
              const cat = catFor(h.goalId)
              const day = Math.min(daysSince(h.addedAt) + 1, 7)
              return (
                <button key={h.id} className="cp-trial-card" onClick={() => onOpenHabit && onOpenHabit(h.id)}>
                  <div className="cp-trial-card__img" style={{ background: gradFor(h) }}>
                    <img src={photoFor(h)} alt="" draggable="false" onError={e => { e.currentTarget.style.display = 'none' }} />
                  </div>
                  <div className="cp-trial-card__body">
                    <p className="cp-trial-card__meta">
                      <span className="cp-trial-card__src">{h.source || cat.label}</span>
                      <span className="cp-trial-card__dot">·</span>
                      <span className="cp-trial-card__trial">Trial</span>
                    </p>
                    <p className="cp-trial-card__label">{h.label}</p>
                    <p className="cp-trial-card__eyebrow">Day {day} of 7</p>
                  </div>
                  <span className="cp-trial-card__chev" aria-hidden="true">›</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Established Habits — things she already does, as achievement badges */}
      <div className="cp-section">
        <p className="cp-section__label">Established Habits</p>
        <p className="cp-section__note">The routines you already have down. Mark the ones you're already doing so we can build around them — these aren't new habits to start.</p>

        {filterCats.length > 1 && (
          <div className="cp-filter-row">
            <button
              className={`cp-pill${filter === 'all' ? ' on' : ''}`}
              onClick={() => setFilter('all')}
            >All</button>
            {filterCats.map(c => (
              <button
                key={c.id}
                className={`cp-pill${filter === c.id ? ' on' : ''}`}
                onClick={() => setFilter(c.id)}
              >{c.label}</button>
            ))}
          </div>
        )}

        {filter === 'all' ? (
          /* All view — crests live in a slot grid; drag any crest into any spot */
          <>
          {myHabits.length > 0 && <p className="cp-drag-hint">{selectedId ? 'Tap a spot to place it' : 'Drag — or tap a crest, then tap a spot · hover for the name'}</p>}
          <div className="cp-crestscroll" ref={gridScrollRef}>
          <div className={`cp-crestgrid${isDragging ? ' dragging' : ''}${selectedId ? ' selecting' : ''}`}>
            {slots.map((id, i) => {
              const dropHandlers = {
                onDragOver: e => { e.preventDefault(); if (dragId.current && dragId.current !== id) setDragOverIdx(i) },
                onDragLeave: () => setDragOverIdx(o => (o === i ? null : o)),
                onDrop: e => { e.preventDefault(); dropIntoSlot(i) },
                onClick: () => tapSlot(i, id),
              }
              // Empty slot
              if (!id) {
                return (
                  <div key={`slot-${i}`} className={`cp-crestcell cp-crestcell--empty${dragOverIdx === i ? ' dragover' : ''}`} {...dropHandlers}>
                    <span className="cp-slot-ghost" />
                  </div>
                )
              }
              // Add crest — draggable + placeable like any other
              if (id === ADD_ID) {
                return (
                  <div key={`slot-${i}`} className={`cp-crestcell${dragOverIdx === i ? ' dragover' : ''}`} {...dropHandlers}>
                    <div
                      className={`cp-crest cp-crest--add${selectedId === ADD_ID ? ' selected' : ''}`}
                      tabIndex={0}
                      draggable
                      onDragStart={e => { dragId.current = ADD_ID; e.dataTransfer.effectAllowed = 'move'; setIsDragging(true); e.currentTarget.classList.add('dragging') }}
                      onDragEnd={e => { e.currentTarget.classList.remove('dragging'); setIsDragging(false); setDragOverIdx(null) }}
                    >
                      <div className="cp-crest__emblem cp-crest__emblem--add"><span>+</span></div>
                      <span className="cp-crest__name">Add habits you already do</span>
                    </div>
                  </div>
                )
              }
              // Habit crest
              const h = habitById[id]
              if (!h) return <div key={`slot-${i}`} className="cp-crestcell cp-crestcell--empty" {...dropHandlers}><span className="cp-slot-ghost" /></div>
              const cat = catFor(h.goalId)
              return (
                <div key={`slot-${i}`} className={`cp-crestcell${dragOverIdx === i ? ' dragover' : ''}`} {...dropHandlers}>
                  <div
                    className={`cp-crest${selectedId === id ? ' selected' : ''}`}
                    style={{ '--cat': cat.color }}
                    tabIndex={0}
                    draggable
                    onDragStart={e => { dragId.current = id; e.dataTransfer.effectAllowed = 'move'; setIsDragging(true); e.currentTarget.classList.add('dragging') }}
                    onDragEnd={e => { e.currentTarget.classList.remove('dragging'); setIsDragging(false); setDragOverIdx(null) }}
                  >
                    <div className="cp-crest__emblem" style={{ background: gradFor(h) }}>
                      {h.icon && <span className="cp-crest__icon">{h.icon}</span>}
                      <span className="cp-crest__seal">✓</span>
                    </div>
                    <span className="cp-crest__name">{h.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
          </>
        ) : (
          /* Category view — crests spaced out with their names */
          <div className="cp-badges cp-badges--crest">
            {visibleHabits.map(h => {
              const cat = catFor(h.goalId)
              return (
                <div key={h.id} className="cp-badge" style={{ '--cat': cat.color }}>
                  <div className="cp-badge__emblem" style={{ background: gradFor(h) }}>
                    {h.icon && <span className="cp-badge__icon">{h.icon}</span>}
                    <span className="cp-badge__seal">✓</span>
                  </div>
                  <span className="cp-badge__label">{h.label}</span>
                  <span className="cp-badge__cat" style={{ color: cat.color }}>{cat.label}</span>
                  <WearableTag goalId={h.goalId} sources={sources} onConnect={connectSource} />
                </div>
              )
            })}
            <button className="cp-badge cp-badge--add" onClick={() => setShowAdd(true)}>
              <div className="cp-badge__emblem cp-badge__emblem--add"><span>+</span></div>
              <span className="cp-badge__add-label">Mark a {CATEGORIES.find(c => c.id === filter)?.label} habit you already do</span>
            </button>
          </div>
        )}
        {visibleHabits.length === 0 && (
          <p className="cp-nofilter">
            {filter === 'all'
              ? "No established habits marked yet — tap + to add ones you already do."
              : `No ${CATEGORIES.find(c => c.id === filter)?.label} habits marked yet — tap + to add one you already do.`}
          </p>
        )}
      </div>

      {showAdd && (
        <AddSheet filter={filter} ownedLabels={ownedLabels} onAdd={addHabit} onClose={() => setShowAdd(false)} />
      )}

      {checkInOpen && (
        <CheckInSheet habits={checkInList} onAnswer={recordCheckin} onClose={() => setCheckInOpen(false)} />
      )}
    </div>
  )
}

// ── 30-day check-in sheet ───────────────────────────────────────────────────
function CheckInSheet({ habits, onAnswer, onClose }) {
  const [answered, setAnswered] = useState({})
  function pick(h, ans) {
    setAnswered(prev => ({ ...prev, [h.id]: ans }))
    onAnswer(h, ans)
  }
  const allDone = habits.length > 0 && habits.every(h => answered[h.id])
  return (
    <div className="cp-sheet" onClick={onClose}>
      <div className="cp-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="cp-sheet__handle" />
        <p className="cp-sheet__eye">30-day check-in</p>
        <h3 className="cp-sheet__title">Still part of your days?</h3>
        <p className="cp-ci__note">Honest answers keep your collection real — slipping habits go back to your daily routine.</p>
        <div className="cp-sheet__scroll">
          {habits.map(h => {
            const a = answered[h.id]
            return (
              <div key={h.id} className="cp-ci">
                <p className="cp-ci__label">{h.label}</p>
                {a ? (
                  <p className="cp-ci__done">✓ {ANSWER_LABEL[a]}</p>
                ) : (
                  <div className="cp-ci__opts">
                    <button className="cp-ci__btn cp-ci__btn--keep" onClick={() => pick(h, 'automatic')}>Still automatic</button>
                    <button className="cp-ci__btn" onClick={() => pick(h, 'slipping')}>Slipping · back to daily</button>
                    <button className="cp-ci__btn" onClick={() => pick(h, 'stopped')}>Not anymore</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button className="cp-sheet__done" onClick={onClose}>{allDone ? 'Done' : 'Close'}</button>
      </div>
    </div>
  )
}

// ── Add sheet — slots grouped by category (scoped to active filter) ─────────
function AddSheet({ filter = 'all', ownedLabels, onAdd, onClose }) {
  const cats = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter)
  const scoped = filter !== 'all' ? CATEGORIES.find(c => c.id === filter) : null
  return (
    <div className="cp-sheet" onClick={onClose}>
      <div className="cp-sheet__panel" onClick={e => e.stopPropagation()}>
        <div className="cp-sheet__handle" />
        <p className="cp-sheet__eye">Already part of your life</p>
        <h3 className="cp-sheet__title">{scoped ? `Mark a ${scoped.label} habit you already do` : 'Mark what you already do'}</h3>
        <p className="cp-sheet__note">These aren't new things to start — pick the routines you've already got down, so we can build around them.</p>
        <div className="cp-sheet__scroll">
          {cats.map(cat => {
            const items = LIBRARY.filter(l => cat.match.includes(l.goalId))
            if (items.length === 0) return null
            return (
              <div key={cat.id} className="cp-slot-group">
                <p className="cp-slot-group__label" style={{ color: cat.color }}>{cat.label}</p>
                <div className="cp-slot-list">
                  {items.map(item => {
                    const added = ownedLabels.has(item.label)
                    return (
                      <button
                        key={item.id}
                        className={`cp-slot${added ? ' filled' : ''}`}
                        onClick={() => onAdd(item)}
                        disabled={added}
                      >
                        <span className="cp-slot__dot" style={{ background: GRAD[item.goalId] }} />
                        <span className="cp-slot__label">{item.label}</span>
                        <span className="cp-slot__action">{added ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        <button className="cp-sheet__done" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}
