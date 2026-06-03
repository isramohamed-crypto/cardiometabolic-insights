import React, { useState, useRef, useEffect } from 'react'
import SponsorBanner from './SponsorBanner'

const PEOPLE_INC_BRANDS = new Set([
  'People', 'Real Simple', 'Verywell Health', 'Verywell Mind',
  'Travel + Leisure', 'Byrdie', 'Better Homes & Gardens',
])

function readProfileName() {
  try {
    const raw = localStorage.getItem('cardiometabolicProfile')
    const name = raw ? (JSON.parse(raw)?.name || '').trim() : ''
    return name ? name.split(' ')[0] : ''
  } catch (_) { return '' }
}

function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    const raw = Array.isArray(p.condition) ? p.condition : (p.condition ? [p.condition] : [])
    return raw.filter(Boolean)
  } catch (_) { return [] }
}

function readDoctor() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return {
      name:      (p.doctor_name || '').trim(),
      specialty: (p.doctor_specialty || '').trim(),
      location:  (p.doctor_location || '').trim(),
    }
  } catch (_) { return { name: '', specialty: '', location: '' } }
}

function readAppointment() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return p.nextAppointment || null
  } catch (_) { return null }
}

function writeAppointment(appt) {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    if (appt) p.nextAppointment = appt
    else delete p.nextAppointment
    localStorage.setItem('cardiometabolicProfile', JSON.stringify(p))
  } catch (_) {}
}

function readEproRecords() {
  try {
    const raw = localStorage.getItem('cardiometabolicEpro')
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
    body: 'Cardiologists and GPs say the single most useful thing a patient can bring is a log of trends over time. Your Cardiometabolic360 summary does this automatically.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#2D3E50,#1a2332)',
    glow: 'radial-gradient(circle at 75% 20%,rgba(0, 185, 226,.2),transparent 60%)',
  },
  {
    step: '2 of 5', emoji: '📊',
    title: 'Know your numbers before you walk in',
    body: "Ask your care team to share your latest cholesterol panel, blood pressure readings, and HbA1c. Coming in with your own record of trends helps your cardiologist or GP see the full picture.",
    cite: 'American Heart Association',
    bg: 'linear-gradient(150deg,#3a2a45,#1e1428)',
    glow: 'radial-gradient(circle at 20% 75%,rgba(232,134,106,.2),transparent 55%)',
  },
  {
    step: '3 of 5', emoji: '💊',
    title: "List every medication and supplement you're taking",
    body: 'Include prescription medications, OTC supplements, and anything you\'ve stopped using. "Didn\'t work" or "caused side effects" is valuable information — it helps your care team find better options faster.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)',
    glow: 'radial-gradient(circle at 70% 25%,rgba(232, 239, 101,.2),transparent 55%)',
  },
  {
    step: '4 of 5', emoji: '🤔',
    title: 'Ask about your cardiovascular risk score — not just your numbers',
    body: 'Individual cholesterol or blood pressure numbers only tell part of the story. Ask your cardiologist or GP about your 10-year cardiovascular risk score and what target ranges are right for your profile.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)',
    glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.25),transparent 55%)',
  },
  {
    step: '5 of 5', emoji: '💬',
    title: 'Tell them about the life impact — not just the numbers',
    body: 'Fatigue, sleep disruption, and emotional burden matter for treatment decisions. Your care team needs the full picture to recommend the right lifestyle changes and therapies.',
    cite: 'Verywell Health',
    bg: 'linear-gradient(150deg,#2a1a38,#140e1e)',
    glow: 'radial-gradient(circle at 50% 50%,rgba(91,107,191,.2),transparent 55%)',
  },
]

const CHAT_RESPONSES = {
  'What should I ask about my cholesterol targets?': "Based on your tracking, here are questions tailored to your data:\n\n→ \"What LDL target should I be aiming for given my cardiovascular risk profile?\"\n→ \"My LDL has dropped but my HDL is still low — does that change our approach?\"\n→ \"Are there non-statin options if I'm experiencing side effects?\"\n→ \"How often should I be retesting my lipid panel?\"\n\nYour stress and sleep data also support a conversation about lifestyle factors that affect lipid levels.",
  'Explain my stress pattern to my doctor': "Here's how to frame it:\n\n\"I've been tracking for 21 days with an Oura Ring and daily check-ins. My data shows that when I report a stressful day and my HRV drops more than 15%, my blood pressure readings worsen about 48 hours later. This happened 3 out of 4 weeks.\"\n\nThis is exactly the kind of evidence your care team finds useful — it moves the conversation from \"stress makes it worse\" (vague) to a specific, documented pattern with timing.",
  'What is my cardiovascular risk score?': "Based on your data, here's what supports a risk discussion:\n\n→ DLQI score of 9 (moderate quality-of-life impact)\n→ 5 high-symptom days in 21 days of tracking\n→ 82% correlation between stress + poor sleep and worse health days\n→ Current medications not fully controlling symptoms\n\nYour care team can calculate your 10-year cardiovascular risk using tools like the Pooled Cohort Equations. Your data tells a clear story to support that conversation.",
  'What lifestyle changes should I prioritize?': "Your tracking data points to a few high-leverage changes:\n\n→ Sleep quality — nights under 65 score correlate with your worst health days\n→ Stress management — your HRV data shows a clear stress → response pattern\n→ Dietary patterns — 3 weeks of food logging shows room for more heart-healthy choices\n\nYour care team can help you prioritize based on which factors are driving your numbers most. Your data makes that conversation much more focused.",
}
const DEFAULT_RESPONSE = "That's a great question to bring up with your care team. Based on your tracking data, I can help you frame it effectively.\n\nYour 21 days of data show a clear stress and sleep pattern with an 82% confidence level. Your health scores both support a conversation about optimizing your treatment plan.\n\nWould you like me to help draft a specific question for your appointment?"

function ChatOverlay({ initialQ, onClose, dermName, apptDate }) {
  const firstName = readProfileName()
  const greeting = firstName ? `Hi ${firstName}!` : 'Hi there!'
  const apptPhrase = apptDate
    ? `for your appointment with ${dermName} on ${apptDate}`
    : (dermName !== 'your care team' ? `for your visit with ${dermName}` : 'for your next care team visit')
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
          Cardiometabolic360 AI · Visit Prep
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
  'High cholesterol': {
    summary: [
      { icon: '📊', text: 'Stress → elevated readings pattern confirmed: high-stress days correlate with worse health metrics 48 hrs later, 3 of 4 weeks', reason: 'Oura HRV + self-reported context' },
      { icon: '😴', text: '82% of worst health days follow nights with sleep score under 65', reason: 'Oura sleep data + health scores' },
      { icon: '📋', text: 'LDL tracking: moderate concern, improving over past 3 months with lifestyle changes', reason: 'Self-reported health scores' },
      { icon: '💊', text: 'Currently managing with statin therapy + dietary changes. Adherent 5/7 days.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My data shows stress correlates with worse readings 48 hours later. Is there an intervention for that window?', reason: 'Based on 21-day stress correlation' },
      { text: '82% of my worst days follow poor sleep. What sleep interventions do you recommend?', reason: 'Based on Oura sleep + health scores' },
      { text: "I've been on my current regimen for 3 months. Should we adjust the dosage or try a different approach?", reason: 'Treatment progress review' },
      { text: 'What is my current 10-year cardiovascular risk score, and what target should I aim for?', reason: 'Based on lipid panel trends' },
    ],
    aiSuggestions: [
      'What should I ask about my cholesterol targets?',
      'Explain my stress pattern to my doctor',
      'What is my cardiovascular risk score?',
      'What lifestyle changes should I prioritize?',
    ],
  },
  'High blood pressure': {
    summary: [
      { icon: '📊', text: 'Blood pressure elevated on 18 of 21 tracked days — highest readings on high-stress days', reason: 'Self-reported health scores + Oura' },
      { icon: '😴', text: 'Sleep under 65 correlates with next-day elevated readings — 4 of 4 weeks', reason: 'Oura sleep data' },
      { icon: '📋', text: 'Quality-of-life impact rated moderate. Fatigue and headaches noted in journal entries.', reason: 'Self-reported ePRO' },
      { icon: '💊', text: 'Currently on ACE inhibitor + lifestyle modifications. Consistent 5/7 days.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My readings are still elevated despite medication. Should we adjust the dosage or add a second agent?', reason: 'Based on 3 months of tracking' },
      { text: 'I have consistent sleep disruption. Could sleep apnea be contributing to my blood pressure?', reason: 'Based on Oura sleep data' },
      { text: 'What home blood pressure monitoring technique do you recommend for accuracy?', reason: 'Monitoring best practice' },
      { text: 'What is my target blood pressure range given my age and other risk factors?', reason: 'Personalized target question' },
    ],
    aiSuggestions: [
      'What should I ask about my blood pressure targets?',
      'Explain my stress pattern to my doctor',
      'What is my cardiovascular risk score?',
      'What lifestyle changes should I prioritize?',
    ],
  },
  'Type 2 diabetes': {
    summary: [
      { icon: '📊', text: 'Blood sugar management: moderate concern — stress days correlate with higher readings', reason: 'Self-reported tracking + Oura HRV' },
      { icon: '🔍', text: 'Top contributors: poor sleep (45%) and high-carb meals (25%) — confirmed 3 of 4 weeks', reason: 'Check-in context tags' },
      { icon: '📋', text: 'HbA1c trend: gradual improvement over 12 weeks with dietary modifications', reason: 'Self-reported progress' },
      { icon: '💊', text: 'Currently on metformin + lifestyle program. Adherent ~5/7 days.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My HbA1c is improving but still above target. Should we adjust medication or intensify lifestyle changes?', reason: 'Based on 12 weeks of data' },
      { text: 'My data shows blood sugar spikes after stress. Are there short-term strategies for that?', reason: 'Based on stress-glucose correlation' },
      { text: 'What is my kidney function status, and does it affect my medication options?', reason: 'Renal health and medication question' },
      { text: 'When should I consider additional diabetes medications or GLP-1 therapy?', reason: 'Treatment escalation question' },
    ],
    aiSuggestions: [
      'What should I ask about my HbA1c target?',
      'Explain my stress pattern to my doctor',
      'What is my cardiovascular risk score?',
      'What lifestyle changes should I prioritize?',
    ],
  },
  'Heart disease': {
    summary: [
      { icon: '📊', text: 'Stress → symptom pattern confirmed: high-stress days correlate with fatigue and discomfort 48 hrs later', reason: 'Oura HRV + self-reported context' },
      { icon: '😴', text: '82% of worst days follow nights with sleep score under 65', reason: 'Oura sleep data + health scores' },
      { icon: '📋', text: 'Quality-of-life impact rated moderate. Activity limitations noted in journal entries.', reason: 'Self-reported ePRO' },
      { icon: '💊', text: 'Currently on cardiac medications. Adherent 6/7 days.', reason: 'Self-reported treatment' },
    ],
    questions: [
      { text: 'My data shows a clear stress → symptom pattern. Are there preventive strategies for high-stress periods?', reason: 'Based on 21-day stress correlation' },
      { text: 'What is my current cardiovascular risk score and what are my treatment targets?', reason: 'Risk stratification question' },
      { text: 'Should I be referred to cardiac rehabilitation given my activity limitations?', reason: 'Based on activity journal data' },
      { text: 'How often should I be tested for lipids, blood pressure, and other cardiac risk markers?', reason: 'Monitoring frequency question' },
    ],
    aiSuggestions: [
      'What should I ask about my cardiac risk targets?',
      'Explain my stress pattern to my doctor',
      'What is my cardiovascular risk score?',
      'What lifestyle changes should I prioritize?',
    ],
  },
}

const GENERIC_PREPARE_PLAYBOOK = {
  summary: [
    { icon: '📊', text: '21 days of daily health check-ins tracked — pattern data ready to review', reason: 'Self-reported health scores' },
    { icon: '🔍', text: 'Top correlating factors: stress (45%), poor sleep (25%), dietary patterns (10%)', reason: 'Context tags across check-ins' },
    { icon: '💡', text: 'Lifestyle data captured across tracked days — ready for care team review', reason: 'AI-assisted health tracking' },
    { icon: '💊', text: 'Current management: lifestyle tracking and monitoring. No formal diagnosis yet.', reason: 'Self-reported approach' },
  ],
  questions: [
    { text: 'Based on my tracking data and family history, what is your initial assessment of my cardiovascular risk?', reason: 'Pre-diagnosis exploration' },
    { text: 'Should I have a full lipid panel, blood sugar, and metabolic workup done?', reason: 'Based on risk factor logs' },
    { text: 'Are there diagnostic tests (bloodwork, imaging, ECG) we should consider?', reason: 'Workup question' },
    { text: 'If a condition is identified, what would first-line treatment typically look like?', reason: 'Planning question' },
  ],
  aiSuggestions: [
    'What questions should I ask without a diagnosis?',
    'What tests might my care team order?',
    'How do I describe my symptoms clearly?',
    'What is my cardiovascular risk score?',
  ],
}

function playbookFor(condition) {
  if (!condition) return GENERIC_PREPARE_PLAYBOOK
  return PREPARE_PLAYBOOKS[condition] || GENERIC_PREPARE_PLAYBOOK
}

const STORIES = [
  {
    step: 'Story 1 of 5', avatar: 'M', name: 'Marcus, 52', detail: 'High cholesterol + hypertension · 8 years managed',
    quote: "I'd been on the same statin for six years. I didn't know there was a whole range of options — or that my risk score had changed.",
    context: "Marcus's cardiologist walked him through his 10-year cardiovascular risk score for the first time. Understanding where he stood gave Marcus the confidence to ask about optimizing his treatment, and they agreed to add a lifestyle referral.",
    takeaway: 'Ask: "What is my current cardiovascular risk score, and what comes next?"', takeawaySub: 'A question for your upcoming visit',
    bg: 'linear-gradient(150deg,#2B1B3D,#4A2D6B)', glow: 'radial-gradient(circle at 75% 20%,rgba(123,45,142,.25),transparent 60%)',
  },
  {
    step: 'Story 2 of 5', avatar: 'P', name: 'Priya, 58', detail: 'Type 2 diabetes · Sleep and stress contributors',
    quote: "My doctor kept asking about my numbers. But it was the fatigue and the stress at work that were really affecting my management.",
    context: "Priya learned that quality-of-life impact — not just lab values — matters for treatment decisions. Once she started describing her sleep disruption and energy levels, her GP reassessed her treatment plan and referred her to a diabetes educator.",
    takeaway: 'Tell your doctor how your condition affects your life — not just your numbers.', takeawaySub: 'Your health scores capture this, too',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)', glow: 'radial-gradient(circle at 20% 75%,rgba(232, 239, 101,.15),transparent 55%)',
  },
  {
    step: 'Story 3 of 5', avatar: 'D', name: 'Diane, 49', detail: 'Family history of heart disease · Prevention focused',
    quote: "I read that heart disease in women presents differently. That changed every question I asked.",
    context: "Diane researched sex-specific cardiovascular risk. When she brought this to her cardiologist, they discussed that standard risk calculators may underestimate risk in women, and agreed on more frequent monitoring.",
    takeaway: 'Ask: "Does my risk profile look different given my age and sex?"', takeawaySub: 'Researchers are documenting important differences',
    bg: 'linear-gradient(150deg,#3D2258,#5A3580)', glow: 'radial-gradient(circle at 65% 30%,rgba(232,134,106,.15),transparent 55%)',
  },
  {
    step: 'Story 4 of 5', avatar: 'J', name: 'James, 55', detail: 'Hypertension + high cholesterol · Stress and sleep triggers',
    quote: "I showed my cardiologist three weeks of tracking data. She said it was the most useful thing a patient had ever brought in.",
    context: "James tracked his blood pressure readings, sleep, and stress daily. When his cardiologist saw the pattern — stress on Monday, elevated readings by Wednesday — she immediately adjusted his treatment approach.",
    takeaway: 'Your tracking data tells a story. Share your Cardiometabolic360 summary.', takeawaySub: 'Your 21-day summary is ready to share',
    bg: 'linear-gradient(150deg,#2D4A38,#1a2e22)', glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.2),transparent 55%)',
  },
  {
    step: 'Story 5 of 5', avatar: 'A', name: 'Amira, 61', detail: 'Heart disease · Post-cardiac event recovery',
    quote: "I didn't know you could ask your cardiologist about cardiac rehab. I thought it was only for people much sicker than me.",
    context: "After her cardiac event, Amira's cardiologist mentioned a cardiac rehabilitation program. She learned that rehab is a proactive option for reducing future risk — and that most people who qualify don't ask about it.",
    takeaway: 'Ask: "Am I a candidate for cardiac rehabilitation?"', takeawaySub: 'Rehab significantly reduces recurrence risk',
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
 * Writes to cardiometabolicProfile.nextAppointment so Prepare can read it back.
 */
function AppointmentModal({ initial, doctorFallback, onSave, onClose }) {
  const [date, setDate]                   = useState(initial?.date || '')
  const [time, setTime]                   = useState(initial?.time || '')
  const [providerName, setProviderName]   = useState(initial?.providerName || doctorFallback?.name || '')
  const [providerSpec, setProviderSpec]   = useState(initial?.providerSpecialty || doctorFallback?.specialty || 'Cardiology / General Practice')

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
          <input type="text" value={providerSpec} onChange={e => setProviderSpec(e.target.value)} style={inputStyle} placeholder="Cardiology / General Practice" />
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
  const dermName = doctor.name || 'your care team'
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
        <p className="pp-hero-sub">We turned your last few weeks into a conversation starter. Your cardiologist or GP will actually want to see this.</p>
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
                : (dermDisplay || 'Add your cardiologist or GP in Profile')}
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
              ? <>{firstName ? `${firstName} is` : "You're"} tracking <strong>{conditions.length} conditions</strong> ({conditions.join(', ')}) with 21 days of daily check-ins. Stress and sleep below 65 affect <strong>both</strong> conditions; risk profiles and treatment status differ.</>
              : conditions[0]
                ? <>{firstName ? `${firstName} is` : "You're"} tracking <strong>{conditions[0].toLowerCase()}</strong> with 21 days of daily check-ins. Clear stress-sleep pattern with a defined treatment plan in progress.</>
                : <>21 days of self-tracked health data ready for review. No formal diagnosis yet — health trends and contributing factors documented.</>
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
          <div className="pp-sum-tile"><div className="pp-st-label">High-symptom days</div><div className="pp-st-val pp-st-val--warm">7</div><div className="pp-st-detail">of 21 days (33%)</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Top pattern</div><div className="pp-st-val pp-st-val--purple">Stress</div><div className="pp-st-detail">48-hr lag · 82% confidence</div></div>
          <div className="pp-sum-tile"><div className="pp-st-label">Avg health score</div><div className="pp-st-val">2.8</div><div className="pp-st-detail">Moderate · range 2–4</div></div>
        </div>
        <div className="pp-card">
          <div className="pp-card-label">Key findings to share</div>
          {allFindings.map((item, i) => {
            const cMod = item.condition ? `--${item.condition.toLowerCase()}` : ''
            return (
              <React.Fragment key={i}>
                <div className="pp-q-row">
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
                {i === 0 && (
                  <div className="pp-q-row pp-q-row--sponsor" aria-label="Sponsored by Sanofi">
                    <img
                      src="/sanofi.jpg"
                      alt="Sanofi"
                      className="pp-q-sponsor-logo"
                    />
                  </div>
                )}
              </React.Fragment>
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
          <div className="pp-ai-label"><span className="pp-ai-dot" />Cardiometabolic360 AI · Visit prep mode</div>
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

      <div className="sponsor-card-wrap sponsor-card-wrap--lg">
        <SponsorBanner variant="card" />
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
