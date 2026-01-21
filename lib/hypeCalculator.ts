interface Team {
  wins: number;
  losses: number;
}

export const calculateHype = (
  homeTeam: Team,
  awayTeam: Team,
  homeStreak?: string | null,
  awayStreak?: string | null
): number => {
  const homeWinPct = (homeTeam.wins + 5) / (homeTeam.wins + homeTeam.losses + 5) || 0;
  const awayWinPct = (awayTeam.wins + 5) / (awayTeam.wins + awayTeam.losses + 5) || 0;

  // Higher hype when both teams have better records
  const avgWinPct = (homeWinPct + awayWinPct) / 2;

  // Bonus for close matchups
  const competitivenessBonus = 1 - Math.abs(homeWinPct - awayWinPct);

  // Streak bonus calculation
  const getStreakBonus = (streak?: string | null) => {
    if (!streak) return 0;

    const isWin = streak.startsWith('W');
    const streakLength = parseInt(streak.substring(1)) || 0;

    if (isWin) {
      // Hot teams on win streaks add excitement
      if (streakLength >= 5) return 5; // Long win streak
      if (streakLength >= 3) return 3; // Medium win streak
      if (streakLength >= 1) return 1; // Recent win
    } else {
      // Teams on losing streaks looking to bounce back
      if (streakLength >= 5) return 2; // Desperate to end long skid
      if (streakLength >= 3) return 1; // Looking to turn it around
    }

    return 0;
  };

  const homeStreakBonus = getStreakBonus(homeStreak);
  const awayStreakBonus = getStreakBonus(awayStreak);
  const totalStreakBonus = (homeStreakBonus + awayStreakBonus) / 2;

  // Extra hype if both teams are hot (both on win streaks)
  const bothHotBonus =
    homeStreak?.startsWith('W') && awayStreak?.startsWith('W') &&
      parseInt(homeStreak.substring(1)) >= 3 && parseInt(awayStreak.substring(1)) >= 3 ? 5 : 0;

  // Base hype score 
  const baseHype = avgWinPct * 100 + competitivenessBonus * 10;

  // Add streak bonuses (0-15 possible)
  const finalHype = baseHype + totalStreakBonus + bothHotBonus;

  // Apply curve and cap at 100
  return Math.min(100, Math.round(10 * Math.sqrt(finalHype)));
};