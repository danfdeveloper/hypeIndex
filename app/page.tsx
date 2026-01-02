'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Standings from '@/components/Standings';
import { calculateHype } from '@/lib/hypeCalculator';
import { fetchGamesFromAPI, type Game } from '@/lib/nbaApi';
import { getStandings } from "@/lib/standings"
import { useRouter } from 'next/navigation';


interface CachedData {
  games: Game[];
  date: string;
}

export default function HypeTracker() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [east, setEast] = useState<any[]>([]);
  const [west, setWest] = useState<any[]>([]);

  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const router = useRouter();
  const goToLogin = () => {
    router.push('/login')
  }


  useEffect(() => {
    const loadStandings = async () => {
      try {
        const res = await fetch(
          "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings"
        )
        const data = await res.json()

        const parse = (conf: any) =>
          conf.standings.entries.map((entry: any) => {
            const stat = (name: string) =>
              entry.stats.find((s: any) => s.name === name)?.value

            return {
              name: entry.team.displayName,
              wins: stat("wins"),
              losses: stat("losses"),
            }
          })

        const eastConf = data.children.find(
          (c: any) => c.name === "Eastern Conference"
        )
        const westConf = data.children.find(
          (c: any) => c.name === "Western Conference"
        )

        setEast(parse(eastConf))
        setWest(parse(westConf))
      } catch (err) {
        console.error("Failed to load standings", err)
      }
    }

    loadStandings()
  }, [])

  useEffect(() => {
    const loadGames = async () => {
      try {
        const today = getTodayDate();
        const cacheKey = 'nba-games-cache';

        // Try to get cached data from localStorage
        const cachedString = localStorage.getItem(cacheKey);
        let cachedData: CachedData | null = null;

        if (cachedString) {
          try {
            cachedData = JSON.parse(cachedString);
          } catch (err) {
            console.log('Invalid cache data');
          }
        }

        // Check if cache is from today
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

        // Cache is old or doesn't exist, fetch new data
        console.log('Fetching fresh data from API');
        const freshGames = await fetchGamesFromAPI(today);

        // Cache the fresh data in localStorage
        localStorage.setItem(cacheKey, JSON.stringify({
          games: freshGames,
          date: today
        }));

        // Calculate hype and sort
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (games.length === 0) return <EmptyState />;


  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Wavy Gradient Background */}
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
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Header title="hypeTracker" subtitle="Today's NBA games sorted by hype rating" onButtonClick={goToLogin} />

        <main className="max-w-full mx-auto px-20 py-4 flex justify-between gap-x-6  ">
          <div className="space-y-4">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} rank={index + 1} />
            ))}
          </div>
          <div className="h-[600px] rounded-lg border border-zinc-800">
            <Standings east={east} west={west} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
