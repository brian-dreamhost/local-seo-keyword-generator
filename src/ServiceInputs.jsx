import { useState } from 'react'

export default function ServiceInputs({ services, onUpdate }) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addService()
    }
  }

  const addService = () => {
    const trimmed = inputValue.trim().replace(/,+$/, '').trim()
    if (trimmed && !services.includes(trimmed)) {
      onUpdate([...services, trimmed])
      setInputValue('')
    }
  }

  const removeService = (index) => {
    onUpdate(services.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-cloudy mb-2">
        Services / Keywords
        <span className="text-galactic font-normal ml-1">(press Enter or comma to add)</span>
      </label>

      {/* Service chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {services.map((service, index) => (
          <span
            key={`${service}-${index}`}
            className="inline-flex items-center gap-1.5 bg-midnight border border-metal/30 rounded-full
                       px-3 py-1.5 text-sm text-cloudy group hover:border-azure/40 transition-colors"
          >
            {service}
            <button
              onClick={() => removeService(index)}
              className="text-galactic hover:text-coral transition-colors p-1.5 -mr-1 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-1 focus:ring-offset-midnight"
              aria-label={`Remove ${service}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a service and press Enter..."
          className="flex-1 bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                     placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure
                     focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
        />
        <button
          onClick={addService}
          disabled={!inputValue.trim()}
          className="px-4 py-3 bg-azure text-white text-sm font-medium rounded-lg
                     hover:bg-azure-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                     min-h-[44px] min-w-[44px]"
        >
          Add
        </button>
      </div>

      {services.length === 0 && (
        <p className="mt-2 text-xs text-galactic">
          Select an industry above to auto-load services, or type your own.
        </p>
      )}
    </div>
  )
}
