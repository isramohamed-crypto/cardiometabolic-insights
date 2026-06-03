import React, { useState, useEffect, useRef } from 'react'
import MarkAsTried from './MarkAsTried'

const SUGGESTED = [
  'What do my cholesterol numbers actually mean?',
  "I'm overwhelmed trying to change my diet and lifestyle at the same time.",
  "What can I eat on the go that's good for my cholesterol?",
  'What are the best tips you have for someone managing high cholesterol?',
]

// Single-turn responses for the first three questions
const CANNED_RESPONSES = {
  'What do my cholesterol numbers actually mean?':
    "Cholesterol results can feel like alphabet soup, but here's what matters most:\n\n• LDL (\"bad\" cholesterol) — ideally below 100 mg/dL. This is the number most linked to heart disease risk.\n• HDL (\"good\" cholesterol) — ideally above 60 mg/dL. Higher is better; it helps clear LDL from your arteries.\n• Triglycerides — ideally below 150 mg/dL. Elevated levels are often tied to diet, alcohol, and activity.\n• Total cholesterol — less useful on its own. The ratio of LDL to HDL matters more.\n\nOne number alone rarely tells the full story. Your doctor will look at your full lipid panel alongside other risk factors — age, blood pressure, family history, diabetes — to assess your overall cardiovascular risk.\n\nWant me to explain what moves these numbers up or down?",
  "I'm overwhelmed trying to change my diet and lifestyle at the same time.":
    "That overwhelm is real — and it's one of the most common things people with high cholesterol describe.\n\nThe research actually supports a simpler approach:\n\n• Pick one change at a time. Stacking too many at once leads to burnout, not results.\n• Diet changes tend to move the needle faster than exercise alone for LDL.\n• Small, consistent shifts — like swapping one meal per day — compound over months.\n• Stress and sleep both affect cholesterol too, so managing overwhelm is genuinely part of the plan.\n\nYour daily check-in is tracking these patterns in the background. After a few weeks, you'll start to see what's actually making a difference.\n\nWould it help to focus on just one area first?",
  "What can I eat on the go that's good for my cholesterol?":
    "Good news — heart-healthy eating on the go is more doable than it sounds. A few solid options:\n\nGood bets:\n\n• A small handful of unsalted walnuts or almonds (omega-3s help raise HDL)\n• Fresh fruit — apples, berries, oranges (soluble fiber lowers LDL)\n• Single-serve hummus with carrots or cucumber\n• A salmon or tuna pouch (omega-3s, high protein)\n• Oat-based snack bars with minimal added sugar\n\nWorth limiting:\n\n• Anything with partially hydrogenated oils (trans fats raise LDL and lower HDL)\n• High-sodium processed snacks (linked to blood pressure, a compounding risk)\n• Sweetened drinks — excess sugar raises triglycerides\n\nThe pattern that matters most: replacing saturated fat with unsaturated fat consistently over weeks, not perfecting every meal.\n\nWant me to suggest some simple meal swaps for the week?",
}

const DEFAULT_RESPONSE =
  "That's a thoughtful question. Managing cardiometabolic health involves a lot of moving parts — diet, activity, stress, medications, and regular monitoring all play a role.\n\nI'd recommend discussing this specifically with your care team. In the meantime, your daily check-in data can help you track patterns and bring clearer information to your next appointment.\n\nIs there something more specific I can help you with?"

// Multi-turn scripted flow for managing high cholesterol
const HELPS_FLOW = [
  // Turn 0 — initial AI response
  {
    text:
      "You're not alone in asking that.\n\nFor most people, managing high cholesterol isn't one big change — it's a series of smaller adjustments that add up over time.\n\nWhat feels hardest for you right now?",
    chips: [
      'Changing my diet',
      'Staying consistent with exercise',
      'Understanding my medications',
      'Knowing what to track',
      'Talking to my doctor',
    ],
  },
  // Turn 1 — after user picks what's hardest
  {
    text:
      "That's one of the most common friction points.\n\nA few things that quietly get in the way:\n• Not knowing which foods matter most\n• All-or-nothing thinking about \"healthy eating\"\n• Conflicting information online\n• Busy schedules making meal planning hard\n\nWhat does a typical day of eating look like for you?",
  },
  // Turn 2 — after user describes eating
  {
    text:
      "That's helpful context.\n\nPeople managing cholesterol often find the biggest wins come from a few targeted swaps — not a total diet overhaul.\n\nDo you usually cook at home or eat out most days?",
    chips: ['Mostly cook at home', 'Mix of both', 'Mostly eat out'],
  },
  // Turn 3 — after cooking question, includes Health.com recommended reading
  {
    text:
      "That context really shapes what's practical for you.",
    reading: {
      source: 'HEALTH.COM',
      url: 'https://www.health.com/',
      title: 'The Best Foods to Lower Cholesterol, According to Dietitians',
      quote: 'Soluble fiber from oats, beans, and fruit can lower LDL by binding cholesterol in the digestive tract before it enters your bloodstream.',
      attribution: 'Sarah Koszyk, RDN, HEALTH.COM',
    },
    followText:
      'A few changes that consistently move the needle:\n• Replace saturated fats (butter, red meat) with unsaturated fats (olive oil, avocado)\n• Add soluble fiber daily — oats, beans, flaxseed\n• Reduce processed and fried foods\n\nHow would you describe your current activity level?',
    chips: ['Mostly sedentary', 'Some light activity', 'Moderately active', 'Very active'],
  },
  // Turn 4 — after activity answer, includes Health.com recommended reading
  {
    text:
      "Exercise has a direct effect on HDL — the \"good\" cholesterol.\n\nEven moderate activity 5 days a week can meaningfully improve your lipid profile over 3–6 months.",
    reading: {
      source: 'HEALTH.COM',
      url: 'https://www.health.com/',
      title: 'How Exercise Affects Your Cholesterol Levels',
      tipsLabel: 'Most effective activities:',
      tips: [
        '30-minute brisk walks, 5x per week',
        'Swimming or cycling (low joint impact)',
        'Resistance training 2x per week',
        'Breaking up long periods of sitting',
      ],
    },
    followText: 'What feels like the biggest barrier to being more active?',
    chips: ['No time', 'Low energy', 'Joint pain or health limits', 'Not sure where to start'],
  },
  // Turn 5 — final summary with curated recommendations
  {
    text:
      "That's really common, and it's worth acknowledging.\n\nBased on what you've shared, your biggest opportunities may be:\n• Small, consistent dietary swaps (not a full overhaul)\n• Adding 20–30 minutes of movement most days\n• Tracking patterns to see what's actually working\n• Preparing clear questions before your next cardiology or GP visit",
    recommendations: {
      label: 'Recommended For You',
      sources: [
        {
          source: 'HEALTH.COM',
          url: 'https://www.health.com/',
          articles: [
            'The 10 Best Foods to Lower Cholesterol Naturally',
            'How to Talk to Your Doctor About High Cholesterol',
            'A 7-Day Heart-Healthy Meal Plan',
          ],
        },
        {
          source: 'Health Monitor',
          url: 'https://www.healthmonitor.com/',
          articles: ['Understanding Your Lipid Panel Results'],
        },
      ],
    },
    autoNext: true,
  },
  // Turn 6 — auto-follow with next-step chips
  {
    text:
      'I can also help you:\n• Prepare questions for your next appointment\n• Understand your medications\n• Build a simple heart-healthy meal plan\n• Track your numbers and patterns over time\n\nWhat would help most right now?',
    chips: [
      'Prepare for my appointment',
      'Understand my medications',
      'Meal plan ideas',
      'Track my numbers',
    ],
  },
]

const FLOW_TRIGGER = 'What are the best tips you have for someone managing high cholesterol?'

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

function stripBrand(s, brand) {
  if (!s || !brand) return s
  // Drop a trailing ", BRAND" so the brand isn't shown twice
  // (it's already rendered in the pill above).
  return s.replace(new RegExp(`,?\\s*${brand}\\s*$`, 'i'), '').replace(/,\s*$/, '')
}

function ReadingCard({ reading }) {
  return (
    <div className="chat-reading">
      <p className="chat-reading__label">Recommended Reading</p>
      <a
        href={reading.url}
        target="_blank"
        rel="noreferrer"
        className="chat-reading__brand-link"
      >
        <span className="brand-pill">{reading.source}</span>
      </a>
      <p className="chat-reading__title">&ldquo;{reading.title}&rdquo;</p>
      {reading.quote && (
        <blockquote className="chat-reading__quote">
          &ldquo;{reading.quote}&rdquo;
          <span>— {stripBrand(reading.attribution, reading.source)}</span>
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
            <a href={src.url} target="_blank" rel="noreferrer">
              <span className="brand-pill">{src.source}</span>
            </a>
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
              Cardiometabolic360 AI
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
