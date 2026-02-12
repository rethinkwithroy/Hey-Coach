import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const sqlite = new Database(process.env.DATABASE_URL || './database.db')
const db = drizzle(sqlite)

migrate(db, { migrationsFolder: './server/db/migrations' })

console.log('✅ Database migration completed')

sqlite.close()
