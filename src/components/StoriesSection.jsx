import React, { useState, useRef } from 'react'

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
    takeaway: 'Your tracking data tells a story. Share your Vitalist summary.', takeawaySub: 'Your 21-day summary is ready to share',
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
            <span>In Partnership with Amgen</span>
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

export default function StoriesSection() {
  return (
    <section className="pp-stories-sec">
      <div className="watch-head">
        <div>
          <span className="watch-badge">Paid content for Amgen</span>
          <h2 className="watch-title">Stories from others</h2>
        </div>
      </div>
      <StoriesSwipe />
      <div className="edu-disclaimer" style={{ margin: 'var(--space-3) 0 0' }}>
        <span className="edu-disclaimer__eyebrow">Paid content for Amgen</span>
        <span className="edu-disclaimer__body">
          <strong>Sponsored content.</strong> Videos and content produced in partnership with Amgen.
        </span>
      </div>
    </section>
  )
}
