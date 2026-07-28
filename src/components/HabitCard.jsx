import React, { useRef } from 'react'
import './HabitCard.css'

// One habit card for every state. See docs/habit-card-states.md.
//
//   state: 'unadopted' | 'trial' | 'adopted'
//   size:  'tall' (onboarding hero) | 'wide' (Routine list, 16/11)
//
// Content props are deliberately primitive so both callers can map their own
// shapes onto them — onboarding passes a habit-suggestion card, the Routine
// list passes a stored habit.

const BellIcon  = <i className="fa-solid fa-bell" aria-hidden="true" />
const StepsIcon = <i className="fa-solid fa-shoe-prints" aria-hidden="true" />

export default function HabitCard({
  state,
  size = 'tall',
  photo,
  gradient,
  brand,            // brand pill — hidden while unadopted
  kicker,           // pillar / "Moving · card 1 of 3"
  eyebrow,          // adopted: "Day 3 of 7" / "2 weeks strong" / "Done today"
  eyebrowDone = false,
  title,
  titleEm,          // optional emphasised tail of the title
  subtitle,
  tier,             // difficulty, e.g. 'T1'
  daysDone,         // count of days completed
  reminder = false, // reminder set -> bell chip
  tracker = null,   // { label } when a tracker is connected -> steps chip
  why,              // "Why this works" body
  whyOpen = false,
  onToggleWhy,
  source,
  article,
  onReadArticle,
  dots = 0,         // pager length
  dotIndex = 0,
  onSelectIndex,    // (i) => void — dots + swipe both call this
  onClick,
  ariaLabel,
}) {
  const adopted = state === 'trial' || state === 'adopted'
  const Tag = onClick ? 'button' : 'div'

  // Swipe left/right through the pager. Horizontal only — we never
  // preventDefault, so the page keeps scrolling vertically.
  const swipeable = !!onSelectIndex && dots > 1 && !whyOpen
  const startX = useRef(null)
  const SWIPE_MIN = 40
  function step(delta) {
    onSelectIndex((dotIndex + delta + dots) % dots)
  }
  const swipeHandlers = swipeable ? {
    onPointerDown: e => { startX.current = e.clientX },
    onPointerUp: e => {
      if (startX.current == null) return
      const dx = e.clientX - startX.current
      startX.current = null
      if (Math.abs(dx) < SWIPE_MIN) return
      step(dx < 0 ? 1 : -1)
    },
    onPointerCancel: () => { startX.current = null },
  } : {}

  return (
    <>
    <Tag
      className={`hcard hcard--${state} hcard--${size}`}
      style={gradient ? { background: gradient } : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      type={Tag === 'button' ? 'button' : undefined}
      {...swipeHandlers}
    >
      {photo && (
        <img
          className="hcard__photo" src={photo} alt="" draggable="false"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      )}
      {gradient && <div className="hcard__duotone" style={{ background: gradient }} />}
      <div className="hcard__veil" />

      <div className="hcard__top">
        <div className="hcard__topleft">
          {brand && <span className="hcard__flag">{brand}</span>}
          {kicker && <span className="hcard__kicker">{kicker}</span>}
        </div>
        {adopted && (reminder || tracker) && (
          <div className="hcard__ind">
            {reminder && (
              <span className="hcard__ind-chip" title="Reminder set" aria-label="Reminder set">{BellIcon}</span>
            )}
            {tracker && (
              <span className="hcard__ind-chip on" title={`${tracker.label} connected`} aria-label={`${tracker.label} connected`}>
                {StepsIcon}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="hcard__foot">
        {eyebrow && <span className={`hcard__eyebrow${eyebrowDone ? ' done' : ''}`}>{eyebrow}</span>}
        {title && <h1 className="hcard__hed">{title}{titleEm && <> <em>{titleEm}</em></>}</h1>}
        {subtitle && <p className="hcard__dek">{subtitle}</p>}

        {adopted && (tier || daysDone != null) && (
          <p className="hcard__meta">
            {tier && <span className="hcard__tier">{tier}</span>}
            {daysDone != null && <span>{daysDone} day{daysDone === 1 ? '' : 's'} done</span>}
          </p>
        )}

        {why && onToggleWhy && (
          <button
            className="hcard__whylink"
            aria-expanded={whyOpen}
            onClick={e => { e.stopPropagation(); onToggleWhy() }}
          >
            Why this works
          </button>
        )}
      </div>

      {/* Why this works — drawer, pulls up from the bottom of the card */}
      {why && onToggleWhy && whyOpen && (
        <div
          className="hcard__drawer"
          onClick={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onPointerUp={e => e.stopPropagation()}
        >
          {/* The handle is the dismiss control — tap it to push the drawer down */}
          <button
            className="hcard__drawer-grab"
            onClick={e => { e.stopPropagation(); onToggleWhy() }}
            aria-label="Close why this works"
          >
            <span className="hcard__drawer-handle" />
          </button>
          <p className="hcard__drawer-label">Why this works</p>
          <p className="hcard__whytext">{why}</p>
          {article && (onReadArticle
            ? <button className="hcard__read" onClick={e => { e.stopPropagation(); onReadArticle() }}>
                <span className="hcard__readtxt">{source}: {article}</span>
                <span className="hcard__go">Read →</span>
              </button>
            : <p className="hcard__cite">{source}: {article}</p>)}
        </div>
      )}
    </Tag>
    {dots > 1 && (
      <div className="hcard__dots">
        {Array.from({ length: dots }, (_, i) => (
          onSelectIndex ? (
            <button
              key={i}
              className="hcard__dot-btn"
              onClick={() => onSelectIndex(i)}
              aria-label={`Show card ${i + 1} of ${dots}`}
              aria-current={i === dotIndex ? 'true' : undefined}
            >
              <span className={`hcard__dot${i === dotIndex ? ' on' : ''}`} />
            </button>
          ) : (
            <span key={i} className={`hcard__dot${i === dotIndex ? ' on' : ''}`} />
          )
        ))}
      </div>
    )}
    </>
  )
}
