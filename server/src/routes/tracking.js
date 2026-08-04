import { Router } from 'express'

const router = Router()

// In-memory placeholder store — replace with a real database later.
let entries = []

router.get('/', (req, res) => {
  res.json(entries)
})

router.post('/', (req, res) => {
  const { metric, value, unit, recordedAt } = req.body
  const entry = {
    id: Date.now(),
    metric,
    value,
    unit,
    recordedAt: recordedAt || new Date().toISOString(),
  }
  entries.push(entry)
  res.status(201).json(entry)
})

export default router
