import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR } from '../onboarding/recommendedHabits.js'
import { getPillarLabel } from '../../domain/pillars.js'
import './HabitChat.css'

let nextId = 1
function makeId() {
  return nextId++
}

// No real LLM wired up yet — same "mocked, keyword-triggered" approach as
// the AI chat in the earlier cardiometabolic-insights prototype. Scoped
// to this one habit: a few keyword buckets pull from the habit's own
// data (justification/tier/moment), with a generic-but-still-habit-named
// fallback for anything else.
function getMockReply(message, habit, catalogHabit) {
  const text = message.toLowerCase()

  if (/why|matter|work|point/.test(text)) {
    return catalogHabit.justification
      ? `Here's the short version: ${catalogHabit.justification}`
      : `"${habit.title}" is worth doing because it's a small, low-effort change that compounds over time.`
  }

  if (/how much|tier|harder|easier|level|difficult/.test(text)) {
    return habit.tier
      ? `Right now you're at "${habit.tier}." You can bump it up or down anytime from the Edit screen — there's no penalty for starting smaller.`
      : "You haven't set a level for this yet — head to the Edit screen to pick how much feels doable."
  }

  if (/when|time|moment|stack|schedule/.test(text)) {
    return habit.moment
      ? `You've got this stacked to "${habit.moment}." If that stopped fitting your day, it's easy to change from the Edit screen.`
      : "You haven't set a time or anchor for this yet — stacking it onto something you already do (like after a meal) tends to stick best."
  }

  if (/hard|stuck|struggl|motivat|forgot|missed|skip/.test(text)) {
    return `Missing a day doesn't undo the habit — that's normal. If "${habit.title}" keeps slipping, try lowering the tier or picking an easier moment to anchor it to, rather than pushing harder.`
  }

  if (/retire|quit|stop|give up/.test(text)) {
    return "If this one isn't working for you, that's useful information too — you can retire it from the detail screen and try something else without starting over."
  }

  return `I'm a mocked assistant for now — no real AI wired up yet — but I can talk through "${habit.title}": why it matters, how much to do, when to do it, or what to do if it's not sticking.`
}

// Full-screen chat scoped to a single habit — reached from HabitDetail's
// "Ask about this habit" link.
function HabitChat() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits } = useHabits()

  const habit = habits.find((h) => h.id === habitId)
  const catalogHabit = habit
    ? RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find((h) => h.id === habit.id)
    : null

  const [messages, setMessages] = useState(() => [
    {
      id: makeId(),
      role: 'assistant',
      text: habit
        ? `Ask me anything about "${habit.title}" — why it works, how to adjust it, or what to do if it's not sticking.`
        : 'Ask me anything about this habit.',
    },
  ])
  const [draft, setDraft] = useState('')

  if (!habit || !catalogHabit) {
    return (
      <main className="habit-chat">
        <p className="habit-chat__intro">This habit couldn’t be found.</p>
        <button type="button" className="habit-chat__back" onClick={() => navigate('/routine')}>
          <span aria-hidden="true">←</span> Back to Routine
        </button>
      </main>
    )
  }

  const handleSend = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return

    setDraft('')
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', text }])

    const reply = getMockReply(text, habit, catalogHabit)
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', text: reply }])
    }, 500)
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
        <p className="habit-chat__eyebrow">{getPillarLabel(habit.pillarId)}</p>
        <h1 className="habit-chat__title">{habit.title}</h1>
      </div>

      <div className="habit-chat__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`habit-chat__bubble habit-chat__bubble--${message.role}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form className="habit-chat__composer" onSubmit={handleSend}>
        <input
          type="text"
          className="habit-chat__input"
          placeholder={`Ask about "${habit.title}"…`}
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
