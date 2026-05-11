import React, { useState, useEffect, useRef } from 'react'
import './ProfilePage.css'   // reuse layout styles
import './SettingsPage.css'  // toggles + tweaks

/**
 * Generic settings page driven by config. Used for Account settings,
 * Notifications, and any future "list of fields" settings views.
 *
 * Props:
 *   title:       string, header
 *   storageKey:  localStorage key
 *   sections:    [{ id, label, icon, hint?, fields: [{id, label, type, options?, placeholder?, hint?}] }]
 *               type ∈ 'text' | 'select' | 'multiselect' | 'toggle' | 'action'
 *   onClose:     callback
 */
export default function SettingsPage({ title, storageKey, sections, onClose, onNavigate }) {
  const [data, setData] = useState(() => readStored(storageKey))
  const [editing, setEditing] = useState(null)
  // Track the timestamp of localStorage updates so cross-page contact reads stay fresh
  const [externalTick, setExternalTick] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Re-check contact status when the page (re)mounts — covers case where the user
  // came back from Account settings after adding email/phone.
  useEffect(() => { setExternalTick(t => t + 1) }, [])

  function setField(id, value) {
    setData(d => {
      const next = { ...d, [id]: value, updatedAt: new Date().toISOString() }
      writeStored(storageKey, next)
      return next
    })
  }

  function getContactStatus(req) {
    if (!req) return null
    const ext = readStored(req.storageKey)
    const v = ext?.[req.field]
    return {
      filled: typeof v === 'string' && v.trim().length > 0,
      value: v,
    }
  }

  return (
    <div className="pp-overlay" role="dialog" aria-label={title}>
      <div className="pp-screen">
        <div className="pp-header">
          <button className="pp-back" onClick={onClose} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="pp-header__title">{title}</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ height: 12 }} />

        {sections.map(sec => {
          const contact = getContactStatus(sec.requiresContact)
          return (
            <div className="pp-section" key={sec.id}>
              <div className="pp-section__head">
                <div className="pp-section__title">
                  <span className="pp-section__icon">{sec.icon}</span>
                  <span>{sec.label}</span>
                </div>
                {contact && (
                  <span className={`pp-section__count ${contact.filled ? 'pp-section__count--complete' : 'pp-section__count--incomplete'}`}>
                    {contact.filled ? <>✓ {sec.requiresContact.label} on file</> : <>Add {sec.requiresContact.label}</>}
                  </span>
                )}
              </div>
              {sec.hint && <p className="sp-section-hint">{sec.hint}</p>}
              {contact && !contact.filled && (
                <div className="sp-banner">
                  <span className="sp-banner__icon">⚠️</span>
                  <span className="sp-banner__body">
                    <strong>No {sec.requiresContact.label} on file.</strong> {' '}
                    These settings won't deliver until you add one.
                  </span>
                  {onNavigate && sec.requiresContact.navigateTo && (
                    <button
                      className="sp-banner__cta"
                      type="button"
                      onClick={() => onNavigate(sec.requiresContact.navigateTo)}
                    >Set up</button>
                  )}
                </div>
              )}
              <div className="pp-fields">
                {sec.fields.map(f => (
                  <SettingField
                    key={f.id}
                    field={f}
                    data={data}
                    editing={editing?.sectionId === sec.id && editing?.fieldId === f.id}
                    onEdit={() => setEditing(editing?.fieldId === f.id ? null : { sectionId: sec.id, fieldId: f.id })}
                    onSet={setField}
                    disabled={contact && !contact.filled}
                  />
                ))}
              </div>
            </div>
          )
        })}

        <div className="pp-footer">
          <button className="pp-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}

function SettingField({ field, data, editing, onEdit, onSet, disabled }) {
  // TOGGLE — render inline switch, no editor
  if (field.type === 'toggle') {
    const checked = !!data[field.id]
    return (
      <div className={`pp-field sp-field-toggle${disabled ? ' sp-field-toggle--disabled' : ''}`}>
        <div className="sp-field-toggle__row">
          <div className="pp-field__main">
            <div className="pp-field__label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, color: '#1A1A1A' }}>
              {field.label}
            </div>
            {field.hint && <div className="sp-field-hint">{field.hint}</div>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            className={`sp-toggle${checked ? ' sp-toggle--on' : ''}`}
            onClick={() => !disabled && onSet(field.id, !checked)}
            disabled={disabled}
          >
            <span className="sp-toggle__thumb" />
          </button>
        </div>
      </div>
    )
  }

  // ACTION — render as a button row that fires onAction
  if (field.type === 'action') {
    return (
      <div className="pp-field">
        <button className="pp-field__row" onClick={() => field.onAction && field.onAction()} type="button">
          <div className="pp-field__main">
            <div className="pp-field__label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, color: '#1A1A1A' }}>{field.label}</div>
            {field.hint && <div className="sp-field-hint">{field.hint}</div>}
          </div>
          <span className="pp-field__edit">{field.cta || 'Open'}</span>
        </button>
      </div>
    )
  }

  // TEXT / SELECT / MULTISELECT — same pattern as ProfilePage
  const rawVal = data[field.id]
  const has = Array.isArray(rawVal) ? rawVal.length > 0 : (rawVal != null && rawVal !== '')
  const displayVal = Array.isArray(rawVal) ? rawVal.join(', ') : (rawVal || '')

  return (
    <div className={`pp-field${editing ? ' pp-field--editing' : ''}`}>
      <button className="pp-field__row" onClick={onEdit} type="button">
        <div className="pp-field__main">
          <div className="pp-field__label">{field.label}</div>
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
          type={field.inputType || 'text'}
          placeholder={field.placeholder || ''}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSave(local.trim()); if (e.key === 'Escape') onCancel() }}
        />
      )}
      {field.type === 'select' && (
        <div className="pp-editor__opts">
          {field.options.map(opt => (
            <button key={opt} type="button"
              className={`pp-chip${local === opt ? ' pp-chip--sel' : ''}`}
              onClick={() => setLocal(opt)}
            >{opt}</button>
          ))}
        </div>
      )}
      {field.type === 'multiselect' && (
        <div className="pp-editor__opts">
          {field.options.map(opt => (
            <button key={opt} type="button"
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

function readStored(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : {} } catch (_) { return {} }
}
function writeStored(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch (_) {}
}

/* ───────────────── Section configs ───────────────── */

export const ACCOUNT_SECTIONS = [
  {
    id: 'login',
    label: 'Sign-in',
    icon: '🔐',
    fields: [
      { id: 'email',    label: 'Email',    type: 'text', inputType: 'email', placeholder: 'you@email.com' },
      { id: 'phone',    label: 'Phone',    type: 'text', inputType: 'tel',   placeholder: '+1 555 555 5555' },
      { id: 'password', label: 'Password', type: 'action', cta: 'Change', onAction: () => alert('Password change coming soon.') },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & data',
    icon: '🛡️',
    hint: 'Control how your data is used.',
    fields: [
      { id: 'data_share', label: 'Share anonymized data for research', type: 'toggle', hint: 'Helps improve eczema care for everyone. Can be turned off anytime.' },
      { id: 'marketing',  label: 'Marketing emails from partners',     type: 'toggle' },
    ],
  },
]

export const NOTIFICATION_SECTIONS = [
  {
    id: 'push',
    label: 'Push notifications',
    icon: '📱',
    hint: 'Reminders and updates pushed to your device.',
    fields: [
      { id: 'push_enabled',      label: 'Allow push notifications',      type: 'toggle' },
      { id: 'push_checkins',     label: 'Daily check-in reminders',      type: 'toggle' },
      { id: 'push_insights',     label: 'New insights for you',           type: 'toggle' },
      { id: 'push_appointments', label: 'Appointment reminders',          type: 'toggle' },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    icon: '✉️',
    requiresContact: { storageKey: 'skinsightsAccount', field: 'email', label: 'email', navigateTo: 'account' },
    fields: [
      { id: 'email_digest', label: 'Weekly skin summary',    type: 'toggle' },
      { id: 'email_tips',   label: 'Personalized tips',      type: 'toggle' },
      { id: 'email_news',   label: 'Product news & updates', type: 'toggle' },
    ],
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: '💬',
    requiresContact: { storageKey: 'skinsightsAccount', field: 'phone', label: 'phone', navigateTo: 'account' },
    fields: [
      { id: 'sms_reminders', label: 'Treatment reminders by text', type: 'toggle' },
    ],
  },
  {
    id: 'general',
    label: 'General',
    icon: '⏰',
    fields: [
      { id: 'frequency', label: 'How often to hear from us', type: 'select',
        options: ['Daily check-ins', 'A few times a week', 'Weekly digest', 'Only the essentials'] },
      { id: 'quiet_hours', label: 'Quiet hours', type: 'select',
        options: ['Off', '9 PM – 7 AM', '10 PM – 8 AM', '11 PM – 6 AM'] },
    ],
  },
]
