import { useEffect, useState } from 'react'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import './page.css'

function Routine() {
  const { answers } = useOnboarding()
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('server not running'))
  }, [])

  return (
    <div className="page">
      <p className="page__lead">
        {answers.name ? `Welcome back, ${answers.name}.` : 'Build healthy habits. Age well.'}
      </p>

      <section>
        <h2>Today</h2>
        <p>Your daily habit checklist will live here.</p>
      </section>

      <p style={{ marginTop: '2rem', color: '#999', fontSize: '0.8rem' }}>
        API status: {status}
      </p>
    </div>
  )
}

export default Routine
