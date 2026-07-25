import type { CollectionConfig } from 'payload'

// Email suppression list — addresses that have unsubscribed via /unsubscribe.
// Checked before any non-essential send (wishlist shares, newsletter); plain
// transactional replies to a form the person just submitted are exempt.

export const Suppressions: CollectionConfig = {
  slug: 'suppressions',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'source', 'createdAt'] },
  access: { read: () => true },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'source', type: 'text' }, // e.g. "unsubscribe page"
  ],
}
