import { NextResponse, NextRequest } from 'next/server';
import prisma, { filter, createApi } from '@libs/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams);
        const data = await prisma.community.findMany();
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
        const fields = body.map((el: Record<string, unknown>) => ({ fields: el }));
        const response = await createApi('communities', fields);
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
