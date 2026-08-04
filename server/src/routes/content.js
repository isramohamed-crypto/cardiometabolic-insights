import { Router } from 'express'

const router = Router()

// Placeholder for People Inc. longevity/wellness content feed.
// Swap this out for a real People Inc. content API integration.
const sampleContent = [
  {
    id: 1,
    title: 'The science of Zone 2 cardio for longevity',
    source: 'People Inc.',
    url: null,
  },
  {
    id: 2,
    title: 'How sleep quality affects healthspan',
    source: 'People Inc.',
    url: null,
  },
]

router.get('/', (req, res) => {
  res.json(sampleContent)
})

export default router
