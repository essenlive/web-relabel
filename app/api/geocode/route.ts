import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('q')
        if (!query) {
            return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
        }

        const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}`
        )
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
