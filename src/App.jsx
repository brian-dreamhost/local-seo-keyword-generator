import { useState, useCallback } from 'react'
import IndustrySelector from './IndustrySelector'
import ServiceInputs from './ServiceInputs'
import LocationInputs from './LocationInputs'
import KeywordResults from './KeywordResults'
import ExportOptions from './ExportOptions'
import { industryPresets } from './industryPresets'
import { generateKeywords, generateKeywordsByLocation } from './keywordEngine'

export default function App() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [services, setServices] = useState([])
  const [location, setLocation] = useState({
    city: '',
    state: '',
    zip: '',
    neighborhoods: '',
    nearbyCities: '',
  })
  const [batchMode, setBatchMode] = useState(false)
  const [keywords, setKeywords] = useState(null)
  const [locationKeywords, setLocationKeywords] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleIndustrySelect = useCallback((industryId) => {
    setSelectedIndustry(industryId)
    const preset = industryPresets.find((p) => p.id === industryId)
    if (preset && preset.services.length > 0) {
      setServices([...preset.services])
    }
    // Reset results when changing industry
    setKeywords(null)
    setLocationKeywords(null)
    setHasGenerated(false)
  }, [])

  const handleServicesUpdate = useCallback((newServices) => {
    setServices(newServices)
    // Reset results when changing services
    setKeywords(null)
    setLocationKeywords(null)
    setHasGenerated(false)
  }, [])

  const handleLocationUpdate = useCallback((newLocation) => {
    setLocation(newLocation)
    // Reset results when changing location
    setKeywords(null)
    setLocationKeywords(null)
    setHasGenerated(false)
  }, [])

  const fillTestData = () => {
    setSelectedIndustry('plumber')
    const preset = industryPresets.find((p) => p.id === 'plumber')
    if (preset) {
      setServices([...preset.services])
    }
    setLocation({
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      neighborhoods: 'Pearl District, Hawthorne, Alberta Arts District',
      nearbyCities: 'Beaverton, Lake Oswego, Tigard',
    })
    setBatchMode(false)
    setKeywords(null)
    setLocationKeywords(null)
    setHasGenerated(false)
  }

  const canGenerate = services.length > 0 && location.city.trim() && location.state

  const handleGenerate = () => {
    if (!canGenerate) return

    const params = {
      services,
      city: location.city.trim(),
      state: location.state,
      zip: location.zip.trim(),
      neighborhoods: location.neighborhoods.split(',').map(n => n.trim()).filter(Boolean),
      nearbyCities: location.nearbyCities.split(',').map(c => c.trim()).filter(Boolean),
      industryId: selectedIndustry,
    }

    if (batchMode && params.nearbyCities.length > 0) {
      const locResults = generateKeywordsByLocation(params)
      setLocationKeywords(locResults)
      setKeywords(null)
    } else {
      const results = generateKeywords(params)
      setKeywords(results)
      setLocationKeywords(null)
    }
    setHasGenerated(true)
  }

  const handleReset = () => {
    setSelectedIndustry('')
    setServices([])
    setLocation({ city: '', state: '', zip: '', neighborhoods: '', nearbyCities: '' })
    setBatchMode(false)
    setKeywords(null)
    setLocationKeywords(null)
    setHasGenerated(false)
  }

  return (
    <div className="bg-abyss min-h-screen bg-glow bg-grid">
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/local-business/" className="text-azure hover:text-white transition-colors">Local Business Tools</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">Local SEO Keyword Generator</span>
        </nav>

        {/* Header */}
        <header className="mb-10 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Local SEO Keyword Generator
          </h1>
          <p className="text-cloudy text-base sm:text-lg max-w-2xl">
            Generate location-based keyword variations for your local business. Get categorized
            keywords grouped by search intent with content placement guidance.
          </p>
        </header>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Input form card */}
          <div className="card-gradient border border-metal/20 rounded-2xl p-5 sm:p-6 animate-fadeIn">
            <div className="space-y-6">
              {/* Industry selector */}
              <IndustrySelector
                selectedIndustry={selectedIndustry}
                onSelect={handleIndustrySelect}
              />

              {/* Services */}
              <ServiceInputs
                services={services}
                onUpdate={handleServicesUpdate}
              />

              {/* Divider */}
              <div className="border-t border-metal/20" />

              {/* Location inputs */}
              <LocationInputs
                location={location}
                onUpdate={handleLocationUpdate}
              />

              {/* Batch mode toggle */}
              {location.nearbyCities.trim() && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setBatchMode(!batchMode)
                      setKeywords(null)
                      setLocationKeywords(null)
                      setHasGenerated(false)
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2
                               border-transparent transition-colors duration-200 ease-in-out
                               focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                               ${batchMode ? 'bg-azure' : 'bg-metal/50'}`}
                    role="switch"
                    aria-checked={batchMode}
                    aria-label="Generate for multiple locations"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white
                                 shadow ring-0 transition duration-200 ease-in-out
                                 ${batchMode ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <span
                    className="text-sm text-cloudy cursor-pointer"
                    onClick={() => {
                      setBatchMode(!batchMode)
                      setKeywords(null)
                      setLocationKeywords(null)
                      setHasGenerated(false)
                    }}
                    role="none"
                  >
                    Generate for multiple locations
                    <span className="text-galactic ml-1">(show each city as a separate section)</span>
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-azure text-white
                             text-base font-semibold rounded-lg hover:bg-azure-hover transition-colors
                             disabled:opacity-40 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                             min-h-[44px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  Generate Keywords
                </button>

                {hasGenerated && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-metal/30
                               text-cloudy text-sm font-medium rounded-lg hover:border-metal/50 hover:text-white
                               transition-colors focus:outline-none focus:ring-2 focus:ring-azure
                               focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Start Over
                  </button>
                )}
              </div>

              {/* Validation message */}
              {!canGenerate && services.length === 0 && !selectedIndustry && (
                <p className="text-xs text-galactic">
                  Select an industry and enter your location to get started.
                </p>
              )}
              {!canGenerate && services.length > 0 && (!location.city.trim() || !location.state) && (
                <p className="text-xs text-tangerine">
                  Please enter your city and state to generate keywords.
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          {hasGenerated && (
            <div className="space-y-6">
              <KeywordResults
                keywords={keywords}
                locationKeywords={locationKeywords}
                batchMode={batchMode}
              />
              <ExportOptions
                keywords={keywords}
                locationKeywords={locationKeywords}
                batchMode={batchMode}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 text-center">
          <p className="text-sm text-galactic">
            Built by{' '}
            <a href="https://www.dreamhost.com" target="_blank" rel="noopener noreferrer" className="text-azure hover:text-white transition-colors">
              DreamHost
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
