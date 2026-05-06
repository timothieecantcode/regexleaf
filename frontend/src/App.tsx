import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [response, setResponse] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/test/')
      const data = await response.json()
      setResponse(data.message)
    }
    fetchData()
  }, [])

  const [file, setFile] = useState<File | null>(null)

  const [table, setTable] = useState([])
  const handleSubmit = async () => {
    const formData = new FormData()
    if (!file) return
    formData.append('file', file)
    const response = await fetch('http://127.0.0.1:8000/api/upload/', {
      method: 'POST',
      body: formData,
    })
    const table = await response.json()
    console.log(table)
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
      <button className="submit" onClick={handleSubmit}>
        Upload
      </button>
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
