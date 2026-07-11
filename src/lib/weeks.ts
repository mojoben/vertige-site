// Week shape shared by the chalet detail page (server) and its interactive
// bits (client). mockWeeks reproduces the prototype's sample season pricing
// (Dec 2026 → mid-Apr 2027) for chalets without live portal availability.

export interface Week {
  s: string // ISO start
  e: string // ISO end
  price: number | null
  status: 'a' | 'req' | 'un' // available / on request / unavailable
}

export function mockWeeks(changeover: 'Sat' | 'Sun' = 'Sun'): Week[] {
  const base = (dt: Date) => {
    const m = dt.getMonth(); const day = dt.getDate()
    if (m === 11) return day >= 20 ? 122000 : 82000
    if (m === 0) return day <= 4 ? 90000 : 72000
    if (m === 1) return day >= 8 && day <= 24 ? 116000 : 100000
    if (m === 2) return day <= 14 ? 80000 : 72000
    if (m === 3) return 64000
    return 80000
  }
  const out: Week[] = []
  const start = new Date(2026, 11, changeover === 'Sat' ? 5 : 6)
  const cur = new Date(start); const end = new Date(2027, 3, 18); let i = 0
  while (cur <= end) {
    const s = new Date(cur); const e = new Date(cur); e.setDate(e.getDate() + 7)
    let status: Week['status'] = 'a'
    if (i === 7) status = 'un'
    if (i === 3 || i === 9) status = 'req'
    out.push({ s: s.toISOString().slice(0, 10), e: e.toISOString().slice(0, 10), price: status === 'req' ? null : base(s), status })
    cur.setDate(cur.getDate() + 7); i++
  }
  return out
}
