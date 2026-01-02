// lib/espn.ts
export type TeamRow = {
    name: string
    wins: number
    losses: number
}

const ENDPOINT =
    "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings"

function parseConference(conf: any): TeamRow[] {
    return conf.standings.entries.map((entry: any) => {
        const stat = (name: string) =>
            entry.stats.find((s: any) => s.name === name)?.value

        return {
            name: entry.team.displayName,
            wins: stat("wins"),
            losses: stat("losses"),
            rank: stat("rank"),
        }
    })
        .sort((a: any, b: any) => b.rank - a.rank)
}

export async function getStandings() {
    const res = await fetch(ENDPOINT, {
        // ESPN data can be cached safely
        next: { revalidate: 300 },
    })

    if (!res.ok) throw new Error("Failed to fetch standings")

    const data = await res.json()

    const eastConf = data.children.find(
        (c: any) => c.name === "Eastern Conference"
    )
    const westConf = data.children.find(
        (c: any) => c.name === "Western Conference"
    )

    return {
        east: parseConference(eastConf),
        west: parseConference(westConf),
    }
}
