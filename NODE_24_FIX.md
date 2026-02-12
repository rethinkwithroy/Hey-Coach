# Node.js 24 Compatibility Fix for better-sqlite3

## Problem

The Vercel build was failing with the following error:

```
Error: Node.js 24 requires C++20, but better-sqlite3 native bindings compilation failed
```

This occurred because:
- Vercel recently moved to Node.js 24 as the default runtime
- `better-sqlite3@9.6.0` has native bindings that are not yet fully compatible with Node.js 24
- Node.js 24 requires C++20 for native module compilation
- The build process crashes during `node-gyp rebuild`

## Solution Applied

The project has been configured to use Node.js 20.x, where `better-sqlite3` works perfectly. Three changes were made:

### 1. Added Node.js version constraint to `package.json`

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

This instructs all deployment platforms (Vercel, Render, Railway, etc.) to use Node.js 20.x.

### 2. Created `.nvmrc` file

```
20
```

This ensures local development and CI/CD systems use Node.js 20.x when they respect `.nvmrc` files.

### 3. Configured Vercel runtime in `vercel.json`

```json
{
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node",
      "config": {
        "runtime": "nodejs20.x"
      }
    }
  ]
}
```

This explicitly forces Vercel to use Node.js 20.x for serverless functions.

## Why This Happened

Vercel's default runtime recently changed to Node.js 24. Many native Node.js packages (including `better-sqlite3`, `sharp`, `bcrypt`, etc.) are still catching up with Node.js 24 compatibility, especially in serverless environments where build conditions differ from local development.

## Deployment Instructions

Simply redeploy to Vercel:

```bash
vercel --prod
```

Or if using GitHub integration, push to your main branch and Vercel will automatically redeploy with Node.js 20.x.

## Long-Term Considerations

### Upgrading better-sqlite3

While you could upgrade to the latest version of `better-sqlite3`:

```bash
npm install better-sqlite3@latest
```

Even the latest versions may still have issues with Node.js 24 in serverless environments. **Pinning to Node.js 20.x is the recommended production solution** for stability.

### SQLite in Serverless Environments (CRITICAL)

**⚠️ WARNING**: SQLite databases are **ephemeral** on Vercel and similar serverless platforms:

- **Data is reset on every deployment**
- **No persistence between invocations** (in some configurations)
- **User data, conversations, and analytics will be LOST**

This is a fundamental limitation of serverless architectures, not a bug.

### Recommended Database Migration for Production

For production use with Vercel, migrate to a persistent database:

1. **Turso** (SQLite-compatible, easiest migration path)
   - Drop-in SQLite replacement
   - Minimal code changes required
   - Excellent for read-heavy workloads

2. **Supabase** (PostgreSQL)
   - Full-featured PostgreSQL
   - Built-in auth, storage, real-time subscriptions
   - Generous free tier

3. **PlanetScale** (MySQL)
   - Serverless MySQL
   - Great developer experience
   - Database branching support

4. **Neon** (PostgreSQL)
   - Serverless PostgreSQL
   - Auto-scaling
   - Excellent cold-start performance

See `DEPLOYMENT.md` for database migration instructions.

## Verification

To verify the fix is working:

1. Check your Vercel build logs - should show Node.js v20.x.x
2. Look for successful `better-sqlite3` native module compilation
3. No more C++20 or node-gyp errors

## References

- Node.js 24 Compatibility: https://nodejs.org/en/blog/announcements/v24-release-announce
- better-sqlite3 Issues: https://github.com/WiseLibs/better-sqlite3/issues
- Vercel Node.js Runtime: https://vercel.com/docs/functions/runtimes/node-js
