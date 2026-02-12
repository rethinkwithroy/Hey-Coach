# API Documentation

## Base URL

```
Local: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API uses a simple user ID system. Future versions will implement proper authentication with JWT tokens.

## Endpoints

### Health Check

#### GET `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-12T19:45:00.000Z"
}
```

---

### Users

#### GET `/api/users`

Get user by phone number.

**Query Parameters:**
- `phone` (string, required): Phone number

**Response:**
```json
{
  "id": "user-123",
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "createdAt": 1707762300,
  "updatedAt": 1707762300
}
```

#### POST `/api/users`

Create or get existing user.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "id": "user-123",
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "createdAt": 1707762300,
  "updatedAt": 1707762300
}
```

---

### Sessions

#### GET `/api/sessions`

List user's coaching sessions.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
[
  {
    "id": "session-1",
    "userId": "user-123",
    "title": "Leadership Development",
    "type": "text",
    "status": "completed",
    "scheduledAt": 1707762300,
    "startedAt": 1707762300,
    "completedAt": 1707765900,
    "duration": 3600,
    "score": 85,
    "notes": "Great progress",
    "createdAt": 1707762300,
    "updatedAt": 1707765900
  }
]
```

#### POST `/api/sessions`

Create a new session.

**Request Body:**
```json
{
  "userId": "user-123",
  "title": "Career Planning Session",
  "type": "text",
  "scheduledAt": "2024-02-15T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "session-2",
  "userId": "user-123",
  "title": "Career Planning Session",
  "type": "text",
  "status": "scheduled",
  "scheduledAt": 1708167600,
  "createdAt": 1707762300,
  "updatedAt": 1707762300
}
```

#### PATCH `/api/sessions/:id`

Update a session.

**Request Body:**
```json
{
  "status": "completed",
  "score": 90,
  "notes": "Excellent insights shared"
}
```

**Response:**
```json
{
  "id": "session-2",
  "status": "completed",
  "score": 90,
  "notes": "Excellent insights shared",
  "completedAt": 1707765900,
  "updatedAt": 1707765900
}
```

---

### Assignments

#### GET `/api/assignments`

List user's assignments.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
[
  {
    "id": "assignment-1",
    "userId": "user-123",
    "title": "Difficult Conversation Practice",
    "description": "Practice addressing performance issues",
    "scenario": "You need to address performance issues...",
    "difficulty": "intermediate",
    "status": "pending",
    "dueDate": 1708081200,
    "createdAt": 1707762300,
    "updatedAt": 1707762300
  }
]
```

#### POST `/api/assignments`

Create a new assignment.

**Request Body:**
```json
{
  "userId": "user-123",
  "title": "Conflict Resolution",
  "description": "Mediate team conflict",
  "scenario": "Two team members are in disagreement...",
  "difficulty": "advanced",
  "dueDate": "2024-02-20T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "assignment-2",
  "userId": "user-123",
  "title": "Conflict Resolution",
  "difficulty": "advanced",
  "status": "pending",
  "createdAt": 1707762300
}
```

#### GET `/api/assignments/:id`

Get assignment details.

**Response:**
```json
{
  "id": "assignment-1",
  "userId": "user-123",
  "title": "Difficult Conversation Practice",
  "description": "Practice addressing performance issues",
  "scenario": "You need to address performance issues with a team member...",
  "difficulty": "intermediate",
  "status": "pending",
  "dueDate": 1708081200,
  "createdAt": 1707762300,
  "updatedAt": 1707762300
}
```

---

### Practice Sessions

#### POST `/api/practice/start`

Start a new practice attempt for an assignment.

**Request Body:**
```json
{
  "assignmentId": "assignment-1",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "id": "attempt-1",
  "assignmentId": "assignment-1",
  "userId": "user-123",
  "status": "in_progress",
  "startedAt": 1707762300,
  "createdAt": 1707762300
}
```

#### POST `/api/practice/:attemptId/message`

Send a coaching message during practice.

**Request Body:**
```json
{
  "userMessage": "I understand you're feeling frustrated...",
  "assignment": {
    "scenario": "You need to address performance issues..."
  }
}
```

**Response:**
```json
{
  "clientResponse": "I appreciate you saying that, but...",
  "evaluation": {
    "score": 85,
    "feedback": "Good empathy demonstrated",
    "strengths": ["Active listening", "Empathetic opening"],
    "improvements": ["Could ask more clarifying questions"]
  },
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "I understand you're feeling frustrated...",
      "evaluation": {...}
    },
    {
      "role": "user",
      "content": "I appreciate you saying that, but..."
    }
  ]
}
```

#### POST `/api/practice/:attemptId/complete`

Complete a practice session.

**Request Body:**
```json
{
  "score": 85,
  "feedback": "Strong overall performance",
  "metrics": {
    "totalExchanges": 5,
    "averageScore": 85,
    "highestScore": 92,
    "lowestScore": 78
  }
}
```

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/practice/assignment/:assignmentId`

Get all practice attempts for an assignment.

**Response:**
```json
[
  {
    "id": "attempt-1",
    "assignmentId": "assignment-1",
    "userId": "user-123",
    "status": "completed",
    "score": 85,
    "feedback": "Strong overall performance",
    "startedAt": 1707762300,
    "completedAt": 1707765900,
    "createdAt": 1707762300
  }
]
```

---

### Messages

#### GET `/api/messages`

Get messages for a session or assignment.

**Query Parameters:**
- `sessionId` (string, optional): Session ID
- `assignmentId` (string, optional): Assignment ID

**Response:**
```json
[
  {
    "id": "msg-1",
    "sessionId": "session-1",
    "userId": "user-123",
    "role": "user",
    "content": "I'm struggling with delegation",
    "metadata": null,
    "createdAt": 1707762300
  },
  {
    "id": "msg-2",
    "sessionId": "session-1",
    "userId": "user-123",
    "role": "assistant",
    "content": "Let's explore what makes delegation challenging for you...",
    "metadata": null,
    "createdAt": 1707762350
  }
]
```

---

### Coach Chat

#### POST `/api/coach/chat`

Get AI coaching response.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How can I improve my leadership skills?"
    }
  ],
  "userInfo": {
    "name": "John Doe"
  }
}
```

**Response:**
```json
{
  "response": "That's a great question! Let's start by understanding what specific aspects of leadership you'd like to develop..."
}
```

---

### Progress

#### GET `/api/progress/:userId`

Get user's progress metrics.

**Query Parameters:**
- `period` (string, optional): 'daily', 'weekly', or 'monthly' (default: 'weekly')
- `startDate` (string, optional): ISO date string
- `endDate` (string, optional): ISO date string

**Response:**
```json
[
  {
    "id": "metric-1",
    "userId": "user-123",
    "metricType": "session_completion",
    "metricValue": 5,
    "period": "weekly",
    "periodStart": 1707157200,
    "periodEnd": 1707762000,
    "metadata": null,
    "createdAt": 1707762300
  }
]
```

---

### Notifications

#### GET `/api/notifications/:userId`

Get user's notifications.

**Response:**
```json
[
  {
    "id": "notif-1",
    "userId": "user-123",
    "type": "assignment_due",
    "title": "Assignment Due Soon",
    "message": "Your assignment is due in 3 days",
    "isRead": false,
    "metadata": null,
    "createdAt": 1707762300
  }
]
```

#### PATCH `/api/notifications/:id/read`

Mark notification as read.

**Response:**
```json
{
  "success": true
}
```

---

### WhatsApp Webhook

#### GET `/api/whatsapp/webhook`

Webhook verification endpoint.

**Response:**
```
Webhook verified
```

#### POST `/api/whatsapp/webhook`

Receive incoming WhatsApp messages.

**Request Body (Twilio format):**
```
From=whatsapp:+1234567890
Body=Hello coach
MessageSid=SM...
```

**Response:**
```
OK
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "User ID required"
}
```

### 404 Not Found
```json
{
  "error": "Assignment not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

## Rate Limiting

Currently not implemented. Recommended limits for production:
- General API: 100 requests/minute
- AI Chat endpoint: 10 requests/minute
- WhatsApp webhook: 1000 requests/minute

## Webhook Security

For production, implement Twilio signature validation:

```typescript
import twilio from 'twilio'

const validateWebhook = (req: Request) => {
  const signature = req.headers['x-twilio-signature']
  const url = `${process.env.WEBHOOK_URL}/api/whatsapp/webhook`
  
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    url,
    req.body
  )
}
```

## Changelog

### v1.0.0 (2024-02-12)
- Initial API release
- User management
- Session tracking
- Assignment practice with AI
- WhatsApp integration
- Progress tracking
