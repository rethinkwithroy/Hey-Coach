import { useQuery } from '@tanstack/react-query'
import { api, mockUserId } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { PlayCircle, Clock, CheckCircle } from 'lucide-react'

export default function Assignments() {
  const navigate = useNavigate()
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments', mockUserId],
    queryFn: () => api.get(`/assignments?userId=${mockUserId}`),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Assignments</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Practice your coaching skills with realistic scenarios
      </p>

      {assignments && assignments.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {assignments.map((assignment: any) => (
            <div
              key={assignment.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{assignment.title}</h3>
                  <StatusBadge status={assignment.status} />
                  <DifficultyBadge difficulty={assignment.difficulty} />
                </div>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>{assignment.description}</p>
                {assignment.dueDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#9ca3af' }}>
                    <Clock size={14} />
                    Due: {new Date(assignment.dueDate * 1000).toLocaleDateString()}
                  </div>
                )}
                {assignment.score && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>
                    Score: {assignment.score}/100
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(`/assignments/${assignment.id}/practice`)}
                disabled={assignment.status === 'completed'}
                style={{
                  padding: '12px 24px',
                  background: assignment.status === 'completed' ? '#e5e7eb' : '#3b82f6',
                  color: assignment.status === 'completed' ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: assignment.status === 'completed' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {assignment.status === 'completed' ? (
                  <>
                    <CheckCircle size={16} />
                    Completed
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} />
                    Start Practice
                  </>
                )}
              </button>
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
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>No assignments yet</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            New assignments will appear here from your coach
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
    pending: { bg: '#fef3c7', text: '#92400e' },
    overdue: { bg: '#fee2e2', text: '#991b1b' },
  }
  const color = colors[status] || colors.pending

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

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: '#f3f4f6',
        color: '#4b5563',
        textTransform: 'capitalize',
      }}
    >
      {difficulty}
    </span>
  )
}
