import React, { useState, useEffect, useRef } from 'react'
import MarkAsTried from './MarkAsTried'
import ParentsCaregiverSupportSection from './ParentsCaregiverSupportSection'
import { useProfileStage } from '../context/ProfileStageContext'
import { HABIT_CONTENT } from '../data/habitContent'

const SUGGESTED = [
  "Eating changes feel hard when I'm stressed.",
  'What do my cholesterol numbers actually mean?',
  "I'm overwhelmed trying to change my diet and lifestyle at the same time.",
  "What can I eat on the go that's good for my cholesterol?",
  'What are the best tips you have for someone managing high cholesterol?',
]

const CANNED_RESPONSES = {
  'What do my cholesterol numbers actually mean?': [
    "Cholesterol results can feel like alphabet soup — here's what actually matters.",
    "• LDL (\"bad\" cholesterol) — ideally below 100 mg/dL. Most linked to heart disease risk.\n• HDL (\"good\" cholesterol) — ideally above 60 mg/dL. Higher is better.\n• Triglycerides — ideally below 150 mg/dL. Often tied to diet and activity.\n• Total cholesterol — less useful alone. The LDL-to-HDL ratio matters more.",
    "One number rarely tells the full story. Your doctor looks at the full lipid panel alongside age, blood pressure, family history, and diabetes risk to assess your overall cardiovascular picture.\n\nWant me to explain what moves these numbers up or down?",
  ],
  "I'm overwhelmed trying to change my diet and lifestyle at the same time.": [
    "That overwhelm is real — and it's one of the most common things people with high cholesterol describe.",
    "The research actually supports a simpler approach:\n\n• Pick one change at a time. Stacking too many at once leads to burnout, not results.\n• Diet tends to move the LDL needle faster than exercise alone.\n• Small, consistent shifts compound over months.\n• Stress and sleep both affect cholesterol too — so managing overwhelm is genuinely part of the plan.",
    {
      text: "Your daily check-in is tracking these patterns. After a few weeks you'll see what's actually moving the needle.\n\nWhat area do you want to focus on first?",
      chips: ['Diet & eating', 'Movement', 'Sleep', 'Stress management'],
    },
  ],
  "What can I eat on the go that's good for my cholesterol?": [
    "Good news — heart-healthy eating on the go is more doable than it sounds.",
    "Good bets:\n• A small handful of unsalted walnuts or almonds\n• Fresh fruit — apples, berries, oranges\n• Single-serve hummus with carrots or cucumber\n• A salmon or tuna pouch\n• Oat-based snack bars with minimal added sugar",
    "Worth limiting:\n• Anything with partially hydrogenated oils (trans fats)\n• High-sodium processed snacks\n• Sweetened drinks — excess sugar raises triglycerides",
    "The pattern that matters most: replacing saturated fat with unsaturated fat consistently over weeks, not perfecting every meal.\n\nWant me to suggest some simple meal swaps for the week?",
  ],
  // Focus area follow-ups (triggered by chips above)
  'Diet & eating': [
    "Good choice — diet has the most direct impact on LDL.",
    "A few changes that consistently move the needle:\n• Swap saturated fats (butter, red meat) for unsaturated fats (olive oil, avocado, nuts)\n• Add soluble fiber daily — oats, beans, flaxseed\n• Reduce ultra-processed and fried foods\n• Limit alcohol, which raises triglycerides",
    "Your My Habits section has heart-healthy eating habits already lined up for you — short, realistic, and they build over time. Scroll down to check them out.",
  ],
  'Movement': [
    "Exercise has a direct effect on HDL — the \"good\" cholesterol.",
    "Even 20–30 minutes of moderate activity most days can meaningfully shift your lipid profile over 3–6 months. Walking counts.\n\nThe most sustainable routine is one that fits your actual life, not an ideal version of it.",
    "Your My Habits section has movement habits sized for busy schedules — even on the hardest days there's something doable.",
  ],
  'Sleep': [
    "Sleep is more connected to cardiometabolic health than most people realize.",
    "Poor sleep raises cortisol, which increases blood sugar and can raise LDL. Even going from 6 to 7 hours consistently shifts things over time.\n\n• Consistent wake time matters more than bedtime\n• Avoid screens 30–60 min before bed\n• Keep your room cool and dark",
    "Your My Habits section includes simple wind-down habits — small things that compound over weeks.",
  ],
  'Stress management': [
    "Chronic stress has a real, measurable effect on cholesterol — it's not just a mental health issue.",
    "When stress is sustained, cortisol increases LDL and triglycerides and decreases HDL. Managing stress is genuinely part of managing your numbers.\n\n• Short breathing exercises (even 2 minutes) lower cortisol noticeably\n• Light movement is one of the fastest stress relievers\n• Social connection is protective — not a luxury",
    "Your My Habits section includes a few stress-relief habits that take under 10 minutes. Worth trying one this week.",
  ],
}

const DEFAULT_RESPONSE =
  "That's a thoughtful question. Managing cardiometabolic health involves a lot of moving parts — diet, activity, stress, medications, and regular monitoring all play a role.\n\nI'd recommend discussing this specifically with your care team. In the meantime, your daily check-in data can help you track patterns and bring clearer information to your next appointment.\n\nIs there something more specific I can help you with?"

// ── Multi-turn flows ──────────────────────────────────────────────────────────
// Each turn has `bubbles: [...]` — an array of message objects shown as
// separate chat bubbles with staggered typing delays.
// Each bubble: { text?, chips?, article?, feed?, recommendations? }

const HELPS_FLOW = [
  // Turn 0 — initial AI response
  {
    bubbles: [
      { text: "You're not alone in asking that." },
      { text: "For most people, managing high cholesterol isn't one big change — it's a series of smaller adjustments that add up over time." },
      {
        text: "What feels hardest for you right now?",
        chips: [
          'Changing my diet',
          'Staying consistent with exercise',
          'Understanding my medications',
          'Knowing what to track',
          'Talking to my doctor',
        ],
      },
    ],
  },
  // Turn 1 — after user picks what's hardest
  {
    bubbles: [
      { text: "That's one of the most common friction points." },
      { text: "A few things that quietly get in the way:\n• Not knowing which foods matter most\n• All-or-nothing thinking about \"healthy eating\"\n• Conflicting information online\n• Busy schedules making meal planning hard" },
      { text: "What does a typical day of eating look like for you?" },
    ],
  },
  // Turn 2 — after user describes eating
  {
    bubbles: [
      { text: "That's helpful context." },
      { text: "People managing cholesterol often find the biggest wins from a few targeted swaps — not a total diet overhaul." },
      {
        text: "Do you usually cook at home or eat out most days?",
        chips: ['Mostly cook at home', 'Mix of both', 'Mostly eat out'],
      },
    ],
  },
  // Turn 3 — cooking question, includes mini article card
  {
    bubbles: [
      { text: "That context really shapes what's practical for you." },
      {
        article: {
          source: 'Health.com',
          url: 'https://www.health.com/',
          title: 'The Best Foods to Lower Cholesterol, According to Dietitians',
        },
      },
      { text: "A few changes that consistently move the needle:\n• Replace saturated fats (butter, red meat) with unsaturated fats (olive oil, avocado)\n• Add soluble fiber daily — oats, beans, flaxseed\n• Reduce processed and fried foods" },
      {
        text: "How would you describe your current activity level?",
        chips: ['Mostly sedentary', 'Some light activity', 'Moderately active', 'Very active'],
      },
    ],
  },
  // Turn 4 — after activity answer, includes mini article card
  {
    bubbles: [
      { text: "Exercise has a direct effect on HDL — the \"good\" cholesterol." },
      { text: "Even moderate activity 5 days a week can meaningfully improve your lipid profile over 3–6 months." },
      {
        article: {
          source: 'Health.com',
          url: 'https://www.health.com/',
          title: 'How Exercise Affects Your Cholesterol Levels',
        },
      },
      {
        text: "What feels like the biggest barrier to being more active?",
        chips: ['No time', 'Low energy', 'Joint pain or health limits', 'Not sure where to start'],
      },
    ],
  },
  // Turn 5 — final summary
  {
    autoNext: true,
    bubbles: [
      { text: "That's really common, and it's worth acknowledging." },
      { text: "Based on what you've shared, your biggest opportunities may be:\n• Small, consistent dietary swaps (not a full overhaul)\n• Adding 20–30 minutes of movement most days\n• Tracking patterns to see what's actually working\n• Preparing clear questions before your next cardiology or GP visit" },
      {
        recommendations: {
          label: 'Recommended For You',
          sources: [
            {
              source: 'Health.com',
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
      },
    ],
  },
  // Turn 6 — auto-follow
  {
    bubbles: [
      { text: "I can also help you prepare for your next appointment, understand your medications, or build a simple heart-healthy meal plan." },
      {
        text: "What would help most right now?",
        chips: [
          'Prepare for my appointment',
          'Understand my medications',
          'Meal plan ideas',
          'Track my numbers',
        ],
      },
    ],
  },
]

// Opening EatingWell recipes feed
const OPENING_RECIPES = [
  {
    id: 'casserole',
    title: 'Philly Chicken Cheesesteak Casserole',
    image: '/images/ew/casserole.png',
    tag: 'High Protein',
    time: '35 min',
    servings: '4 servings',
    description: 'All the comfort of a cheesesteak in a lighter casserole format. Lean chicken, peppers, and onions make this a heart-healthy crowd-pleaser.',
    nutrients: ['32g protein', '8g fiber', '420 cal'],
  },
  {
    id: 'fajita',
    title: 'Chicken Fajita Soup',
    image: '/images/ew/fajita.png',
    tag: 'Low Saturated Fat',
    time: '25 min',
    servings: '6 servings',
    description: "Bold fajita flavors in a warm, satisfying soup. Packed with lean protein and vegetables, it's an easy weeknight win.",
    nutrients: ['28g protein', '6g fiber', '310 cal'],
  },
  {
    id: 'shrimp',
    title: 'Spicy Jerk Shrimp',
    image: '/images/ew/shrimp.png',
    tag: 'Quick & Light',
    time: '15 min',
    servings: '2 servings',
    description: 'Shrimp is one of the leanest proteins around. Jerk seasoning adds big flavor without added fat — ready in 15 minutes.',
    nutrients: ['26g protein', '2g fiber', '240 cal'],
  },
]

const BETH_FLOW = [
  // Turn 0 — ask what happens when stressed
  {
    bubbles: [
      { text: "Thanks for sharing that, Beth." },
      {
        text: "To make my recommendations more realistic — what usually happens when you're stressed?",
        chips: [
          'I reach for comfort food',
          "I don't have time to cook",
          'I lose motivation',
          'I snack throughout the day',
        ],
      },
    ],
  },
  // Turn 1 — after "I reach for comfort food"
  {
    bubbles: [
      { text: "That makes sense — you're definitely not alone." },
      { text: "Instead of trying to change everything at once, let's find meals that feel comforting while still supporting your health." },
      { feed: 'openingPreview' },
      {
        text: "Do any of these feel like something you'd actually try this week?",
        chips: ["Yes, I'd try one", 'Maybe with some swaps', 'Not really my thing'],
      },
    ],
  },
  // Turn 2 — ask what feels hardest
  {
    bubbles: [
      { text: "That gives me a much better picture of your situation." },
      { text: "When you're taking care of everyone else, it's easy for your own needs to end up at the bottom of the list." },
      {
        text: "What feels hardest right now?",
        chips: ['Finding time to cook', 'Taking care of myself', 'Managing stress', 'Staying consistent'],
      },
    ],
  },
  // Turn 3 — reflect back
  {
    bubbles: [
      { text: "That resonates with a lot of caregivers." },
      { text: "When self-care starts feeling like another responsibility instead of something that recharges you, healthy habits become much harder to sustain." },
      {
        text: "Does that feel true for you?",
        chips: ['Yes, exactly', 'Sometimes', 'Not really'],
      },
    ],
  },
  // Turn 4 — parents preview card, auto-follows
  {
    autoNext: true,
    bubbles: [
      { text: "I thought this might be especially helpful right now." },
      { feed: 'parentsPreview' },
    ],
  },
  // Turn 5 — memory close
  {
    bubbles: [
      { text: "I'll remember that caregiving is part of your daily life." },
      { text: "Future recommendations will fit the time and energy you actually have." },
      { text: "Is there anything else I can help with today?" },
    ],
  },
]

const FLOW_TRIGGER = 'What are the best tips you have for someone managing high cholesterol?'
const BETH_TRIGGER = "Eating changes feel hard when I'm stressed."

// ── Sub-components ────────────────────────────────────────────────────────────

function RecipeOverlay({ recipe, onClose }) {
  return (
    <div className="recipe-overlay">
      <div className="recipe-overlay__header">
        <button className="chat-overlay__back" onClick={onClose} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="recipe-overlay__brand">EatingWell</span>
        <div style={{ width: 36 }} />
      </div>
      <div className="recipe-overlay__scroll">
        <img src={recipe.image} alt="" className="recipe-overlay__hero" />
        <div className="recipe-overlay__body">
          <span className="recipe-overlay__tag">{recipe.tag}</span>
          <h2 className="recipe-overlay__title">{recipe.title}</h2>
          <div className="recipe-overlay__meta">
            <span className="recipe-overlay__meta-item">⏱ {recipe.time}</span>
            <span className="recipe-overlay__meta-sep">·</span>
            <span className="recipe-overlay__meta-item">🍽 {recipe.servings}</span>
          </div>
          <p className="recipe-overlay__desc">{recipe.description}</p>
          <div className="recipe-overlay__nutrients">
            {recipe.nutrients.map((n, i) => (
              <span key={i} className="recipe-overlay__nutrient">{n}</span>
            ))}
          </div>
          <a
            href="https://www.eatingwell.com"
            target="_blank"
            rel="noreferrer"
            className="recipe-overlay__cta"
          >
            View Full Recipe on EatingWell →
          </a>
        </div>
      </div>
    </div>
  )
}

function OpeningFeed({ onRecipeClick }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="chat-feed">
      <div className="chat-feed__header">
        <span className="chat-feed__brand">EatingWell</span>
        <span className="chat-feed__divider" />
        <span className="chat-feed__title">Simple &amp; Satisfying Swaps</span>
      </div>
      {!expanded ? (
        <button type="button" className="chat-preview-card" onClick={() => setExpanded(true)}>
          <div className="chat-preview-card__media">
            <img src="/images/ew/casserole.png" alt="" className="chat-preview-card__img" />
            <span className="chat-preview-card__play" aria-hidden="true">▶</span>
          </div>
          <div className="chat-preview-card__panel">
            <p className="chat-preview-card__title">Dietitian-Approved<br />Comfort Food</p>
            <span className="chat-preview-card__hint">Tap to see recipes →</span>
          </div>
        </button>
      ) : (
        <div className="chat-feed__scroll">
          {OPENING_RECIPES.map(r => (
            <button
              key={r.id}
              type="button"
              className="chat-recipe-card"
              onClick={() => onRecipeClick && onRecipeClick(r)}
            >
              <img src={r.image} alt="" className="chat-recipe-card__img" />
              <p className="chat-recipe-card__title">{r.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ParentsPreview({ onOpen }) {
  return (
    <button type="button" className="chat-preview-card chat-preview-card--parents" onClick={onOpen}>
      <div className="chat-preview-card__panel">
        <p className="chat-preview-card__eyebrow">Resources for You</p>
        <p className="chat-preview-card__title">Balancing caregiving &amp; your own health</p>
        <span className="chat-preview-card__hint">Tap to read →</span>
      </div>
    </button>
  )
}

function ParentsOverlay({ onClose }) {
  return (
    <div className="recipe-overlay">
      <div className="recipe-overlay__header">
        <button className="chat-overlay__back" onClick={onClose} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="recipe-overlay__brand">Resources for You</span>
        <div style={{ width: 36 }} />
      </div>
      <div className="recipe-overlay__scroll">
        <ParentsCaregiverSupportSection />
      </div>
    </div>
  )
}

function MiniArticleCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="chat-mini-article"
    >
      <span className="chat-mini-article__source">{article.source}</span>
      <p className="chat-mini-article__title">{article.title}</p>
      <span className="chat-mini-article__cta">Read article →</span>
    </a>
  )
}

function ArticlesFeed({ articles }) {
  const typeLabel = { article: '📄 Article', recipe: '🍽 Recipe', video: '▶ Video' }
  return (
    <div className="chat-articles-feed">
      <p className="chat-articles-feed__label">Related reading</p>
      {articles.map((a, i) => (
        <a key={i} href={a.url} target="_blank" rel="noreferrer" className="chat-mini-article">
          <span className="chat-mini-article__source" style={{ color: a.sourceColor }}>{a.source}</span>
          <p className="chat-mini-article__title">{a.title}</p>
          <span className="chat-mini-article__cta">{typeLabel[a.type] || 'Read more'} →</span>
        </a>
      ))}
    </div>
  )
}

function MemoryNote({ text }) {
  return (
    <div className="chat-memory">
      <span className="chat-memory__icon" aria-hidden="true">✨</span>
      <p>{text}</p>
    </div>
  )
}

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

function ChatBubble({ msg, onChip, onRecipeClick, onParentsOpen }) {
  if (msg.role === 'user') {
    return (
      <div className="chat-bubble chat-bubble--user">
        {renderText(msg.text)}
      </div>
    )
  }

  // Feed-only bubbles (no white background bubble wrapper)
  if (!msg.text && (msg.feed || msg.article || msg.articles)) {
    return (
      <div className="chat-bubble-feed-wrap">
        {msg.feed === 'openingPreview' && <OpeningFeed onRecipeClick={onRecipeClick} />}
        {msg.feed === 'parentsPreview' && <ParentsPreview onOpen={onParentsOpen} />}
        {msg.article && <MiniArticleCard article={msg.article} />}
        {msg.articles && <ArticlesFeed articles={msg.articles} />}
      </div>
    )
  }

  return (
    <div className={`chat-bubble chat-bubble--ai${msg.feed || msg.article || msg.articles ? ' chat-bubble--feed' : ''}`}>
      {msg.text && renderText(msg.text)}
      {msg.article && <MiniArticleCard article={msg.article} />}
      {msg.articles && <ArticlesFeed articles={msg.articles} />}
      {msg.recommendations && <Recommendations data={msg.recommendations} />}
      {msg.feed === 'openingPreview' && <OpeningFeed onRecipeClick={onRecipeClick} />}
      {msg.feed === 'parentsPreview' && <ParentsPreview onOpen={onParentsOpen} />}
      {msg.memory && <MemoryNote text={msg.memory} />}
      {msg.chips && (
        <>
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
          <p className="chat-chips__hint">Tap one, or type your own below</p>
        </>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AskAI({ habitContext = null, onClearHabitContext = null }) {
  const { isNew } = useProfileStage()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [activeFlow, setActiveFlow] = useState(null)
  const [flowTurn, setFlowTurn] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showParentsOverlay, setShowParentsOverlay] = useState(false)
  const bottomRef = useRef(null)

  const FLOWS = { helps: HELPS_FLOW, beth: BETH_FLOW }

  // Auto-open with habit context when triggered from a MyRituals card
  useEffect(() => {
    if (!habitContext) return
    const userText = `Tell me more about "${habitContext.label}"`
    setOpen(true)
    setActiveFlow(null)
    setMessages([{ role: 'user', text: userText }])
    onClearHabitContext?.()

    const relatedContent = HABIT_CONTENT.filter(c => c.habitIds.includes(habitContext.id)).slice(0, 3)
    const bubbles = [
      { text: `Here's why "${habitContext.label}" is one of the highest-impact habits for cardiometabolic health.` },
      { text: `${habitContext.stat} ${habitContext.statLabel.toLowerCase()}\n\n${habitContext.body}` },
      ...(relatedContent.length > 0 ? [{ articles: relatedContent }] : []),
      { text: 'What would you like to know more about?', chips: ['How do I start?', 'What if I miss a day?', 'What does the research say?', 'Best time of day for this?'] },
    ]

    function showBubble(idx) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(prev => [...prev, { role: 'ai', ...bubbles[idx] }])
        if (idx + 1 < bubbles.length) setTimeout(() => showBubble(idx + 1), 350)
      }, idx === 0 ? 1200 : 800)
    }
    showBubble(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitContext])

  // Shows each bubble in a turn sequentially with typing indicators between them
  function showAITurn(flowName, turnIdx) {
    const flow = FLOWS[flowName]
    const turn = flow[turnIdx]
    const parts = turn.bubbles

    function showPart(partIdx) {
      const delay = partIdx === 0 ? 1200 : 750
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'ai', ...parts[partIdx] }])
        const next = partIdx + 1
        if (next < parts.length) {
          setTimeout(() => showPart(next), 350)
        } else {
          setFlowTurn(turnIdx + 1)
          if (turn.autoNext && flow[turnIdx + 1]) {
            setTimeout(() => showAITurn(flowName, turnIdx + 1), 1400)
          }
        }
      }, delay)
    }

    showPart(0)
  }

  function submit(q) {
    const text = (q ?? query).trim()
    if (!text) return
    setOpen(true)
    setQuery('')

    if (text === FLOW_TRIGGER) {
      setMessages([{ role: 'user', text }])
      setActiveFlow('helps')
      setFlowTurn(0)
      showAITurn('helps', 0)
      return
    }

    if (text === BETH_TRIGGER) {
      setMessages([{ role: 'user', text }])
      setActiveFlow('beth')
      setFlowTurn(0)
      showAITurn('beth', 0)
      return
    }

    // Single-turn canned response — split into multiple bubbles
    setMessages([{ role: 'user', text }])
    setActiveFlow(null)
    const parts = CANNED_RESPONSES[text]

    if (parts) {
      function showCanned(idx) {
        setTyping(true)
        setTimeout(() => {
          setTyping(false)
          const part = parts[idx]
          const msg = typeof part === 'string'
            ? { role: 'ai', text: part }
            : { role: 'ai', ...part }
          setMessages(prev => [...prev, msg])
          if (idx + 1 < parts.length) {
            setTimeout(() => showCanned(idx + 1), 350)
          }
        }, idx === 0 ? 1200 : 750)
      }
      showCanned(0)
    } else {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages(prev => [...prev, { role: 'ai', text: DEFAULT_RESPONSE }])
      }, 1600)
    }
  }

  function handleUserSubmit(text) {
    const t = text.trim()
    if (!t) return
    setMessages(prev => [...prev, { role: 'user', text: t }])

    if (activeFlow && flowTurn < FLOWS[activeFlow].length) {
      showAITurn(activeFlow, flowTurn)
      return
    }

    // Check canned responses (e.g. focus-area chips)
    const parts = CANNED_RESPONSES[t]
    if (parts) {
      function showCanned(idx) {
        setTyping(true)
        setTimeout(() => {
          setTyping(false)
          const part = parts[idx]
          const msg = typeof part === 'string'
            ? { role: 'ai', text: part }
            : { role: 'ai', ...part }
          setMessages(prev => [...prev, msg])
          if (idx + 1 < parts.length) {
            setTimeout(() => showCanned(idx + 1), 350)
          }
        }, idx === 0 ? 1200 : 750)
      }
      showCanned(0)
      return
    }

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'ai', text: DEFAULT_RESPONSE }])
    }, 1600)
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
      {/* Floating action button — always visible unless chat overlay is open */}
      {!open && (
        <button
          className="ask-ai__fab"
          aria-label="Ask Vitalist AI"
          onClick={() => { setOpen(true); setShowSuggestions(true) }}
        >
          ✨
        </button>
      )}

      {false && <div className="ask-ai">
        <div className="ask-ai__inner">
          <div className="ask-ai__input-row">
            <input
              className="ask-ai__input"
              type="text"
              placeholder={isNew ? '✨ New here? Ask me anything…' : '✨ Hi! Ask me anything…'}
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
              <p className="ask-ai__label">{isNew ? 'New here? Try one of these to get started' : "Here's what people like you ask"}</p>
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
      </div>}

      {open && selectedRecipe && (
        <RecipeOverlay recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}

      {open && showParentsOverlay && (
        <ParentsOverlay onClose={() => setShowParentsOverlay(false)} />
      )}

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
              Vitalist AI
            </div>
            <div style={{ width: 36 }} />
          </div>

          <div className="chat-overlay__messages">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} onChip={handleUserSubmit} onRecipeClick={setSelectedRecipe} onParentsOpen={() => setShowParentsOverlay(true)} />
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
