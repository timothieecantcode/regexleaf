import type { TableRow } from '../types/data'

interface DataTableProps {
  table: TableRow[]
}

function DataTable({ table }: DataTableProps) {
  if (table.length === 0) return null

  const headers = Object.keys(table[0])

  return (
    <table className="w-full border-collapse overflow-hidden rounded-xl">
      <thead>
        <tr className="bg-[#588157] text-left text-[#DAD7CD]">
          {headers.map(header => (
            <th key={header} className="p-3 font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {table.map((row, rIndex) => (
          <tr key={rIndex} className="border-b border-[#A3B18A] hover:bg-[#DAD7CD]">
            {Object.values(row).map((cell, cIndex) => (
              <td key={cIndex} className="max-w-65 truncate p-3 text-[#3A5A40]">
                {String(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
