import { useRef } from 'react'
import Pill from '../../components/Pill.jsx'
import './HabitPickCard.css'

const SWIPE_THRESHOLD = 50

/**
 * Swipeable habit recommendation card. Adapted from Figma node 1185:4175
 * ("Habit: Pick Carousel"). The outer phone-bezel/status-bar chrome from
 * that mock isn't reproduced — this renders as the actual card in the page,
 * not a simulated device screen.
 *
 * `habit.image` is currently always a CSS gradient placeholder (see
 * recommendedHabits.js) standing in for a real background photo.
 *
 * Tier isn't chosen here — a habit starts at its suggested tier
 * automatically (see Recommendations.jsx), and can be changed afterward
 * from the habit's own page (/habit/:habitId) once it's actually in the
 * user's routine.
 */
function HabitPickCard({
  habit,
  categoryLabel,
  gradient,
  index,
  total,
  onNext,
  onPrev,
  onSelect,
  onAdd,
  onWhyThisOne,
}) {
  const touchStartX = useRef(null)

  const handlePointerDown = (e) => {
    touchStartX.current = e.clientX ?? e.touches?.[0]?.clientX
  }

  const handlePointerUp = (e) => {
    if (touchStartX.current == null) return
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX
    const delta = endX - touchStartX.current
    if (delta <= -SWIPE_THRESHOLD) onNext()
    else if (delta >= SWIPE_THRESHOLD) onPrev()
    touchStartX.current = null
  }

  return (
    <div className="habit-card-wrap">
      <Pill label={categoryLabel} />

      <div
        className="habit-card"
        style={{ backgroundImage: gradient }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="habit-card__scrim" />

        <div className="habit-card__content">
          <h3 className="habit-card__title">{habit.title}</h3>

          <p className="habit-card__subtitle">{habit.subtitle}</p>

          <button type="button" className="habit-card__why" onClick={onWhyThisOne}>
            Why this one?
          </button>

          <button type="button" className="habit-card__add" onClick={onAdd}>
            Add this habit
          </button>
        </div>
      </div>

      <button type="button" className="habit-card__another" onClick={onNext}>
        Show me another
      </button>

      <div className="habit-card__dots" role="tablist" aria-label="Habit options">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show habit ${i + 1} of ${total}`}
            className={`habit-card__dot${i === index ? ' habit-card__dot--active' : ''}`}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default HabitPickCard
