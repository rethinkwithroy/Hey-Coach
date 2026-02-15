import { useQuery } from '@tanstack/react-query'
import { api, mockUserId } from '../lib/api'
import { Calendar, CheckCircle, TrendingUp, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: sessions } = useQuery({
    queryKey: ['sessions', mockUserId],
    queryFn: () => api.get(`/sessions?userId=${mockUserId}`),
  })

  const { data: assignments } = useQuery({
    queryKey: ['assignments', mockUserId],
    queryFn: () => api.get(`/assignments?userId=${mockUserId}`),
  })

  const completedSessions = sessions?.filter((s: any) => s.status === 'completed').length || 0
  const pendingAssignments = assignments?.filter((a: any) => a.status !== 'completed').length || 0
  const completedAssignments = assignments?.filter((a: any) => a.status === 'completed').length || 0

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a1a1a' }}>
        Welcome Back! 👋
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Here's your coaching overview
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatCard
          icon={<Calendar size={24} />}
          title="Total Sessions"
          value={sessions?.length || 0}
          subtitle={`${completedSessions} completed`}
          color="#3b82f6"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          title="Assignments"
          value={pendingAssignments}
          subtitle={`${completedAssignments} completed`}
          color="#10b981"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Avg Score"
          value={completedAssignments > 0
            ? `${Math.round(assignments.filter((a: any) => a.status === 'completed').reduce((sum: number, a: any) => sum + (a.score || 0), 0) / completedAssignments)}%`
            : 'N/A'}
          subtitle="Keep improving!"
          color="#f59e0b"
        />
        <StatCard
          icon={<MessageSquare size={24} />}
          title="Active Chats"
          value={sessions?.filter((s: any) => s.status === 'in_progress').length || 0}
          subtitle="Ongoing conversations"
          color="#8b5cf6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Card title="Recent Sessions">
          {sessions && sessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.slice(0, 5).map((session: any) => (
                <div
                  key={session.id}
                  style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{session.title}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {new Date(session.createdAt * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusBadge status={session.status} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px' }}>
              No sessions yet. Start your first coaching session!
            </p>
          )}
        </Card>

        <Card title="Quick Actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ActionButton to="/sessions" color="#3b82f6">
              Schedule Session
            </ActionButton>
            <ActionButton to="/chat" color="#10b981">
              Start Coaching Chat
            </ActionButton>
            <ActionButton to="/assignments" color="#f59e0b">
              View Assignments
            </ActionButton>
            <ActionButton to="/progress" color="#8b5cf6">
              Check Progress
            </ActionButton>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ color, background: `${color}20`, padding: '8px', borderRadius: '8px' }}>
          {icon}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{title}</div>
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#9ca3af' }}>{subtitle}</div>
    </div>
  )
}

function Card({ title, children }: any) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
      }}
    >
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    completed: { bg: '#d1fae5', text: '#065f46' },
    in_progress: { bg: '#dbeafe', text: '#1e40af' },
    scheduled: { bg: '#fef3c7', text: '#92400e' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
  }
  const color = colors[status] || colors.scheduled

  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: color.bg,
        color: color.text,
      }}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function ActionButton({ to, children, color }: any) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '16px',
        background: color,
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </Link>
  )
}
