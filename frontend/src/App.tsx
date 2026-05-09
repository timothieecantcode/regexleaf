import { useEffect, useState } from 'react'
import './App.css'

import FileUpload from './components/FileUpload'
import TransformForm from './components/TransformForm'
import StatusMessage from './components/StatusMessage'
import DataTable from './components/DataTable'

import type { TableRow } from './types/data'

function App() {
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const [file, setFile] = useState<File | null>(null)

  const [table, setTable] = useState<TableRow[]>([])

  const [rows, setRows] = useState(0)
  const [totalRows, setTotalRows] = useState(0)

  const [columns, setColumns] = useState(0)
  const [totalColumns, setTotalColumns] = useState(0)

  const [prompt, setPrompt] = useState('')
  const [replacement, setReplacement] = useState('')

  const handleError = async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      setError(data.error)
      return true
    }

    return false
  }

  useEffect(() => {
    const fetchData = async () => {
      setError('')

      const response = await fetch('http://127.0.0.1:8000/api/test/')

      const hasError = await handleError(response)

      if (hasError) return

      const data = await response.json()

      setResponse(data.message)
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    // Prevent empty submissions
    if (!prompt || !replacement || !file) return

    setError('')

    const formData = new FormData()

    formData.append('file', file)
    formData.append('prompt', prompt)
    formData.append('replacement', replacement)

    const response = await fetch('http://127.0.0.1:8000/api/transform/', {
      method: 'POST',
      body: formData,
    })

    const hasError = await handleError(response)

    if (hasError) return

    const data = await response.json()

    setTable(data.preview)
    setRows(data.rows)
    setTotalRows(data.total_rows)
    setColumns(data.columns)
    setTotalColumns(data.total_columns)
  }

  return (
    <>
      <h1>{response}</h1>

      <FileUpload setFile={setFile} />

      <TransformForm
        prompt={prompt}
        setPrompt={setPrompt}
        replacement={replacement}
        setReplacement={setReplacement}
        handleSubmit={handleSubmit}
      />

      <StatusMessage
        error={error}
        rows={rows}
        totalRows={totalRows}
        columns={columns}
        totalColumns={totalColumns}
      />

      <DataTable table={table} />
    </>
  )
}

export default App
