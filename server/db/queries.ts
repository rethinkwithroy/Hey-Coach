import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'
import { db, schema } from './index.js'
import { nanoid } from 'nanoid'

export const userQueries = {
  async create(phoneNumber: string, name: string) {
    const id = nanoid()
    await db.insert(schema.users).values({ id, phoneNumber, name })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.users.findFirst({ where: eq(schema.users.id, id) })
  },

  async findByPhone(phoneNumber: string) {
    return db.query.users.findFirst({ where: eq(schema.users.phoneNumber, phoneNumber) })
  },

  async findOrCreate(phoneNumber: string, name: string) {
    const existing = await this.findByPhone(phoneNumber)
    if (existing) return existing
    return this.create(phoneNumber, name)
  },
}

export const sessionQueries = {
  async create(userId: string, title: string, type: 'text' | 'voice', scheduledAt?: Date) {
    const id = nanoid()
    await db.insert(schema.sessions).values({
      id,
      userId,
      title,
      type,
      scheduledAt: scheduledAt ? Math.floor(scheduledAt.getTime() / 1000) : undefined,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.sessions.findFirst({ where: eq(schema.sessions.id, id) })
  },

  async findByUser(userId: string) {
    return db.query.sessions.findMany({
      where: eq(schema.sessions.userId, userId),
      orderBy: [desc(schema.sessions.createdAt)],
    })
  },

  async updateStatus(id: string, status: string) {
    await db.update(schema.sessions).set({ 
      status,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.sessions.id, id))
  },

  async complete(id: string, score?: number, notes?: string) {
    await db.update(schema.sessions).set({
      status: 'completed',
      completedAt: Math.floor(Date.now() / 1000),
      score,
      notes,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.sessions.id, id))
  },
}

export const assignmentQueries = {
  async create(userId: string, data: {
    title: string
    description: string
    scenario: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    dueDate?: Date
  }) {
    const id = nanoid()
    await db.insert(schema.assignments).values({
      id,
      userId,
      ...data,
      dueDate: data.dueDate ? Math.floor(data.dueDate.getTime() / 1000) : undefined,
    })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.assignments.findFirst({ where: eq(schema.assignments.id, id) })
  },

  async findByUser(userId: string) {
    return db.query.assignments.findMany({
      where: eq(schema.assignments.userId, userId),
      orderBy: [desc(schema.assignments.createdAt)],
    })
  },

  async updateStatus(id: string, status: string) {
    await db.update(schema.assignments).set({ 
      status,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.assignments.id, id))
  },

  async complete(id: string, score: number, feedback: string) {
    await db.update(schema.assignments).set({
      status: 'completed',
      completedAt: Math.floor(Date.now() / 1000),
      score,
      feedback,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.assignments.id, id))
  },
}

export const messageQueries = {
  async create(data: {
    userId: string
    sessionId?: string
    assignmentId?: string
    role: 'user' | 'assistant' | 'system'
    content: string
    metadata?: any
  }) {
    const id = nanoid()
    await db.insert(schema.messages).values({ id, ...data })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.messages.findFirst({ where: eq(schema.messages.id, id) })
  },

  async findBySession(sessionId: string) {
    return db.query.messages.findMany({
      where: eq(schema.messages.sessionId, sessionId),
      orderBy: [desc(schema.messages.createdAt)],
    })
  },

  async findByAssignment(assignmentId: string) {
    return db.query.messages.findMany({
      where: eq(schema.messages.assignmentId, assignmentId),
      orderBy: [desc(schema.messages.createdAt)],
    })
  },
}

export const practiceAttemptQueries = {
  async create(assignmentId: string, userId: string) {
    const id = nanoid()
    await db.insert(schema.practiceAttempts).values({ id, assignmentId, userId })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.practiceAttempts.findFirst({ where: eq(schema.practiceAttempts.id, id) })
  },

  async findByAssignment(assignmentId: string) {
    return db.query.practiceAttempts.findMany({
      where: eq(schema.practiceAttempts.assignmentId, assignmentId),
      orderBy: [desc(schema.practiceAttempts.createdAt)],
    })
  },

  async complete(id: string, score: number, feedback: string, metrics: any) {
    await db.update(schema.practiceAttempts).set({
      status: 'completed',
      completedAt: Math.floor(Date.now() / 1000),
      score,
      feedback,
      metrics,
    }).where(eq(schema.practiceAttempts.id, id))
  },

  async updateConversation(id: string, conversationData: any) {
    await db.update(schema.practiceAttempts).set({
      conversationData,
    }).where(eq(schema.practiceAttempts.id, id))
  },
}

export const voiceCallQueries = {
  async create(sessionId: string, userId: string, callSid?: string) {
    const id = nanoid()
    await db.insert(schema.voiceCalls).values({ id, sessionId, userId, callSid })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.voiceCalls.findFirst({ where: eq(schema.voiceCalls.id, id) })
  },

  async updateStatus(id: string, status: string) {
    await db.update(schema.voiceCalls).set({ 
      status,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.voiceCalls.id, id))
  },

  async complete(id: string, data: {
    transcription?: string
    duration?: number
    score?: number
    feedback?: string
    recordingUrl?: string
  }) {
    await db.update(schema.voiceCalls).set({
      status: 'completed',
      ...data,
      updatedAt: Math.floor(Date.now() / 1000)
    }).where(eq(schema.voiceCalls.id, id))
  },
}

export const progressMetricsQueries = {
  async create(userId: string, data: {
    metricType: string
    metricValue: number
    period: 'daily' | 'weekly' | 'monthly'
    periodStart: Date
    periodEnd: Date
    metadata?: any
  }) {
    const id = nanoid()
    await db.insert(schema.progressMetrics).values({
      id,
      userId,
      ...data,
      periodStart: Math.floor(data.periodStart.getTime() / 1000),
      periodEnd: Math.floor(data.periodEnd.getTime() / 1000),
    })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.progressMetrics.findFirst({ where: eq(schema.progressMetrics.id, id) })
  },

  async findByUserAndPeriod(userId: string, period: 'daily' | 'weekly' | 'monthly', start: Date, end: Date) {
    return db.query.progressMetrics.findMany({
      where: and(
        eq(schema.progressMetrics.userId, userId),
        eq(schema.progressMetrics.period, period),
        gte(schema.progressMetrics.periodStart, Math.floor(start.getTime() / 1000)),
        lte(schema.progressMetrics.periodEnd, Math.floor(end.getTime() / 1000))
      ),
      orderBy: [desc(schema.progressMetrics.periodStart)],
    })
  },
}

export const notificationQueries = {
  async create(data: {
    userId?: string
    type: 'milestone' | 'assignment_due' | 'session_reminder' | 'general'
    title: string
    message: string
    metadata?: any
  }) {
    const id = nanoid()
    await db.insert(schema.notifications).values({ id, ...data })
    return this.findById(id)
  },

  async findById(id: string) {
    return db.query.notifications.findFirst({ where: eq(schema.notifications.id, id) })
  },

  async findByUser(userId: string) {
    return db.query.notifications.findMany({
      where: eq(schema.notifications.userId, userId),
      orderBy: [desc(schema.notifications.createdAt)],
    })
  },

  async markAsRead(id: string) {
    await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id))
  },
}
