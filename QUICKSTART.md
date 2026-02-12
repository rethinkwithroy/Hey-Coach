# Quick Start Guide

Get Hey Coach running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (2 min)

```bash
npm install
```

### 2. Configure (1 min)

```bash
# Copy example environment file
cp .env.example .env

# Edit with your API keys (minimum required for demo)
nano .env
```

**Minimum configuration for local demo:**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.db
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

WhatsApp integration is optional for local testing!

### 3. Setup Database (1 min)

```bash
# Create database and run migrations
npm run db:generate
npm run db:migrate

# Add demo data
tsx server/db/seed.ts
```

### 4. Start Development Server (1 min)

```bash
npm run dev
```

## 🎯 Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 🧪 Try It Out

### Demo User Credentials

The seeded database includes a demo user:
- **User ID**: `demo-user-123`
- **Phone**: `+1234567890`

### Test the Features

1. **Dashboard** (http://localhost:5173)
   - View overview of sessions and assignments
   - Check quick stats

2. **Assignments** (http://localhost:5173/assignments)
   - See 3 pre-loaded practice scenarios
   - Click "Start Practice" on any assignment

3. **Assignment Practice**
   - Engage with AI client simulator
   - Get real-time feedback on responses
   - See your coaching score (0-100)

4. **Coach Chat** (http://localhost:5173/chat)
   - Have open-ended conversations with AI coach
   - Ask for career advice
   - Discuss challenges

5. **Progress** (http://localhost:5173/progress)
   - View completed sessions and assignments
   - Check performance metrics
   - See insights

6. **Sessions** (http://localhost:5173/sessions)
   - Review past coaching sessions
   - Schedule new sessions

## 🤖 Test AI Features Without WhatsApp

You can test all AI coaching features through the web dashboard without WhatsApp:

1. Go to **Coach Chat** to interact with the AI coach
2. Go to **Assignments** to practice coaching scenarios
3. The AI will:
   - Simulate realistic client responses
   - Evaluate your coaching approach
   - Provide detailed feedback

## 📱 Optional: Add WhatsApp Integration

### Get Twilio Sandbox (Free)

1. Sign up at https://www.twilio.com/try-twilio (free trial)
2. Go to Console > Messaging > Try it out > Send a WhatsApp message
3. Follow instructions to join your WhatsApp sandbox
4. Add credentials to `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Setup Webhook with ngrok

```bash
# Install ngrok
npm install -g ngrok

# In a new terminal, start ngrok
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
```

Configure Twilio:
1. In Twilio Console, go to WhatsApp Sandbox Settings
2. Set webhook URL: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`
3. Save

### Test WhatsApp Commands

Send to your WhatsApp sandbox number:

```
/help       - Show available commands
/session    - Start coaching session
/assignments - View your assignments
/progress   - Check your progress
```

## 🔍 Verify Everything Works

### Check Backend

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2024-02-12T19:45:00.000Z"}
```

### Check Database

```bash
# View database with Drizzle Studio
npm run db:studio
```

Opens at http://localhost:4983

### Check Frontend

Open http://localhost:5173 - you should see the dashboard with demo data.

## 🛠️ Common Issues

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

### API Key Errors

- Verify `ANTHROPIC_API_KEY` is valid
- Check https://console.anthropic.com for key status
- Ensure you have API credits

### Database Not Found

```bash
# Re-run migrations
npm run db:migrate
tsx server/db/seed.ts
```

### Frontend Not Loading

```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## 📚 Next Steps

1. **Read the README.md** for comprehensive documentation
2. **Check API.md** for API endpoint details
3. **Review DEPLOYMENT.md** for production deployment
4. **Customize the coaching persona** in `server/ai/coach.ts`
5. **Add your own assignments** via the API or database

## 🎓 Learning Path

1. **Start Simple**: Use Coach Chat to understand the AI persona
2. **Practice Scenarios**: Try the beginner assignment
3. **Review Feedback**: Study the evaluation criteria
4. **Iterate**: Practice multiple times to improve scores
5. **Track Progress**: Watch your metrics improve over time

## 💡 Pro Tips

- **Scoring**: Aim for 80+ scores consistently
- **Empathy**: Lead with understanding before solutions
- **Questions**: Ask open-ended questions
- **Specificity**: Provide specific, actionable advice
- **Follow-up**: Build on previous conversation points

## 🤝 Get Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check README.md and API.md
- **Code**: All source code is well-commented

## 🎉 You're Ready!

Open http://localhost:5173 and start your coaching journey!

---

**Quick command reference:**

```bash
npm run dev          # Start dev servers
npm run build        # Build for production
npm start            # Run production build
npm test             # Run tests
npm run db:studio    # Open database GUI
npm run db:generate  # Generate new migration
npm run db:migrate   # Run migrations
```
