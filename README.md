# Hey Coach - WhatsApp Executive Coach Bot

A comprehensive AI-powered coaching platform that combines WhatsApp bot integration with an interactive web dashboard for executive coaching and professional development.

## Features

### 🤖 WhatsApp Integration
- **Text Coaching**: Have coaching conversations directly through WhatsApp
- **Voice Calls**: Schedule and conduct voice coaching sessions
- **Real-time Responses**: AI-powered coaching responses using Claude
- **Command System**: Easy-to-use commands for session management

### 📊 Web Dashboard
- **Session Management**: Schedule, view, and track coaching sessions
- **Interactive Assignments**: Practice scenarios with AI client simulation
- **Real-time Evaluation**: Get instant feedback on coaching responses
- **Progress Tracking**: Monitor performance metrics and improvements
- **Coach Chat**: Have extended conversations with your AI coach

### 🎯 Assignment Practice System
- **Realistic Scenarios**: Practice with challenging client situations
- **AI Client Simulator**: Responds authentically to your coaching approach
- **Live Scoring**: Real-time evaluation of each response (0-100 scale)
- **Detailed Feedback**: Strengths and improvement areas for each interaction
- **Performance Metrics**: Track average scores and progress over time

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Drizzle ORM
- **AI**: Anthropic Claude (via SDK)
- **WhatsApp**: Twilio API
- **Styling**: Inline CSS (easily replaceable with Tailwind/styled-components)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Twilio account (for WhatsApp integration)
- Anthropic API key (for AI coaching)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hey-coach
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=./database.db

# AI Provider
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Owner Notifications
OWNER_PHONE_NUMBER=+1234567890
```

### Database Setup

1. Generate database schema:
```bash
npm run db:generate
```

2. Run migrations:
```bash
npm run db:migrate
```

3. Seed demo data:
```bash
tsx server/db/seed.ts
```

### Development

Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

### WhatsApp Webhook Setup

1. Expose your local server using ngrok or similar:
```bash
ngrok http 3000
```

2. Configure Twilio webhook URL:
   - Go to Twilio Console > Messaging > Settings
   - Set webhook URL to: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`

### Production Build

```bash
npm run build
npm start
```

## Usage

### WhatsApp Commands

- `/help` - Show available commands
- `/session` - Start a new coaching session
- `/endsession` - End current session
- `/assignments` - View your assignments
- `/progress` - Check your progress
- `/schedule` - Schedule a voice call

### Web Dashboard

1. **Dashboard**: Overview of sessions, assignments, and metrics
2. **Sessions**: Manage and schedule coaching sessions
3. **Chat**: Have extended conversations with AI coach
4. **Assignments**: View and practice coaching scenarios
5. **Progress**: Track performance and improvements

### Assignment Practice Flow

1. Navigate to Assignments page
2. Click "Start Practice" on any assignment
3. Read the scenario and client background
4. Start the practice session
5. Respond to the AI client as a professional coach
6. Receive real-time evaluation after each response
7. Complete the session (minimum 3 exchanges)
8. View final score and detailed feedback

## API Endpoints

### Sessions
- `GET /api/sessions?userId={id}` - List user sessions
- `POST /api/sessions` - Create new session
- `PATCH /api/sessions/:id` - Update session

### Assignments
- `GET /api/assignments?userId={id}` - List user assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/:id` - Get assignment details

### Practice
- `POST /api/practice/start` - Start practice attempt
- `POST /api/practice/:attemptId/message` - Send practice message
- `POST /api/practice/:attemptId/complete` - Complete practice

### Coach
- `POST /api/coach/chat` - Chat with AI coach

### WhatsApp
- `GET /api/whatsapp/webhook` - Webhook verification
- `POST /api/whatsapp/webhook` - Incoming messages

## Database Schema

- **users**: User profiles and contact information
- **sessions**: Coaching session records
- **assignments**: Practice assignments and scenarios
- **messages**: Conversation history
- **practice_attempts**: Practice session data
- **voice_calls**: Voice call records
- **progress_metrics**: Performance tracking
- **notifications**: User notifications

## AI Coaching Persona

The AI coach is designed to:
- Be empathetic and supportive while maintaining high standards
- Use the Socratic method to help clients discover solutions
- Provide specific, behavioral feedback
- Encourage reflection and self-awareness
- Celebrate progress while pushing for improvement

## Testing

Run tests:
```bash
npm test
```

Run type checking:
```bash
npm run build:server
```

## Deployment

### Environment Variables

Ensure all production environment variables are set:
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_WHATSAPP_NUMBER`: Your Twilio WhatsApp number
- `WEBHOOK_URL`: Public webhook URL
- `DATABASE_URL`: Database file path

### Deployment Platforms

The application can be deployed to:
- **Railway**: Zero-config deployment
- **Render**: Supports Node.js and SQLite
- **DigitalOcean App Platform**: Full-stack support
- **AWS/GCP/Azure**: Traditional cloud providers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@heycoach.example.com

## Roadmap

- [ ] User authentication and multi-user support
- [ ] Advanced analytics dashboard
- [ ] Integration with calendar services
- [ ] Mobile app (React Native)
- [ ] Video coaching sessions
- [ ] Team coaching features
- [ ] Custom coaching personas
- [ ] Integration with other messaging platforms

---

Built with ❤️ for executive coaches and their clients
