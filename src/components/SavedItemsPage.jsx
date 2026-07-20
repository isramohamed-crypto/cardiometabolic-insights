import React, { useEffect } from 'react'
import { useSavedItems } from '../context/SavedItemsContext'
import './SavedItemsPage.css'

const VARIANT_META = {
  try:     { label: 'Tried',           dot: '✓' },
  save:    { label: 'Saved',           dot: '✓' },
  helpful: { label: 'Found helpful',   dot: '♥' },
}

function timeAgo(ts) {
  const ms = Date.now() - ts
  const m = Math.floor(ms / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

export default function SavedItemsPage({ onClose }) {
  const { items, remove } = useSavedItems()

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Newest first
  const sorted = [...items].sort((a, b) => b.markedAt - a.markedAt)

  return (
    <div className="si-overlay" role="dialog" aria-label="Saved items">
      <header className="si-header">
        <button className="si-back" onClick={onClose} aria-label="Close">←</button>
        <div className="si-header__title">Saved items</div>
        <div style={{ width: 36 }} />
      </header>

      <main className="si-main">
        {sorted.length === 0 ? (
          <div className="si-empty">
            <div className="si-empty__icon" aria-hidden>🔖</div>
            <h2 className="si-empty__title">Nothing here yet</h2>
            <p className="si-empty__body">
              Tap <strong>Mark as tried</strong>, <strong>Save</strong>, or <strong>Found this helpful</strong> on any tip,
              article, or video to keep it here. You can come back any time to remind yourself what you wanted to try.
            </p>
          </div>
        ) : (
          <>
            <p className="si-count">{sorted.length} item{sorted.length === 1 ? '' : 's'}</p>
            <ul className="si-list">
              {sorted.map(item => {
                const meta = VARIANT_META[item.variant] || VARIANT_META.try
                return (
                  <li key={item.id} className={`si-item si-item--${item.variant}`}>
                    <div className="si-item__body">
                      <span className={`si-chip si-chip--${item.variant}`}>
                        <span aria-hidden>{meta.dot}</span> {meta.label}
                      </span>
                      <p className="si-item__title">{item.title}</p>
                      <p className="si-item__meta">
                        {item.source && <span>{item.source}</span>}
                        {item.source && <span className="si-item__dot">·</span>}
                        <span>{timeAgo(item.markedAt)}</span>
                      </p>
                    </div>
                    <button
                      className="si-item__remove"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove "${item.title}"`}
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
