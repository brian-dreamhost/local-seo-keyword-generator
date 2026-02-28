import { US_STATES } from './industryPresets'

export default function LocationInputs({ location, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate({ ...location, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-cloudy mb-2">
            City / Town <span className="text-coral">*</span>
          </label>
          <input
            id="city"
            type="text"
            value={location.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. Austin"
            className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                       placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure
                       focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-cloudy mb-2">
            State <span className="text-coral">*</span>
          </label>
          <select
            id="state"
            value={location.state}
            onChange={(e) => handleChange('state', e.target.value)}
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
            <option value="">Select state...</option>
            {US_STATES.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name} ({s.abbr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ZIP Code */}
      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-cloudy mb-2">
          ZIP Code <span className="text-galactic font-normal">(optional)</span>
        </label>
        <input
          id="zip"
          type="text"
          value={location.zip}
          onChange={(e) => handleChange('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder="e.g. 78701"
          maxLength={5}
          className="w-full sm:w-48 bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                     placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure
                     focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
        />
      </div>

      {/* Neighborhoods */}
      <div>
        <label htmlFor="neighborhoods" className="block text-sm font-medium text-cloudy mb-2">
          Neighborhoods <span className="text-galactic font-normal">(optional, comma-separated)</span>
        </label>
        <input
          id="neighborhoods"
          type="text"
          value={location.neighborhoods}
          onChange={(e) => handleChange('neighborhoods', e.target.value)}
          placeholder="e.g. East Austin, South Congress, Downtown"
          className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                     placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure
                     focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
        />
      </div>

      {/* Nearby Cities */}
      <div>
        <label htmlFor="nearby" className="block text-sm font-medium text-cloudy mb-2">
          Nearby Cities <span className="text-galactic font-normal">(optional, comma-separated)</span>
        </label>
        <input
          id="nearby"
          type="text"
          value={location.nearbyCities}
          onChange={(e) => handleChange('nearbyCities', e.target.value)}
          placeholder="e.g. Round Rock, Cedar Park, Georgetown"
          className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white text-sm
                     placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure
                     focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
        />
      </div>
    </div>
  )
}
