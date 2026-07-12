'use client'

// Wishlist store — guest-first per HANDOFF 09 §3: lists persist in
// localStorage for anonymous users (merged into the account on login when
// accounts land). Items reference portal property slugs; display details are
// resolved against the live catalogue at render, with a small snapshot kept
// as the fallback for chalets that later leave the feed.

export interface WishlistItem {
  slug: string
  // Snapshot for display resilience — the live catalogue wins when present.
  name: string
  loc: string
  meta: string
  price: string
  img: string
}

export interface WishlistList {
  id: number
  name: string
  items: WishlistItem[]
  shareToken?: string
  createdAt: string
}

const KEY = 'vg-wishlist-v1'
const CURRENT_KEY = 'vg-wishlist-current'

export function loadLists(): WishlistList[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as WishlistList[]
  } catch {
    return []
  }
}

function persist(lists: WishlistList[]) {
  localStorage.setItem(KEY, JSON.stringify(lists))
  dispatchEvent(new CustomEvent('vg-wishlist'))
}

export function saveLists(lists: WishlistList[]) {
  persist(lists)
}

export function currentListId(): number | null {
  const v = localStorage.getItem(CURRENT_KEY)
  return v ? Number(v) : null
}

export function setCurrentList(id: number) {
  localStorage.setItem(CURRENT_KEY, String(id))
}

export function itemCount(): number {
  return loadLists().reduce((n, l) => n + l.items.length, 0)
}

export function isSaved(slug: string): boolean {
  return loadLists().some((l) => l.items.some((i) => i.slug === slug))
}

/** Add a chalet to the current list, creating "My favourites" if none exists.
 *  Returns the list it was saved to (or null if it was already on it). */
export function addItem(item: WishlistItem): WishlistList | null {
  const lists = loadLists()
  let list = lists.find((l) => l.id === currentListId()) ?? lists[0]
  if (!list) {
    list = { id: Date.now(), name: 'My favourites', items: [], createdAt: new Date().toISOString() }
    lists.push(list)
    setCurrentList(list.id)
  }
  if (list.items.some((i) => i.slug === item.slug)) return null
  list.items.push(item)
  persist(lists)
  return list
}

export function removeItemEverywhere(slug: string) {
  const lists = loadLists()
  for (const l of lists) l.items = l.items.filter((i) => i.slug !== slug)
  persist(lists)
}
