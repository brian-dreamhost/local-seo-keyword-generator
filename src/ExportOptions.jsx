import { useState } from 'react'
import { keywordsToCSV, multiLocationToCSV } from './keywordEngine'

export default function ExportOptions({ keywords, locationKeywords, batchMode }) {
  const [copiedAll, setCopiedAll] = useState(false)

  const getAllKeywordsText = () => {
    if (batchMode && locationKeywords) {
      const lines = []
      for (const [location, groups] of Object.entries(locationKeywords)) {
        lines.push(`=== ${location} ===`)
        for (const [, kws] of Object.entries(groups)) {
          lines.push(...kws)
        }
        lines.push('')
      }
      return lines.join('\n')
    }
    if (keywords) {
      return Object.values(keywords).flat().join('\n')
    }
    return ''
  }

  const copyAllKeywords = async () => {
    const text = getAllKeywordsText()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    }
  }

  const downloadCSV = () => {
    const csv = batchMode && locationKeywords
      ? multiLocationToCSV(locationKeywords)
      : keywordsToCSV(keywords)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'local-seo-keywords.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const totalCount = batchMode && locationKeywords
    ? Object.values(locationKeywords).reduce((total, group) => {
        return total + Object.values(group).reduce((sum, arr) => sum + arr.length, 0)
      }, 0)
    : keywords
      ? Object.values(keywords).reduce((sum, arr) => sum + arr.length, 0)
      : 0

  if (totalCount === 0) return null

  return (
    <div className="space-y-4">
      {/* Export buttons */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Export Keywords</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyAllKeywords}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-azure text-white
                       text-sm font-medium rounded-lg hover:bg-azure-hover transition-colors
                       focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                       min-h-[44px]"
          >
            {copiedAll ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Copied {totalCount} Keywords!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy All Keywords
              </>
            )}
          </button>

          <button
            onClick={downloadCSV}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-azure text-azure
                       text-sm font-medium rounded-lg hover:bg-azure/10 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                       min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {/* Google Keyword Planner CTA */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-tangerine shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <div>
            <p className="text-sm text-cloudy">
              <span className="font-semibold text-white">Want to check search volume?</span>{' '}
              Validate these keywords with{' '}
              <a
                href="https://ads.google.com/home/tools/keyword-planner/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-azure hover:text-white transition-colors underline"
              >
                Google Keyword Planner
              </a>{' '}
              (free with a Google Ads account) to find your highest-opportunity keywords.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
