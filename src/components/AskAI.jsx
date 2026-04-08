import React, { useState, useEffect, useRef } from 'react'

const SUGGESTED = [
  "Why is my skin worse when I'm stressed?",
  'What should I do before my next appointment?',
  'Is a biologic right for me?',
  'How do I track a flare?',
]

const CANNED_RESPONSES = {
  "Why is my skin worse when I'm stressed?": "When you're stressed, your body releases cortisol — a hormone that directly weakens your skin's lipid barrier. This makes it easier for irritants to get in and moisture to escape.\n\nThe tricky part: the flare often shows up 24–48 hours after the stress event, so the connection isn't always obvious.\n\nThe good news is that stress management is actually skin management. Even small interventions like the 3-minute breathing exercise can measurably reduce cortisol levels.",
  'What should I do before my next appointment?': "Great question. A few things that will make your appointment much more productive:\n\n→ Log your skin score daily this week so you have a trend to share\n→ Note your top 2–3 triggers from the past month\n→ Write down any medications or topicals you've tried and how they worked\n→ If you've been tracking with Oura, bring your HRV and sleep data\n\nWould you like me to help you put together a summary to share with your doctor?",
  'Is a biologic right for me?': "Biologics like Dupixent (dupilumab) are now considered a first-line treatment for moderate-to-severe eczema that hasn't responded well to topicals.\n\nYou may be a good candidate if:\n→ Topical steroids aren't controlling your symptoms\n→ Your eczema significantly impacts your sleep or daily life\n→ You've had recurring flares over the past 6 months\n\nThe best next step is a conversation with a dermatologist. Your check-in data and flare history in this app can help make that case. Want help preparing for that conversation?",
  'How do I track a flare?': "Tracking flares well makes a huge difference — both for understanding your triggers and for conversations with your care team.\n\nHere's what to log during a flare:\n→ Severity (mild / moderate / severe)\n→ Location on body\n→ What you think triggered it\n→ Sleep quality the night before\n→ Stress level in the 48 hours before\n\nYour daily check-in captures most of this automatically. Tap 'How are you feeling?' below to log today's score.",
}

const DEFAULT_RESPONSE = "That's a great question. Based on what we know about eczema and stress, the connection between your skin and your nervous system is real and well-documented.\n\nI'd recommend checking in with your care team about this specifically. In the meantime, your daily check-in data can help you spot patterns over time.\n\nIs there anything more specific I can help you with?"

function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--ai chat-bubble--typing">
      <span /><span /><span />
    </div>
  )
}

export default function AskAI() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const bottomRef = useRef(null)

  function submit(q) {
    const text = q || query
    if (!text.trim()) return
    setOpen(true)
    setMessages([{ role: 'user', text }])
    setQuery('')
    setTyping(true)
    const response = CANNED_RESPONSES[text] || DEFAULT_RESPONSE
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 1800)
  }

  function sendFollowUp() {
    if (!followUp.trim()) return
    const text = followUp
    setFollowUp('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: DEFAULT_RESPONSE }])
    }, 1800)
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typing])

  return (
    <>
      <div className="ask-ai">
        <div className="ask-ai__inner">
          <div className="ask-ai__input-row">
            <input
              className="ask-ai__input"
              type="text"
              placeholder="Hi! Ask me anything…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            <button className="ask-ai__submit" aria-label="Send" onClick={() => submit()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <p className="ask-ai__label">Common questions</p>
          <ul className="ask-ai__suggestions">
            {SUGGESTED.map((q, i) => (
              <li key={i} className="ask-ai__suggestion" onClick={() => submit(q)}>
                <span className="ask-ai__arrow">→</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {open && (
        <div className="chat-overlay">
          <div className="chat-overlay__header">
            <button className="chat-overlay__back" onClick={() => setOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <div className="chat-overlay__title">
              <span className="chat-overlay__dot" />
              Eczema360 AI
            </div>
            <div style={{ width: 36 }} />
          </div>

          <div className="chat-overlay__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                {msg.text.split('\n').map((line, j) => (
                  line ? <p key={j}>{line}</p> : <br key={j} />
                ))}
              </div>
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <div className="chat-overlay__input-wrap">
            <div className="chat-overlay__input-row">
              <input
                className="chat-overlay__input"
                type="text"
                placeholder="Type something..."
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendFollowUp()}
              />
              <button className="ask-ai__submit" onClick={sendFollowUp}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <p className="chat-overlay__disclaimer">AI responses are for informational purposes only. Always consult your care team.</p>
          </div>
        </div>
      )}
    </>
  )
}
