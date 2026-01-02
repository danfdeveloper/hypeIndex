import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    try {
        // Fetch from ESPN scoreboard - includes games and team records
        const espnResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');

        if (!espnResponse.ok) {
            console.error('ESPN API Error:', await espnResponse.text());
            return NextResponse.json({ error: 'Failed to fetch from ESPN' }, { status: espnResponse.status });
        }

        const espnData = await espnResponse.json();
        console.log('ESPN Response received');

        return NextResponse.json(espnData);
    } catch (error) {
        console.error('Error fetching NBA data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}