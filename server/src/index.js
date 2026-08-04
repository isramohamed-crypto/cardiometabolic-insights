import express from 'express'
import cors from 'cors'
import habitsRouter from './routes/habits.js'
import trackingRouter from './routes/tracking.js'
import contentRouter from './routes/content.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/habits', habitsRouter)
app.use('/api/tracking', trackingRouter)
app.use('/api/content', contentRouter)

app.listen(PORT, () => {
  console.log(`Vitalist server running on http://localhost:${PORT}`)
})
