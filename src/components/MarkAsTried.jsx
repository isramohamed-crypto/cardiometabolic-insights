import React from 'react'
import { useSavedItems } from '../context/SavedItemsContext'

/**
 * Subtle right-aligned affordance for recommendation surfaces.
 * Reads/writes a shared store (SavedItemsContext) so state is consistent
 * across the app and persists across refreshes via localStorage.
 *
 *   variant="try"      (default) — actionable tips you can actually do
 *   variant="save"               — articles / videos to keep for later
 *   variant="helpful"            — mindset / philosophy / quotes
 *
 * Required:
 *   id     — unique string across the app (e.g. "quick-wins:towels")
 *   title  — user-readable label saved into the store
 *
 * Optional:
 *   source     — string surfaced in the saved-items list (e.g. "Quick wins")
 *   className  — extra classes (e.g. "try-btn--overlay" for over-image use)
 *
 * If id is missing the button still toggles visually but nothing is stored.
 */
const LABELS = {
  try:     { default: '+ Mark as tried',       tried: '✓ Tried' },
  save:    { default: '+ Save',                tried: '✓ Saved' },
  helpful: { default: '♡ Found this helpful',  tried: '♥ Found this helpful' },
}

export default function MarkAsTried({
  id,
  title = '',
  source = '',
  variant = 'try',
  className = '',
}) {
  const { isMarked, toggle } = useSavedItems()
  const marked = id ? isMarked(id) : false
  const label = LABELS[variant] || LABELS.try

  function handleClick(e) {
    e.stopPropagation()
    if (!id) return
    toggle({ id, title, source, variant })
  }

  return (
    <button
      type="button"
      className={`try-btn try-btn--${variant}${marked ? ' try-btn--tried' : ''}${className ? ' ' + className : ''}`}
      onClick={handleClick}
      aria-pressed={marked}
    >
      {marked ? label.tried : label.default}
    </button>
  )
}
