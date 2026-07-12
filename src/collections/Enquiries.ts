import type { CollectionConfig } from 'payload'

// The durable backup store for EVERY form submission (HANDOFF 03 §4 — the
// "never lose it" guarantee, copy 1 of 3: DB → portal → email). Written by
// /api/enquiry, admin-visible + exportable; humans read, the API writes.
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['enquiryType', 'email', 'portalSync', 'portalRef', 'createdAt'],
    description: 'Every website form submission. Backup copy — the working record lives in the res portal.',
  },
  access: {
    // Admin UI only; the API route writes via the local Payload API.
    read: ({ req }) => !!req.user,
    create: () => false,
    update: () => false,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'enquiryType', type: 'select', required: true, options: ['trip', 'owner', 'newsletter', 'chalet-request', 'wishlist', 'wishlist-share'] },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'payload', type: 'json', admin: { description: 'The full submitted form body.' } },
    { name: 'portalSync', type: 'select', defaultValue: 'pending', options: ['pending', 'synced', 'failed', 'n/a'] },
    { name: 'portalRef', type: 'text', admin: { description: 'The res-portal enquiry ref (QVTG-…) once forwarded.' } },
    { name: 'sourcePath', type: 'text', admin: { description: 'The page the form was submitted from.' } },
  ],
  timestamps: true,
}
