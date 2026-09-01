import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useFavorites } from '../../content/FavoritesContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from '../onboarding/recommendedHabits.js'
import BrandLogo from '../../components/BrandLogo.jsx'
import './HabitChat.css'

let nextId = 1
function makeId() {
  return nextId++
}

// No real LLM wired up yet — same "mocked, keyword-triggered" approach as
// the AI chat in the earlier cardiometabolic-insights prototype. Scoped
// to this one habit: a few keyword buckets pull from the habit's own
// data (justification/tier/moment), with a generic-but-still-habit-named
// fallback for anything else. Some replies carry a `card` (an embedded
// content recommendation with Read/Save actions) and/or `suggestions`
// (quick-reply chips) — see getMockReply's return shape.
function getMockReply(message, habit, catalogHabit, gradient) {
  const text = message.toLowerCase()

  // Scoped to the daily walk specifically — weather/indoor avoidance
  // doesn't generalize to every habit the way the buckets below do, so
  // this only fires for walk-after-meal rather than joining the generic
  // chain. Checked before the generic "hard|stuck|struggl..." bucket so a
  // rainy-day excuse doesn't get the generic "missing a day is normal"
  // reply instead of this more specific, actionable one.
  if (
    habit.id === 'walk-after-meal' &&
    /rain|raining|rainy|storm|snow|cold outside|too hot|don'?t want to walk|can'?t walk|indoor|inside/.test(text)
  ) {
    return {
      text: `Weather doesn't have to bench the habit — there are plenty of ways to get simple movement in even while indoors. A few short routes to walk through your living room still count.`,
      links: [
        {
          title: '6 Best Ways to Incorporate an Indoor Walking Workout to Your Routine',
          url: 'https://www.verywellhealth.com/indoor-walking-workout-8729016',
        },
        {
          title: 'How to Create the Ultimate Beginner Walking Workout Plan',
          url: 'https://www.verywellhealth.com/walking-workout-8724153',
        },
      ],
    }
  }

  if (/second|another|more habit|add.*habit|slot/.test(text)) {
    return {
      text: `You could — but I'd hold. Two new routines is a lot to remember, and this one's still new. Give "${habit.title}" a couple more weeks to get boring. Boring means it's yours — then we'll open the next slot.`,
      card: {
        id: `coach-hold-${habit.id}`,
        brand: 'Real Simple',
        title: 'Why one habit at a time actually goes faster',
        thumbnail: gradient,
      },
      suggestions: ['Show me how'],
    }
  }

  if (/show me how/.test(text)) {
    return {
      text: `Keep it simple: same time, same cue, every day this week. Don't touch anything else about your routine until this one stops feeling like a decision.`,
    }
  }

  if (/why|matter|work|point/.test(text)) {
    return {
      text: catalogHabit.justification
        ? `Here's the short version: ${catalogHabit.justification}`
        : `"${habit.title}" is worth doing because it's a small, low-effort change that compounds over time.`,
    }
  }

  if (/how much|tier|harder|easier|level|difficult/.test(text)) {
    return {
      text: habit.tier
        ? `Right now you're at "${habit.tier}." You can bump it up or down anytime from the Edit screen — there's no penalty for starting smaller.`
        : "You haven't set a level for this yet — head to the Edit screen to pick how much feels doable.",
    }
  }

  if (/when|time|moment|stack|schedule/.test(text)) {
    return {
      text: habit.moment
        ? `You've got this stacked to "${habit.moment}." If that stopped fitting your day, it's easy to change from the Edit screen.`
        : "You haven't set a time or anchor for this yet — stacking it onto something you already do (like after a meal) tends to stick best.",
    }
  }

  if (/hard|stuck|struggl|motivat|forgot|missed|skip/.test(text)) {
    return {
      text: `Missing a day doesn't undo the habit — that's normal. If "${habit.title}" keeps slipping, try lowering the tier or picking an easier moment to anchor it to, rather than pushing harder.`,
    }
  }

  if (/retire|quit|stop|give up/.test(text)) {
    return {
      text: "If this one isn't working for you, that's useful information too — you can retire it from the detail screen and try something else without starting over.",
    }
  }

  return {
    text: `I'm a mocked coach for now — no real AI wired up yet — but I can talk through "${habit.title}": why it matters, how much to do, when to do it, or whether it's time to add another one.`,
  }
}

function ChatCard({ card }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(card.id)

  return (
    <div className="habit-chat__card">
      <div className="habit-chat__card-thumb" style={{ backgroundImage: card.thumbnail }} />
      <div className="habit-chat__card-body">
        <BrandLogo brand={card.brand} className="habit-chat__card-brand" />
        <span className="habit-chat__card-title">{card.title}</span>
        <div className="habit-chat__card-actions">
          <Link to="/read" className="habit-chat__card-action">
            View in Learn
          </Link>
          <button
            type="button"
            className="habit-chat__card-action"
            onClick={() => toggleFavorite(card)}
          >
            {saved ? 'Saved to Learn' : 'Save to Learn'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Full-screen chat scoped to a single habit — reached from HabitDetail's
// "Ask about this habit" link. Framed as a "Coach" rather than generic AI,
// matching the richer coach chat surfaced in later product mockups:
// replies can carry an embedded content card and quick-reply chips.
function HabitChat() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { habits } = useHabits()

  const habit = habits.find((h) => h.id === habitId)
  const catalogHabit = habit
    ? RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find((h) => h.id === habit.id)
    : null
  const gradient = habit ? getHabitVisual(habit.pillarId, habit.id) : null

  const [messages, setMessages] = useState(() => [
    {
      id: makeId(),
      role: 'assistant',
      text: habit
        ? `Ask me anything about "${habit.title}" — why it works, how to adjust it, or whether it's time to add another one.`
        : 'Ask me anything about this habit.',
    },
  ])
  const [draft, setDraft] = useState('')

  const sendMessage = (text) => {
    if (!text.trim()) return
    setDraft('')
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', text }])

    const reply = getMockReply(text, habit, catalogHabit, gradient)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', ...reply }])
    }, 500)
  }

  const handleSend = (e) => {
    e.preventDefault()
    sendMessage(draft)
  }

  // HabitDetail's own composer hands off whatever was typed there via
  // navigation state instead of just linking over to a blank chat — send it
  // as the first user turn on arrival. Guarded with a ref (not state) so
  // this fires exactly once even though sendMessage/habit are recreated
  // every render, and cleared from history state after so refreshing or
  // coming back later doesn't resend it.
  const sentInitialMessage = useRef(false)
  useEffect(() => {
    const initialMessage = location.state?.initialMessage
    if (!initialMessage || sentInitialMessage.current || !habit || !catalogHabit) return
    sentInitialMessage.current = true
    sendMessage(initialMessage)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location, habit, catalogHabit, navigate])

  if (!habit || !catalogHabit) {
    return (
      <main className="habit-chat">
        <p className="habit-chat__intro">This habit couldn’t be found.</p>
        <button type="button" className="habit-chat__back" onClick={() => navigate('/routine')}>
          <span aria-hidden="true">←</span> Back to Today
        </button>
      </main>
    )
  }

  return (
    <main className="habit-chat">
      <div className="habit-chat__header">
        <button
          type="button"
          className="habit-chat__close"
          onClick={() => navigate(`/habit/${habit.id}`)}
          aria-label="Close chat"
        >
          ×
        </button>
        <p className="habit-chat__eyebrow">Coach · About this habit</p>
        <h1 className="habit-chat__title">{habit.title}</h1>
      </div>

      <div className="habit-chat__messages">
        {messages.map((message) => (
          <div key={message.id} className="habit-chat__message-group">
            <div
              className={`habit-chat__bubble habit-chat__bubble--${message.role}`}
            >
              {message.text}
            </div>

            {message.card && <ChatCard card={message.card} />}

            {message.links && (
              <div className="habit-chat__links">
                {message.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="habit-chat__link"
                  >
                    {link.title} ↗
                  </a>
                ))}
              </div>
            )}

            {message.suggestions && (
              <div className="habit-chat__suggestions">
                {message.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="habit-chat__suggestion"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form className="habit-chat__composer" onSubmit={handleSend}>
        <input
          type="text"
          className="habit-chat__input"
          placeholder="Ask about this habit…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="habit-chat__send" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </main>
  )
}

export default HabitChat
