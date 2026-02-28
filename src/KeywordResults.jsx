import { useState } from 'react'
import IntentSection from './IntentSection'

const INTENT_ORDER = ['transactional', 'commercial', 'informational', 'navigational']

export default function KeywordResults({ keywords, locationKeywords, batchMode }) {
  const [expandedIntents, setExpandedIntents] = useState({ transactional: true })
  const [expandedLocations, setExpandedLocations] = useState({})

  const toggleIntent = (intent) => {
    setExpandedIntents(prev => ({ ...prev, [intent]: !prev[intent] }))
  }

  const toggleLocation = (location) => {
    setExpandedLocations(prev => ({ ...prev, [location]: !prev[location] }))
  }

  // Calculate total keyword count
  const totalCount = batchMode && locationKeywords
    ? Object.values(locationKeywords).reduce((total, group) => {
        return total + Object.values(group).reduce((sum, arr) => sum + arr.length, 0)
      }, 0)
    : keywords
      ? Object.values(keywords).reduce((sum, arr) => sum + arr.length, 0)
      : 0

  if (totalCount === 0) return null

  // Single location mode
  if (!batchMode || !locationKeywords) {
    return (
      <div className="animate-fadeIn">
        {/* Keyword count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Generated Keywords</h2>
            <p className="text-sm text-galactic mt-1">Grouped by search intent with content placement guidance</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{totalCount}</p>
            <p className="text-xs text-galactic">keywords</p>
          </div>
        </div>

        {/* Intent sections */}
        <div className="space-y-3">
          {INTENT_ORDER.map((intent) => (
            keywords[intent] && keywords[intent].length > 0 && (
              <IntentSection
                key={intent}
                intent={intent}
                keywords={keywords[intent]}
                isExpanded={!!expandedIntents[intent]}
                onToggle={() => toggleIntent(intent)}
              />
            )
          ))}
        </div>
      </div>
    )
  }

  // Multi-location batch mode
  const locations = Object.keys(locationKeywords)

  return (
    <div className="animate-fadeIn">
      {/* Keyword count */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Generated Keywords</h2>
          <p className="text-sm text-galactic mt-1">
            {locations.length} locations with intent-grouped keywords
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{totalCount}</p>
          <p className="text-xs text-galactic">total keywords</p>
        </div>
      </div>

      {/* Location sections */}
      <div className="space-y-4">
        {locations.map((location) => {
          const locKeywords = locationKeywords[location]
          const locCount = Object.values(locKeywords).reduce((sum, arr) => sum + arr.length, 0)
          const isExpanded = expandedLocations[location] ?? (location === locations[0])

          return (
            <div key={location} className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
              {/* Location header */}
              <button
                onClick={() => toggleLocation(location)}
                className="w-full flex items-center justify-between px-5 py-4 text-left
                           hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2
                           focus:ring-azure focus:ring-inset min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  <span className="text-lg font-semibold text-white">{location}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-cloudy">{locCount} keywords</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-5 h-5 text-galactic transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-3 animate-fadeIn">
                  {INTENT_ORDER.map((intent) => (
                    locKeywords[intent] && locKeywords[intent].length > 0 && (
                      <IntentSection
                        key={`${location}-${intent}`}
                        intent={intent}
                        keywords={locKeywords[intent]}
                        isExpanded={!!expandedIntents[`${location}-${intent}`]}
                        onToggle={() => setExpandedIntents(prev => ({
                          ...prev,
                          [`${location}-${intent}`]: !prev[`${location}-${intent}`]
                        }))}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
