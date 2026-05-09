interface TransformFormProps {
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
  replacement: string
  setReplacement: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => Promise<void>
  loading: boolean
}

function TransformForm({
  prompt,
  setPrompt,
  replacement,
  setReplacement,
  handleSubmit,
  loading,
}: TransformFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Prompt</label>

        <input
          placeholder="e.g. Extract phone numbers"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full rounded-lg border border-[#588157] bg-[#DAD7CD] p-3 text-[#3A5A40]"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Replacement Value</label>

        <input
          placeholder="e.g. +61"
          value={replacement}
          onChange={e => setReplacement(e.target.value)}
          className="w-full rounded-lg border border-[#588157] bg-[#DAD7CD] p-3 text-[#3A5A40]"
        />
      </div>

      <button
        disabled={loading}
        className="rounded-lg bg-[#3A5A40] px-6 py-3 font-semibold text-[#DAD7CD] hover:bg-[#588157] transition"
        onClick={handleSubmit}
      >
        {loading ? 'Transforming Dataset...' : 'Transform Dataset'}
      </button>
    </div>
  )
}

export default TransformForm
