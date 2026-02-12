import { useQuery } from '@tanstack/react-query'
import { api, mockUserId } from '../lib/api'
import { TrendingUp, Award, Target, Calendar } from 'lucide-react'

export default function Progress() {
  const { data: sessions } = useQuery({
    queryKey: ['sessions', mockUserId],
    queryFn: () => api.get(`/sessions?userId=${mockUserId}`),
  })

  const { data: assignments } = useQuery({
    queryKey: ['assignments', mockUserId],
    queryFn: () => api.get(`/assignments?userId=${mockUserId}`),
  })

  const completedSessions = sessions?.filter((s: any) => s.status === 'completed') || []
  const completedAssignments = assignments?.filter((a: any) => a.status === 'completed') || []

  const averageSessionScore =
    completedSessions.length > 0
      ? completedSessions.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / completedSessions.length
      : 0

  const averageAssignmentScore =
    completedAssignments.length > 0
      ? completedAssignments.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / completedAssignments.length
      : 0

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Progress Tracking</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Monitor your coaching journey and improvements</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <MetricCard
          icon={<Calendar size={24} />}
          title="Sessions Completed"
          value={completedSessions.length}
          subtitle="Total coaching sessions"
          color="#3b82f6"
        />
        <MetricCard
          icon={<Target size={24} />}
          title="Assignments Completed"
          value={completedAssignments.length}
          subtitle="Practice scenarios finished"
          color="#10b981"
        />
        <MetricCard
          icon={<TrendingUp size={24} />}
          title="Session Avg Score"
          value={Math.round(averageSessionScore)}
          subtitle="Out of 100"
          color="#f59e0b"
        />
        <MetricCard
          icon={<Award size={24} />}
          title="Assignment Avg Score"
          value={Math.round(averageAssignmentScore)}
          subtitle="Out of 100"
          color="#8b5cf6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card title="Recent Sessions">
          {completedSessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedSessions.slice(0, 5).map((session: any) => (
                <ProgressItem
                  key={session.id}
                  title={session.title}
                  score={session.score}
                  date={new Date(session.completedAt * 1000).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No completed sessions yet" />
          )}
        </Card>

        <Card title="Recent Assignments">
          {completedAssignments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedAssignments.slice(0, 5).map((assignment: any) => (
                <ProgressItem
                  key={assignment.id}
                  title={assignment.title}
                  score={assignment.score}
                  date={new Date(assignment.completedAt * 1000).toLocaleDateString()}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No completed assignments yet" />
          )}
        </Card>
      </div>

      {(completedSessions.length > 0 || completedAssignments.length > 0) && (
        <div style={{ marginTop: '32px' }}>
          <Card title="Performance Insights">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Insight
                icon={<TrendingUp size={20} style={{ color: '#10b981' }} />}
                text={`You've completed ${completedSessions.length + completedAssignments.length} total activities`}
              />
              {averageAssignmentScore > 80 && (
                <Insight
                  icon={<Award size={20} style={{ color: '#f59e0b' }} />}
                  text="Excellent work! Your assignment scores are above 80%"
                />
              )}
              {completedSessions.length >= 5 && (
                <Insight
                  icon={<Calendar size={20} style={{ color: '#3b82f6' }} />}
                  text="Great consistency! You've completed 5+ coaching sessions"
                />
              )}
              <Insight
                icon={<Target size={20} style={{ color: '#8b5cf6' }} />}
                text="Keep practicing to improve your coaching skills!"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon, title, value, subtitle, color }: any) {
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

function ProgressItem({ title, score, date }: any) {
  return (
    <div
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
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>{date}</div>
      </div>
      {score && (
        <div
          style={{
            padding: '6px 12px',
            background: getScoreColor(score),
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {Math.round(score)}
        </div>
      )}
    </div>
  )
}

function Insight({ icon, text }: any) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}
    >
      {icon}
      <span style={{ color: '#4b5563', fontSize: '14px' }}>{text}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
      {message}
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
