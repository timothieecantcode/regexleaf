import type { TableRow } from '../types/data'

interface DataTableProps {
  table: TableRow[]
}

function DataTable({ table }: DataTableProps) {
  if (table.length === 0) return null

  return (
    <table border={1}>
      <tbody>
        {table.map((row, rIndex) => (
          <tr key={rIndex}>
            {Object.values(row).map((cell, cIndex) => (
              <td key={cIndex}>{String(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
