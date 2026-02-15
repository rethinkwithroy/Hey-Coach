import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import serverless from 'serverless-http'
import apiRouter from '../server/routes/api.js'
import { handleIncomingMessage, handleWebhookVerification } from '../server/whatsapp/handlers.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.get('/api/whatsapp/webhook', handleWebhookVerification)
app.post('/api/whatsapp/webhook', handleIncomingMessage)

app.use('/api', apiRouter)

export default serverless(app)
