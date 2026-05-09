interface StatusMessageProps {
  error: string
  rows: number
  totalRows: number
  columns: number
  totalColumns: number
}

function StatusMessage({ error, rows, totalRows, columns, totalColumns }: StatusMessageProps) {
  return (
    <div>
      {error && (
        <div className="rounded-lg bg-red-100 border border-red-400 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {totalRows > 0 && (
        <div className="rounded-lg  p-4 text-[#3A5A40]">
          Showing first {rows} rows of {totalRows} rows and first {columns} columns of{' '}
          {totalColumns} columns.
        </div>
      )}
    </div>
  )
}

export default StatusMessage
