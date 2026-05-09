interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

function FileUpload({ setFile }: FileUploadProps) {
  return (
    <div>
      <label>Upload File</label>
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={e => {
          if (!e.target.files) return
          setFile(e.target.files[0])
        }}
      />
    </div>
  )
}

export default FileUpload
