'use client'

import { useState } from 'react'

interface NameResult {
  name: string
  domain: string
  domainAvailable: string
  rationale: string
  vibeScore: number
}

export default function Home() {
  const [description, setDescription] = useState('')
  const [results, setResults] = useState<NameResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResults(data.names)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const vibeColor = (score: number) => {
    if (score >= 9) return 'text-emerald-400'
    if (score >= 7) return 'text-cyan-400'
    if (score >= 5) return 'text-amber-400'
    return 'text-red-400'
  }

  const vibeEmoji = (score: number) => {
    if (score >= 9) return '🔥'
    if (score >= 7) return '✨'
    if (score >= 5) return '👍'
    return '😐'
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          ⚒️ NameForge
        </h1>
        <p className="text-gray-400 text-lg">
          AI-powered business & project name generator
        </p>
        <p className="text-gray-500 text-sm mt-1">Day 002 · Built with Gemini 1.5 Flash</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <label className="block text-sm text-gray-400 mb-2">
          Describe what your business or project does (1-2 sentences)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. An app that helps remote teams run async standups with AI summaries"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
          maxLength={300}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-600">{description.length}/300</span>
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Forging...
              </span>
            ) : 'Forge Names ⚒️'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-8 text-red-300">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">
            🎯 {results.length} Names Forged
          </h2>
          {results.map((r, i) => (
            <div
              key={i}
              className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{r.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">
                    {r.domain}{' '}
                    <span className={r.domainAvailable === 'Likely Available' ? 'text-emerald-500' : r.domainAvailable === 'Likely Taken' ? 'text-red-400' : 'text-amber-400'}>
                      · {r.domainAvailable}
                    </span>
                  </p>
                </div>
                <div className={`text-2xl font-bold ${vibeColor(r.vibeScore)} flex items-center gap-1`}>
                  {vibeEmoji(r.vibeScore)} {r.vibeScore}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{r.rationale}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-16 text-center text-gray-600 text-xs">
        Built with Next.js, Tailwind CSS & Gemini 1.5 Flash ·{' '}
        <a href="https://github.com/luke-skywalker-open-claw/nameforge" className="hover:text-gray-400 underline">
          Source
        </a>
      </footer>
    </main>
  )
}
