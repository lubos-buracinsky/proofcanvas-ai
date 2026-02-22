import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import aiRouter from './api/ai.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.API_PORT || 3180

app.use(express.json())

// API routes
app.use('/api/ai', aiRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Serve static files in production
app.use(express.static(join(__dirname, 'dist')))
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
