"use client"

import { useState, useEffect } from "react"
import { fetchTrends, checkBackendHealth, type Trend } from "../../lib/api-client"
import Image from "next/image"

export default function Trends() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if backend is running
        const isHealthy = await checkBackendHealth()
        setIsBackendConnected(isHealthy)
        
        if (!isHealthy) {
          setError("FastAPI backend is not running. Start with: uvicorn scripts.api:app --reload")
          return
        }
        
        // Fetch trends from backend
        const backendTrends = await fetchTrends()
        setTrends(backendTrends)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trends")
        console.error("Error loading trends:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTrends()
  }, [])

  const fallbackTrends: Trend[] = [
    {
      id: 1,
      name: "Minimalist Fashion",
      description: "Clean lines, neutral colors, and timeless pieces are dominating the fashion scene.",
      season: "Fall 2025",
      popularity: "High",
    },
    {
      id: 2,
      name: "Vintage Revival",
      description: "90s and Y2K styles are making a strong comeback with modern twists.",
      season: "Fall 2025",
      popularity: "High",
    },
    {
      id: 3,
      name: "Sustainable Fashion",
      description: "Eco-friendly materials and ethical production are becoming mainstream.",
      season: "Fall 2025",
      popularity: "Growing",
    },
  ]

  const displayTrends = trends.length > 0 ? trends : fallbackTrends

  const filteredTrends = displayTrends.filter((trend) => {
    const matchesSearch =
      trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              src="/fashion-runway-trends-colorful-minimalist.jpg"
              alt="Fashion trends banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance">Fashion Trends</h1>
                <p className="text-lg text-white/90 leading-relaxed max-w-xl">
                  Discover the hottest fashion trends powered by FastAPI backend
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isBackendConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-slate-700">
                {isBackendConnected ? 'Live data from FastAPI' : 'Using fallback data'}
              </span>
            </div>
            <div className="text-sm text-slate-500">
              {displayTrends.length} trends available
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-900 mb-1">Backend Connection Issue</p>
                <p className="text-amber-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search fashion trends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-200 border-t-amber-700 mb-3"></div>
            <p className="text-slate-600 font-medium">Fetching trends from backend...</p>
          </div>
        ) : (
          <>
            {/* Trends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTrends.map((trend, index) => (
                <div
                  key={trend.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-300 group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={`/fashion-trend-.jpg?key=ek2hp&height=300&width=500&query=fashion trend ${trend.name.toLowerCase()}`}
                      alt={trend.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <button
                      onClick={() => toggleFavorite(trend.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all text-xl shadow-lg"
                      aria-label="Add to favorites"
                    >
                      {favorites.includes(trend.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-2">
                      {trend.name}
                    </h2>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                        {trend.season}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                        {trend.popularity}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{trend.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredTrends.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-slate-500 text-lg font-medium">No trends found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
