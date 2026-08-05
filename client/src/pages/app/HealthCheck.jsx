import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import './HealthCheck.css'

// Re-surfaces onboarding's health question for confirmation, then asks two
// short follow-ups (last saw a doctor, any prescriptions) — each branching
// into a one-question drill-down depending on the answer. Reached from a
// card on Routine; results land in Me's "health details" (not built yet)
// and quietly reshape what shows up in Read.
//
// Visual note: this previews the new cream/pill visual system from the
// Figma demo, scoped to just this flow for now — onboarding itself still
// uses the older colored-header chrome until that flow gets its own pass.
const CONDITIONS = [
  { id: 'heart-cholesterol', label: 'Heart or cholesterol' },
  { id: 'blood-pressure', label: 'Blood pressure' },
  { id: 'blood-sugar', label: 'Blood sugar' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'sleep', label: 'Sleep' },
]
const SOMETHING_ELSE = { id: 'something-else', label: 'Something else' }

const DOCTOR_TIMING = [
  { id: 'within-year', label: 'Within the year' },
  { id: 'a-while', label: "It's been a while" },
  { id: 'cant-remember', label: "Honestly, can't remember" },
]

const DOCTOR_BARRIERS = [
  { id: 'no-doctor', label: 'No doctor right now' },
  { id: 'appointment', label: 'Hard to get an appointment' },
  { id: 'cost', label: 'Cost or insurance' },
  { id: 'feel-fine', label: 'I feel fine' },
  { id: 'meaning-to', label: 'I keep meaning to' },
  { id: 'nervous', label: 'Nervous about going' },
]

const PRESCRIPTION_OPTIONS = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
]

const PRESCRIPTION_FOR = [
  { id: 'cholesterol', label: 'Cholesterol' },
  { id: 'blood-pressure', label: 'Blood pressure' },
  { id: 'blood-sugar', label: 'Blood sugar' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'sleep', label: 'Sleep' },
]

const CONDITION_LABELS = {
  'heart-cholesterol': 'your heart',
  'blood-pressure': 'blood pressure',
  'blood-sugar': 'blood sugar',
  thyroid: 'thyroid',
  sleep: 'sleep',
}

function Pill({ label, selected, onClick, dashed }) {
  return (
    <button
      type="button"
      className={`health-check__pill${selected ? ' health-check__pill--selected' : ''}${dashed ? ' health-check__pill--dashed' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {selected && <span aria-hidden="true">✓ </span>}
      {label}
    </button>
  )
}

function HealthCheck() {
  const navigate = useNavigate()
  const { answers, setAnswer } = useOnboarding()
  const [stage, setStage] = useState('intro')

  const priorConditions = answers.healthConditions || []
  const [conditions, setConditions] = useState(priorConditions)
  const [doctorTiming, setDoctorTiming] = useState(null)
  const [doctorBarrier, setDoctorBarrier] = useState(null)
  const [prescriptions, setPrescriptions] = useState(null)
  const [prescriptionFor, setPrescriptionFor] = useState([])

  const toggleCondition = (id) => {
    setConditions((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const togglePrescriptionFor = (id) => {
    setPrescriptionFor((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const finish = () => {
    setAnswer('healthCheck', {
      conditions,
      doctorTiming,
      doctorBarrier,
      prescriptions,
      prescriptionFor,
      completedAt: new Date().toISOString(),
    })
    setStage('done')
  }

  const handleDoctorTimingContinue = () => {
    setStage(doctorTiming === 'within-year' || !doctorTiming ? 'prescriptions' : 'doctorBarrier')
  }

  const handlePrescriptionsContinue = () => {
    setStage(prescriptions === 'yes' ? 'prescriptionFor' : 'done')
    if (prescriptions !== 'yes') finish()
  }

  const primaryConditionLabel = CONDITION_LABELS[conditions[0]] || 'your health'

  if (stage === 'intro') {
    return (
      <main className="health-check health-check--hero">
        <div className="health-check__hero-content">
          <p className="health-check__eyebrow">Health check · 2 min</p>
          <h1 className="health-check__hero-title">
            Two minutes, so this <span className="health-check__accent">fits your health</span>.
          </h1>
          <p className="health-check__hero-body">
            Your answers shape the habits we suggest and the reading we send. Skip anything
            you'd rather not answer.
          </p>
          <button type="button" className="health-check__cta" onClick={() => setStage('confirm')}>
            Start the check
          </button>
          <button type="button" className="health-check__link" onClick={() => navigate('/routine')}>
            Not now
          </button>
          <p className="health-check__disclaimer">
            Private to you. Your answers only shape what we show you — never sold, never used
            for ads.
          </p>
        </div>
      </main>
    )
  }

  if (stage === 'done') {
    return (
      <main className="health-check">
        <p className="health-check__step-label">Health check · Done</p>
        <h1 className="health-check__title">
          That's it. <span className="health-check__accent">Here's what changes.</span>
        </h1>

        <ul className="health-check__changes">
          <li>
            <p className="health-check__change-title">Habits that suit {primaryConditionLabel}</p>
            <p className="health-check__change-desc">
              Your current habit already counts as one. The next ones we offer will too.
            </p>
          </li>
          <li>
            <p className="health-check__change-title">More relevant reading, less noise</p>
            <p className="health-check__change-desc">From Health and EatingWell, in the Read tab.</p>
          </li>
          <li>
            <p className="health-check__change-title">A recap you can take to a doctor</p>
            <p className="health-check__change-desc">
              Building quietly in Me — for whenever you go.
            </p>
          </li>
        </ul>

        <p className="health-check__footnote">Change any answer in Me · Health details.</p>

        <button type="button" className="health-check__cta" onClick={() => navigate('/routine')}>
          Back to my routine
        </button>
      </main>
    )
  }

  return (
    <main className="health-check">
      <p className="health-check__step-label">
        {stage === 'confirm' && '1 of 3'}
        {(stage === 'doctorTiming' || stage === 'doctorBarrier') && '2 of 3'}
        {(stage === 'prescriptions' || stage === 'prescriptionFor') && '3 of 3'}
      </p>
      <div className="health-check__progress">
        <div
          className="health-check__progress-fill"
          style={{
            width:
              stage === 'confirm'
                ? '33%'
                : stage === 'doctorTiming' || stage === 'doctorBarrier'
                  ? '66%'
                  : '100%',
          }}
        />
      </div>

      {stage === 'confirm' && (
        <>
          <h1 className="health-check__title">
            {priorConditions.length > 0
              ? `When you started, you said you were keeping an eye on ${primaryConditionLabel}.`
              : 'Anything you keep an eye on, health-wise?'}
          </h1>
          <p className="health-check__body">
            {priorConditions.length > 0
              ? 'Still right? Add anything that\'s come up since.'
              : 'Totally optional — it just helps us point things the right way.'}
          </p>

          <div className="health-check__pills">
            {CONDITIONS.map((c) => (
              <Pill
                key={c.id}
                label={c.label}
                selected={conditions.includes(c.id)}
                onClick={() => toggleCondition(c.id)}
              />
            ))}
            <Pill
              label={SOMETHING_ELSE.label}
              selected={conditions.includes(SOMETHING_ELSE.id)}
              onClick={() => toggleCondition(SOMETHING_ELSE.id)}
              dashed
            />
          </div>

          <button type="button" className="health-check__cta" onClick={() => setStage('doctorTiming')}>
            Continue
          </button>
        </>
      )}

      {stage === 'doctorTiming' && (
        <>
          <p className="health-check__followup-label">Follow-up</p>
          <h1 className="health-check__title">When did you last see a doctor?</h1>

          <div className="health-check__options">
            {DOCTOR_TIMING.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`health-check__option${doctorTiming === option.id ? ' health-check__option--selected' : ''}`}
                aria-pressed={doctorTiming === option.id}
                onClick={() => setDoctorTiming(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button type="button" className="health-check__cta" onClick={handleDoctorTimingContinue}>
            Continue
          </button>
          <button type="button" className="health-check__link" onClick={handleDoctorTimingContinue}>
            Skip this one
          </button>
        </>
      )}

      {stage === 'doctorBarrier' && (
        <>
          <p className="health-check__followup-label">Follow-up</p>
          <h1 className="health-check__title">What's getting in the way?</h1>

          <div className="health-check__pills">
            {DOCTOR_BARRIERS.map((option) => (
              <Pill
                key={option.id}
                label={option.label}
                selected={doctorBarrier === option.id}
                onClick={() => setDoctorBarrier(option.id)}
              />
            ))}
          </div>

          <p className="health-check__footnote">No wrong answer — it changes what we can help with.</p>

          <button type="button" className="health-check__cta" onClick={() => setStage('prescriptions')}>
            Continue
          </button>
        </>
      )}

      {stage === 'prescriptions' && (
        <>
          <h1 className="health-check__title">Any prescriptions you're keeping up with?</h1>

          <div className="health-check__options">
            {PRESCRIPTION_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`health-check__option${prescriptions === option.id ? ' health-check__option--selected' : ''}`}
                aria-pressed={prescriptions === option.id}
                onClick={() => setPrescriptions(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button type="button" className="health-check__cta" onClick={handlePrescriptionsContinue}>
            Continue
          </button>
          <button type="button" className="health-check__link" onClick={handlePrescriptionsContinue}>
            Skip this one
          </button>
        </>
      )}

      {stage === 'prescriptionFor' && (
        <>
          <p className="health-check__followup-label">Follow-up</p>
          <h1 className="health-check__title">What are you taking them for?</h1>

          <div className="health-check__pills">
            {PRESCRIPTION_FOR.map((option) => (
              <Pill
                key={option.id}
                label={option.label}
                selected={prescriptionFor.includes(option.id)}
                onClick={() => togglePrescriptionFor(option.id)}
              />
            ))}
          </div>

          <p className="health-check__footnote">
            This stays private. It only shapes what we show you — we'll never tell you to change
            a medication.
          </p>

          <button type="button" className="health-check__cta" onClick={finish}>
            Continue
          </button>
        </>
      )}
    </main>
  )
}

export default HealthCheck
