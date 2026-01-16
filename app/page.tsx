'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import Standings from '@/components/Standings';
import { calculateHype } from '@/lib/hypeCalculator';
import { fetchGamesFromAPI, type Game } from '@/lib/nbaApi';

interface CachedData {
  games: Game[];
  date: string;
}

// Inline Header Component
function Header({ title, subtitle, onButtonClick, showProfile }: any) {
  return (
    <header className="">
      <div className="w-full px-4 sm:px-6 lg:px-20 py-4 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            hype<span className="text-purple-500">Tracker</span>
          </h1>
          <p className="text-sm sm:text-base">{subtitle}</p>
        </div>
        <button
          onClick={onButtonClick}
          type="button"
          className="cursor-pointer px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
        >
          {showProfile ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Log In
            </>
          )}
        </button>
      </div>
    </header>
  );
}

// Inline GameCard Component
function GameCard({ game, rank, favoriteTeam, timezone = 'America/New_York' }: any) {

  const getHypeLabel = (hype: number): string => {
    if (hype >= 95) return '👑 GAME OF ALL GAMES';
    if (hype >= 85) return '🔥 MUST WATCH';
    if (hype >= 75) return '⚡ HIGH HYPE';
    return '🥱 TV STAYS OFF';
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
    <div className={`bg-gray-900 border rounded-lg p-4 sm:p-6 hover:border-purple-500 transition-all duration-300 ${hasFavoriteTeam ? 'border-purple-600 ring-2 ring-purple-500/50' : 'border-gray-800'
      }`}>
      {hasFavoriteTeam && (
        <div className="mb-2 flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          YOUR TEAM
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-500 -mt-5">#{rank}</div>
          <div className={`text-xs sm:text-lg font-bold text-purple-500 -mt-5`}> {getHypeLabel(game.hype || 0)}</div>

        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-4xl font-bold text-purple-500">{game.hype}</div>
          <div className="text-xs text-gray-500">HYPE</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
        <div className="text-right">
          <div className={`text-sm sm:text-xl font-bold ${isFavoriteTeam(game.away.name) ? 'text-purple-400' : ''} truncate`}>
            {game.away.name}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">{game.away.wins}-{game.away.losses}</div>
        </div>
        <div className="text-center">
          <div className="text-sm sm:text-base">{formatGameTime(game.date)}</div>
          <div className="text-purple-400 font-bold text-2xl sm:text-3xl">@</div>
        </div>
        <div className="text-left">
          <div className={`text-sm sm:text-xl font-bold ${isFavoriteTeam(game.home.name) ? 'text-purple-400' : ''} truncate`}>
            {game.home.name}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">{game.home.wins}-{game.home.losses}</div>
        </div>
      </div>
    </div>
  );
}

export default function HypeTracker() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [east, setEast] = useState<any[]>([]);
  const [west, setWest] = useState<any[]>([]);
  const [showStandings, setShowStandings] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const res = await fetch("https://site.api.espn.com/apis/v2/sports/basketball/nba/standings");
        const data = await res.json();

        const parse = (conf: any) =>
          conf.standings.entries.map((entry: any) => {
            const stat = (name: string) => entry.stats.find((s: any) => s.name === name)?.value;
            return {
              name: entry.team.displayName,
              wins: stat("wins"),
              losses: stat("losses"),
            };
          });

        const eastConf = data.children.find((c: any) => c.name === "Eastern Conference");
        const westConf = data.children.find((c: any) => c.name === "Western Conference");

        setEast(parse(eastConf));
        setWest(parse(westConf));
      } catch (err) {
        console.error("Failed to load standings", err);
      }
    };

    loadStandings();
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const today = getTodayDate();
        const cacheKey = 'nba-games-cache';
        const cachedString = localStorage.getItem(cacheKey);
        let cachedData: CachedData | null = null;

        if (cachedString) {
          try {
            cachedData = JSON.parse(cachedString);
          } catch (err) {
            console.log('Invalid cache data');
          }
        }

        if (cachedData && cachedData.date === today) {
          console.log('Using cached data from today');
          const gamesWithHype = cachedData.games.map(game => ({
            ...game,
            hype: calculateHype(game.home, game.away)
          })).sort((a, b) => (b.hype || 0) - (a.hype || 0));

          setGames(gamesWithHype);
          setLoading(false);
          return;
        }

        console.log('Fetching fresh data from API');
        const freshGames = await fetchGamesFromAPI(today);

        localStorage.setItem(cacheKey, JSON.stringify({
          games: freshGames,
          date: today
        }));

        const gamesWithHype = freshGames.map(game => ({
          ...game,
          hype: calculateHype(game.home, game.away)
        })).sort((a, b) => (b.hype || 0) - (a.hype || 0));

        setGames(gamesWithHype);
        setLoading(false);
      } catch (err) {
        console.error('Error loading games:', err);
        setError(err instanceof Error ? err.message : 'Failed to load games');
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-xl sm:text-2xl">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-xl sm:text-2xl text-red-500 mb-4">Error</div>
          <div className="text-gray-400 text-sm sm:text-base">{error}</div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header
          title="hypeTracker"
          subtitle="Today's NBA games sorted by hype rating"
          onButtonClick={() => router.push(user ? '/profile' : '/login')}
          showProfile={!!user}
        />
        <div className="flex items-center justify-center mt-20 px-4">
          <div className="text-lg sm:text-xl text-gray-400">No games scheduled for today</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(125deg, rgba(147, 51, 234, 0.4) 0%, rgba(0, 0, 0, 0.9) 40%, rgba(147, 51, 234, 0.3) 70%, rgba(0, 0, 0, 0.9) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientWave 8s ease infinite',
          zIndex: 0
        }}
      />
      <style jsx>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="relative" style={{ zIndex: 2 }}>
        <Header
          title="hypeTracker"
          subtitle="Today's NBA games sorted by hype rating"
          onButtonClick={() => {
            console.log('Button clicked, user:', user);
            router.push(user ? '/profile' : '/login');
          }}
          showProfile={!!user}
        />

        {/* Mobile Standings Toggle Button */}
        <div className="lg:hidden px-4 mb-4">
          <button
            onClick={() => setShowStandings(!showStandings)}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            {showStandings ? 'Hide Standings' : 'Show Standings'}
          </button>
        </div>

        {/* Mobile Standings Modal */}
        {showStandings && (
          <div className="lg:hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Standings</h2>
                <button
                  onClick={() => setShowStandings(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Standings east={east} west={west} />
              </div>
            </div>
          </div>
        )}

        <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 py-4 flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full lg:flex-1 space-y-4">
            {games.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                rank={index + 1}
                favoriteTeam={profile?.favorite_team}
                timezone={profile?.timezone}
              />
            ))}
          </div>

          {/* Desktop Standings */}
          <div className="hidden lg:block lg:w-[550px] sticky top-4 rounded-lg border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm overflow-hidden flex-shrink-0">
            <Standings east={east} west={west} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}