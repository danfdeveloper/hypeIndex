interface Team {
  wins: number;
  losses: number;
}

export const calculateHype = (homeTeam: Team, awayTeam: Team): number => {
  const homeWinPct = (homeTeam.wins + 5) / (homeTeam.wins + homeTeam.losses + 5) || 0;
  const awayWinPct = (awayTeam.wins + 5) / (awayTeam.wins + awayTeam.losses + 5) || 0;

  // Higher hype when both teams have better records
  const avgWinPct = (homeWinPct + awayWinPct) / 2;

  // Bonus for close matchups
  const competitivenessBonus = 1 - Math.abs(homeWinPct - awayWinPct);

  // Hype score out of 100 (curved)
  return Math.round(10 * Math.sqrt((avgWinPct * 70 + competitivenessBonus * 30)));
};