import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api, mockUserId } from '../lib/api'
import { Send, CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react'

export default function AssignmentPractice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => api.get(`/assignments/${id}`),
  })

  const startPractice = useMutation({
    mutationFn: () =>
      api.post('/practice/start', {
        assignmentId: id,
        userId: mockUserId,
      }),
    onSuccess: (data) => {
      setAttemptId(data.id)
      setMessages([
        {
          role: 'system',
          content: `🎯 Practice started! You'll be coaching a client in the following scenario:\n\n${assignment.scenario}\n\nRespond as a professional coach. The AI will simulate realistic client responses.`,
        },
        {
          role: 'user',
          content: 'Hi, thanks for meeting with me today.',
        },
      ])
    },
  })

  const sendMessage = useMutation({
    mutationFn: (userMessage: string) =>
      api.post(`/practice/${attemptId}/message`, {
        userMessage,
        assignment,
      }),
    onSuccess: (data, userMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: userMessage,
          evaluation: data.evaluation,
        },
        {
          role: 'user',
          content: data.clientResponse,
        },
      ])
      setInputValue('')
      setIsTyping(false)
    },
  })

  const completePractice = useMutation({
    mutationFn: () => {
      const scores = messages
        .filter((m) => m.evaluation)
        .map((m) => m.evaluation.score)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

      const allFeedback = messages
        .filter((m) => m.evaluation)
        .map((m) => m.evaluation.feedback)
        .join(' ')

      return api.post(`/practice/${attemptId}/complete`, {
        score: avgScore,
        feedback: allFeedback,
        metrics: {
          totalExchanges: scores.length,
          averageScore: avgScore,
          highestScore: Math.max(...scores, 0),
          lowestScore: Math.min(...scores, 100),
        },
      })
    },
    onSuccess: () => {
      navigate('/assignments')
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading) {
    return <LoadingState />
  }

  if (!assignment) {
    return (
      <div style={{ textAlign: 'center', padding: '64px' }}>
        <p>Assignment not found</p>
      </div>
    )
  }

  if (!attemptId) {
    return (
      <div>
        <button
          onClick={() => navigate('/assignments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          <ArrowLeft size={16} />
          Back to Assignments
        </button>

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '12px',
            padding: '48px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <DifficultyBadge difficulty={assignment.difficulty} />
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '16px', marginBottom: '8px' }}>
              {assignment.title}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>{assignment.description}</p>
          </div>

          <div
            style={{
              background: '#f9fafb',
              padding: '24px',
              borderRadius: '8px',
              borderLeft: '4px solid #3b82f6',
              marginBottom: '32px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              📝 Scenario
            </h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{assignment.scenario}</p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              How it works:
            </h2>
            <ul style={{ color: '#4b5563', lineHeight: '1.8', paddingLeft: '24px' }}>
              <li>You'll engage in a coaching conversation with an AI client</li>
              <li>Each response you give will be evaluated in real-time</li>
              <li>The client will respond realistically based on your coaching approach</li>
              <li>Practice your coaching skills in a safe environment</li>
              <li>Get detailed feedback at the end</li>
            </ul>
          </div>

          <button
            onClick={() => startPractice.mutate()}
            disabled={startPractice.isPending}
            style={{
              width: '100%',
              padding: '16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {startPractice.isPending ? 'Starting...' : 'Start Practice Session'}
          </button>
        </div>
      </div>
    )
  }

  const averageScore = messages.filter(m => m.evaluation).length > 0
    ? messages.filter(m => m.evaluation).reduce((sum, m) => sum + m.evaluation.score, 0) / messages.filter(m => m.evaluation).length
    : 0

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', gap: '24px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{assignment.title}</h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Practice Session</p>
          </div>
          <button
            onClick={() => completePractice.mutate()}
            disabled={completePractice.isPending || messages.filter(m => m.evaluation).length < 3}
            style={{
              padding: '12px 24px',
              background: messages.filter(m => m.evaluation).length >= 3 ? '#10b981' : '#e5e7eb',
              color: messages.filter(m => m.evaluation).length >= 3 ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: messages.filter(m => m.evaluation).length >= 3 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={16} />
            Complete Session
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginTop: '16px' }}>
              <div className="typing-indicator" />
              Client is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (inputValue.trim() && !sendMessage.isPending) {
                setIsTyping(true)
                sendMessage.mutate(inputValue.trim())
              }
            }}
            style={{ display: 'flex', gap: '12px' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your coaching response..."
              disabled={sendMessage.isPending}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || sendMessage.isPending}
              style={{
                padding: '12px 24px',
                background: inputValue.trim() && !sendMessage.isPending ? '#3b82f6' : '#e5e7eb',
                color: inputValue.trim() && !sendMessage.isPending ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                cursor: inputValue.trim() && !sendMessage.isPending ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      </div>

      <div style={{ width: '320px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} />
          Performance
        </h3>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#3b82f6', textAlign: 'center' }}>
            {Math.round(averageScore)}
          </div>
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>Average Score</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Response Count</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{messages.filter(m => m.evaluation).length}</div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Recent Evaluations</div>
          {messages
            .filter((m) => m.evaluation)
            .slice(-3)
            .reverse()
            .map((m, i) => (
              <EvaluationCard key={i} evaluation={m.evaluation} />
            ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: any) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isAssistant = message.role === 'assistant'

  if (isSystem) {
    return (
      <div
        style={{
          padding: '16px',
          background: '#eff6ff',
          borderRadius: '8px',
          marginBottom: '16px',
          borderLeft: '4px solid #3b82f6',
          fontSize: '14px',
          lineHeight: '1.6',
          whiteSpace: 'pre-line',
        }}
      >
        {message.content}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-start' : 'flex-end',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '12px',
            background: isUser ? '#f3f4f6' : '#3b82f6',
            color: isUser ? '#1a1a1a' : 'white',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.8 }}>
            {isUser ? 'Client' : 'You (Coach)'}
          </div>
          {message.content}
        </div>
      </div>

      {isAssistant && message.evaluation && (
        <div
          style={{
            marginLeft: 'auto',
            maxWidth: '70%',
            padding: '12px',
            background: '#fef3c7',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                padding: '4px 8px',
                background: getScoreColor(message.evaluation.score),
                color: 'white',
                borderRadius: '4px',
                fontWeight: '600',
              }}
            >
              {message.evaluation.score}/100
            </div>
            <span style={{ fontSize: '11px', color: '#92400e' }}>Evaluation</span>
          </div>
          <div style={{ color: '#92400e', lineHeight: '1.4' }}>
            {message.evaluation.feedback}
          </div>
          {message.evaluation.strengths?.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>✅ Strengths:</div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {message.evaluation.strengths.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {message.evaluation.improvements?.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>💡 Improvements:</div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {message.evaluation.improvements.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EvaluationCard({ evaluation }: any) {
  return (
    <div
      style={{
        padding: '12px',
        background: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '8px',
        fontSize: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontWeight: '600' }}>Score</span>
        <span
          style={{
            padding: '2px 8px',
            background: getScoreColor(evaluation.score),
            color: 'white',
            borderRadius: '4px',
            fontWeight: '600',
          }}
        >
          {evaluation.score}
        </span>
      </div>
      <div style={{ color: '#6b7280', lineHeight: '1.4' }}>{evaluation.feedback}</div>
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: any = {
    beginner: { bg: '#d1fae5', text: '#065f46' },
    intermediate: { bg: '#fef3c7', text: '#92400e' },
    advanced: { bg: '#fee2e2', text: '#991b1b' },
  }
  const color = colors[difficulty] || colors.intermediate

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: color.bg,
        color: color.text,
        textTransform: 'capitalize',
      }}
    >
      {difficulty}
    </span>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <div>Loading...</div>
    </div>
  )
}
