'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  type WishlistItem, type WishlistList,
  loadLists, saveLists, setCurrentList,
} from '@/lib/wishlist'

// The wishlist page app — faithful port of vertige-proto-wishlist.html
// (HANDOFF 09): lists view / list detail, create-rename-delete, the share
// modal (copy link / send by email with Sent confirmation / WhatsApp) and
// the "Let us plan your week" request panel → /api/enquiry (type wishlist).
// Lists live in localStorage (guest-first, 09 §3); sharing snapshots the
// list server-side under a token.

const HEART = (
  <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
)

function useToast(): [string | null, (t: string) => void] {
  const [msg, setMsg] = useState<string | null>(null)
  const show = useCallback((t: string) => {
    setMsg(t)
    setTimeout(() => setMsg(null), 1800)
  }, [])
  return [msg, show]
}

async function ensureShare(list: WishlistList): Promise<{ token: string; url: string } | null> {
  try {
    const res = await fetch('/api/wishlist/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: list.shareToken, name: list.name, items: list.items }),
    })
    if (!res.ok) return null
    const d = await res.json()
    return { token: d.token, url: d.url }
  } catch {
    return null
  }
}

/** Header heart (HANDOFF 09 §2.2): count badge + the "My Favourites"
 *  mini-panel — list selector, removable chalets, "See my lists". */
export function WishlistHeaderButton() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [lists, setLists] = useState<WishlistList[]>([])
  const [sel, setSel] = useState<number | null>(null)

  useEffect(() => {
    const sync = () => {
      const ls = loadLists()
      setLists(ls)
      setCount(ls.reduce((n, l) => n + l.items.length, 0))
      setSel((s) => (s != null && ls.some((l) => l.id === s) ? s : ls[0]?.id ?? null))
    }
    sync()
    addEventListener('vg-wishlist', sync)
    const close = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.('.wishpanel') || t?.closest?.('.wishwrap')) return
      setOpen(false)
    }
    document.addEventListener('click', close)
    return () => { removeEventListener('vg-wishlist', sync); document.removeEventListener('click', close) }
  }, [])

  const current = lists.find((l) => l.id === sel) ?? null
  const removeAt = (i: number) => {
    if (!current) return
    const next = loadLists().map((l) => (l.id === current.id ? { ...l, items: l.items.filter((_, j) => j !== i) } : l))
    saveLists(next)
  }

  return (
    <span className="wishwrap">
      <button className="hicon wish" aria-label="Wishlist" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        {count > 0 && <span className="wishcount">{count}</span>}
      </button>
      {open && (
        <div className="wishpanel">
          <div className="wp-h">My Favourites</div>
          {lists.length > 1 && (
            <select value={sel ?? ''} onChange={(e) => { setSel(Number(e.target.value)); setCurrentList(Number(e.target.value)) }}>
              {lists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.items.length})</option>)}
            </select>
          )}
          {current?.items.length
            ? current.items.map((it, i) => (
              <div key={it.slug} className="wp-item">
                <div className="im" style={{ backgroundImage: `url(${it.img})` }} />
                <div className="n">{it.name}</div>
                <button className="rm" title="Remove" onClick={() => removeAt(i)}>×</button>
              </div>
            ))
            : <div className="wp-empty">No list yet — add your favourites to a list, share it with an advisor and let us guide you.</div>}
          <Link className="btn" href="/wishlist" onClick={() => setOpen(false)}>See my lists</Link>
        </div>
      )}
    </span>
  )
}

export function WishlistApp() {
  const [lists, setLists] = useState<WishlistList[]>([])
  const [ready, setReady] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)
  const [modal, setModal] = useState<'create' | 'rename' | 'share' | null>(null)
  const [shareStep, setShareStep] = useState<'opts' | 'email' | 'sent'>('opts')
  const [sentTo, setSentTo] = useState('')
  const [nameField, setNameField] = useState('')
  const [reqSent, setReqSent] = useState(false)
  const [toast, showToast] = useToast()

  useEffect(() => {
    setLists(loadLists())
    setReady(true)
    const sync = () => setLists(loadLists())
    addEventListener('vg-wishlist', sync)
    return () => removeEventListener('vg-wishlist', sync)
  }, [])

  const update = (next: WishlistList[]) => {
    setLists(next)
    saveLists(next)
  }
  const cur = lists.find((l) => l.id === openId) ?? null

  const openList = (id: number) => {
    setOpenId(id)
    setCurrentList(id)
    setReqSent(false)
    scrollTo(0, 0)
  }

  const saveName = () => {
    const v = nameField.trim()
    if (!v) return
    if (modal === 'rename' && cur) {
      update(lists.map((l) => (l.id === cur.id ? { ...l, name: v } : l)))
    } else {
      const id = Date.now()
      update([...lists, { id, name: v, items: [], createdAt: new Date().toISOString() }])
      openList(id)
    }
    setModal(null)
    showToast('List saved')
  }

  const deleteList = () => {
    if (!cur || !confirm(`Delete the list “${cur.name}”?`)) return
    update(lists.filter((l) => l.id !== cur.id))
    setOpenId(null)
    showToast('List deleted')
  }

  const removeItem = (i: number) => {
    if (!cur) return
    update(lists.map((l) => (l.id === cur.id ? { ...l, items: l.items.filter((_, j) => j !== i) } : l)))
  }

  const withShare = async (fn: (token: string, url: string) => void) => {
    if (!cur || !cur.items.length) { showToast('Add a chalet to the list first'); return }
    const share = await ensureShare(cur)
    if (!share) { showToast('Could not create the share link — try again'); return }
    if (!cur.shareToken) update(lists.map((l) => (l.id === cur.id ? { ...l, shareToken: share.token } : l)))
    fn(share.token, `${location.origin}${share.url}`)
  }

  const shareVia = (m: 'link' | 'whatsapp') => withShare((_t, url) => {
    if (m === 'link') {
      navigator.clipboard?.writeText(url)
      showToast('Link copied')
      setModal(null)
    } else {
      open(`https://wa.me/?text=${encodeURIComponent(`A wishlist of Vertige chalets for you: ${url}`)}`, '_blank')
      setModal(null)
    }
  })

  const sendShareEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!cur) return
    const fd = new FormData(e.currentTarget)
    const friendEmail = String(fd.get('friendEmail') ?? '').trim()
    const senderName = String(fd.get('senderName') ?? '').trim()
    const note = String(fd.get('note') ?? '').trim()
    withShare(async (token) => {
      const countries = [...new Set(cur.items.map((i) => i.loc.split(',').pop()?.trim()).filter(Boolean))]
      const res = await fetch('/api/wishlist/share-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friendEmail, senderName, note,
          listName: cur.name,
          countLine: `${cur.items.length} chalet${cur.items.length === 1 ? '' : 's'}${countries.length ? ` · ${countries.join(' & ')}` : ''}`,
          coverImg: cur.items[0]?.img, thumbs: cur.items.slice(0, 3).map((i) => i.img),
          shareToken: token, sourcePath: '/wishlist',
        }),
      })
      if (res.ok) { setSentTo(friendEmail); setShareStep('sent') }
      else showToast('Could not send — try again')
    })
  }

  const sendRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!cur) return
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enquiryType: 'wishlist',
        firstName: String(fd.get('firstName') ?? '').trim(),
        lastName: String(fd.get('lastName') ?? '').trim(),
        email: String(fd.get('email') ?? '').trim(),
        arrival: String(fd.get('arrival') ?? ''),
        departure: String(fd.get('departure') ?? ''),
        listName: cur.name,
        properties: cur.items.map((i) => i.slug),
        message: `Wishlist request — ${cur.name}: ${cur.items.map((i) => i.name).join(', ')}`,
        sourcePath: '/wishlist',
      }),
    })
    if (res.ok) setReqSent(true)
    else showToast('Could not send the request — try again')
  }

  if (!ready) return <div className="wlsec"><div className="wrap" /></div>

  return (
    <section className="wlsec"><div className="wrap">
      {!cur ? (
        /* ── View A: my lists ── */
        <div>
          <div className="wlbar"><h2>Your lists</h2><button className="wlbtn" onClick={() => { setNameField(''); setModal('create') }}>+ Create a new list</button></div>
          {lists.length ? (
            <div className="listgrid">
              {lists.map((l) => (
                <button key={l.id} className="listcard" onClick={() => openList(l.id)}>
                  <div className="im" style={{ backgroundImage: `url(${l.items[0]?.img ?? '/images/chalets/ext-05.webp'})` }} />
                  <div className="b"><h3>{l.name}</h3><div className="c">{l.items.length}{l.items.length === 1 ? ' chalet' : ' chalets'}</div></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="wlempty">
              {HEART}
              <h3>No lists yet</h3>
              <p>Add your favourite chalets to a list, share it with an advisor and let us guide you.</p>
              <Link className="btn" href="/destinations">Browse chalets</Link>
            </div>
          )}
        </div>
      ) : (
        /* ── View B: list detail ── */
        <div>
          <div className="wlbar">
            <div>
              <div className="crumb2"><a href="#" onClick={(e) => { e.preventDefault(); setOpenId(null) }}>My favourites</a> › <span>{cur.name}</span></div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}><span>{cur.name}</span>
                <button className="icobtn" title="Rename list" onClick={() => { setNameField(cur.name); setModal('rename') }}><svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg></button>
                <button className="icobtn" title="Delete list" onClick={deleteList}><svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg></button>
              </h2>
            </div>
            <span className="sharelink" onClick={() => { setShareStep('opts'); setModal('share') }}><svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></svg> Share with a friend</span>
          </div>
          <div className="wldetail">
            <div>
              {cur.items.length
                ? cur.items.map((it, i) => (
                  <div key={it.slug} className="propcard">
                    <button className="rm" title="Remove" onClick={() => removeItem(i)}>×</button>
                    <div className="im" style={{ backgroundImage: `url(${it.img})` }} />
                    <div className="b">
                      <h3>{it.name}</h3>
                      <div className="loc">{it.loc}</div>
                      <div className="meta">{it.meta}</div>
                      <div className="price">{it.price}</div>
                    </div>
                  </div>
                ))
                : <p style={{ color: 'var(--muted)' }}>This list is empty. <Link href="/destinations" style={{ color: 'var(--rose)' }}>Browse chalets</Link> and tap the heart to add them.</p>}
            </div>
            <div className="reqpanel">
              {reqSent && <div className="okmsg" style={{ display: 'block' }}>Thank you — your list is with our team. An advisor will confirm availability and pricing across your selection and be in touch shortly.</div>}
              <span className="eyebrow">Your selection</span>
              <h3>Let us plan your week</h3>
              <div className="cnt">{cur.items.length}{cur.items.length === 1 ? ' chalet in this list' : ' chalets in this list'}</div>
              <p>Share your selection and we&rsquo;ll confirm availability and pricing across every chalet on the list, then help you choose and plan the week. Add your dates and send the request.</p>
              {!reqSent && (
                <form onSubmit={sendRequest}>
                  <label>Date of stay</label>
                  <div className="two"><input type="date" name="arrival" aria-label="Arrival" /><input type="date" name="departure" aria-label="Departure" /></div>
                  <div className="two">
                    <div><label>First name</label><input type="text" name="firstName" required /></div>
                    <div><label>Last name</label><input type="text" name="lastName" required /></div>
                  </div>
                  <label>Email</label><input type="email" name="email" required />
                  <button className="btn" type="submit">Send the request</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

      {/* ── Create / rename modal ── */}
      <div className={`wlmodal${modal === 'create' || modal === 'rename' ? ' on' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="box">
          <button className="x" onClick={() => setModal(null)}>×</button>
          <h3>{modal === 'rename' ? 'Rename list' : 'Create a new list'}</h3>
          <div className="hint">{HEART} Add your favourites to a list and share them with an advisor.</div>
          <label>Name of the list</label>
          <input type="text" value={nameField} placeholder="e.g. Chamonix, February" onChange={(e) => setNameField(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveName() }} />
          <button className="btn" onClick={saveName}>{modal === 'rename' ? 'Save' : 'Validate'}</button>
        </div>
      </div>

      {/* ── Share modal ── */}
      <div className={`wlmodal${modal === 'share' ? ' on' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
        <div className="box">
          <button className="x" onClick={() => setModal(null)}>×</button>
          <h3>Share my list</h3>
          {shareStep === 'opts' && (
            <div>
              <div className="shareopt" onClick={() => shareVia('link')}>Copy the link <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg></div>
              <div className="shareopt" onClick={() => setShareStep('email')}>Send by email <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg></div>
              <div className="shareopt" onClick={() => shareVia('whatsapp')}>Send on WhatsApp <svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5z" /></svg></div>
            </div>
          )}
          {shareStep === 'email' && (
            <form onSubmit={sendShareEmail}>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.2rem' }}>We&rsquo;ll send your friend a beautifully presented email with your list and a link to view it.</p>
              <label>Your friend&rsquo;s email</label><input type="email" name="friendEmail" placeholder="friend@email.com" required />
              <label>Your name</label><input type="text" name="senderName" placeholder="So they know who it’s from" />
              <label>Add a note (optional)</label><textarea name="note" placeholder="Thought you’d love these for our trip…" />
              <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center' }}>
                <button type="button" className="wlbtn" onClick={() => setShareStep('opts')}>Back</button>
                <button type="submit" className="btn" style={{ border: 'none' }}>Send the wishlist</button>
              </div>
            </form>
          )}
          {shareStep === 'sent' && (
            <div style={{ textAlign: 'center', padding: '.6rem 0 .4rem' }}>
              <svg viewBox="0 0 24 24" style={{ width: 42, height: 42, stroke: 'var(--rose)', strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', marginBottom: '.9rem' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
              <h3 style={{ marginBottom: '.5rem' }}>Sent</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.95rem' }}>Your wishlist is on its way to <b style={{ color: 'var(--plum)', fontWeight: 400 }}>{sentTo}</b>.</p>
              <button className="wlbtn" style={{ marginTop: '1.3rem' }} onClick={() => setModal(null)}>Done</button>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="wltoast" style={{ display: 'block' }}>{toast}</div>}
    </section>
  )
}
