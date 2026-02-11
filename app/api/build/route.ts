import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await fetch(process.env.BUILD_HOOK!);
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error, { status: 500 });
    }
}
