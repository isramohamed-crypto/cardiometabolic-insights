import React, { useState } from 'react'

const initialTasks = [
  {
    id: 1,
    title: 'Moisturize within 3 min of showering',
    desc: 'Ceramide cream — lock moisture before it evaporates',
    pill: 'Skincare',
    pillColor: 'teal',
    meta: 'Byrdie',
    done: false,
  },
  {
    id: 2,
    title: 'Try 4-7-8 breathing before bed',
    desc: 'Inhale 4s, hold 7s, exhale 8s — just once (19 sec)',
    pill: 'Stress',
    pillColor: 'sage',
    meta: 'Headspace',
    done: false,
  },
]

export default function TodayCard() {
  const [tasks, setTasks] = useState(initialTasks)

  function toggle(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const remaining = tasks.filter(t => !t.done).length

  return (
    <div className="focus-section">
      <ul className="focus-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`focus-task${task.done ? ' focus-task--done' : ''}`}
            onClick={() => toggle(task.id)}
          >
            <span className={`focus-task__check${task.done ? ' focus-task__check--filled' : ''}`}>
              {task.done && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <div className="focus-task__body">
              <p className="focus-task__title">{task.title}</p>
              <p className="focus-task__desc">{task.desc}</p>
              <div className="focus-task__meta">
                <span className={`focus-pill focus-pill--${task.pillColor}`}>{task.pill}</span>
                <span className="focus-task__category">{task.meta}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
