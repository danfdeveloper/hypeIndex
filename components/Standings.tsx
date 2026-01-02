// components/StandingsTable.tsx
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
        <table className="w-[550px] table-fixed">
            <thead>
                <tr>
                    <th className="border px-2 w=1/2">West</th>
                    <th className="border px-2 w=1/2">East</th>
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i}>
                        <td className="border px-2">
                            {westOrdered[i] && (
                                <>
                                    {i + 1}. {westOrdered[i].name} <br /> ({westOrdered[i].wins}-{westOrdered[i].losses})
                                </>
                            )}
                        </td>
                        <td className="border px-2">
                            {eastOrdered[i] && (
                                <>
                                    {i + 1}. {eastOrdered[i].name} <br /> ({eastOrdered[i].wins}-{eastOrdered[i].losses})
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
