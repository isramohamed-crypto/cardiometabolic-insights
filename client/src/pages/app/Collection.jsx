import { useEffect, useState } from 'react'
import './page.css'

function Collection() {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    fetch('/api/habits')
      .then((res) => res.json())
      .then(setHabits)
      .catch(() => setHabits([]))
  }, [])

  return (
    <div className="page">
      <p className="page__lead">Habits you're building.</p>

      <ul className="page__list">
        {habits.map((habit) => (
          <li key={habit.id}>
            <p className="page__list-title">{habit.name}</p>
            <p className="page__list-meta">
              {habit.frequency} · streak {habit.streak}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Collection
