import { NextResponse, NextRequest } from 'next/server';
import prisma, { filter, createApi } from '@libs/prisma';

interface GeocodingResponse {
    features: Array<{
        geometry: {
            coordinates: [number, number];
        };
    }>;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams);
        const data = await prisma.structure.findMany();
        const filteredData = filter(data, query);
        return NextResponse.json(filteredData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let fields = body.map((el: Record<string, unknown>) => ({ fields: el }));
        fields = await Promise.all(fields.map(async (structure: { fields: Record<string, unknown> }) => {
            if (structure.fields.adress) {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${(structure.fields.adress as string).replace(/ /g, "+")}`);
                const data: GeocodingResponse = await response.json();
                structure.fields.longitude = data.features[0].geometry.coordinates[0];
                structure.fields.latitude = data.features[0].geometry.coordinates[1];
            }
            return structure;
        }));
        const response = await createApi('structures', fields);
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
