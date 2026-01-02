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
        hype?: number;
    };
    rank: number;
}

export default function GameCard({ game, rank }: GameCardProps) {
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

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition-all duration-300">
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
                    <div className="text-xl font-bold">{game.away.name}</div>
                    <div className="text-gray-400 text-sm">
                        {game.away.wins}-{game.away.losses}
                    </div>
                </div>

                {/* time and @ */}
                <div className="text-center">
                    <div className="text-xs ">{game.time}</div>
                    <div className="text-purple-400 font-bold text-3xl">@</div>
                </div>

                {/* Home Team */}
                <div className="text-left">
                    <div className="text-xl font-bold">{game.home.name}</div>
                    <div className="text-gray-400 text-sm">
                        {game.home.wins}-{game.home.losses}
                    </div>
                </div>
            </div>
        </div>
    );
}