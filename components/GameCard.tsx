// components/GameCard.tsx
'use client';

interface Team {
    name: string;
    wins: number;
    losses: number;
}

interface GameCardProps {
    game: {
        id: number;
        home: Team;
        away: Team;
        time: string;
        date: string; // ISO date string
        hype?: number;
    };
    rank: number;
    favoriteTeam?: string | null;
    timezone?: string;
}

export default function GameCard({ game, rank, favoriteTeam, timezone = 'America/New_York' }: GameCardProps) {
    const getHypeColor = (hype: number): string => {
        if (hype >= 75) return 'text-purple-400';
        if (hype >= 50) return 'text-purple-500';
        return 'text-purple-600';
    };

    const getHypeLabel = (hype: number): string => {
        if (hype >= 75) return '🔥 MUST WATCH';
        if (hype >= 50) return '⚡ HIGH HYPE';
        return '📊 LOW HYPE';
    };

    const formatGameTime = (dateString: string): string => {
        const date = new Date(dateString);

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            timeZone: timezone,
            timeZoneName: 'short'
        });
    };

    const isFavoriteTeam = (teamName: string): boolean => {
        return favoriteTeam === teamName;
    };

    const hasFavoriteTeam = isFavoriteTeam(game.home.name) || isFavoriteTeam(game.away.name);

    return (
        <div className={`bg-black border rounded-lg p-6 hover:border-purple-500 transition-all duration-300 ${hasFavoriteTeam ? 'border-purple-600 ring-2 ring-purple-500/50' : 'border-gray-800'
            }`}>
            {hasFavoriteTeam && (
                <div className="mb-2 flex items-center gap-2 text-purple-400 text-sm font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    YOUR TEAM
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-purple-500">
                        #{rank}
                    </div>
                    <div>
                        <div className={`text-sm font-semibold ${getHypeColor(game.hype || 0)}`}>
                            {getHypeLabel(game.hype || 0)}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold text-purple-500">
                        {game.hype}
                    </div>
                    <div className="text-xs text-gray-500">HYPE SCORE</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
                {/* Away Team */}
                <div className="text-right">
                    <div className={`text-xl font-bold ${isFavoriteTeam(game.away.name) ? 'text-purple-400' : ''}`}>
                        {game.away.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {game.away.wins}-{game.away.losses}
                    </div>
                </div>

                {/* time and @ */}
                <div className="text-center">
                    <div className="text-2xl">{formatGameTime(game.date)}</div>
                    <div className="text-purple-400 font-bold text-5xl">@</div>
                </div>

                {/* Home Team */}
                <div className="text-left">
                    <div className={`text-xl font-bold ${isFavoriteTeam(game.home.name) ? 'text-purple-400' : ''}`}>
                        {game.home.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                        {game.home.wins}-{game.home.losses}
                    </div>
                </div>
            </div>
        </div>
    );
}