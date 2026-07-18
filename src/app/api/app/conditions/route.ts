import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { appCors } from '../shape'

// Live resort conditions for the app (Ben, 2026-07-18: temp low/high +
// weather symbol; snow depth dropped — no clean free source). One cached
// server-side call to Open-Meteo for all resorts at once; the app never
// hits the weather API directly. NOTE: Open-Meteo's free tier is licensed
// non-commercial — swap to their commercial plan or MET Norway before the
// app ships properly.

const RESORTS: { id: string; lat: number; lon: number }[] = [
  { id: 'val-disere', lat: 45.4489, lon: 6.9797 },
  { id: 'chamonix', lat: 45.9237, lon: 6.8694 },
  { id: 'verbier', lat: 46.0964, lon: 7.2286 },
  { id: 'zermatt', lat: 46.0207, lon: 7.7491 },
  { id: 'st-anton', lat: 47.1275, lon: 10.2618 },
  { id: 'lech', lat: 47.2085, lon: 10.1421 },
  { id: 'cortina', lat: 46.5405, lon: 12.1357 },
  { id: 'courmayeur', lat: 45.7967, lon: 6.9689 },
]

// WMO weather code → the app's symbol vocabulary (line icons on the client).
function symbolFor(code: number): string {
  if (code === 0) return 'sun'
  if (code <= 2) return 'partly'
  if (code === 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloud'
}

const loadConditions = unstable_cache(
  async () => {
    const lat = RESORTS.map((r) => r.lat).join(',')
    const lon = RESORTS.map((r) => r.lon).join(',')
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=1&timezone=Europe%2FParis`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`open-meteo ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : [data]
    const out: Record<string, { low: number; high: number; symbol: string }> = {}
    RESORTS.forEach((r, i) => {
      const d = list[i]?.daily
      if (!d) return
      out[r.id] = {
        low: Math.round(d.temperature_2m_min[0]),
        high: Math.round(d.temperature_2m_max[0]),
        symbol: symbolFor(d.weather_code[0]),
      }
    })
    return { updated: new Date().toISOString(), conditions: out }
  },
  ['app-conditions'],
  { revalidate: 1800 }, // 30 min
)

export async function GET() {
  try {
    const payload = await loadConditions()
    return NextResponse.json(payload, { headers: appCors })
  } catch {
    return NextResponse.json({ updated: null, conditions: {} }, { headers: appCors })
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: appCors })
}
