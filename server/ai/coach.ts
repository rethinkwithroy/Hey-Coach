import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const COACH_SYSTEM_PROMPT = `You are an experienced executive coach specializing in leadership development, communication skills, and professional growth. Your coaching style is:

- Empathetic and supportive while maintaining high standards
- Focused on actionable insights and practical strategies
- Uses the Socratic method to help clients discover their own solutions
- Provides specific, behavioral feedback rather than general praise or criticism
- Encourages reflection and self-awareness
- Celebrates progress while pushing for continuous improvement

When coaching:
1. Listen actively and ask clarifying questions
2. Help identify patterns and blind spots
3. Challenge limiting beliefs constructively
4. Provide frameworks and models when helpful
5. Set clear, measurable goals
6. Follow up on previous commitments

Your responses should be concise, warm, and professional. Aim for 2-3 sentences unless more detail is specifically needed.`

const SIMULATOR_SYSTEM_PROMPT = `You are roleplaying as a challenging client in a professional coaching scenario. Your goal is to provide realistic, varied responses that test the coach's skills. 

Key behaviors:
- Sometimes be resistant or defensive
- Occasionally bring up tangential issues
- Show authentic emotions (frustration, excitement, doubt)
- Challenge the coach's suggestions appropriately
- Provide enough detail to make the scenario realistic
- Evolve your responses based on the coach's approach

Stay in character and make the coach work for progress. Be professional but authentic.`

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface CoachingContext {
  messages: Message[]
  userInfo?: {
    name: string
    goals?: string[]
    challenges?: string[]
  }
}

export async function generateCoachResponse(context: CoachingContext): Promise<string> {
  const messages = context.messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: COACH_SYSTEM_PROMPT,
    messages,
  })

  const content = response.content[0]
  return content.type === 'text' ? content.text : ''
}

export async function generateClientSimulatorResponse(
  scenario: string,
  conversationHistory: Message[]
): Promise<string> {
  const systemPrompt = `${SIMULATOR_SYSTEM_PROMPT}\n\nScenario: ${scenario}`

  const messages = conversationHistory.map(msg => ({
    role: (msg.role === 'assistant' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.content,
  }))

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    system: systemPrompt,
    messages,
  })

  const content = response.content[0]
  return content.type === 'text' ? content.text : ''
}

export async function evaluateCoachingResponse(
  coachResponse: string,
  context: {
    clientMessage: string
    scenario: string
    conversationHistory: Message[]
  }
): Promise<{
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}> {
  const evaluationPrompt = `Evaluate this coaching response on a scale of 0-100:

Scenario: ${context.scenario}
Client said: "${context.clientMessage}"
Coach responded: "${coachResponse}"

Consider:
1. Empathy and active listening (0-25 points)
2. Asking powerful questions (0-25 points)
3. Providing actionable insights (0-25 points)
4. Professional communication (0-25 points)

Provide:
- Overall score (0-100)
- 2-3 specific strengths
- 2-3 specific areas for improvement
- Brief feedback summary

Format your response as JSON:
{
  "score": <number>,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "summary"
}`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: 'You are an expert coach evaluator. Provide constructive, specific feedback.',
    messages: [
      {
        role: 'user',
        content: evaluationPrompt,
      },
    ],
  })

  const content = response.content[0]
  const text = content.type === 'text' ? content.text : '{}'

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const evaluation = JSON.parse(jsonMatch[0])
      return {
        score: evaluation.score || 0,
        feedback: evaluation.feedback || '',
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
      }
    } catch {
      // Fall through to default response if JSON is malformed
    }
  }

  return {
    score: 50,
    feedback: 'Unable to evaluate response',
    strengths: [],
    improvements: [],
  }
}

export async function generateFeedbackSummary(
  attempts: Array<{
    score: number
    feedback: string
    conversationData: any
  }>
): Promise<string> {
  const summaryPrompt = `Analyze these coaching practice attempts and provide a comprehensive performance summary:

${attempts.map((a, i) => `
Attempt ${i + 1}:
- Score: ${a.score}/100
- Feedback: ${a.feedback}
`).join('\n')}

Provide:
1. Overall performance trend
2. Key strengths demonstrated
3. Priority areas for development
4. Specific actionable recommendations

Keep the summary concise but insightful (4-6 sentences).`

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    system: 'You are an expert coaching mentor providing developmental feedback.',
    messages: [
      {
        role: 'user',
        content: summaryPrompt,
      },
    ],
  })

  const content = response.content[0]
  return content.type === 'text' ? content.text : 'Unable to generate summary'
}
