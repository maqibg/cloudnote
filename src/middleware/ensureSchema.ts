import type { Context, Next } from 'hono';
import type { AppEnv, Bindings } from '../types';

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS notes (
    path TEXT PRIMARY KEY,
    content TEXT NOT NULL DEFAULT '',
    is_locked BOOLEAN DEFAULT 0,
    lock_type TEXT CHECK(lock_type IN ('read', 'write', NULL)),
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    view_count INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    target_path TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
  )`,
  'CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_notes_view_count ON notes(view_count DESC)',
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp DESC)',
];

let schemaReadyPromise: Promise<void> | null = null;

async function ensureSchemaReady(env: Bindings): Promise<void> {
  if (schemaReadyPromise) {
    return schemaReadyPromise;
  }

  schemaReadyPromise = (async () => {
    for (const statement of SCHEMA_STATEMENTS) {
      await env.DB.prepare(statement).run();
    }
  })().catch((error) => {
    schemaReadyPromise = null;
    throw error;
  });

  return schemaReadyPromise;
}

export async function ensureSchema(c: Context<AppEnv>, next: Next) {
  await ensureSchemaReady(c.env);
  await next();
}
