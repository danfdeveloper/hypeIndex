interface Team {
    name: string;
    wins: number;
    losses: number;
    last10?: string;
}

export interface Game {
    id: number;
    home: Team;
    away: Team;
    time: string;
    date: string;
    hype?: number;
}

export const fetchGamesFromAPI = async (date: string): Promise<Game[]> => {
    console.log('Fetching from ESPN API with date:', date);

    try {
        const response = await fetch(`/api/nba-games?date=${date}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);
            throw new Error(`API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('ESPN Response:', data);

        const games: Game[] = (data.events || []).map((event: any) => {
            const competition = event.competitions[0];
            const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
            const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

            // Calculate win percentage as a simple indicator of recent form
            // Since ESPN doesn't provide last 10 directly in scoreboard, we'll use home/road records
            const getFormIndicator = (competitor: any) => {
                const totalRecord = competitor.records?.find((r: any) => r.type === 'total');
                if (!totalRecord) return null;

                const [wins, losses] = totalRecord.summary.split('-').map(Number);
                const totalGames = wins + losses;

                // Simple form: "Hot" if > 60% win rate, "Cold" if < 40%
                const winPct = wins / totalGames;
                if (winPct >= 0.60) return '🔥';
                if (winPct <= 0.40) return '❄️';
                return null;
            };

            return {
                id: parseInt(event.id),
                home: {
                    name: homeTeam.team.displayName,
                    wins: parseInt(homeTeam.records?.[0]?.summary?.split('-')[0] || '0'),
                    losses: parseInt(homeTeam.records?.[0]?.summary?.split('-')[1] || '0'),
                    last10: getFormIndicator(homeTeam)
                },
                away: {
                    name: awayTeam.team.displayName,
                    wins: parseInt(awayTeam.records?.[0]?.summary?.split('-')[0] || '0'),
                    losses: parseInt(awayTeam.records?.[0]?.summary?.split('-')[1] || '0'),
                    last10: getFormIndicator(awayTeam)
                },
                date: event.date,
                time: new Date(event.date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: 'America/New_York',
                    timeZoneName: 'short'
                })
            };
        });

        console.log('Parsed games:', games);
        return games;
    } catch (fetchError) {
        console.error('Fetch error details:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
};