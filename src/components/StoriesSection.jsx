import React from 'react'

const STORIES = [
  {
    step: '1 / 5', avatar: 'M', name: 'Marcus, 52', detail: 'High cholesterol + hypertension · 8 years managed',
    quote: "I'd been on the same statin for six years. I didn't know there was a whole range of options — or that my risk score had changed.",
    context: "Marcus's cardiologist walked him through his 10-year cardiovascular risk score for the first time. Understanding where he stood gave Marcus the confidence to ask about optimizing his treatment, and they agreed to add a lifestyle referral.",
    takeaway: 'Ask: "What is my current cardiovascular risk score, and what comes next?"',
    takeawaySub: 'A question for your upcoming visit',
    bg: 'linear-gradient(150deg,#2B1B3D,#4A2D6B)',
  },
  {
    step: '2 / 5', avatar: 'P', name: 'Priya, 58', detail: 'Type 2 diabetes · Sleep and stress contributors',
    quote: "My doctor kept asking about my numbers. But it was the fatigue and the stress at work that were really affecting my management.",
    context: "Priya learned that quality-of-life impact — not just lab values — matters for treatment decisions. Once she started describing her sleep disruption and energy levels, her GP reassessed her treatment plan.",
    takeaway: 'Tell your doctor how your condition affects your life — not just your numbers.',
    takeawaySub: 'Your health scores capture this, too',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)',
  },
  {
    step: '3 / 5', avatar: 'D', name: 'Diane, 49', detail: 'Family history of heart disease · Prevention focused',
    quote: "I read that heart disease in women presents differently. That changed every question I asked.",
    context: "Diane researched sex-specific cardiovascular risk. When she brought this to her cardiologist, they discussed that standard risk calculators may underestimate risk in women, and agreed on more frequent monitoring.",
    takeaway: 'Ask: "Does my risk profile look different given my age and sex?"',
    takeawaySub: 'Researchers are documenting important differences',
    bg: 'linear-gradient(150deg,#3D2258,#5A3580)',
  },
  {
    step: '4 / 5', avatar: 'J', name: 'James, 55', detail: 'Hypertension + high cholesterol · Stress and sleep triggers',
    quote: "I showed my cardiologist three weeks of tracking data. She said it was the most useful thing a patient had ever brought in.",
    context: "James tracked his blood pressure readings, sleep, and stress daily. When his cardiologist saw the pattern — stress on Monday, elevated readings by Wednesday — she immediately adjusted his treatment approach.",
    takeaway: 'Your tracking data tells a story. Share your Vitalist summary.',
    takeawaySub: 'Your 21-day summary is ready to share',
    bg: 'linear-gradient(150deg,#2D4A38,#1a2e22)',
  },
  {
    step: '5 / 5', avatar: 'A', name: 'Amira, 61', detail: 'Heart disease · Post-cardiac event recovery',
    quote: "I didn't know you could ask your cardiologist about cardiac rehab. I thought it was only for people much sicker than me.",
    context: "After her cardiac event, Amira's cardiologist mentioned a cardiac rehabilitation program. She learned that rehab is a proactive option for reducing future risk — and that most people who qualify don't ask about it.",
    takeaway: 'Ask: "Am I a candidate for cardiac rehabilitation?"',
    takeawaySub: 'Rehab significantly reduces recurrence risk',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)',
  },
]

export default function StoriesSection({ onNavigate }) {
  return (
    <section className="pp-stories-sec">
      <div className="watch-head" style={{ padding: '0 var(--space-5) var(--space-4)', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <span className="watch-badge">Paid content for Amgen</span>
        <h2 className="watch-title">Stories from others</h2>
      </div>

      {/* Native-scroll snap carousel — same pattern as EatingWell/VeryWell */}
      <div style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        padding: '0 var(--space-5) var(--space-2)',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {STORIES.map((s, i) => (
          <React.Fragment key={i}>
          {i === 2 && onNavigate && (
            <div
              onClick={() => onNavigate('Prepare')}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNavigate('Prepare') }}
              style={{
                flexShrink: 0,
                width: 'calc(100vw - 48px)',
                maxWidth: 360,
                scrollSnapAlign: 'start',
                borderRadius: 16,
                background: 'linear-gradient(150deg, #1a4a3a, #0d2e22)',
                padding: '20px 18px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.6, textTransform: 'uppercase' }}>
                Your next appointment
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
                  Ready to talk to your doctor?
                </div>
                <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.55 }}>
                  The stories you've read are full of questions worth asking. Vitalist turns them into a personalized prep kit for your visit.
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#2D9B83', borderRadius: 99,
                padding: '10px 18px', fontWeight: 700, fontSize: 13,
                alignSelf: 'flex-start',
              }}>
                Prepare for your visit →
              </div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>Vitalist · Personalized for you</div>
            </div>
          )}
          <div style={{
            flexShrink: 0,
            width: 'calc(100vw - 48px)',
            maxWidth: 360,
            scrollSnapAlign: 'start',
            borderRadius: 16,
            background: s.bg,
            padding: '20px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            color: '#fff',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.6, textTransform: 'uppercase' }}>
              {s.step}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}>{s.avatar}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{s.detail}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, fontStyle: 'italic', opacity: 0.95 }}>
              "{s.quote}"
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.75 }}>
              {s.context}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{s.takeaway}</div>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>{s.takeawaySub}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, opacity: 0.5, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>Verywell Health</span>
              <span>·</span>
              <span>In Partnership with Amgen</span>
            </div>
          </div>
          </React.Fragment>
        ))}
      </div>

      <div className="edu-disclaimer">
        <span className="edu-disclaimer__eyebrow">Paid content for Amgen</span>
        <span className="edu-disclaimer__body">
          <strong>Sponsored content.</strong> Videos and content produced in partnership with Amgen.
        </span>
      </div>
    </section>
  )
}
