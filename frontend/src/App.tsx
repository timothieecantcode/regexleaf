import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

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

  const [file, setFile] = useState<File | null>(null)

  const [table, setTable] = useState([])

  const [prompt, setPrompt] = useState('')
  const [replacement, setReplacement] = useState('')

  const handleSubmit = async () => {
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
    const table = await response.json()
    setTable(table)
  }

  return (
    <>
      <h1>{response}</h1>
      <br />
      <input
        type="file"
        onChange={e => {
          if (!e.target.files) return
          setFile(e.target.files[0])
        }}
      />
      <label>Prompt</label>
      <input
        placeholder="Enter prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      ></input>
      <label>Replacement value</label>
      <input
        placeholder="Enter replacement value"
        value={replacement}
        onChange={e => setReplacement(e.target.value)}
      ></input>
      <button className="submit" onClick={handleSubmit}>
        Submit
      </button>
      {error && <p>{error}</p>}
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
    </>
  )
}

export default App
