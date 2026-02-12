# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Anthropic API key
- Twilio account (for WhatsApp integration)
- Public domain or ngrok for webhooks

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.db

# Get from https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxx

# Get from https://console.twilio.com
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Your webhook URL (use ngrok for local dev)
WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/whatsapp/webhook

# Owner contact
OWNER_PHONE_NUMBER=+1234567890
```

### 3. Initialize Database

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed demo data (optional)
tsx server/db/seed.ts
```

### 4. Start Development Server

```bash
npm run dev
```

This starts:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### 5. Setup WhatsApp Webhook

For local development, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000
```

Configure Twilio:
1. Go to https://console.twilio.com/
2. Navigate to Messaging > Settings > WhatsApp sandbox
3. Set webhook URL: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`
4. Save configuration

## Production Deployment

### Option 1: Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Set environment variables in Railway dashboard

4. Add custom domain and update webhook URL

### Option 2: Render

1. Create `render.yaml`:

```yaml
services:
  - type: web
    name: hey-coach
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_WHATSAPP_NUMBER
        sync: false
```

2. Connect GitHub repo to Render
3. Configure environment variables
4. Deploy

### Option 3: DigitalOcean App Platform

1. Create app from GitHub
2. Set build command: `npm install && npm run build`
3. Set run command: `npm start`
4. Configure environment variables
5. Deploy

### Option 4: Manual VPS Deployment

On your VPS (Ubuntu/Debian):

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo-url>
cd hey-coach

# Install dependencies
npm install

# Build application
npm run build

# Install PM2 for process management
npm install -g pm2

# Create .env file with production values
nano .env

# Initialize database
npm run db:migrate

# Start application
pm2 start dist/server/index.js --name hey-coach

# Save PM2 configuration
pm2 save
pm2 startup
```

Setup Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable SSL with Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | Yes | Environment (development/production) |
| `DATABASE_URL` | Yes | SQLite database file path |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for AI features |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Yes | Your Twilio WhatsApp number |
| `WEBHOOK_URL` | Yes | Public webhook URL |
| `OWNER_PHONE_NUMBER` | No | Owner's phone for notifications |

## Database Migrations

### Create New Migration

1. Modify `server/db/schema.ts`
2. Generate migration:
```bash
npm run db:generate
```
3. Review generated SQL in `server/db/migrations/`
4. Apply migration:
```bash
npm run db:migrate
```

### Backup Database

```bash
# Backup
cp database.db database.backup.db

# Restore
cp database.backup.db database.db
```

## Monitoring & Logs

### PM2 Logs

```bash
# View logs
pm2 logs hey-coach

# Monitor
pm2 monit
```

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-12T19:45:00.000Z"
}
```

## Troubleshooting

### WhatsApp Webhook Not Receiving Messages

1. Check webhook URL is publicly accessible
2. Verify Twilio configuration
3. Check server logs for errors
4. Test webhook with curl:

```bash
curl -X POST http://your-webhook-url/api/whatsapp/webhook \
  -d "From=whatsapp:+1234567890" \
  -d "Body=test message"
```

### AI Responses Not Working

1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check API key has sufficient credits
3. Review server logs for API errors

### Database Issues

```bash
# Check database exists
ls -la database.db

# View schema
npm run db:studio

# Reset database (CAUTION: deletes all data)
rm database.db
npm run db:migrate
tsx server/db/seed.ts
```

## Security Considerations

1. **Never commit `.env` file**
2. **Use strong Twilio auth tokens**
3. **Keep dependencies updated**: `npm audit fix`
4. **Enable HTTPS in production**
5. **Implement rate limiting** for API endpoints
6. **Validate webhook signatures** from Twilio
7. **Sanitize user inputs** before storing in database

## Performance Optimization

1. **Enable database WAL mode** (already configured)
2. **Use connection pooling** for database
3. **Implement caching** for frequent queries
4. **Compress responses** with gzip
5. **Use CDN** for frontend assets
6. **Monitor API usage** to avoid rate limits

## Scaling Considerations

### Horizontal Scaling

- Use PostgreSQL instead of SQLite
- Implement Redis for session management
- Use message queue (Bull/RabbitMQ) for async jobs
- Deploy multiple instances behind load balancer

### Database Migration to PostgreSQL

Update `drizzle.config.ts`:

```typescript
export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
}
```

Update dependencies:
```bash
npm install pg @types/pg
npm uninstall better-sqlite3 @types/better-sqlite3
```

## Support

For deployment issues:
- Check README.md for general documentation
- Review GitHub Issues
- Contact: support@example.com
