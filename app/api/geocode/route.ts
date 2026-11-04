import { NextResponse, type NextRequest } from 'next/server'

// Best-effort, per-instance rate limit (serverless instances don't share memory,
// but this still blunts bursts from a single client).
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const hits = new Map<string, { count: number; reset: number }>()

function rateLimited(ip: string): boolean {
    const now = Date.now()
    if (hits.size > 1000) {
        for (const [key, value] of hits) if (value.reset < now) hits.delete(key)
    }
    const entry = hits.get(ip)
    if (!entry || entry.reset < now) {
        hits.set(ip, { count: 1, reset: now + WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > MAX_REQUESTS
}

export async function GET(request: NextRequest) {
    try {
        const ip = request.headers.get('x-nf-client-connection-ip')
            ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
            ?? 'unknown'
        if (rateLimited(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } })
        }

        const query = request.nextUrl.searchParams.get('q')?.trim()
        if (!query) {
            return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
        }
        if (query.length > 200) {
            return NextResponse.json({ error: 'Query too long' }, { status: 400 })
        }

        const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`,
            { signal: AbortSignal.timeout(5000) }
        )
        if (!response.ok) {
            return NextResponse.json({ error: 'Geocoding service unavailable' }, { status: 502 })
        }
        const data = await response.json()

        if (!data.features || data.features.length === 0) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 })
        }

        const [longitude, latitude] = data.features[0].geometry.coordinates
        return NextResponse.json({ longitude, latitude })
    } catch (error) {
        console.error('Geocoding error:', error)
        return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
    }
}
