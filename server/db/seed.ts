import { db } from './index.js'
import { schema } from './index.js'

async function seed() {
  console.log('🌱 Seeding database...')

  await db.insert(schema.users).values({
    id: 'demo-user-123',
    phoneNumber: '+1234567890',
    name: 'Demo User',
  }).onConflictDoNothing()

  const now = new Date()
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  await db.insert(schema.sessions).values([
    {
      id: 'session-1',
      userId: 'demo-user-123',
      title: 'Leadership Development Session',
      type: 'text' as const,
      status: 'completed' as const,
      startedAt: weekAgo,
      completedAt: new Date(weekAgo.getTime() + 3600 * 1000),
      duration: 3600,
      score: 85,
      notes: 'Great progress on delegation skills',
      scheduledAt: weekAgo,
      createdAt: weekAgo,
      updatedAt: new Date(weekAgo.getTime() + 3600 * 1000),
    },
    {
      id: 'session-2',
      userId: 'demo-user-123',
      title: 'Communication Skills Workshop',
      type: 'voice' as const,
      status: 'completed' as const,
      startedAt: dayAgo,
      completedAt: new Date(dayAgo.getTime() + 2700 * 1000),
      duration: 2700,
      score: 78,
      notes: 'Worked on active listening techniques',
      scheduledAt: dayAgo,
      createdAt: dayAgo,
      updatedAt: new Date(dayAgo.getTime() + 2700 * 1000),
    },
    {
      id: 'session-3',
      userId: 'demo-user-123',
      title: 'Goal Setting Session',
      type: 'text' as const,
      status: 'scheduled' as const,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
  ]).onConflictDoNothing()

  await db.insert(schema.assignments).values([
    {
      id: 'assignment-1',
      userId: 'demo-user-123',
      title: 'Difficult Conversation Practice',
      description: 'Practice having a challenging conversation with an underperforming team member',
      scenario: 'You need to address performance issues with a team member who has been missing deadlines. They are defensive and feel the workload is unfair. Practice delivering constructive feedback while maintaining empathy and professionalism.',
      difficulty: 'intermediate' as const,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'assignment-2',
      userId: 'demo-user-123',
      title: 'Conflict Resolution Scenario',
      description: 'Mediate a conflict between two team members with different work styles',
      scenario: 'Two senior team members are in conflict. One prefers detailed planning while the other favors quick iteration. Their disagreements are affecting team morale. You need to facilitate a resolution that respects both perspectives.',
      difficulty: 'advanced' as const,
      status: 'in_progress' as const,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdAt: weekAgo,
      updatedAt: dayAgo,
    },
    {
      id: 'assignment-3',
      userId: 'demo-user-123',
      title: 'Career Development Coaching',
      description: 'Coach an ambitious employee who wants a promotion',
      scenario: 'A high-performing employee wants to be promoted to a leadership role but lacks some key skills. They are impatient and feel they deserve the promotion now. Help them create a realistic development plan.',
      difficulty: 'beginner' as const,
      status: 'completed' as const,
      completedAt: weekAgo,
      score: 88,
      feedback: 'Excellent empathy and practical action planning. Great job maintaining positive energy while setting realistic expectations.',
      dueDate: new Date(weekAgo.getTime() + 24 * 60 * 60 * 1000),
      createdAt: new Date(weekAgo.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: weekAgo,
    },
  ]).onConflictDoNothing()

  await db.insert(schema.notifications).values([
    {
      id: 'notif-1',
      userId: 'demo-user-123',
      type: 'assignment_due' as const,
      title: 'Assignment Due Soon',
      message: 'Your "Difficult Conversation Practice" assignment is due in 3 days',
      isRead: false,
      createdAt: now,
    },
    {
      id: 'notif-2',
      userId: 'demo-user-123',
      type: 'milestone' as const,
      title: 'Milestone Achieved!',
      message: 'Congratulations! You\'ve completed your first assignment with a score of 88/100',
      isRead: false,
      createdAt: weekAgo,
    },
  ]).onConflictDoNothing()

  console.log('✅ Database seeded successfully!')
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))
