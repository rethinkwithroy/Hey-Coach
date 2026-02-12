import { useQuery } from '@tanstack/react-query'
import { api, mockUserId } from '../lib/api'
import { Calendar, Clock, Video, MessageSquare } from 'lucide-react'

export default function Sessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', mockUserId],
    queryFn: () => api.get(`/sessions?userId=${mockUserId}`),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Sessions</h1>
          <p style={{ color: '#6b7280' }}>Manage your coaching sessions</p>
        </div>
        <button
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Schedule New Session
        </button>
      </div>

      {sessions && sessions.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {sessions.map((session: any) => (
            <div
              key={session.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{session.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {session.type === 'voice' ? <Video size={14} /> : <MessageSquare size={14} />}
                      {session.type === 'voice' ? 'Voice Call' : 'Text Chat'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {new Date(session.createdAt * 1000).toLocaleDateString()}
                    </div>
                    {session.duration && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        {Math.round(session.duration / 60)} min
                      </div>
                    )}
                  </div>
                </div>
                <StatusBadge status={session.status} />
              </div>

              {session.notes && (
                <div
                  style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#4b5563',
                    marginBottom: '12px',
                  }}
                >
                  {session.notes}
                </div>
              )}

              {session.score && (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: getScoreColor(session.score),
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Score: {session.score}/100
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '64px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Calendar size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>No sessions scheduled</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Schedule your first coaching session to get started
          </p>
        </div>
      )}
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

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}
