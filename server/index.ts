import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRouter from './routes/api.js'
import { handleIncomingMessage, handleWebhookVerification } from './whatsapp/handlers.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.get('/api/whatsapp/webhook', handleWebhookVerification)
app.post('/api/whatsapp/webhook', handleIncomingMessage)

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/api/whatsapp/webhook`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
})
