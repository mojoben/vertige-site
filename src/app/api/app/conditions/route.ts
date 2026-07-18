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
  // France
  { id: 'courchevel', lat: 45.4154, lon: 6.6345 },
  { id: 'val-disere', lat: 45.4489, lon: 6.9797 },
  { id: 'meribel', lat: 45.3967, lon: 6.5660 },
  { id: 'chamonix', lat: 45.9237, lon: 6.8694 },
  { id: 'megeve', lat: 45.8570, lon: 6.6180 },
  { id: 'tignes', lat: 45.4686, lon: 6.9060 },
  { id: 'val-thorens', lat: 45.2979, lon: 6.5800 },
  { id: 'les-arcs', lat: 45.5720, lon: 6.8290 },
  { id: 'la-plagne', lat: 45.5070, lon: 6.6780 },
  { id: 'argentiere', lat: 45.9832, lon: 6.9260 },
  { id: 'les-gets', lat: 46.1580, lon: 6.6690 },
  { id: 'chatel', lat: 46.2650, lon: 6.8400 },
  { id: 'samoens', lat: 46.0830, lon: 6.7270 },
  { id: 'saint-martin-de-belleville', lat: 45.3810, lon: 6.5060 },
  { id: 'serre-chevalier', lat: 44.9420, lon: 6.5540 },
  { id: 'la-clusaz', lat: 45.9040, lon: 6.4230 },
  { id: 'le-grand-bornand', lat: 45.9420, lon: 6.4270 },
  // Switzerland
  { id: 'verbier', lat: 46.0964, lon: 7.2286 },
  { id: 'zermatt', lat: 46.0207, lon: 7.7491 },
  { id: 'st-moritz', lat: 46.4908, lon: 9.8355 },
  { id: 'gstaad', lat: 46.4750, lon: 7.2860 },
  { id: 'davos', lat: 46.8027, lon: 9.8360 },
  { id: 'grindelwald', lat: 46.6244, lon: 8.0414 },
  { id: 'klosters', lat: 46.8697, lon: 9.8810 },
  { id: 'crans-montana', lat: 46.3110, lon: 7.4800 },
  { id: 'wengen', lat: 46.6053, lon: 7.9220 },
  { id: 'adelboden', lat: 46.4930, lon: 7.5590 },
  { id: 'andermatt', lat: 46.6350, lon: 8.5940 },
  { id: 'laax', lat: 46.8050, lon: 9.2580 },
  { id: 'arosa', lat: 46.7790, lon: 9.6790 },
  { id: 'engelberg', lat: 46.8210, lon: 8.4010 },
  { id: 'villars', lat: 46.2980, lon: 7.0560 },
  // Austria
  { id: 'st-anton', lat: 47.1275, lon: 10.2618 },
  { id: 'lech', lat: 47.2085, lon: 10.1421 },
  { id: 'kitzbuhel', lat: 47.4460, lon: 12.3920 },
  { id: 'ischgl', lat: 47.0120, lon: 10.2900 },
  { id: 'solden', lat: 46.9650, lon: 11.0070 },
  { id: 'saalbach-hinterglemm', lat: 47.3900, lon: 12.6360 },
  { id: 'zurs', lat: 47.1690, lon: 10.1690 },
  { id: 'mayrhofen', lat: 47.1640, lon: 11.8590 },
  { id: 'schladming', lat: 47.3940, lon: 13.6870 },
  { id: 'obertauern', lat: 47.2510, lon: 13.5570 },
  { id: 'bad-gastein', lat: 47.1150, lon: 13.1340 },
  { id: 'skiwelt', lat: 47.4880, lon: 12.3040 },
  { id: 'hintertux', lat: 47.0680, lon: 11.6660 },
  // Italy
  { id: 'cortina-dampezzo', lat: 46.5405, lon: 12.1357 },
  { id: 'courmayeur', lat: 45.7967, lon: 6.9689 },
  { id: 'alta-badia', lat: 46.5770, lon: 11.8940 },
  { id: 'madonna-di-campiglio', lat: 46.2290, lon: 10.8260 },
  { id: 'cervinia', lat: 45.9370, lon: 7.6290 },
  { id: 'val-gardena', lat: 46.5570, lon: 11.6760 },
  { id: 'livigno', lat: 46.5380, lon: 10.1350 },
  { id: 'bormio', lat: 46.4680, lon: 10.3700 },
  { id: 'sestriere', lat: 44.9560, lon: 6.8790 },
  { id: 'kronplatz', lat: 46.7410, lon: 11.9540 },
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
    // Legacy app ids from the prototype seed (pre-canonical-slugs)
    const alias: Record<string, string> = { cortina: 'cortina-dampezzo' }
    for (const [a, real] of Object.entries(alias)) if (out[real]) out[a] = out[real]
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
