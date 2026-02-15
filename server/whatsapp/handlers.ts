import { Request, Response } from 'express'
import { userQueries, sessionQueries, messageQueries } from '../db/queries.js'
import { generateCoachResponse } from '../ai/coach.js'
import { sendWhatsAppMessage } from './client.js'

interface WhatsAppMessage {
  From: string
  Body: string
  MessageSid: string
}

export async function handleIncomingMessage(req: Request, res: Response): Promise<void> {
  try {
    const message: WhatsAppMessage = req.body
    const phoneNumber = message.From.replace('whatsapp:', '')
    const messageBody = message.Body.trim()

    res.status(200).send('OK')

    let user = await userQueries.findByPhone(phoneNumber)
    if (!user) {
      user = await userQueries.create(phoneNumber, 'User')
      await sendWhatsAppMessage(
        phoneNumber,
        'Welcome to Hey Coach! 🎯\n\nI\'m your executive coach. How can I help you today?\n\nCommands:\n/help - Show available commands\n/session - Start a coaching session\n/assignments - View your assignments\n/progress - Check your progress'
      )
      return
    }

    if (messageBody.startsWith('/')) {
      await handleCommand(phoneNumber, messageBody, user.id)
      return
    }

    const activeSessions = await sessionQueries.findByUser(user.id)
    const activeSession = activeSessions.find(s => s.status === 'in_progress')

    if (!activeSession) {
      await sendWhatsAppMessage(
        phoneNumber,
        'Start a coaching session with /session or type /help for more options.'
      )
      return
    }

    await messageQueries.create({
      userId: user.id,
      sessionId: activeSession.id,
      role: 'user',
      content: messageBody,
    })

    const sessionMessages = await messageQueries.findBySession(activeSession.id)
    const context = {
      messages: sessionMessages
        .reverse()
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      userInfo: {
        name: user.name,
      },
    }

    const coachResponse = await generateCoachResponse(context)

    await messageQueries.create({
      userId: user.id,
      sessionId: activeSession.id,
      role: 'assistant',
      content: coachResponse,
    })

    await sendWhatsAppMessage(phoneNumber, coachResponse)
  } catch (error) {
    console.error('Error handling incoming message:', error)
  }
}

async function handleCommand(phoneNumber: string, command: string, userId: string): Promise<void> {
  const cmd = command.toLowerCase().split(' ')[0]

  switch (cmd) {
    case '/help':
      await sendWhatsAppMessage(
        phoneNumber,
        `📚 Available Commands:

/session - Start a new coaching session
/endsession - End current session
/assignments - View your assignments
/progress - Check your progress
/schedule - Schedule a voice call
/help - Show this message`
      )
      break

    case '/session':
      const existingSession = await sessionQueries.findByUser(userId)
      const active = existingSession.find(s => s.status === 'in_progress')

      if (active) {
        await sendWhatsAppMessage(
          phoneNumber,
          'You already have an active session. Use /endsession to end it first.'
        )
        return
      }

      const newSession = await sessionQueries.create(
        userId,
        `Session ${new Date().toLocaleDateString()}`,
        'text'
      )
      await sessionQueries.updateStatus(newSession!.id, 'in_progress')

      await sendWhatsAppMessage(
        phoneNumber,
        '🎯 New coaching session started!\n\nWhat would you like to focus on today?'
      )
      break

    case '/endsession':
      const sessions = await sessionQueries.findByUser(userId)
      const activeSession = sessions.find(s => s.status === 'in_progress')

      if (!activeSession) {
        await sendWhatsAppMessage(phoneNumber, 'No active session found.')
        return
      }

      await sessionQueries.complete(activeSession.id)
      await sendWhatsAppMessage(
        phoneNumber,
        '✅ Session completed! Great work today.\n\nType /session when you\'re ready for another session.'
      )
      break

    case '/assignments':
      await sendWhatsAppMessage(
        phoneNumber,
        '📋 View your assignments in the web dashboard:\nhttps://your-app-url.com/assignments'
      )
      break

    case '/progress':
      await sendWhatsAppMessage(
        phoneNumber,
        '📊 View your progress dashboard:\nhttps://your-app-url.com/progress'
      )
      break

    case '/schedule':
      await sendWhatsAppMessage(
        phoneNumber,
        '📞 Schedule a voice coaching call:\nhttps://your-app-url.com/sessions'
      )
      break

    default:
      await sendWhatsAppMessage(
        phoneNumber,
        'Unknown command. Type /help to see available commands.'
      )
  }
}

export async function handleWebhookVerification(_req: Request, res: Response): Promise<void> {
  res.status(200).send('Webhook verified')
}
