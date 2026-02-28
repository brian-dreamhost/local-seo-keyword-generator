import { emergencyIndustries } from './industryPresets'

/**
 * Generates all keyword variations for given services, locations, and industry.
 * Returns keywords grouped by search intent.
 */
export function generateKeywords({ services, city, state, zip, neighborhoods, nearbyCities, industryId }) {
  const isEmergencyIndustry = emergencyIndustries.includes(industryId)
  const allLocations = [
    { name: city, isPrimary: true },
    ...nearbyCities.map(c => ({ name: c.trim(), isPrimary: false })),
  ].filter(loc => loc.name.length > 0)

  const neighborhoodList = neighborhoods.filter(n => n.trim().length > 0).map(n => n.trim())

  const transactional = new Set()
  const commercial = new Set()
  const informational = new Set()
  const navigational = new Set()

  for (const service of services) {
    const s = service.trim()
    if (!s) continue

    // "near me" keywords (one set, not per city)
    transactional.add(`${s} near me`)

    for (const loc of allLocations) {
      const c = loc.name.trim()
      if (!c) continue

      // --- Transactional ---
      transactional.add(`${s} ${c}`)
      transactional.add(`${s} in ${c}`)
      transactional.add(`${s} ${c} ${state}`)
      transactional.add(`${s} near ${c}`)
      transactional.add(`${c} ${s}`)
      transactional.add(`hire ${s} ${c}`)

      // Emergency modifiers for relevant industries
      if (isEmergencyIndustry) {
        transactional.add(`emergency ${s} ${c}`)
        transactional.add(`24 hour ${s} ${c}`)
      }

      // --- Commercial Investigation ---
      commercial.add(`best ${s} ${c}`)
      commercial.add(`affordable ${s} ${c}`)
      commercial.add(`${s} reviews ${c}`)
      commercial.add(`${s} cost ${c}`)
      commercial.add(`${s} prices ${c}`)
      commercial.add(`top ${s} ${c}`)
      commercial.add(`${s} ratings ${c}`)
      commercial.add(`cheap ${s} ${c}`)

      // --- Informational ---
      informational.add(`how much does ${s} cost in ${c}`)
      informational.add(`do I need ${s} in ${c}`)
      informational.add(`when to call ${s} ${c}`)
      informational.add(`${s} tips ${c}`)
      informational.add(`how to find ${s} ${c}`)
      informational.add(`what does ${s} include`)

      // --- Navigational ---
      navigational.add(`${s} ${c} phone number`)
      navigational.add(`${s} ${c} address`)
      navigational.add(`${s} ${c} hours`)
      navigational.add(`${s} near ${c} open now`)
    }

    // ZIP-based keywords
    if (zip) {
      transactional.add(`${s} ${zip}`)
      navigational.add(`${s} ${zip}`)
      commercial.add(`best ${s} ${zip}`)
    }

    // Neighborhood keywords
    for (const hood of neighborhoodList) {
      transactional.add(`${s} ${hood}`)
      transactional.add(`${s} in ${hood}`)
      commercial.add(`best ${s} ${hood}`)
      commercial.add(`${s} near ${hood}`)
    }
  }

  return {
    transactional: [...transactional].sort(),
    commercial: [...commercial].sort(),
    informational: [...informational].sort(),
    navigational: [...navigational].sort(),
  }
}

/**
 * Generates keywords grouped by location for multi-location batch mode.
 */
export function generateKeywordsByLocation({ services, city, state, zip, neighborhoods, nearbyCities, industryId }) {
  const allCities = [city, ...nearbyCities.filter(c => c.trim().length > 0)]
  const results = {}

  for (const currentCity of allCities) {
    results[currentCity] = generateKeywords({
      services,
      city: currentCity,
      state,
      zip: currentCity === city ? zip : '',
      neighborhoods: currentCity === city ? neighborhoods : [],
      nearbyCities: [],
      industryId,
    })
  }

  return results
}

/**
 * Flatten all keyword groups into a single array with intent labels.
 */
export function flattenKeywords(keywordGroups) {
  const rows = []
  for (const [intent, keywords] of Object.entries(keywordGroups)) {
    for (const keyword of keywords) {
      rows.push({ keyword, intent, placement: getPlacement(intent) })
    }
  }
  return rows
}

/**
 * Get suggested content placement for an intent category.
 */
export function getPlacement(intent) {
  const placements = {
    transactional: 'Homepage title, GBP description, Service pages H1',
    commercial: 'Testimonials page, Review responses, Blog posts',
    informational: 'Blog posts, FAQ page, How-to guides',
    navigational: 'About page, Contact page, Footer',
  }
  return placements[intent] || ''
}

/**
 * Get intent display info (label, color, description).
 */
export function getIntentInfo(intent) {
  const info = {
    transactional: {
      label: 'Transactional',
      color: 'turtle',
      description: 'High purchase intent — the searcher is ready to hire or buy. These are your most valuable keywords.',
      placement: 'Homepage title, GBP description, Service pages H1',
    },
    commercial: {
      label: 'Commercial Investigation',
      color: 'azure',
      description: 'Comparison shopping — the searcher is evaluating options before deciding. Great for building trust.',
      placement: 'Testimonials page, Review responses, Blog posts',
    },
    informational: {
      label: 'Informational',
      color: 'prince',
      description: 'Research phase — the searcher wants to learn before taking action. Ideal for attracting early-stage leads.',
      placement: 'Blog posts, FAQ page, How-to guides',
    },
    navigational: {
      label: 'Navigational',
      color: 'tangerine',
      description: 'Looking for a specific business or location. These help people find and contact you directly.',
      placement: 'About page, Contact page, Footer',
    },
  }
  return info[intent] || { label: intent, color: 'galactic', description: '', placement: '' }
}

/**
 * Convert keywords to CSV string.
 */
export function keywordsToCSV(keywordGroups) {
  const header = 'Keyword,Search Intent,Suggested Placement'
  const rows = []
  for (const [intent, keywords] of Object.entries(keywordGroups)) {
    const info = getIntentInfo(intent)
    for (const keyword of keywords) {
      rows.push(`"${keyword.replace(/"/g, '""')}","${info.label}","${info.placement}"`)
    }
  }
  return [header, ...rows].join('\n')
}

/**
 * Convert multi-location keywords to CSV string.
 */
export function multiLocationToCSV(locationGroups) {
  const header = 'Location,Keyword,Search Intent,Suggested Placement'
  const rows = []
  for (const [location, keywordGroups] of Object.entries(locationGroups)) {
    for (const [intent, keywords] of Object.entries(keywordGroups)) {
      const info = getIntentInfo(intent)
      for (const keyword of keywords) {
        rows.push(`"${location}","${keyword.replace(/"/g, '""')}","${info.label}","${info.placement}"`)
      }
    }
  }
  return [header, ...rows].join('\n')
}
