import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Enquiries } from './collections/Enquiries'
import { Wishlists } from './collections/Wishlists'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Enquiries, Wishlists],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Isolated schema: keeps the site's tables (editorial + enquiry backup)
    // fully separate from the res platform's public schema in the shared dev DB.
    schemaName: 'site',
    // Create/sync the schema on boot in every environment — without this the
    // hosted DB never gets the site tables (Payload only pushes in dev) and
    // enquiry storage fails. Swap for generated Payload migrations at
    // production hardening.
    push: true,
  }),
  sharp,
  plugins: [],
})
