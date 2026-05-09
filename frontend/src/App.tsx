import { useState } from 'react'
import './App.css'

import FileUpload from './components/FileUpload'
import TransformForm from './components/TransformForm'
import StatusMessage from './components/StatusMessage'
import DataTable from './components/DataTable'
import { Download } from 'lucide-react'
import type { TableRow } from './types/data'

function App() {
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

  const handleSubmit = async () => {
    // Prevent empty submissions
    if (!prompt || !replacement || !file) return
    setError('')

    const formData = new FormData()

    formData.append('file', file)
    formData.append('prompt', prompt)
    formData.append('replacement', replacement)
    try {
      setLoading(true)
      const response = await fetch('http://127.0.0.1:8000/api/transform/', {
        method: 'POST',
        body: formData,
      })

      const hasError = await handleError(response)

      if (hasError) {
        return
      }

      const data = await response.json()
      setLoading(false)
      setTable(data.preview)
      setDownloadUrl(data.download_url)
      setRows(data.rows)
      setTotalRows(data.total_rows)
      setColumns(data.columns)
      setTotalColumns(data.total_columns)
    } finally {
      setLoading(false)
    }
  }

  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  return (
    <main className="min-h-screen bg-[#DAD7CD] text-[#3A5A40] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">AI-Powered Regex Transformer</h1>

        <p className="text-[#588157] mb-8">
          Upload and transform spreadsheet datasets using regex and AI.
        </p>

        <div className="bg-[#A3B18A] rounded-2xl p-6 shadow-lg mb-6">
          <FileUpload file={file} setFile={setFile} />
          <div className="mt-6">
            <TransformForm
              prompt={prompt}
              setPrompt={setPrompt}
              replacement={replacement}
              setReplacement={setReplacement}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>

        <div className="mb-6">
          <StatusMessage
            error={error}
            rows={rows}
            totalRows={totalRows}
            columns={columns}
            totalColumns={totalColumns}
          />
        </div>

        {table.length > 0 && (
          <div>
            <a
              href={downloadUrl}
              download
              className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#3A5A40] px-4 py-2 font-medium text-[#DAD7CD] hover:bg-[#588157] transition"
            >
              <Download size={18} />
              Download Result
            </a>
            <div className="bg-[#A3B18A] rounded-2xl p-6 shadow-lg overflow-auto">
              <DataTable table={table} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
