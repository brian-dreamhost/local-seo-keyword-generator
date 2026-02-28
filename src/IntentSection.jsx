import { useState } from 'react'
import { getIntentInfo } from './keywordEngine'

const colorClasses = {
  turtle: {
    border: 'border-turtle',
    text: 'text-turtle',
    bg: 'bg-turtle/10',
    pill: 'border-turtle/40 text-turtle',
    badge: 'bg-turtle/15 text-turtle border-turtle/30',
  },
  azure: {
    border: 'border-azure',
    text: 'text-azure',
    bg: 'bg-azure/10',
    pill: 'border-azure/40 text-azure',
    badge: 'bg-azure/15 text-azure border-azure/30',
  },
  prince: {
    border: 'border-prince',
    text: 'text-prince',
    bg: 'bg-prince/10',
    pill: 'border-prince/40 text-prince',
    badge: 'bg-prince/15 text-prince border-prince/30',
  },
  tangerine: {
    border: 'border-tangerine',
    text: 'text-tangerine',
    bg: 'bg-tangerine/10',
    pill: 'border-tangerine/40 text-tangerine',
    badge: 'bg-tangerine/15 text-tangerine border-tangerine/30',
  },
}

export default function IntentSection({ intent, keywords, isExpanded, onToggle }) {
  const [copied, setCopied] = useState(false)
  const info = getIntentInfo(intent)
  const colors = colorClasses[info.color] || colorClasses.turtle

  const copyKeywords = async () => {
    try {
      await navigator.clipboard.writeText(keywords.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = keywords.join('\n')
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`card-gradient border ${colors.border}/20 rounded-2xl overflow-hidden transition-all duration-200`}>
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left
                   hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2
                   focus:ring-azure focus:ring-inset min-h-[44px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors.badge}`}>
            {info.label}
          </span>
          <span className="text-sm text-galactic hidden sm:inline">
            {info.description}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-sm font-semibold text-white">
            {keywords.length}
          </span>
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

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-fadeIn">
          {/* Description on mobile */}
          <p className="text-sm text-galactic mb-3 sm:hidden">{info.description}</p>

          {/* Content mapping */}
          <div className={`${colors.bg} rounded-lg px-4 py-3 mb-4`}>
            <p className="text-xs font-medium text-galactic mb-1">Use on:</p>
            <p className={`text-sm font-medium ${colors.text}`}>{info.placement}</p>
          </div>

          {/* Copy button for this category */}
          <div className="flex justify-end mb-3">
            <button
              onClick={copyKeywords}
              className="inline-flex items-center gap-1.5 text-xs text-azure hover:text-white transition-colors
                         focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss
                         rounded px-2 py-1 min-h-[44px] min-w-[44px] justify-center"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-turtle">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy {info.label}
                </>
              )}
            </button>
          </div>

          {/* Keyword pills */}
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className={`inline-block border ${colors.pill} rounded-full px-3 py-1.5 text-xs font-medium
                           hover:bg-white/5 transition-colors cursor-default`}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
