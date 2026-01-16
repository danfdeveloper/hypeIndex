// components/Standings.tsx
import { TeamRow } from "@/lib/standings"

type Props = {
    east: TeamRow[]
    west: TeamRow[]
}

export default function StandingsTable({ east, west }: Props) {
    const eastOrdered = [...east].reverse()
    const westOrdered = [...west].reverse()

    const rows = Math.max(eastOrdered.length, westOrdered.length)

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[300px] table-fixed">
                <thead>
                    <tr>
                        <th className="border border-zinc-700 px-2 w-1/2 text-sm sm:text-base">West</th>
                        <th className="border border-zinc-700 px-2 w-1/2 text-sm sm:text-base">East</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            <td className="border border-zinc-700 px-2">
                                {westOrdered[i] && (
                                    <>
                                        <span className="font-semibold">{i + 1}.</span> {westOrdered[i].name}
                                        <br />
                                        <span className="text-gray-400">({westOrdered[i].wins}-{westOrdered[i].losses})</span>
                                    </>
                                )}
                            </td>
                            <td className="border border-zinc-700 px-2">
                                {eastOrdered[i] && (
                                    <>
                                        <span className="font-semibold">{i + 1}.</span> {eastOrdered[i].name}
                                        <br />
                                        <span className="text-gray-400">({eastOrdered[i].wins}-{eastOrdered[i].losses})</span>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}