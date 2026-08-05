import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './QuestionScreen.css'

// Stub account-creation screen — no real auth backend exists yet. Submitting
// just stores nothing and moves on; "Skip for now" does the same thing
// without pretending to collect anything. Wire up real signup before this
// ships anywhere but a demo.
function CreateAccount() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const canContinue = email.trim().length > 0 && password.length > 0

  const handleContinue = (e) => {
    e.preventDefault()
    navigate('/all-set')
  }

  return (
    <main className="question-screen">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Save your progress</p>
        <h1 className="question-screen__headline">
          <span>Create an account</span>
          <span>so it's here next time.</span>
        </h1>
      </div>

      <form className="question-screen__body" onSubmit={handleContinue}>
        <p className="question-screen__intro">
          Your habit and plan are saved on this device for now — an account keeps them yours
          across devices.
        </p>

        <input
          type="email"
          className="question-screen__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          style={{ marginBottom: 10 }}
        />
        <input
          type="password"
          className="question-screen__input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <div className="question-screen__spacer" />

        <button type="submit" className="question-screen__continue" disabled={!canContinue}>
          Create account
        </button>

        <button type="button" className="question-screen__skip" onClick={() => navigate('/all-set')}>
          Skip for now
        </button>
      </form>
    </main>
  )
}

export default CreateAccount
