import React, { useState } from 'react'

interface FileUploadProps {
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

function FileUpload({ file, setFile }: FileUploadProps) {
  const [drag, setDrag] = useState(false)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDrag(true)
  }

  const handleDragLeave = () => {
    setDrag(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDrag(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed p-10 text-center transition
    ${drag ? 'border-[#3A5A40] bg-[#A3B18A]' : 'border-[#588157] bg-[#DAD7CD]'}`}
    >
      <p className="mb-4 text-lg font-semibold text-[#3A5A40]">Drag & Drop CSV/XLSX File Here</p>

      <p className="mb-6 text-[#588157]">or choose file manually</p>

      <label className="cursor-pointer rounded-lg bg-[#3A5A40] px-5 py-3 text-[#DAD7CD] font-medium hover:bg-[#588157] transition">
        Choose File
        <input
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={e => {
            if (!e.target.files) return
            setFile(e.target.files[0])
          }}
        />
      </label>

      <p className="mt-5 text-sm text-[#588157]">{file ? file.name : 'No file selected'}</p>
    </div>
  )
}

export default FileUpload
