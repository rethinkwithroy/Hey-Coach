# Contributing to Hey Coach

Thank you for your interest in contributing to Hey Coach! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, browser)

Example:

```markdown
**Bug**: Assignment practice score not updating

**Steps to Reproduce**:
1. Navigate to Assignments page
2. Start practice on any assignment
3. Complete 5 exchanges
4. Click "Complete Session"

**Expected**: Score should be calculated and displayed
**Actual**: Score shows as 0

**Environment**: Chrome 120, Node 18.x, macOS
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title and description**
- **Use case and motivation**
- **Proposed solution** (if you have one)
- **Alternative solutions** considered

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/hey-coach.git
cd hey-coach

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Initialize database
npm run db:generate
npm run db:migrate
tsx server/db/seed.ts

# Start development server
npm run dev
```

## Development Guidelines

### Code Style

We use TypeScript and follow these conventions:

#### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

#### TypeScript

- Use explicit types for function parameters
- Avoid `any` type when possible
- Use interfaces for object shapes
- Use type aliases for unions/intersections

Example:

```typescript
// Good
interface User {
  id: string
  name: string
  email: string
}

async function getUser(id: string): Promise<User> {
  // implementation
}

// Avoid
async function getUser(id: any): Promise<any> {
  // implementation
}
```

### Component Structure

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

interface Props {
  userId: string
}

export default function UserProfile({ userId }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`),
  })

  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

### API Development

#### Creating New Endpoints

1. Add route handler in `server/routes/api.ts`
2. Add database query in `server/db/queries.ts` (if needed)
3. Document in `API.md`
4. Add tests in `server/__tests__/`

Example:

```typescript
// server/routes/api.ts
router.get('/users/:id/stats', async (req, res) => {
  try {
    const { id } = req.params
    const stats = await userQueries.getStats(id)
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})
```

### Database Changes

#### Adding New Tables

1. Update `server/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Review generated SQL
4. Run migration:
   ```bash
   npm run db:migrate
   ```
5. Add queries in `server/db/queries.ts`
6. Update seed data if needed

#### Schema Guidelines

- Use `text` for IDs (nanoid)
- Use `integer` for timestamps (Unix seconds)
- Add indexes for frequently queried columns
- Use `notNull()` for required fields
- Add foreign keys with `onDelete: 'cascade'`

### Testing

#### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- coach.test.ts
```

#### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { calculateScore } from './utils'

describe('Score Calculation', () => {
  it('should calculate average correctly', () => {
    const scores = [80, 90, 85]
    const result = calculateScore(scores)
    expect(result).toBe(85)
  })

  it('should handle empty array', () => {
    const result = calculateScore([])
    expect(result).toBe(0)
  })
})
```

### Commit Messages

Follow conventional commits format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat: add user profile page
fix: correct score calculation in practice sessions
docs: update API documentation for assignments
refactor: simplify WhatsApp message handler
test: add tests for coach AI responses
chore: update dependencies
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Examples:
- `feature/voice-call-recording`
- `fix/assignment-score-calculation`
- `docs/deployment-guide`

## Project Structure

```
hey-coach/
├── server/              # Backend code
│   ├── ai/             # AI/coaching logic
│   ├── db/             # Database schema and queries
│   ├── routes/         # API endpoints
│   ├── whatsapp/       # WhatsApp integration
│   └── index.ts        # Server entry point
├── src/                # Frontend code
│   ├── components/     # React components
│   ├── lib/           # Utilities and API client
│   ├── pages/         # Page components
│   └── main.tsx       # Frontend entry point
└── docs/              # Documentation
```

## Areas Needing Contribution

### High Priority

- [ ] Add authentication system (JWT)
- [ ] Implement role-based access control
- [ ] Add proper error boundaries in React
- [ ] Improve mobile responsiveness
- [ ] Add webhook signature validation

### Medium Priority

- [ ] Add more test coverage
- [ ] Implement rate limiting
- [ ] Add email notifications
- [ ] Create admin dashboard
- [ ] Add export functionality for progress data

### Low Priority

- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Alternative AI providers
- [ ] Voice call recording
- [ ] Calendar integration

## Questions?

- Check existing issues and discussions
- Join our Discord/Slack (if available)
- Email: developers@heycoach.example.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special thanks in documentation

Thank you for contributing to Hey Coach! 🎉
