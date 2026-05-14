import React, { useState, useRef, useEffect } from 'react'

const PEOPLE_INC_BRANDS = new Set([
  'People', 'Real Simple', 'Verywell Health', 'Verywell Mind',
  'Travel + Leisure', 'Byrdie', 'Better Homes & Gardens',
])

function readProfileName() {
  try {
    const raw = localStorage.getItem('skinsightsProfile')
    const name = raw ? (JSON.parse(raw)?.name || '').trim() : ''
    return name ? name.split(' ')[0] : ''
  } catch (_) { return '' }
}

function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
    const raw = Array.isArray(p.condition) ? p.condition : (p.condition ? [p.condition] : [])
    return raw.filter(Boolean)
  } catch (_) { return [] }
}

function readDoctor() {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
    return {
      name:      (p.doctor_name || '').trim(),
      specialty: (p.doctor_specialty || '').trim(),
      location:  (p.doctor_location || '').trim(),
    }
  } catch (_) { return { name: '', specialty: '', location: '' } }
}

function readAppointment() {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
    return p.nextAppointment || null
  } catch (_) { return null }
}

function writeAppointment(appt) {
  try {
    const p = JSON.parse(localStorage.getItem('skinsightsProfile') || '{}')
    if (appt) p.nextAppointment = appt
    else delete p.nextAppointment
    localStorage.setItem('skinsightsProfile', JSON.stringify(p))
  } catch (_) {}
}

function readEproRecords() {
  try {
    const raw = localStorage.getItem('skinsightsEpro')
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch (_) { return [] }
}

function dlqiBand(score) {
  if (score <= 1)  return 'no effect'
  if (score <= 5)  return 'small effect'
  if (score <= 10) return 'moderate effect'
  if (score <= 20) return 'large effect'
  return 'extremely large effect'
}
function poemBand(score) {
  if (score <= 2)  return 'clear or almost clear'
  if (score <= 7)  return 'mild'
  if (score <= 16) return 'moderate'
  if (score <= 24) return 'severe'
  return 'very severe'
}
function trendArrow(curr, prev) {
  if (prev == null) return ''
  if (curr < prev) return ` ↓ from ${prev}`
  if (curr > prev) return ` ↑ from ${prev}`
  return ` · same as last week`
}

/**
 * Build a dynamic "ePRO summary" finding from the latest Health Pulse record.
 * Returns null when there are no records yet (so callers can fall back to
 * the playbook's static demo row, or show an empty-state CTA).
 */
function eproSummaryItem(records) {
  if (!records || records.length === 0) return null
  const latest = records[records.length - 1]
  const previous = records.length > 1 ? records[records.length - 2] : null
  const dlqiText = `DLQI ${latest.dlqi}/30 (${dlqiBand(latest.dlqi)}${trendArrow(latest.dlqi, previous?.dlqi)})`
  const poemText = `POEM ${latest.poem}/28 (${poemBand(latest.poem)}${trendArrow(latest.poem, previous?.poem)})`
  return {
    icon: '📋',
    text: `${dlqiText} · ${poemText}`,
    reason: `From your Weekly Health Pulse${records.length > 1 ? ` (${records.length} entries)` : ''}`,
    isEpro: true,
  }
}

function formatAppointmentDisplay(appt) {
  if (!appt?.date) return ''
  const iso = appt.time ? `${appt.date}T${appt.time}` : `${appt.date}T12:00`
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = appt.time
    ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : ''
  return timeStr ? `${dateStr} · ${timeStr}` : dateStr
}

const SW_SLIDES = [
  {
    step: '1 of 5', emoji: '📋',
    title: 'Bring your tracking data — even on your phone',
    body: 'Dermatologists say the single most useful thing a patient can bring is a log of symptoms over time. Your Skinsights360 summary does this automatically.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#2D3E50,#1a2332)',
    glow: 'radial-gradient(circle at 75% 20%,rgba(0, 185, 226,.2),transparent 60%)',
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
    glow: 'radial-gradient(circle at 70% 25%,rgba(232, 239, 101,.2),transparent 55%)',
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

function ChatOverlay({ initialQ, onClose, dermName, apptDate }) {
  const firstName = readProfileName()
  const greeting = firstName ? `Hi ${firstName}!` : 'Hi there!'
  const apptPhrase = apptDate
    ? `for your appointment with ${dermName} on ${apptDate}`
    : (dermName !== 'your derm' ? `for your visit with ${dermName}` : 'for your next derm visit')
  const [messages, setMessages] = useState([
    { role: 'ai', text: `${greeting} I can help you prepare ${apptPhrase}.\n\nI have access to your tracking data, ePRO scores, and Oura data. Ask me anything about what to discuss or how to frame your questions.` },
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
          Skinsights360 AI · Visit Prep
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
          <button className="pp-ai-send" aria-label="Send" onClick={() => send(input)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
        style={{ cursor: 'grab' }}
        onTouchStart={e => { dragStartX.current = e.changedTouches[0].clientX }}
        onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
        onPointerDown={e => { dragStartX.current = e.clientX }}
        onPointerUp={e => onDragEnd(e.clientX)}
      >
        <div className="pp-sw-content">
          <div className="pp-sw-step">{s.step}</div>
          <div className="pp-sw-emoji">{s.emoji}</div>
          <div className="pp-sw-heading">{s.title}</div>
          <div className="pp-sw-body">{s.body}</div>
          {s.cite && (
            PEOPLE_INC_BRANDS.has(s.cite)
              ? <span className="brand-pill" style={{ marginTop: 'var(--space-3)' }}>{s.cite}</span>
              : <div className="pp-sw-cite">{s.cite}</div>
          )}
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

/**
 * Per-condition playbooks for Prepare. Each one supplies the "Key findings",
 * "Questions to ask", and "AI suggestions" content tailored to that condition.
 * Falls back to GENERIC_PREPARE_PLAYBOOK when the user's condition isn't here
 * (e.g. for the non-diagnosis "concerns").
 */
const PREPARE_PLAYBOOKS = {
  'Eczema': {
    summary: [
      { icon: '📊', text: 'Stress → flare pattern confirmed: Wednesday stress shows up on skin by Friday, 3 of 4 weeks', reason: 'Oura HRV + self-reported context' },
      { icon: '😴', text: '82% of worst skin days follow nights with sleep score under 65', reason: 'Oura sleep data + skin score' },
      { icon: '📋', text: 'DLQI: 9/30 (moderate impact, improving from 16 in January) · POEM: 11/28 (moderate symptoms)', reason: 'ePRO assessment results' },
      { icon: '🧴', text: 'Currently managing with OTC moisturizers + occasional hydrocortisone. Consistent routine 4/7 nights.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My data shows flares spike 48 hours after high-stress days. Is there a preventive intervention for that window?', reason: 'Based on 21-day stress-flare correlation' },
      { text: '82% of my flares follow poor sleep. Are there nighttime-specific interventions beyond moisturizing?', reason: 'Based on Oura sleep + skin scores' },
      { text: "I've been managing with OTC for 3 weeks without full control. Should we discuss stepping up treatment?", reason: 'Pre-Rx readiness assessment' },
      { text: 'My DLQI is 9 and improving. At what point would you consider biologic therapy for my profile?', reason: 'Based on DLQI + POEM trends' },
    ],
    aiSuggestions: [
      'What should I ask about biologics?',
      'Explain my stress-flare pattern to my doctor',
      'Is my eczema severe enough for a referral?',
      'What does my DLQI score mean for treatment?',
    ],
  },
  'Psoriasis': {
    summary: [
      { icon: '📊', text: 'PASI score: 6.8 (moderate, body surface area ~8%) — slow improvement over 12 weeks', reason: 'Self-reported severity + photos' },
      { icon: '🦴', text: 'Morning joint stiffness logged 4 of 21 days — possible psoriatic arthritis signal', reason: 'Daily check-in symptoms' },
      { icon: '📋', text: 'DLQI: 9/30 (moderate impact). Plaques most disruptive in social and clothing-choice scenarios.', reason: 'ePRO assessment results' },
      { icon: '🧴', text: 'Currently on topical calcipotriene + emollient. Stable but not clearing.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My plaques are stable but not clearing on topicals. At what point should we discuss systemic therapy?', reason: 'Based on 12 weeks of topical use' },
      { text: 'I have morning joint stiffness lasting >30 minutes. Could this be psoriatic arthritis?', reason: 'Based on check-in symptom log' },
      { text: 'What biologics treat both my plaques and joint symptoms?', reason: 'Combination-therapy question' },
      { text: 'My PASI has improved from 9.4 to 6.8. Is this clinically meaningful progress?', reason: 'Based on severity trend' },
    ],
    aiSuggestions: [
      'What should I ask about biologics for psoriasis?',
      'Are my joint symptoms a concern?',
      'Explain my PASI trend for my dermatologist',
      'What questions to ask about scalp psoriasis?',
    ],
  },
  'Rosacea': {
    summary: [
      { icon: '🌡️', text: 'Persistent erythema across cheeks and nose on 18 of 21 days', reason: 'Daily check-in skin score' },
      { icon: '🔍', text: 'Top triggers: heat/humidity and red wine — flushing within 30 minutes, 100% consistent', reason: 'Check-in context tags' },
      { icon: '🫧', text: 'Papulopustular component on chin and nasolabial folds — averaging 4–6 active lesions', reason: 'Photos + check-ins' },
      { icon: '🧴', text: 'Currently using gentle skincare + metronidazole gel ~3x/week.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My flushing persists for hours after triggers. Would a vascular treatment like brimonidine or oxymetazoline help?', reason: 'Based on logged trigger response' },
      { text: 'Should I consider IPL or laser for the persistent background redness?', reason: 'Procedural treatment question' },
      { text: 'Are there oral options like low-dose doxycycline for my bumps?', reason: 'Based on papulopustular pattern' },
      { text: "I've been on metronidazole for 8 weeks with partial improvement. What's the next step?", reason: 'Treatment trial readiness' },
    ],
    aiSuggestions: [
      'What questions to ask about laser for rosacea?',
      'Explain my trigger patterns to the doctor',
      'Should I try oral treatment for rosacea?',
      'Is my rosacea moderate or severe?',
    ],
  },
  'Acne': {
    summary: [
      { icon: '📊', text: 'Active inflammatory lesions: 7–10 on average, distribution along jawline + chin', reason: 'Daily check-ins + photos' },
      { icon: '🔄', text: 'Cyclical pattern detected — breakouts cluster every 25–30 days (likely hormonal)', reason: '3 months of tracking' },
      { icon: '📋', text: 'Quality-of-life impact rated moderate. Scarring concerns noted in journal entries.', reason: 'Self-reported ePRO' },
      { icon: '🧴', text: 'Currently using benzoyl peroxide 2.5% + tretinoin 0.025% for 12 weeks. Marginal improvement.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: "I've used my current regimen for 12 weeks without significant improvement. What's the next step?", reason: 'Based on adherent treatment period' },
      { text: 'My breakouts follow a cyclical pattern. Should we discuss hormonal therapy like spironolactone or a combined OC?', reason: 'Based on 3-month cycle pattern' },
      { text: 'Would you consider oral isotretinoin given the persistent cystic component and scarring risk?', reason: 'Severity + scarring concerns' },
      { text: 'Are there in-office treatments (chemical peels, laser, cortisone injections) to help my active cysts?', reason: 'Adjunctive treatment question' },
    ],
    aiSuggestions: [
      'What questions to ask about isotretinoin?',
      'Explain my hormonal acne pattern',
      'What should I ask about my cystic acne?',
      'Are there in-office options for my acne?',
    ],
  },
}

const GENERIC_PREPARE_PLAYBOOK = {
  summary: [
    { icon: '📊', text: '21 days of daily skin check-ins tracked — pattern data ready to review', reason: 'Self-reported skin scores' },
    { icon: '🔍', text: 'Top correlating factors: stress (45%), poor sleep (25%), weather changes (10%)', reason: 'Context tags across check-ins' },
    { icon: '📸', text: 'Photos captured during both calm and symptomatic days for derm review', reason: 'AI-assisted skin photos' },
    { icon: '🧴', text: 'Current management: OTC products + lifestyle tracking. No diagnosis yet.', reason: 'Self-reported approach' },
  ],
  questions: [
    { text: 'Based on my photos and symptom log, what is your initial differential diagnosis?', reason: 'Pre-diagnosis exploration' },
    { text: 'Should I consider patch testing or other allergy workups for my reactivity?', reason: 'Based on product-trigger logs' },
    { text: 'Are there diagnostic tests (biopsy, blood work) we should consider?', reason: 'Workup question' },
    { text: 'If this turns out to be a chronic condition, what would the first-line treatment look like?', reason: 'Planning question' },
  ],
  aiSuggestions: [
    'What questions should I ask without a diagnosis?',
    'What tests might my derm order?',
    'How do I describe my symptoms clearly?',
    'What conditions match my symptoms?',
  ],
}

function playbookFor(condition) {
  if (!condition) return GENERIC_PREPARE_PLAYBOOK
  return PREPARE_PLAYBOOKS[condition] || GENERIC_PREPARE_PLAYBOOK
}

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
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)', glow: 'radial-gradient(circle at 20% 75%,rgba(232, 239, 101,.15),transparent 55%)',
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
    takeaway: 'Your tracking data tells a story. Share your Skinsights360 summary.', takeawaySub: 'Your 21-day summary is ready to share',
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

// AI_SUGGESTIONS moved into PREPARE_PLAYBOOKS — each condition has its own.

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
        style={{ cursor: 'grab' }}
        onTouchStart={e => { dragStartX.current = e.changedTouches[0].clientX }}
        onTouchEnd={e => onDragEnd(e.changedTouches[0].clientX)}
        onPointerDown={e => { dragStartX.current = e.clientX }}
        onPointerUp={e => onDragEnd(e.clientX)}
      >
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
          <div className="pp-story-src">
            <span className="brand-pill">Verywell Health</span>
            <span>In Partnership with Sanofi</span>
          </div>
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

/**
 * Small modal for setting / editing the next dermatology appointment.
 * Writes to skinsightsProfile.nextAppointment so Prepare can read it back.
 */
function AppointmentModal({ initial, doctorFallback, onSave, onClose }) {
  const [date, setDate]                   = useState(initial?.date || '')
  const [time, setTime]                   = useState(initial?.time || '')
  const [providerName, setProviderName]   = useState(initial?.providerName || doctorFallback?.name || '')
  const [providerSpec, setProviderSpec]   = useState(initial?.providerSpecialty || doctorFallback?.specialty || 'Dermatology')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSave() {
    if (!date) return
    onSave({ date, time, providerName: providerName.trim(), providerSpecialty: providerSpec.trim() })
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', fontSize: 14, border: '1px solid var(--color-border)',
    borderRadius: 8, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box', outline: 'none',
  }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,70,32,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'siFadeIn .15s ease-out',
      }}
    >
      <div
        role="dialog"
        aria-label="Edit appointment"
        style={{
          width: '100%', maxWidth: 380, background: '#fff',
          borderRadius: 18, padding: 22,
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 800, color: '#004620', marginBottom: 4, letterSpacing: '-0.01em' }}>
          {initial ? 'Edit appointment' : 'Add your next appointment'}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 18, lineHeight: 1.5 }}>
          We'll surface a Visit Prep summary in the days leading up to it.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Provider name</label>
          <input type="text" value={providerName} onChange={e => setProviderName(e.target.value)} style={inputStyle} placeholder="Dr. Smith" />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Specialty</label>
          <input type="text" value={providerSpec} onChange={e => setProviderSpec(e.target.value)} style={inputStyle} placeholder="Dermatology" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
          {initial && (
            <button
              onClick={() => { onSave(null); onClose() }}
              style={{
                background: 'transparent', color: 'var(--color-coral)', border: 'none',
                padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', marginRight: 'auto',
              }}
            >Remove</button>
          )}
          <button
            onClick={onClose}
            style={{
              background: '#fff', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)',
              padding: '9px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={!date}
            style={{
              background: date ? '#1BBC3C' : 'var(--color-border)',
              color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 9999,
              fontSize: 13, fontWeight: 700, cursor: date ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
            }}
          >Save</button>
        </div>
      </div>
    </div>
  )
}

export default function PreparePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInitQ, setChatInitQ] = useState('')
  const [shared, setShared] = useState(false)
  const firstName = readProfileName()
  // Tracked conditions — all shown side-by-side in the report
  const [conditions] = useState(() => readConditions())
  // Phase 1: care team + appointment now read from profile (no longer hard-coded)
  const [doctor, setDoctor]           = useState(readDoctor)
  const [appointment, setAppointment] = useState(readAppointment)
  const [showApptModal, setShowApptModal] = useState(false)
  // Phase 2: latest Weekly Health Pulse drives DLQI/POEM in summary
  const eproRecords = readEproRecords()
  const eproRow     = eproSummaryItem(eproRecords)
  const hasEpro     = !!eproRow
  const dermName = doctor.name || 'your derm'
  const dermDisplay = doctor.name
    ? (doctor.specialty ? `${doctor.name} · ${doctor.specialty}` : doctor.name)
    : ''
  const apptDisplay = formatAppointmentDisplay(appointment)
  function saveAppointment(appt) {
    writeAppointment(appt)
    setAppointment(appt)
    // re-read doctor too in case the modal updated provider name/specialty into the profile in future iterations
    setDoctor(readDoctor())
  }
  const conditionsToRender = conditions.length > 0 ? conditions : [null]   // null = generic
  // Flattened lists with a condition tag on each item, for the combined sections
  // Build summary findings. When we have real Weekly Pulse data, replace the
  // playbook's hard-coded DLQI/POEM line with a computed row at the top.
  // When we don't, the playbook's static demo data stays (so the Prepare tab
  // still looks populated for first-time users).
  const isPlaybookEproRow = item => /\bDLQI\b|\bPOEM\b/.test(item.text)
  const playbookFindings = conditionsToRender.flatMap(c =>
    playbookFor(c).summary
      .filter(item => !hasEpro || !isPlaybookEproRow(item))
      .map(item => ({ ...item, condition: c }))
  )
  const allFindings = hasEpro
    ? [{ ...eproRow, condition: null }, ...playbookFindings]
    : playbookFindings
  const allQuestions = conditionsToRender.flatMap(c =>
    playbookFor(c).questions.map(item => ({ ...item, condition: c }))
  )
  // AI suggestions: take 1-2 per condition to keep the chip row manageable
  const allSuggestions = conditionsToRender.flatMap(c =>
    playbookFor(c).aiSuggestions.slice(0, conditionsToRender.length > 1 ? 2 : 4)
  )

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
        <div
          className="pp-hero-appt"
          onClick={() => setShowApptModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowApptModal(true) }}
          style={{ cursor: 'pointer' }}
        >
          <span className="pp-hero-appt-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </span>
          <div className="pp-hero-appt-body">
            <div className="pp-hero-appt-name">
              {appointment?.providerName
                ? `${appointment.providerName}${appointment.providerSpecialty ? ' · ' + appointment.providerSpecialty : ''}`
                : (dermDisplay || 'Add your dermatologist in Profile')}
            </div>
            <div className="pp-hero-appt-date">
              {apptDisplay || 'Tap to add appointment date & time'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary — cross-condition synthesis at the top */}
      <div className="pp-section">
        <div className="pp-ai-summary-card">
          <div className="pp-ai-summary-card__head">
            <span className="pp-ai-summary-card__badge">✨ AI Summary</span>
            <span className="pp-ai-summary-card__meta">For {dermName} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <p className="pp-ai-summary-card__lead">
            {conditions.length >= 2
              ? <>{firstName ? `${firstName} is` : "You're"} tracking <strong>{conditions.length} conditions</strong> ({conditions.join(', ')}) with 21 days of daily check-ins. Stress and sleep below 65 affect <strong>both</strong> conditions; cycles and treatment status differ.</>
              : conditions[0]
                ? <>{firstName ? `${firstName} is` : "You're"} tracking <strong>{conditions[0].toLowerCase()}</strong> with 21 days of daily check-ins. Clear stress-sleep pattern with a defined treatment trial in progress.</>
                : <>21 days of self-tracked skin data ready for review. No diagnosis yet — symptoms and trigger patterns documented.</>
            }
          </p>
          <p className="pp-ai-summary-card__cta">
            Bring this report to your visit. The sections below show the data and pre-drafted questions {dermName} will find most useful.
          </p>
        </div>
      </div>

      {/* Key findings — all conditions, each labeled */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <span className="pp-sec-badge">Auto-generated</span>
          <h2 className="pp-sec-title">Key findings for {dermName}</h2>
        </div>
        <div className="pp-sum-grid">
          <div className="pp-sum-tile"><div className="pp-st-label">Days tracked</div><div className="pp-st-val">21</div><div className="pp-st-detail">Daily check-ins + Oura</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Flare days</div><div className="pp-st-val pp-st-val--warm">7</div><div className="pp-st-detail">of 21 days (33%)</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Top pattern</div><div className="pp-st-val pp-st-val--purple">Stress</div><div className="pp-st-detail">48-hr lag · 82% confidence</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Avg skin score</div><div className="pp-st-val">2.8</div><div className="pp-st-detail">Moderate · range 2–4</div></div>
        </div>
        <div className="pp-card">
          <div className="pp-card-label">Key findings to share</div>
          {allFindings.map((item, i) => {
            const cMod = item.condition ? `--${item.condition.toLowerCase()}` : ''
            return (
              <div key={i} className="pp-q-row">
                <div className={`pp-q-icon${cMod ? ` pp-q-icon${cMod}` : ''}`}>{item.icon}</div>
                <div>
                  <div className="pp-q-text">{item.text}</div>
                  <div className="pp-q-reason">
                    {item.condition && (
                      <span className={`pp-cond-tag pp-cond-tag${cMod}`}>{item.condition}</span>
                    )}
                    {item.reason}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Bar */}
      <div className="pp-section">
        <div className="pp-sec-head">
          <h2 className="pp-sec-title">Ask the AI</h2>
        </div>
        <div className="pp-ai-bar">
          <div className="pp-ai-label"><span className="pp-ai-dot" />Skinsights360 AI · Visit prep mode</div>
          <div className="pp-ai-input-row">
            <input
              className="pp-ai-input"
              type="text"
              placeholder="Ask about your data or what to discuss..."
              onKeyDown={e => { if (e.key === 'Enter' && e.target.value) { openChat(e.target.value); e.target.value = '' } }}
            />
            <button className="pp-ai-send" aria-label="Send" onClick={e => { const inp = e.currentTarget.previousElementSibling; if (inp.value) { openChat(inp.value); inp.value = '' } }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div className="pp-ai-suggestions">
            {allSuggestions.map((q, i) => (
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
          {allQuestions.map((item, i) => {
            const cMod = item.condition ? `--${item.condition.toLowerCase()}` : ''
            return (
              <div key={i} className="pp-q-row">
                <div className={`pp-q-icon${cMod ? ` pp-q-icon${cMod}` : ''}`}>💡</div>
                <div>
                  <div className="pp-q-text">{item.text}</div>
                  <div className="pp-q-reason">
                    {item.condition && (
                      <span className={`pp-cond-tag pp-cond-tag${cMod}`}>{item.condition}</span>
                    )}
                    {item.reason}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Share (after questions) */}
      <div className="pp-section">
        <button
          className={`pp-share-btn${shared ? ' pp-share-btn--done' : ''}`}
          onClick={() => setShared(true)}
        >
          {shared ? `✓ Report shared with ${dermName}` : `Share report with ${dermName} →`}
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
            <span className="watch-badge">Paid content for Sanofi</span>
            <h2 className="watch-title">Stories from others</h2>
          </div>
        </div>
        <StoriesSwipe />
        <div className="edu-disclaimer" style={{ margin: 'var(--space-3) 0 0' }}>
          <span className="edu-disclaimer__eyebrow">Paid content for Sanofi</span>
          <span className="edu-disclaimer__body">
            <strong>Sponsored content.</strong> Videos and content produced in partnership with Sanofi.
          </span>
        </div>
      </section>

      {/* Share */}
      <div className="pp-section">
        <button
          className={`pp-share-btn${shared ? ' pp-share-btn--done' : ''}`}
          onClick={() => setShared(true)}
        >
          {shared ? `✓ Report shared with ${dermName}` : `Share report with ${dermName} →`}
        </button>
      </div>

      {chatOpen && (
        <ChatOverlay
          initialQ={chatInitQ}
          onClose={() => setChatOpen(false)}
          dermName={dermName}
          apptDate={apptDisplay}
        />
      )}

      {showApptModal && (
        <AppointmentModal
          initial={appointment}
          doctorFallback={doctor}
          onSave={saveAppointment}
          onClose={() => setShowApptModal(false)}
        />
      )}
    </main>
  )
}
