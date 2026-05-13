import React, { useState, useEffect, useRef } from 'react'
import MarkAsTried from './MarkAsTried'

const SUGGESTED = [
  'Why does my face burn after I wash it?',
  "I'm exhausted trying to figure out what makes my skin better or worse.",
  "What can I eat on the go that won't make my skin worse?",
  'What are the best tips you have for someone living with eczema?',
]

// Single-turn responses for the first two questions
const CANNED_RESPONSES = {
  'Why does my face burn after I wash it?':
    "When your face burns or stings after washing, that's often a sign your skin barrier is irritated. The most common culprits:\n\n• A cleanser with sulfates or fragrance\n• Water that's too hot or too cold\n• Towel-drying too aggressively\n• Waiting more than 3 minutes before moisturizing\n\nFor eczema-prone skin, swapping to a fragrance-free, sulfate-free cleanser and moisturizing within 3 minutes of washing can dramatically reduce that burning sensation. Want me to walk through what to look for in a cleanser?",
  "I'm exhausted trying to figure out what makes my skin better or worse.":
    "You're not alone — figuring out personal triggers is one of the hardest parts of eczema, and it's exhausting because the connections aren't obvious in the moment.\n\nWhat actually works:\n\n• Track a small set of things daily (skin score, sleep, stress, weather, products) — patterns emerge after 2–3 weeks, not 2–3 days\n• Don't try to track everything at once\n• Look for triggers that show up 24–48 hours later, not the same day\n\nYour daily check-in is doing this work in the background. After three weeks, you'll have data your derm can actually use. Would you like to see what patterns we've spotted so far?",
  "What can I eat on the go that won't make my skin worse?":
    "Eczema and food connections are real but very individual — what flares your skin may not flare someone else's. That said, a few generally low-risk, on-the-go picks:\n\nSolid bets:\n\n• Unsalted almonds or walnuts (omega-3s support the skin barrier)\n• Fresh fruit — berries, apples, oranges\n• Single-serve hummus with carrots or cucumber\n• A salmon or tuna pouch\n• Hard-boiled eggs, if you tolerate them\n\nWorth being cautious with:\n\n• Dairy and eggs — the most common adult-eczema food triggers in studies\n• Aged cheeses, kombucha, alcohol — high in histamine\n• Heavily processed snacks (sugar + seed oils tend to spike inflammation)\n\nOne pattern worth knowing: food-related flares tend to show up 24–48 hours later, not the same day. If you suspect something, log it and check your skin score two days out.\n\nWant me to set up a food-tracking field in your daily check-in?",
}

const DEFAULT_RESPONSE =
  "That's a great question. Based on what we know about eczema and stress, the connection between your skin and your nervous system is real and well-documented.\n\nI'd recommend checking in with your care team about this specifically. In the meantime, your daily check-in data can help you spot patterns over time.\n\nIs there anything more specific I can help you with?"

// Multi-turn scripted flow for "What are the best tips you have for someone living with eczema?"
const HELPS_FLOW = [
  // Turn 0 — initial AI response after Claire's question
  {
    text:
      "You're not alone in feeling that way.\n\nA lot of people with eczema realize it's less about finding one miracle product — and more about reducing irritation throughout daily life.\n\nWhat's bothering you most right now?",
    chips: [
      'Burning/stinging',
      'Itching',
      'Dryness/tightness',
      'Sleep disruption',
      'Stress/flare unpredictability',
    ],
  },
  // Turn 1 — after user picks what's bothering them
  {
    text:
      "That's really common when the skin barrier is irritated.\n\nA few things can quietly make it worse:\n• Harsh cleansing\n• Waiting too long to moisturize\n• Dry indoor air\n• Stressful nighttime routines\n\nWhat does your nighttime routine usually look like?",
  },
  // Turn 2 — after user describes routine
  {
    text:
      'That tells me a lot already.\n\nPeople with eczema often say they\'re "always aware of their skin" — especially at night.\n\nDo you usually shower at night too?',
    chips: ['Yes', 'No', 'Sometimes'],
  },
  // Turn 3 — after shower question, includes Real Simple recommended reading
  {
    text:
      'That post-shower window is actually one of the biggest moisture-loss moments for eczema-prone skin.',
    reading: {
      source: 'REAL SIMPLE',
      url: 'https://www.realsimple.com/',
      title: 'The Eczema Reset: Gentle Home Changes That Actually Help',
      quote: 'Keep creams or ointments immediately available after showering.',
      attribution: 'Heather Muir, Beauty Director, REAL SIMPLE',
    },
    followText:
      'A lot of people find it helps to create:\n• A "safe skincare" area\n• Bedside hydration products\n• Simpler nighttime routines\n\nWould you describe your bathroom as:',
    chips: ['Calm and organized', 'Functional but cluttered', 'Stressful/chaotic'],
  },
  // Turn 4 — after bathroom answer, includes The Spruce recommended reading
  {
    text:
      "That's more connected to eczema than it sounds.\n\nReducing visual clutter and routine friction can make nighttime care feel easier and less exhausting.",
    reading: {
      source: 'The Spruce',
      url: 'https://www.thespruce.com/',
      title: 'How to Create a Calming Bathroom Routine for Sensitive Skin',
      tipsLabel: 'Popular tips:',
      tips: [
        'Keep "safe" products visible',
        'Separate fragrance-heavy products',
        'Use softer towels',
        'Simplify the counter before bed',
      ],
    },
    followText: 'What tends to trigger your flares most?',
    chips: ['Stress', 'Weather', 'Fabrics', 'New products', 'Hard to tell'],
  },
  // Turn 5 — final summary with curated recommendations
  {
    text:
      "That pattern is extremely common.\n\nBased on what you've shared, your biggest opportunities may be:\n• Reducing nighttime irritation\n• Improving moisture retention after showers\n• Simplifying products\n• Supporting dry indoor air",
    recommendations: {
      label: 'Recommended For You',
      sources: [
        {
          source: 'REAL SIMPLE',
          url: 'https://www.realsimple.com/',
          articles: [
            'The Best Fabrics and Towels for Sensitive Skin',
            '7 Home Products People With Eczema Say Were Worth Buying',
            'How to Build a Low-Stress Night Routine',
          ],
        },
        {
          source: 'Better Homes & Gardens',
          url: 'https://www.bhg.com/',
          articles: ['Simple Ways to Reduce Dry Winter Air at Home'],
        },
      ],
    },
    autoNext: true,
  },
  // Turn 6 — auto-follow with next-step chips
  {
    text:
      'I can also help you:\n• Simplify your nighttime routine\n• Identify irritating products\n• Create an eczema-friendly home setup\n• Track flare patterns without obsessing over triggers\n\nWhat would help most right now?',
    chips: [
      'Simplify my routine',
      'Identify products',
      'Eczema-friendly home',
      'Track patterns',
    ],
  },
]

const FLOW_TRIGGER = 'What are the best tips you have for someone living with eczema?'

function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--ai chat-bubble--typing">
      <span /><span /><span />
    </div>
  )
}

function renderText(text) {
  return text.split('\n').map((line, i) =>
    line ? <p key={i}>{line}</p> : <br key={i} />
  )
}

function slug(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
}

function ReadingCard({ reading }) {
  return (
    <div className="chat-reading">
      <p className="chat-reading__label">
        Recommended Reading from{' '}
        <a href={reading.url} target="_blank" rel="noreferrer">{reading.source}</a>
      </p>
      <p className="chat-reading__title">&ldquo;{reading.title}&rdquo;</p>
      {reading.quote && (
        <blockquote className="chat-reading__quote">
          &ldquo;{reading.quote}&rdquo;
          <span>— {reading.attribution}</span>
        </blockquote>
      )}
      {reading.tips && (
        <>
          {reading.tipsLabel && (
            <p className="chat-reading__tips-label">{reading.tipsLabel}</p>
          )}
          <ul className="chat-reading__tips">
            {reading.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </>
      )}
      <div className="chat-reading__try-row">
        <MarkAsTried
          id={`ai-reading:${slug(reading.title)}`}
          title={reading.title}
          source={`AI Chat · ${reading.source}`}
        />
      </div>
    </div>
  )
}

function Recommendations({ data }) {
  return (
    <div className="chat-reco">
      <p className="chat-reco__label">{data.label}</p>
      {data.sources.map((src, i) => (
        <div key={i} className="chat-reco__group">
          <p className="chat-reco__src">
            From{' '}
            <a href={src.url} target="_blank" rel="noreferrer">{src.source}</a>
          </p>
          <ul className="chat-reco__list">
            {src.articles.map((a, j) => (
              <li key={j} className="chat-reco__item">
                <span>&ldquo;{a}&rdquo;</span>
                <MarkAsTried
                  id={`ai-reco:${slug(src.source)}:${slug(a)}`}
                  title={a}
                  source={`AI Chat · ${src.source}`}
                  variant="save"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ChatBubble({ msg, onChip }) {
  if (msg.role === 'user') {
    return (
      <div className="chat-bubble chat-bubble--user">
        {renderText(msg.text)}
      </div>
    )
  }
  return (
    <div className="chat-bubble chat-bubble--ai">
      {msg.text && renderText(msg.text)}
      {msg.reading && <ReadingCard reading={msg.reading} />}
      {msg.followText && renderText(msg.followText)}
      {msg.recommendations && <Recommendations data={msg.recommendations} />}
      {msg.chips && (
        <div className="chat-chips">
          {msg.chips.map((c, i) => (
            <button
              key={i}
              type="button"
              className="chat-chip"
              onClick={() => onChip(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AskAI() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [flowActive, setFlowActive] = useState(false)
  const [flowTurn, setFlowTurn] = useState(0) // index of NEXT flow turn to show
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef(null)

  function showAITurn(idx) {
    setTyping(true)
    setTimeout(() => {
      const turn = HELPS_FLOW[idx]
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', ...turn }])
      setFlowTurn(idx + 1)
      if (turn?.autoNext && HELPS_FLOW[idx + 1]) {
        setTimeout(() => showAITurn(idx + 1), 1400)
      }
    }, 1600)
  }

  function submit(q) {
    const text = (q ?? query).trim()
    if (!text) return
    setOpen(true)
    setQuery('')

    if (text === FLOW_TRIGGER) {
      // Start the multi-turn helps flow
      setMessages([{ role: 'user', text }])
      setFlowActive(true)
      setFlowTurn(0)
      showAITurn(0)
      return
    }

    // Single-turn for other suggested questions
    setMessages([{ role: 'user', text }])
    setFlowActive(false)
    setTyping(true)
    const response = CANNED_RESPONSES[text] || DEFAULT_RESPONSE
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 1600)
  }

  function handleUserSubmit(text) {
    const t = text.trim()
    if (!t) return
    setMessages(prev => [...prev, { role: 'user', text: t }])

    if (flowActive && flowTurn < HELPS_FLOW.length) {
      showAITurn(flowTurn)
    } else {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(prev => [...prev, { role: 'ai', text: DEFAULT_RESPONSE }])
      }, 1600)
    }
  }

  function sendFollowUp() {
    handleUserSubmit(followUp)
    setFollowUp('')
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
              placeholder="✨ Hi! Ask me anything…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            <button className="ask-ai__submit" aria-label="Send" onClick={() => submit()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          {showSuggestions && (
            <>
              <p className="ask-ai__label">Here's what people like you ask</p>
              <ul className="ask-ai__suggestions">
                {SUGGESTED.map((q, i) => (
                  <li
                    key={i}
                    className="ask-ai__suggestion"
                    onMouseDown={e => { e.preventDefault(); submit(q) }}
                  >
                    <span className="ask-ai__arrow">→</span>
                    {q}
                  </li>
                ))}
              </ul>
            </>
          )}
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
              Skinsights360 AI
            </div>
            <div style={{ width: 36 }} />
          </div>

          <div className="chat-overlay__messages">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} onChip={handleUserSubmit} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <div className="chat-overlay__input-wrap">
            <div className="chat-overlay__input-row">
              <input
                className="chat-overlay__input"
                type="text"
                placeholder="✨ Type something..."
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
