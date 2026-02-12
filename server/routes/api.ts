import express from 'express'
import {
  userQueries,
  sessionQueries,
  assignmentQueries,
  messageQueries,
  practiceAttemptQueries,
  progressMetricsQueries,
  notificationQueries,
} from '../db/queries.js'
import {
  generateCoachResponse,
  generateClientSimulatorResponse,
  evaluateCoachingResponse,
  generateFeedbackSummary,
} from '../ai/coach.js'

const router = express.Router()

router.get('/users', async (req, res) => {
  try {
    const { phone } = req.query
    if (phone) {
      const user = await userQueries.findByPhone(phone as string)
      res.json(user)
    } else {
      res.status(400).json({ error: 'Phone number required' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post('/users', async (req, res) => {
  try {
    const { phoneNumber, name } = req.body
    const user = await userQueries.findOrCreate(phoneNumber, name)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

router.get('/sessions', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' })
    }
    const sessions = await sessionQueries.findByUser(userId as string)
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

router.post('/sessions', async (req, res) => {
  try {
    const { userId, title, type, scheduledAt } = req.body
    const session = await sessionQueries.create(
      userId,
      title,
      type,
      scheduledAt ? new Date(scheduledAt) : undefined
    )
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' })
  }
})

router.patch('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, score, notes } = req.body
    
    if (status === 'completed') {
      await sessionQueries.complete(id, score, notes)
    } else if (status) {
      await sessionQueries.updateStatus(id, status)
    }
    
    const session = await sessionQueries.findById(id)
    res.json(session)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session' })
  }
})

router.get('/assignments', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' })
    }
    const assignments = await assignmentQueries.findByUser(userId as string)
    res.json(assignments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' })
  }
})

router.post('/assignments', async (req, res) => {
  try {
    const { userId, title, description, scenario, difficulty, dueDate } = req.body
    const assignment = await assignmentQueries.create(userId, {
      title,
      description,
      scenario,
      difficulty,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })
    res.json(assignment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

router.get('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params
    const assignment = await assignmentQueries.findById(id)
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' })
    }
    res.json(assignment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment' })
  }
})

router.post('/practice/start', async (req, res) => {
  try {
    const { assignmentId, userId } = req.body
    const attempt = await practiceAttemptQueries.create(assignmentId, userId)
    await assignmentQueries.updateStatus(assignmentId, 'in_progress')
    res.json(attempt)
  } catch (error) {
    res.status(500).json({ error: 'Failed to start practice' })
  }
})

router.post('/practice/:attemptId/message', async (req, res) => {
  try {
    const { attemptId } = req.params
    const { userMessage, assignment } = req.body

    const attempt = await practiceAttemptQueries.findById(attemptId)
    if (!attempt) {
      return res.status(404).json({ error: 'Practice attempt not found' })
    }

    const conversationHistory = (attempt.conversationData as any)?.messages || []

    const clientResponse = await generateClientSimulatorResponse(
      assignment.scenario,
      [...conversationHistory, { role: 'assistant', content: userMessage }]
    )

    const evaluation = await evaluateCoachingResponse(userMessage, {
      clientMessage: conversationHistory.length > 0 
        ? conversationHistory[conversationHistory.length - 1].content 
        : 'Initial greeting',
      scenario: assignment.scenario,
      conversationHistory,
    })

    const newConversation = {
      messages: [
        ...conversationHistory,
        { role: 'assistant', content: userMessage, evaluation },
        { role: 'user', content: clientResponse },
      ],
    }

    await practiceAttemptQueries.updateConversation(attemptId, newConversation)

    res.json({
      clientResponse,
      evaluation,
      conversationHistory: newConversation.messages,
    })
  } catch (error) {
    console.error('Practice message error:', error)
    res.status(500).json({ error: 'Failed to process message' })
  }
})

router.post('/practice/:attemptId/complete', async (req, res) => {
  try {
    const { attemptId } = req.params
    const { score, feedback, metrics } = req.body

    await practiceAttemptQueries.complete(attemptId, score, feedback, metrics)
    
    const attempt = await practiceAttemptQueries.findById(attemptId)
    if (attempt) {
      await assignmentQueries.complete(attempt.assignmentId, score, feedback)
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete practice' })
  }
})

router.get('/practice/assignment/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params
    const attempts = await practiceAttemptQueries.findByAssignment(assignmentId)
    res.json(attempts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch practice attempts' })
  }
})

router.get('/messages', async (req, res) => {
  try {
    const { sessionId, assignmentId } = req.query
    
    if (sessionId) {
      const messages = await messageQueries.findBySession(sessionId as string)
      res.json(messages)
    } else if (assignmentId) {
      const messages = await messageQueries.findByAssignment(assignmentId as string)
      res.json(messages)
    } else {
      res.status(400).json({ error: 'Session ID or Assignment ID required' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

router.post('/coach/chat', async (req, res) => {
  try {
    const { messages, userInfo } = req.body
    const response = await generateCoachResponse({ messages, userInfo })
    res.json({ response })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { period = 'weekly', startDate, endDate } = req.query

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate as string) : new Date()

    const metrics = await progressMetricsQueries.findByUserAndPeriod(
      userId,
      period as 'daily' | 'weekly' | 'monthly',
      start,
      end
    )

    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' })
  }
})

router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const notifications = await notificationQueries.findByUser(userId)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params
    await notificationQueries.markAsRead(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' })
  }
})

export default router
