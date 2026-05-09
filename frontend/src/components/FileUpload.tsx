interface FileUploadProps {
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

function FileUpload({ file, setFile }: FileUploadProps) {
  return (
    <div>
      <label className="block text-lg font-semibold mb-3">Upload Spreadsheet</label>

      <label className="inline-block cursor-pointer rounded-lg bg-[#3A5A40] px-5 py-3 text-[#DAD7CD] font-medium hover:bg-[#588157] transition">
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

      <p className="mt-3 text-sm text-[#588157]">{file ? file.name : 'No file selected'}</p>
    </div>
  )
}

export default FileUpload
