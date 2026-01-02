interface Team {
  wins: number;
  losses: number;
}

export const calculateHype = (homeTeam: Team, awayTeam: Team): number => {
  const homeWinPct = homeTeam.wins / (homeTeam.wins + homeTeam.losses) || 0;
  const awayWinPct = awayTeam.wins / (awayTeam.wins + awayTeam.losses) || 0;

  // Higher hype when both teams have better records
  const avgWinPct = (homeWinPct + awayWinPct) / 2;

  // Bonus for close matchups
  const competitivenessBonus = 1 - Math.abs(homeWinPct - awayWinPct);

  // Hype score out of 100 (curved)
  return Math.round(10 * Math.sqrt((avgWinPct * 70 + competitivenessBonus * 30)));
};