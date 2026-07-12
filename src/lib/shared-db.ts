import 'server-only'
import { Pool } from 'pg'

// Shared-database connection (HANDOFF-site doc 10): the site reads portal
// data LIVE from the one shared PostgreSQL, through the stable views in the
// `web` schema. At deploy this URL is the site's own LOGIN user carrying the
// read-only `vertige_web` role (SELECT on web.* views + insert-only leads —
// it cannot alter portal data even fully compromised). In dev it falls back
// to the same DATABASE_URL Payload uses.

const globalForDb = globalThis as unknown as { vgSharedPool?: Pool }

export function sharedDb(): Pool {
  if (!globalForDb.vgSharedPool) {
    globalForDb.vgSharedPool = new Pool({
      connectionString: process.env.WEB_DATABASE_URL || process.env.DATABASE_URL,
      max: 5,
    })
  }
  return globalForDb.vgSharedPool
}
