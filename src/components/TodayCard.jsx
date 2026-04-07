import React, { useState } from 'react'

const initialTasks = [
  { id: 1, label: 'Log morning vitals',     done: true },
  { id: 2, label: 'Complete 20-min walk',   done: false },
  { id: 3, label: 'Review nutrition guide', done: false },
  { id: 4, label: 'Schedule pharmacist call', done: false },
]

export default function TodayCard() {
  const [tasks, setTasks] = useState(initialTasks)

  function toggle(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const remaining = tasks.filter(t => !t.done).length

  return (
    <div className="card card--full">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Daily Actions</p>
          <h2 className="card__title">Today&rsquo;s focus</h2>
        </div>
        <span className="badge">{remaining} left</span>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`task-list__item${task.done ? ' task-list__item--done' : ''}`}
            onClick={() => toggle(task.id)}
          >
            <span className={`task-list__check${task.done ? '' : ' task-list__check--empty'}`}>
              {task.done ? '✓' : ''}
            </span>
            <span>{task.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
