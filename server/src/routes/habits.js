import { Router } from 'express'

const router = Router()

// In-memory placeholder store — replace with a real database later.
let habits = [
  { id: 1, name: 'Morning walk', frequency: 'daily', streak: 0 },
  { id: 2, name: 'Strength training', frequency: '3x/week', streak: 0 },
]

router.get('/', (req, res) => {
  res.json(habits)
})

router.post('/', (req, res) => {
  const habit = { id: Date.now(), streak: 0, ...req.body }
  habits.push(habit)
  res.status(201).json(habit)
})

router.post('/:id/complete', (req, res) => {
  const habit = habits.find((h) => h.id === Number(req.params.id))
  if (!habit) return res.status(404).json({ error: 'Habit not found' })
  habit.streak += 1
  res.json(habit)
})

export default router
