import React, { useState, useRef, useEffect } from 'react'

function readProfileName() {
  try {
    const raw = localStorage.getItem('skinsightsProfile')
    const name = raw ? (JSON.parse(raw)?.name || '').trim() : ''
    return name ? name.split(' ')[0] : ''
  } catch (_) { return '' }
}

const SW_SLIDES = [
  {
    step: '1 of 5', emoji: '📋',
    title: 'Bring your tracking data — even on your phone',
    body: 'Dermatologists say the single most useful thing a patient can bring is a log of symptoms over time. Your SkInsights summary does this automatically.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#2D3E50,#1a2332)',
    glow: 'radial-gradient(circle at 75% 20%,rgba(46,209,203,.2),transparent 60%)',
  },
  {
    step: '2 of 5', emoji: '📸',
    title: 'Take photos between visits — not just during flares',
    body: "Photos of your skin when it's clear AND when it's flaring help your dermatologist see the full picture. Don't wait for the worst day to snap a photo.",
    cite: 'American Academy of Dermatology',
    bg: 'linear-gradient(150deg,#3a2a45,#1e1428)',
    glow: 'radial-gradient(circle at 20% 75%,rgba(232,134,106,.2),transparent 55%)',
  },
  {
    step: '3 of 5', emoji: '💊',
    title: "List every product and treatment you've tried",
    body: 'Include OTC moisturizers, prescription creams, and anything you\'ve stopped using. "Didn\'t work" is valuable information — it helps your dermatologist narrow options faster.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)',
    glow: 'radial-gradient(circle at 70% 25%,rgba(253,218,60,.2),transparent 55%)',
  },
  {
    step: '4 of 5', emoji: '🤔',
    title: 'Ask about the treatment ladder — not just the next cream',
    body: 'Eczema treatment follows a progression: moisturizers → topical steroids → non-steroidal topicals → phototherapy → biologics. Knowing where you are helps you ask better questions.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)',
    glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.25),transparent 55%)',
  },
  {
    step: '5 of 5', emoji: '💬',
    title: 'Tell them about the life impact — not just the itch',
    body: 'Your DLQI score, sleep disruption, and emotional burden matter for treatment decisions. Biologics are often approved when quality-of-life impact is documented.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#2a1a38,#140e1e)',
    glow: 'radial-gradient(circle at 50% 50%,rgba(91,107,191,.2),transparent 55%)',
  },
]

const CHAT_RESPONSES = {
  'What should I ask about biologics?': "Based on your tracking, you're a potential candidate for biologic therapy. Here are questions tailored to your data:\n\n→ \"My topical hasn't controlled symptoms after 14 days of consistent use. Should we discuss biologics?\"\n→ \"My DLQI score is 9 — does that qualify for biologic treatment?\"\n→ \"What's the difference between Dupixent and newer options?\"\n→ \"How long until I'd see results?\"\n\nYour 48-hour stress → flare pattern and sleep disruption data strengthen this conversation.",
  'Explain my stress-flare pattern to my doctor': "Here's how to frame it:\n\n\"I've been tracking for 21 days with an Oura Ring and daily check-ins. My data shows that when I report a stressful day and my HRV drops more than 15%, my skin score worsens about 48 hours later. This happened 3 out of 4 weeks.\"\n\nThis is exactly the kind of evidence dermatologists find useful — it moves the conversation from \"stress makes it worse\" (vague) to a specific, documented pattern with timing.",
  'Is my eczema severe enough for a referral?': "Based on your data, here's what supports a treatment discussion:\n\n→ DLQI score of 9 (moderate quality-of-life impact)\n→ POEM score of 11 (moderate symptom severity)\n→ 5 flare days in 21 days of tracking\n→ 82% correlation between stress + poor sleep and flares\n→ OTC moisturizers aren't fully controlling symptoms\n\nMany dermatologists consider escalating treatment when daily management isn't achieving control. Your data tells that story clearly.",
  'What does my DLQI score mean for treatment?': "Your DLQI is 9, which falls in the \"moderate impact\" range (6–10). This matters because:\n\n→ Scores above 10 are often used as a threshold for biologic eligibility\n→ Your score has improved from 16 → 12 → 9 over three months\n→ The areas driving your score are leisure and relationships\n\nDermatologists use DLQI alongside clinical severity to make treatment decisions. Your improving trend is positive, but the persistent moderate impact suggests there's room for further improvement.",
}
const DEFAULT_RESPONSE = "That's a great question to bring up with Dr. Williams. Based on your tracking data, I can help you frame it effectively.\n\nYour 21 days of data show a clear stress → flare pattern with an 82% confidence level. Your DLQI and POEM scores both support a conversation about optimizing your treatment plan.\n\nWould you like me to help draft a specific question for your appointment?"

function ChatOverlay({ initialQ, onClose }) {
  const firstName = readProfileName()
  const greeting = firstName ? `Hi ${firstName}!` : 'Hi there!'
  const [messages, setMessages] = useState([
    { role: 'ai', text: `${greeting} I can help you prepare for your appointment with Dr. Williams on April 15th.\n\nI have access to your tracking data, ePRO scores, and Oura data. Ask me anything about what to discuss or how to frame your questions.` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const msgsRef = useRef(null)
  const initSent = useRef(false)

  function send(q) {
    if (!q.trim()) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setTyping(true)
    setTimeout(() => {
      const resp = CHAT_RESPONSES[q] || DEFAULT_RESPONSE
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', text: resp }])
    }, 1500)
  }

  useEffect(() => {
    if (initialQ && !initSent.current) {
      initSent.current = true
      setTimeout(() => send(initialQ), 300)
    }
  }, [])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, typing])

  return (
    <div className="pp-chat-overlay">
      <div className="pp-chat-header">
        <button className="pp-chat-back" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <div className="pp-chat-title">
          <span className="pp-chat-dot" />
          SkInsights AI · Visit Prep
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div className="pp-chat-msgs" ref={msgsRef}>
        {messages.map((m, i) => (
          <div key={i} className={`pp-msg pp-msg--${m.role}`}>
            {m.text.split('\n').map((line, j) =>
              line ? <p key={j}>{line}</p> : <br key={j} />
            )}
          </div>
        ))}
        {typing && (
          <div className="pp-msg-typing">
            <span /><span /><span />
          </div>
        )}
      </div>
      <div className="pp-chat-input-wrap">
        <div className="pp-chat-input-row">
          <input
            className="pp-ai-input"
            type="text"
            placeholder="Ask about your data or what to discuss..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            autoFocus
          />
          <button className="pp-ai-send" onClick={() => send(input)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function SwipeCards() {
  const [idx, setIdx] = useState(0)
  const dragStartX = useRef(null)

  function go(i) {
    setIdx(Math.max(0, Math.min(i, SW_SLIDES.length - 1)))
  }

  function onDragEnd(clientX) {
    const diff = dragStartX.current - clientX
    if (Math.abs(diff) > 40) go(idx + (diff > 0 ? 1 : -1))
  }

  const s = SW_SLIDES[idx]

  return (
    <div className="pp-swipe">
      <div
        className="pp-sw-inner"
        style={{ background: s.bg, cursor: 'grab' }}
        onTouchStart={e => { dragStartX.current = e.changedTouches[0].clientX }}
        onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
        onPointerDown={e => { dragStartX.current = e.clientX }}
        onPointerUp={e => onDragEnd(e.clientX)}
      >
        <div className="pp-sw-glow" style={{ background: s.glow }} />
        <div className="pp-sw-content">
          <div className="pp-sw-step">{s.step}</div>
          <div className="pp-sw-emoji">{s.emoji}</div>
          <div className="pp-sw-heading">{s.title}</div>
          <div className="pp-sw-body">{s.body}</div>
          {s.cite && <div className="pp-sw-cite">{s.cite}</div>}
        </div>
      </div>
      <div className="pp-swipe-dots">
        {SW_SLIDES.map((_, i) => (
          <div key={i} className={`pp-sw-dot${i === idx ? ' pp-sw-dot--on' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

const SUMMARY_ITEMS = [
  { icon: '📊', text: 'Stress → flare pattern confirmed: Wednesday stress shows up on skin by Friday, 3 of 4 weeks', reason: 'Oura HRV + self-reported context' },
  { icon: '😴', text: '82% of worst skin days follow nights with sleep score under 65', reason: 'Oura sleep data + skin score' },
  { icon: '📋', text: 'DLQI: 9/30 (moderate impact, improving from 16 in January) · POEM: 11/28 (moderate symptoms)', reason: 'ePRO assessment results' },
  { icon: '🧴', text: 'Currently managing with OTC moisturizers + occasional hydrocortisone. Consistent routine 4/7 nights.', reason: 'Self-reported treatment' },
]

const QUESTIONS = [
  { text: 'My data shows flares spike 48 hours after high-stress days. Is there a preventive intervention for that window?', reason: 'Based on 21-day stress-flare correlation' },
  { text: '82% of my flares follow poor sleep. Are there nighttime-specific interventions beyond moisturizing?', reason: 'Based on Oura sleep + skin scores' },
  { text: "I've been managing with OTC for 3 weeks without full control. Should we discuss stepping up treatment?", reason: 'Pre-Rx readiness assessment' },
  { text: 'My DLQI is 9 and improving. At what point would you consider biologic therapy for my profile?', reason: 'Based on DLQI + POEM trends' },
]

const STORIES = [
  {
    step: 'Story 1 of 5', avatar: 'M', name: 'Marcus, 34', detail: 'Moderate-to-severe AD · 12 years diagnosed',
    quote: "I'd been on the same topical for six years. I didn't know there was a whole ladder of options I hadn't tried.",
    context: "Marcus's dermatologist explained the treatment escalation pathway — from topicals to phototherapy to biologics. Understanding where he was on that spectrum gave Marcus the confidence to ask about next steps.",
    takeaway: 'Ask: "Where am I on the treatment ladder, and what comes next?"', takeawaySub: 'A question for your upcoming visit',
    bg: 'linear-gradient(150deg,#2B1B3D,#4A2D6B)', glow: 'radial-gradient(circle at 75% 20%,rgba(123,45,142,.25),transparent 60%)',
  },
  {
    step: 'Story 2 of 5', avatar: 'P', name: 'Priya, 28', detail: 'Severe AD · Sleep and stress triggers',
    quote: "My doctor kept asking about my skin. But it was the sleep loss and the anxiety at work that were destroying me.",
    context: "Priya learned that quality-of-life impact — not just skin severity — matters for treatment decisions. Once she started describing her sleep disruption and social avoidance, her dermatologist reassessed her treatment plan.",
    takeaway: 'Tell your doctor how eczema affects your life — not just your skin.', takeawaySub: 'Your DLQI score captures this, too',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)', glow: 'radial-gradient(circle at 20% 75%,rgba(253,218,60,.15),transparent 55%)',
  },
  {
    step: 'Story 3 of 5', avatar: 'D', name: 'Diane, mom of Maya (13)', detail: "Managing her daughter's moderate AD",
    quote: "I read that eczema is an immune condition — not just a skin thing. That changed every question I asked.",
    context: "Diane researched how atopic dermatitis involves an overactive immune system. When she brought this understanding to Maya's appointment, her pediatric dermatologist discussed newer approaches that target specific immune pathways like OX40L.",
    takeaway: 'Ask: "Are there newer treatments that target the immune system directly?"', takeawaySub: 'Researchers are studying new approaches',
    bg: 'linear-gradient(150deg,#3D2258,#5A3580)', glow: 'radial-gradient(circle at 65% 30%,rgba(232,134,106,.15),transparent 55%)',
  },
  {
    step: 'Story 4 of 5', avatar: 'J', name: 'James, 45', detail: 'AD + psoriasis · Stress and sleep triggers',
    quote: "I showed my dermatologist three weeks of tracking data. She said it was the most useful thing a patient had ever brought in.",
    context: "James tracked his symptoms, sleep, and stress daily. When his dermatologist saw the pattern — stress on Monday, skin flare by Wednesday — she immediately adjusted his treatment approach and discussed whether systemic therapy might help.",
    takeaway: 'Your tracking data tells a story. Share your SkInsights summary.', takeawaySub: 'Your 21-day summary is ready to share',
    bg: 'linear-gradient(150deg,#2D4A38,#1a2e22)', glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.2),transparent 55%)',
  },
  {
    step: 'Story 5 of 5', avatar: 'A', name: 'Amira, 31', detail: 'Severe AD · Multiple treatment failures',
    quote: "I didn't know you could ask your dermatologist about clinical trials. I thought they were only for people with no options left.",
    context: "After trying multiple topicals and one biologic without full control, Amira's dermatologist mentioned a clinical trial studying a new approach that targets OX40L. She learned that trials are a proactive option — not a last resort.",
    takeaway: 'Ask: "Are there any clinical trials I might be eligible for?"', takeawaySub: 'Trials are an option at any stage',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)', glow: 'radial-gradient(circle at 50% 50%,rgba(212,168,83,.15),transparent 55%)',
  },
]

const AI_SUGGESTIONS = [
  'What should I ask about biologics?',
  'Explain my stress-flare pattern to my doctor',
  'Is my eczema severe enough for a referral?',
  'What does my DLQI score mean for treatment?',
]

function StoriesSwipe() {
  const [idx, setIdx] = useState(0)
  const dragStartX = useRef(null)

  function go(i) { setIdx(Math.max(0, Math.min(i, STORIES.length - 1))) }

  function onDragEnd(clientX) {
    const diff = dragStartX.current - clientX
    if (Math.abs(diff) > 40) go(idx + (diff > 0 ? 1 : -1))
  }

  const s = STORIES[idx]

  return (
    <div className="pp-stories-swipe">
      <div
        className="pp-story-card"
        style={{ background: s.bg, cursor: 'grab' }}
        onTouchStart={e => { dragStartX.current = e.changedTouches[0].clientX }}
        onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
        onPointerDown={e => { dragStartX.current = e.clientX }}
        onPointerUp={e => onDragEnd(e.clientX)}
      >
        <div className="pp-story-glow" style={{ background: s.glow }} />
        <div className="pp-story-content">
          <div className="pp-story-step">{s.step}</div>
          <div className="pp-story-person">
            <div className="pp-story-avatar">{s.avatar}</div>
            <div>
              <div className="pp-story-name">{s.name}</div>
              <div className="pp-story-detail">{s.detail}</div>
            </div>
          </div>
          <div className="pp-story-quote">"{s.quote}"</div>
          <div className="pp-story-context">{s.context}</div>
          <div className="pp-story-takeaway">
            <div className="pp-story-takeaway-icon">💡</div>
            <div>
              <div className="pp-story-takeaway-text">{s.takeaway}</div>
              <div className="pp-story-takeaway-sub">{s.takeawaySub}</div>
            </div>
          </div>
          <div className="pp-story-src">Verywell Health · In Partnership with Sanofi</div>
        </div>
      </div>
      <div className="pp-swipe-dots">
        {STORIES.map((_, i) => (
          <div key={i} className={`pp-sw-dot${i === idx ? ' pp-sw-dot--on' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

export default function PreparePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInitQ, setChatInitQ] = useState('')
  const [shared, setShared] = useState(false)
  const firstName = readProfileName()

  function openChat(q = '') {
    setChatInitQ(q)
    setChatOpen(true)
  }

  return (
    <main className="main learn-page prepare-page">

      {/* Hero */}
      <div className="pp-hero">
        <p className="pp-hero-eyebrow">Walk in ready</p>
        <h1 className="pp-hero-title">{firstName ? `${firstName}, you're set` : "You're all set"}</h1>
        <p className="pp-hero-sub">We turned your last few weeks into a conversation starter. Your derm will actually want to see this.</p>
        <div className="pp-hero-appt">
          <span className="pp-hero-appt-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </span>
          <div className="pp-hero-appt-body">
            <div className="pp-hero-appt-name">Dr. Sarah Williams · Dermatology</div>
            <div className="pp-hero-appt-date">April 15, 2026 · 2:30 PM</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <span className="pp-sec-badge">Auto-generated</span>
          <h2 className="pp-sec-title">Your summary for Dr. Williams</h2>
        </div>
        <div className="pp-sum-grid">
          <div className="pp-sum-tile"><div className="pp-st-label">Days tracked</div><div className="pp-st-val">21</div><div className="pp-st-detail">Daily check-ins + Oura</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Flare days</div><div className="pp-st-val pp-st-val--warm">7</div><div className="pp-st-detail">of 21 days (33%)</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Top pattern</div><div className="pp-st-val pp-st-val--purple">Stress</div><div className="pp-st-detail">48-hr lag · 82% confidence</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Avg skin score</div><div className="pp-st-val">2.8</div><div className="pp-st-detail">Moderate · range 2–4</div></div>
        </div>
        <div className="pp-card">
          <div className="pp-card-label">Key findings to share</div>
          {SUMMARY_ITEMS.map((item, i) => (
            <div key={i} className="pp-q-row">
              <div className="pp-q-icon">{item.icon}</div>
              <div><div className="pp-q-text">{item.text}</div><div className="pp-q-reason">{item.reason}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Bar */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <h2 className="pp-sec-title">Ask the AI</h2>
        </div>
        <div className="pp-ai-bar">
          <div className="pp-ai-label"><span className="pp-ai-dot" />SkInsights AI · Visit prep mode</div>
          <div className="pp-ai-input-row">
            <input
              className="pp-ai-input"
              type="text"
              placeholder="Ask about your data or what to discuss..."
              onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { openChat(e.target.value); e.target.value = '' } }}
            />
            <button className="pp-ai-send" onClick={e => { const inp = e.currentTarget.previousElementSibling; if (inp.value) { openChat(inp.value); inp.value = '' } }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="pp-ai-suggestions">
            {AI_SUGGESTIONS.map((q, i) => (
              <button key={i} className="pp-ai-sug" onClick={() => openChat(q)}>
                <span className="pp-ai-sug-arrow">→</span>{q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <span className="pp-sec-badge">Data-driven</span>
          <h2 className="pp-sec-title">Questions to ask</h2>
        </div>
        <div className="pp-card">
          {QUESTIONS.map((item, i) => (
            <div key={i} className="pp-q-row">
              <div className="pp-q-icon">💡</div>
              <div><div className="pp-q-text">{item.text}</div><div className="pp-q-reason">{item.reason}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Share (after questions) */}
      <div className="pp-section">
        <button
          className={`pp-share-btn${shared ? ' pp-share-btn--done' : ''}`}
          onClick={() => setShared(true)}
        >
          {shared ? '✓ Report shared with Dr. Williams' : 'Share report with Dr. Williams →'}
        </button>
      </div>

      {/* Swipe */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <h2 className="pp-sec-title">Things your doctor wants you to know</h2>
        </div>
        <SwipeCards />
      </div>

      {/* Stories from others */}
      <section className="pp-stories-sec">
        <div className="watch-head">
          <div>
            <span className="watch-badge">Paid content for Brand</span>
            <h2 className="watch-title">Stories from others</h2>
          </div>
        </div>
        <StoriesSwipe />
        <div className="edu-disclaimer" style={{ margin: 'var(--space-3) 0 0' }}>
          <strong>Sponsored content.</strong> These stories are illustrative and produced in partnership with Brand.
        </div>
      </section>

      {/* Share */}
      <div className="pp-section">
        <button
          className={`pp-share-btn${shared ? ' pp-share-btn--done' : ''}`}
          onClick={() => setShared(true)}
        >
          {shared ? '✓ Report shared with Dr. Williams' : 'Share report with Dr. Williams →'}
        </button>
      </div>

      {chatOpen && <ChatOverlay initialQ={chatInitQ} onClose={() => setChatOpen(false)} />}
    </main>
  )
}
