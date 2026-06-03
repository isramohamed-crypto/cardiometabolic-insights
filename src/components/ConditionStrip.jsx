import React, { useState, useEffect } from 'react'

function readConditions() {
  try {
    const raw = localStorage.getItem('cardiometabolicProfile')
    const profile = raw ? JSON.parse(raw) : {}
    // condition is stored as a string or array of labels
    const c = profile.condition
    if (!c) return []
    return Array.isArray(c) ? c : [c]
  } catch (_) { return [] }
}

// Per-condition content cards
const CONDITION_CONTENT = {
  'High cholesterol': {
    icon: '🫀',
    gradient: 'linear-gradient(135deg, #0A2463 0%, #1B4FBF 100%)',
    label: 'Cholesterol',
    stat: '1 in 3 adults has high LDL cholesterol — most have no symptoms.',
    tip: 'Your LDL goal depends on your overall risk. Ask your doctor what target is right for you.',
    cta: 'Know your number',
  },
  'High blood pressure': {
    icon: '🩺',
    gradient: 'linear-gradient(135deg, #7B0D1E 0%, #C1292E 100%)',
    label: 'Blood Pressure',
    stat: 'Hypertension affects nearly half of U.S. adults — and two-thirds don\'t have it under control.',
    tip: 'Even a 5-point drop in systolic pressure meaningfully reduces stroke and heart attack risk.',
    cta: 'Track your readings',
  },
  'Type 2 diabetes': {
    icon: '🔬',
    gradient: 'linear-gradient(135deg, #0D5C63 0%, #0A9396 100%)',
    label: 'Blood Sugar',
    stat: 'People with type 2 diabetes are 2–4x more likely to develop heart disease.',
    tip: 'Keeping your A1C below 7% significantly lowers the risk of cardiovascular complications.',
    cta: 'Log your levels',
  },
  'Weight / metabolic health': {
    icon: '⚖️',
    gradient: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
    label: 'Metabolic Health',
    stat: 'Losing just 5–10% of body weight can lower LDL, blood pressure, and blood sugar simultaneously.',
    tip: 'Metabolic health isn\'t just about the scale — waist circumference and fasting glucose matter too.',
    cta: 'See your trends',
  },
  'Heart disease': {
    icon: '❤️‍🩹',
    gradient: 'linear-gradient(135deg, #6B2737 0%, #C9184A 100%)',
    label: 'Heart Health',
    stat: 'After a cardiac event, consistent follow-up care reduces recurrence risk by up to 40%.',
    tip: 'Cardiac rehab is one of the most underused but effective tools for recovery — ask if you qualify.',
    cta: 'Stay on track',
  },
  'Recovery': {
    icon: '❤️‍🩹',
    gradient: 'linear-gradient(135deg, #6B2737 0%, #C9184A 100%)',
    label: 'Recovery',
    stat: 'After a cardiac event, consistent follow-up care reduces recurrence risk by up to 40%.',
    tip: 'Cardiac rehab is one of the most underused but effective tools for recovery — ask if you qualify.',
    cta: 'Stay on track',
  },
  'Family history': {
    icon: '👨‍👩‍👧',
    gradient: 'linear-gradient(135deg, #2D1B69 0%, #5C3D8F 100%)',
    label: 'Family Risk',
    stat: 'Having a first-degree relative with heart disease doubles your own risk.',
    tip: 'Family history is a fixed risk factor — but many others aren\'t. Early action matters most.',
    cta: 'Build your baseline',
  },
  'Prevention focused': {
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #014F86 0%, #0077B6 100%)',
    label: 'Prevention',
    stat: 'Primary prevention — acting before a diagnosis — is the most cost-effective form of cardiac care.',
    tip: 'Knowing your baseline numbers (LDL, blood pressure, blood sugar, BMI) is where prevention starts.',
    cta: 'Know your baseline',
  },
}

const DEFAULT_CARD = {
  icon: '📊',
  gradient: 'linear-gradient(135deg, #0A2463 0%, #1B4FBF 100%)',
  label: 'Your Health',
  stat: 'Small, consistent actions compound into meaningful health outcomes over months and years.',
  tip: 'Start by knowing your numbers — LDL, blood pressure, blood sugar, and resting heart rate.',
  cta: 'Get started',
}

export default function ConditionStrip() {
  const [conditions, setConditions] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    setConditions(readConditions())
    function onFocus() { setConditions(readConditions()) }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const cards = conditions.length > 0
    ? conditions.map(c => CONDITION_CONTENT[c]).filter(Boolean)
    : [DEFAULT_CARD]

  if (cards.length === 0) return null

  const card = cards[activeIdx] || cards[0]

  return (
    <section className="condition-strip">
      <div className="condition-strip__card" style={{ background: card.gradient }}>
        <div className="condition-strip__icon">{card.icon}</div>
        <div className="condition-strip__body">
          <p className="condition-strip__label">{card.label}</p>
          <p className="condition-strip__stat">{card.stat}</p>
          <p className="condition-strip__tip">{card.tip}</p>
        </div>
        <button className="condition-strip__cta">{card.cta} →</button>
      </div>
      {cards.length > 1 && (
        <div className="condition-strip__dots">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`condition-strip__dot${i === activeIdx ? ' condition-strip__dot--active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`View ${cards[i].label}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
