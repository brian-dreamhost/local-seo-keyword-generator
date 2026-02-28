import { industryPresets } from './industryPresets'

export default function IndustrySelector({ selectedIndustry, onSelect }) {
  return (
    <div>
      <label htmlFor="industry-select" className="block text-sm font-medium text-cloudy mb-2">
        Industry
      </label>
      <select
        id="industry-select"
        value={selectedIndustry}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                   focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                   transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23677983' stroke-width='1.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
      >
        <option value="">Select your industry...</option>
        {industryPresets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  )
}
