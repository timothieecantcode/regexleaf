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
      {error && <p>{error}</p>}

      {totalRows > 0 && (
        <p>
          Show first {rows} rows of {totalRows} rows, first {columns} columns of {totalColumns}{' '}
          columns
        </p>
      )}
    </div>
  )
}

export default StatusMessage
