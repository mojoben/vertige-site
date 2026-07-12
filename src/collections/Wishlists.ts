import type { CollectionConfig } from 'payload'

// Shared wishlists (HANDOFF 09 §3): when a guest shares a list we persist a
// read-only copy under a token so /wishlist/s/{token} can render it for the
// recipient. The guest's working copy stays in localStorage; this is the
// share snapshot, refreshed each time they re-share.

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'token', 'senderName', 'createdAt'] },
  access: { read: () => true },
  fields: [
    { name: 'token', type: 'text', required: true, unique: true, index: true },
    { name: 'name', type: 'text', required: true },
    { name: 'senderName', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'chaletName', type: 'text' },
        { name: 'loc', type: 'text' },
        { name: 'meta', type: 'text' },
        { name: 'price', type: 'text' },
        { name: 'img', type: 'text' },
      ],
    },
  ],
}
