import React, { useState, useEffect, useRef } from 'react'
import './ProfilePage.css'

/**
 * Migration map: onboarding stores values as short codes; the profile page
 * uses the full label as the canonical value. We migrate codes -> labels on
 * first profile open so the chip pickers match.
 */
const MIGRATION_MAP = {
  role: { myself: 'Myself', child: 'My child', other: 'Someone else' },
  focus: {
    confidence: 'Taking control of my numbers',
    sleep:      'Improving my energy and sleep',
    triggers:   'Understanding what drives my condition',
    treatment:  'Managing my treatment plan',
    frustrated: 'Finding an approach that actually sticks',
  },
  diagnosisStatus: { yes: 'Yes, I have a diagnosis', no: 'Not yet / not sure' },
  condition: {
    cholesterol: 'High cholesterol', hypertension: 'High blood pressure', diabetes: 'Type 2 diabetes',
    obesity: 'Weight / metabolic health', heart: 'Heart disease', other_dx: 'Something else (diagnosed)',
    family_hx: 'Family history', borderline: 'Borderline numbers', weight: 'Weight concerns',
    prevention: 'Prevention focused', post_event: 'Recovery',
  },
}

/**
 * AI Insights "seed": if these fields are still empty when the profile page
 * is opened for the first time, prefill them with reasonable AI-inferred
 * defaults and tag them with "From AI Insights" until the user edits them.
 */
const AI_SEEDS = {
  topics:        ['Home', 'Food', 'Entertainment'],
  climate:       'Cold and dry',
  comms_freq:    'A few times a week',
}

const SECTIONS = [
  {
    id: 'basics',
    label: 'Basics',
    icon: '👤',
    fields: [
      { id: 'name',      label: 'First name',  type: 'text',   placeholder: 'What should we call you?' },
      { id: 'pronouns',  label: 'Pronouns',    type: 'select', options: ['She / her', 'He / him', 'They / them', 'Other', 'Prefer not to say'] },
      { id: 'age',       label: 'Age range',   type: 'select', options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'] },
      { id: 'location',  label: 'Location',    type: 'text',   placeholder: 'City, State' },
      { id: 'ethnicity', label: 'Ethnicity',   type: 'select', options: ['Asian', 'Black or African American', 'Hispanic or Latino', 'Middle Eastern or North African', 'Native American or Alaska Native', 'Native Hawaiian or Pacific Islander', 'White', 'Multiracial', 'Other', 'Prefer not to say'] },
    ],
  },
  {
    id: 'health',
    label: 'Health context',
    icon: '🩺',
    fields: [
      { id: 'role',            label: 'Managing for',          type: 'select',      options: ['Myself', 'My child', 'Someone else'] },
      { id: 'diagnosisStatus', label: 'Diagnosis status',      type: 'select',      options: ['Yes, I have a diagnosis', 'Not yet / not sure'] },
      { id: 'condition',       label: 'Conditions / concerns', type: 'multiselect', options: ['High cholesterol', 'High blood pressure', 'Type 2 diabetes', 'Weight / metabolic health', 'Heart disease', 'Something else (diagnosed)', 'Family history', 'Borderline numbers', 'Weight concerns', 'Prevention focused', 'Recovery'] },
      { id: 'triggers',        label: 'Known contributors',    type: 'multiselect', options: ['Stress', 'Poor sleep', 'Unhealthy diet', 'Physical inactivity', 'Smoking', 'Excess alcohol', 'Hormonal changes', 'Medications', 'Family history', 'Other'] },
      { id: 'comorbidities',   label: 'Other conditions',      type: 'multiselect', options: ['Hypertension', 'Type 2 diabetes', 'Obesity / metabolic syndrome', 'Heart disease', 'Anxiety or depression', 'Kidney disease', 'None of these'] },
    ],
  },
  {
    id: 'care_team',
    label: 'Care team',
    icon: '👩‍⚕️',
    fields: [
      { id: 'doctor_name',      label: 'Cardiologist or GP',  type: 'text', placeholder: 'Dr. Sarah Williams' },
      { id: 'doctor_specialty', label: 'Specialty',           type: 'text', placeholder: 'Cardiology / General Practice' },
      { id: 'doctor_location',  label: 'Practice',       type: 'text', placeholder: 'City, State' },
    ],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    icon: '🌿',
    fields: [
      { id: 'sleep',          label: 'Typical sleep quality', type: 'select', options: ['Great — wake up rested', 'Okay most nights', 'Poor — often disrupted', 'It really varies'] },
      { id: 'stress_level',   label: 'Day-to-day stress',     type: 'select', options: ['Low — pretty calm', 'Moderate — some pressure', 'High — frequently stressed', 'Very high — constant'] },
      { id: 'diet',           label: 'Diet pattern',          type: 'select', options: ['No restrictions', 'Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free', 'Other'] },
      { id: 'climate',        label: 'Climate where you live',type: 'select', options: ['Hot and humid', 'Hot and dry', 'Temperate / mild', 'Cold and dry', 'Cold and humid', 'Four distinct seasons'] },
      { id: 'pets',           label: 'Pets in your home',     type: 'multiselect', options: ['Dog', 'Cat', 'Other furry pet', 'Bird', 'Fish / reptile', 'No pets'] },
    ],
  },
  {
    id: 'topics',
    label: 'Topics & preferences',
    icon: '🎯',
    fields: [
      { id: 'focus',          label: 'What matters most',           type: 'select',      options: ['Taking control of my numbers', 'Improving my energy and sleep', 'Understanding what drives my condition', 'Managing my treatment plan', 'Finding an approach that actually sticks'] },
      { id: 'topics',         label: 'Topics I want to see more of',type: 'multiselect', options: ['Heart-healthy eating', 'Exercise & movement', 'Sleep & rest', 'Stress & mental health', 'Medications & treatment', 'Blood pressure', 'Blood sugar', 'Weight management', 'Understanding my numbers', 'Preparing for appointments', 'New treatments & research', 'Alcohol & lifestyle', 'Cooking at home', 'Travel & staying on track', 'Confidence & self-image', 'Community & peer support', 'Family & caregiving', 'Work & daily life'] },
      { id: 'comms_freq',     label: 'How often to hear from us',   type: 'select',      options: ['Daily check-ins', 'A few times a week', 'Weekly digest', 'Only the essentials'] },
      { id: 'goal',           label: 'Top goal for the next 90 days', type: 'select',    options: ['Improve my cholesterol or blood pressure', 'Lose weight or improve metabolic health', 'Sleep better', 'Reduce stress', 'Stick to my treatment plan', 'Feel more in control', 'Just learn for now'] },
    ],
  },
]

const STORAGE_KEY = 'cardiometabolicProfile'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (_) { return {} }
}

function writeStored(profile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)) } catch (_) {}
}

function migrateAndSeed(profile) {
  const next = { ...profile }

  // 1. Migrate code values to labels
  for (const [key, map] of Object.entries(MIGRATION_MAP)) {
    const v = next[key]
    if (Array.isArray(v)) {
      next[key] = v.map(x => map[x] || x)
    } else if (typeof v === 'string' && map[v]) {
      next[key] = map[v]
    }
  }

  // 2. Seed AI Insights (only once)
  const aiSources = new Set(profile.aiSources || [])
  if (!profile.aiSeededAt) {
    next.aiSeededAt = new Date().toISOString()
    for (const [key, val] of Object.entries(AI_SEEDS)) {
      const cur = next[key]
      const isEmpty = cur == null || cur === '' || (Array.isArray(cur) && cur.length === 0)
      if (isEmpty) {
        next[key] = val
        aiSources.add(key)
      }
    }
  }
  next.aiSources = Array.from(aiSources)
  return next
}

// Compute completion across all editable fields
export function computeCompletion(profile) {
  let total = 0
  let filled = 0
  for (const sec of SECTIONS) {
    for (const f of sec.fields) {
      total++
      const v = profile?.[f.id]
      if (Array.isArray(v) ? v.length > 0 : (v != null && v !== '')) filled++
    }
  }
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100)
  let label = 'Beginner'
  if (pct >= 70) label = 'All-Star'
  else if (pct >= 30) label = 'Intermediate'
  return { pct, total, filled, label }
}

export default function ProfilePage({ onClose, onAskAI }) {
  const [profile, setProfile] = useState(() => readStored())
  const [editing, setEditing] = useState(null)

  // On mount: migrate codes -> labels and seed AI insights
  useEffect(() => {
    const stored = readStored()
    const next = migrateAndSeed(stored)
    if (JSON.stringify(stored) !== JSON.stringify(next)) {
      writeStored(next)
      setProfile(next)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function setField(id, value) {
    setProfile(p => {
      // User edited the field — remove from AI and onboarding source tags
      const aiSources = (p.aiSources || []).filter(x => x !== id)
      const onboardingSources = (p.onboardingSources || []).filter(x => x !== id)
      const next = { ...p, [id]: value, aiSources, onboardingSources, updatedAt: new Date().toISOString() }
      writeStored(next)
      return next
    })
  }

  function updateTreatmentList(newList) {
    setProfile(p => {
      const next = { ...p, treatmentList: newList, updatedAt: new Date().toISOString() }
      writeStored(next)
      return next
    })
  }

  const aiSources = new Set(profile.aiSources || [])
  const onboardingSources = new Set(profile.onboardingSources || [])
  const { pct, total, filled, label: tierLabel } = computeCompletion(profile)

  return (
    <div className="pp-overlay" role="dialog" aria-label="Profile">
      <div className="pp-screen">
        {/* Header */}
        <div className="pp-header">
          <button className="pp-back" onClick={onClose} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="pp-header__title">Profile</div>
          <div style={{ width: 36 }} />
        </div>

        {/* Strength banner */}
        <div className="pp-strength">
          <div className="pp-strength__top">
            <div>
              <div className="pp-strength__tier">
                <span className={`pp-tier pp-tier--${tierLabel.toLowerCase().replace(/[^a-z]/g, '')}`}>{tierLabel}</span>
              </div>
              <div className="pp-strength__head">Profile strength</div>
              <div className="pp-strength__sub">{filled} of {total} fields complete · the more you share, the better we tailor your feed</div>
            </div>
            <div className="pp-strength__pct">{pct}%</div>
          </div>
          <div className="pp-strength__bar">
            <div className="pp-strength__fill" style={{ width: `${pct}%` }} />
          </div>
          <button className="pp-ai" onClick={onAskAI}>
            <span className="pp-ai__icon">✨</span>
            <span className="pp-ai__body">
              <span className="pp-ai__title">Have AI help me complete this</span>
              <span className="pp-ai__desc">Chat with Vitalist AI to fill in the rest</span>
            </span>
            <span className="pp-ai__arrow">→</span>
          </button>
        </div>

        {/* Sections */}
        {SECTIONS.map(sec => (
          <React.Fragment key={sec.id}>
            <Section
              section={sec}
              profile={profile}
              aiSources={aiSources}
              onboardingSources={onboardingSources}
              editingFieldId={editing?.sectionId === sec.id ? editing.fieldId : null}
              onEdit={(fieldId) => setEditing(editing?.fieldId === fieldId ? null : { sectionId: sec.id, fieldId })}
              onSet={setField}
            />
            {/* Treatments & products lives directly after Health context. */}
            {sec.id === 'health' && (
              <TreatmentsSection profile={profile} onUpdate={updateTreatmentList} />
            )}
          </React.Fragment>
        ))}


        <div className="pp-footer">
          <button className="pp-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}

const FREQ_OPTIONS = [
  'Once daily', 'Twice daily', 'Three times daily',
  'As needed', '2–3x a week', 'Weekly', 'Every 2 weeks', 'Monthly',
]

/**
 * Treatments & products — read-only chips synced from check-in chips,
 * but each row is tappable to enrich with dose, frequency, notes.
 * Persists everything to profile.treatmentList via onUpdate.
 */
function TreatmentsSection({ profile, onUpdate }) {
  const list = Array.isArray(profile?.treatmentList) ? profile.treatmentList : []
  const [editingKey, setEditingKey] = useState(null)   // `${condition||''}::${name}`
  const [form, setForm] = useState({ dose: '', frequency: '', notes: '' })

  function keyFor(item) {
    const c = (typeof item === 'object' ? item?.condition : null) || ''
    const n = typeof item === 'string' ? item : item?.name
    return `${c}::${n}`
  }

  function startEdit(item) {
    const obj = typeof item === 'string' ? { name: item } : item
    setEditingKey(keyFor(item))
    setForm({
      dose: obj.dose || '',
      frequency: obj.frequency || '',
      notes: obj.notes || '',
    })
  }

  function cancelEdit() {
    setEditingKey(null)
    setForm({ dose: '', frequency: '', notes: '' })
  }

  function saveEdit() {
    const updated = list.map(item => {
      if (keyFor(item) !== editingKey) return item
      const base = typeof item === 'string' ? { name: item } : { ...item }
      return {
        ...base,
        dose: form.dose.trim() || null,
        frequency: form.frequency.trim() || null,
        notes: form.notes.trim() || null,
        updatedAt: new Date().toISOString(),
      }
    })
    onUpdate(updated)
    cancelEdit()
  }

  // Group by condition for display
  const groups = {}
  for (const item of list) {
    const name = typeof item === 'string' ? item : item?.name
    if (!name) continue
    const cond = (typeof item === 'object' && item?.condition) || '__general'
    groups[cond] = groups[cond] || []
    groups[cond].push(item)
  }
  const groupKeys = Object.keys(groups)

  return (
    <div className="pp-section">
      <div className="pp-section__head">
        <div className="pp-section__title">
          <span className="pp-section__icon">🧴</span>
          <span>Treatments &amp; products</span>
        </div>
        {list.length > 0 && (
          <span className="pp-section__count pp-section__count--complete">{list.length} active</span>
        )}
      </div>

      {list.length === 0 ? (
        <div className="pp-fields">
          <div className="pp-field" style={{ padding: '14px 16px' }}>
            <div className="pp-field__label">No treatments logged yet</div>
            <div className="pp-field__value pp-field__value--empty">
              Add what you're using during your next health check-in. They'll show up here for you to add dose &amp; frequency.
            </div>
          </div>
        </div>
      ) : (
        <div className="pp-fields">
          {groupKeys.map(key => (
            <React.Fragment key={key}>
              {groupKeys.length > 1 && (
                <div className="pp-tx-group__label">
                  {key === '__general' ? 'General' : key}
                </div>
              )}
              {groups[key].map((item) => {
                const k = keyFor(item)
                const obj = typeof item === 'string' ? { name: item } : item
                const meta = [obj.dose, obj.frequency].filter(Boolean).join(' · ')
                const isEditing = editingKey === k
                return (
                  <div key={k} className={`pp-field${isEditing ? ' pp-field--editing' : ''}`}>
                    <button className="pp-field__row" type="button" onClick={() => startEdit(item)}>
                      <div className="pp-field__main">
                        <div className="pp-field__label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, color: '#1A1520', fontWeight: 600 }}>
                          {obj.name}
                        </div>
                        <div className={`pp-field__value${meta ? '' : ' pp-field__value--empty'}`}>
                          {meta || 'Add dose & frequency'}
                        </div>
                      </div>
                      <span className="pp-field__edit">{meta ? 'Edit' : '+ Details'}</span>
                    </button>
                    {isEditing && (
                      <div className="pp-editor">
                        <label className="pp-tx-edit-label">Dose</label>
                        <input
                          className="pp-editor__input"
                          type="text"
                          placeholder="e.g. 0.025%, 300mg, 1 pump"
                          value={form.dose}
                          onChange={e => setForm(f => ({ ...f, dose: e.target.value }))}
                        />
                        <label className="pp-tx-edit-label" style={{ marginTop: 10 }}>Frequency</label>
                        <div className="pp-editor__opts">
                          {FREQ_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              className={`pp-chip${form.frequency === opt ? ' pp-chip--sel' : ''}`}
                              onClick={() => setForm(f => ({ ...f, frequency: opt }))}
                            >{opt}</button>
                          ))}
                        </div>
                        <label className="pp-tx-edit-label" style={{ marginTop: 10 }}>Notes (optional)</label>
                        <input
                          className="pp-editor__input"
                          type="text"
                          placeholder="When applied, side effects, anything to remember…"
                          value={form.notes}
                          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        />
                        <div className="pp-editor__actions">
                          <button className="pp-editor__cancel" type="button" onClick={cancelEdit}>Cancel</button>
                          <button className="pp-editor__save" type="button" onClick={saveEdit}>Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
          <p className="pp-tx-foot">
            💡 Add or remove items during your next health check-in. Dose &amp; frequency tracked here power adherence insights.
          </p>
        </div>
      )}
    </div>
  )
}

function Section({ section, profile, aiSources, onboardingSources, editingFieldId, onEdit, onSet }) {
  let total = section.fields.length
  let filled = 0
  for (const f of section.fields) {
    const v = profile?.[f.id]
    if (Array.isArray(v) ? v.length > 0 : (v != null && v !== '')) filled++
  }
  const isComplete = filled === total

  return (
    <div className="pp-section">
      <div className="pp-section__head">
        <div className="pp-section__title">
          <span className="pp-section__icon">{section.icon}</span>
          <span>{section.label}</span>
        </div>
        <span className={`pp-section__count${isComplete ? ' pp-section__count--complete' : ' pp-section__count--incomplete'}`}>
          {isComplete ? <>✓ Complete</> : <>{filled}/{total}</>}
        </span>
      </div>

      <div className="pp-fields">
        {section.fields.map(f => (
          <Field
            key={f.id}
            field={f}
            profile={profile}
            isAi={aiSources.has(f.id)}
            isOnboarding={onboardingSources.has(f.id)}
            editing={editingFieldId === f.id}
            onEdit={() => onEdit(f.id)}
            onSet={onSet}
          />
        ))}
      </div>
    </div>
  )
}

function Field({ field, profile, isAi, isOnboarding, editing, onEdit, onSet }) {
  const rawVal = profile?.[field.id]
  const has = Array.isArray(rawVal) ? rawVal.length > 0 : (rawVal != null && rawVal !== '')
  const displayVal = Array.isArray(rawVal) ? rawVal.join(', ') : (rawVal || '')
  // AI tag takes precedence if somehow both are set (shouldn't happen in practice)
  const tag = isAi && has
    ? <span className="pp-field__ai-tag">✨ From AI Insights</span>
    : (isOnboarding && has
        ? <span className="pp-field__onboarding-tag">From onboarding</span>
        : null)

  return (
    <div className={`pp-field${editing ? ' pp-field--editing' : ''}`}>
      <button
        className="pp-field__row"
        onClick={onEdit}
        type="button"
      >
        <div className="pp-field__main">
          <div className="pp-field__label">
            {field.label}
            {tag}
          </div>
          <div className={`pp-field__value${has ? '' : ' pp-field__value--empty'}`}>
            {has ? displayVal : 'Not added yet'}
          </div>
        </div>
        {has
          ? <span className="pp-field__edit">Edit</span>
          : <span className="pp-field__add">+ Add</span>
        }
      </button>

      {editing && (
        <FieldEditor
          field={field}
          value={rawVal}
          onSave={v => { onSet(field.id, v); onEdit() }}
          onCancel={onEdit}
        />
      )}
    </div>
  )
}

function FieldEditor({ field, value, onSave, onCancel }) {
  const [local, setLocal] = useState(() => {
    if (field.type === 'multiselect') return Array.isArray(value) ? [...value] : []
    return value ?? ''
  })
  const inputRef = useRef(null)
  useEffect(() => { if (field.type === 'text' && inputRef.current) inputRef.current.focus() }, [field.type])

  function toggleMulti(opt) {
    setLocal(arr => arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt])
  }

  return (
    <div className="pp-editor">
      {field.type === 'text' && (
        <input
          ref={inputRef}
          className="pp-editor__input"
          type="text"
          placeholder={field.placeholder || ''}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSave(local.trim()); if (e.key === 'Escape') onCancel() }}
        />
      )}

      {field.type === 'select' && (
        <div className="pp-editor__opts">
          {field.options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`pp-chip${local === opt ? ' pp-chip--sel' : ''}`}
              onClick={() => setLocal(opt)}
            >{opt}</button>
          ))}
        </div>
      )}

      {field.type === 'multiselect' && (
        <div className="pp-editor__opts">
          {field.options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`pp-chip${local.includes(opt) ? ' pp-chip--sel' : ''}`}
              onClick={() => toggleMulti(opt)}
            >{opt}</button>
          ))}
        </div>
      )}

      <div className="pp-editor__actions">
        <button className="pp-editor__cancel" type="button" onClick={onCancel}>Cancel</button>
        <button
          className="pp-editor__save"
          type="button"
          onClick={() => onSave(typeof local === 'string' ? local.trim() : local)}
          disabled={field.type === 'text' && !local.trim()}
        >Save</button>
      </div>
    </div>
  )
}
