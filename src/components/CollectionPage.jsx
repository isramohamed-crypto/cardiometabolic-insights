import React, { useState } from 'react'
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
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5.5"/><path d="M8.5 3.5 9 8M15.5 3.5 15 8M8.5 20.5 9 16M15.5 20.5 15 16M12 9.5V12l1.8 1"/></svg>
)

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
const LIBRARY = [
  { id: 'lib_walk10',    goalId: 'move',    label: '10-min walk daily' },
  { id: 'lib_stairs',    goalId: 'move',    label: 'Take the stairs' },
  { id: 'lib_squats',    goalId: 'strong',  label: '10 squats before the shower' },
  { id: 'lib_stretch',   goalId: 'strong',  label: 'Morning stretch' },
  { id: 'lib_water',     goalId: 'water',   label: 'Glass of water before coffee' },
  { id: 'lib_veg',       goalId: 'eat',     label: 'Veg with every dinner' },
  { id: 'lib_slow',      goalId: 'eat',     label: 'Fork down between bites' },
  { id: 'lib_lights',    goalId: 'sleep',   label: 'Lights low after 9' },
  { id: 'lib_wake',      goalId: 'sleep',   label: 'Same wake time' },
  { id: 'lib_breath',    goalId: 'stress',  label: '5 breaths before scrolling' },
  { id: 'lib_gratitude', goalId: 'stress',  label: 'One good thing at night' },
  { id: 'lib_call',      goalId: 'connect', label: 'Call someone weekly' },
  { id: 'lib_dryday',    goalId: 'alcohol', label: 'One dry day a week' },
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

export default function CollectionPage() {
  const [collection, setCollection] = useState(() => readCollection())
  const [filter, setFilter]         = useState('all')
  const [showAdd, setShowAdd]       = useState(false)
  const [sources, setSources]       = useState(() => readSources())

  function connectSource(source) {
    if (sources.includes(source)) return
    const next = [...sources, source]
    setSources(next)
    writeSources(next)
  }

  const activeHabits = readActiveHabits()
  const trialHabits  = activeHabits.filter(h => h.status === 'trial')
  const keptHabits   = activeHabits.filter(h => h.status === 'kept')
  const graduated    = collection.filter(h => h.status === 'graduated' || h.status === 'established')

  const myHabits     = [...graduated, ...keptHabits]
  const hasAnything  = trialHabits.length > 0 || myHabits.length > 0

  // Show every category as a filter so users can pick one, then add into it
  const filterCats = CATEGORIES
  const visibleHabits = filter === 'all'
    ? myHabits
    : myHabits.filter(h => catFor(h.goalId).id === filter)

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

      {/* Working on it — trial habits */}
      {trialHabits.length > 0 && (
        <div className="cp-section">
          <p className="cp-section__label">Working on it</p>
          <p className="cp-section__note">Stick to a habit for 2 weeks to add it to your established routine.</p>
          <div className="cp-trial-list">
            {trialHabits.map(h => (
              <div key={h.id} className="cp-trial-card">
                <div className="cp-trial-card__img" style={{ background: gradFor(h) }} />
                <div className="cp-trial-card__body">
                  <p className="cp-trial-card__label">{h.label}</p>
                  <p className="cp-trial-card__sub">In trial · trying it on</p>
                  <WearableTag goalId={h.goalId} sources={sources} onConnect={connectSource} />
                </div>
                <span className="cp-trial-card__badge">Trial</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Habits — established, as achievement-style badges */}
      <div className="cp-section">
        <p className="cp-section__label">My Habits</p>
        <p className="cp-section__note">Habits are the building blocks of success. Add your established routines here.</p>

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

        <div className="cp-badges">
          {visibleHabits.map(h => {
            const cat = catFor(h.goalId)
            return (
              <div key={h.id} className="cp-badge">
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
            <span className="cp-badge__add-label">
              {filter === 'all' ? 'Add a habit' : `Add ${CATEGORIES.find(c => c.id === filter)?.label}`}
            </span>
          </button>
        </div>
        {visibleHabits.length === 0 && (
          <p className="cp-nofilter">
            {filter === 'all'
              ? 'No established habits yet — tap Add a habit.'
              : `No ${CATEGORIES.find(c => c.id === filter)?.label} habits yet — tap Add to start one.`}
          </p>
        )}
      </div>

      {showAdd && (
        <AddSheet filter={filter} ownedLabels={ownedLabels} onAdd={addHabit} onClose={() => setShowAdd(false)} />
      )}
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
        <p className="cp-sheet__eye">Add to your habits</p>
        <h3 className="cp-sheet__title">{scoped ? `Add a ${scoped.label} habit` : 'Fill a slot'}</h3>
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
