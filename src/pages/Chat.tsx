import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Send } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your executive coach. How can I help you today? We can discuss your career goals, challenges you\'re facing, or any professional development topics.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = useMutation({
    mutationFn: (content: string) => {
      const allMessages = [...messages, { role: 'user', content }]
      return api.post('/coach/chat', {
        messages: allMessages,
        userInfo: { name: 'User' },
      })
    },
    onSuccess: (data, content) => {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content },
        { role: 'assistant', content: data.response },
      ])
      setInputValue('')
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Coach Chat</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Have a conversation with your AI executive coach
      </p>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          height: 'calc(100vh - 280px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
                  color: message.role === 'user' ? 'white' : '#1a1a1a',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '14px',
                }}
              >
                Coach is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (inputValue.trim() && !sendMessage.isPending) {
                sendMessage.mutate(inputValue.trim())
              }
            }}
            style={{ display: 'flex', gap: '12px' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
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
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
