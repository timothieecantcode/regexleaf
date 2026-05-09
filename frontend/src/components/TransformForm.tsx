interface TransformFormProps {
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
  replacement: string
  setReplacement: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => Promise<void>
}

function TransformForm({
  prompt,
  setPrompt,
  replacement,
  setReplacement,
  handleSubmit,
}: TransformFormProps) {
  return (
    <div>
      <label>Prompt</label>
      <input placeholder="Enter prompt" value={prompt} onChange={e => setPrompt(e.target.value)} />

      <label>Replacement value</label>
      <input
        placeholder="Enter replacement value"
        value={replacement}
        onChange={e => setReplacement(e.target.value)}
      />

      <button className="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  )
}

export default TransformForm
