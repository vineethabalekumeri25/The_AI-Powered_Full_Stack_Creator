"use client"

import { useState } from "react"

export default function Trends() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const trendsList = [
    {
      id: 1,
      title: "Minimalist Fashion",
      description: "Clean lines, neutral colors, and timeless pieces are dominating the fashion scene.",
      season: "Fall 2025",
      category: "aesthetic",
      icon: "✨",
    },
    {
      id: 2,
      title: "Vintage Revival",
      description: "90s and Y2K styles are making a strong comeback with modern twists.",
      season: "Fall 2025",
      category: "vintage",
      icon: "🕰️",
    },
    {
      id: 3,
      title: "Sustainable Fashion",
      description: "Eco-friendly materials and ethical production are becoming mainstream.",
      season: "Fall 2025",
      category: "sustainable",
      icon: "🌿",
    },
    {
      id: 4,
      title: "Bold Colors",
      description: "Vibrant jewel tones and unexpected color combinations are trending.",
      season: "Fall 2025",
      category: "colors",
      icon: "🎨",
    },
    {
      id: 5,
      title: "Oversized Silhouettes",
      description: "Comfortable, relaxed fits with exaggerated proportions are everywhere.",
      season: "Fall 2025",
      category: "silhouette",
      icon: "👕",
    },
    {
      id: 6,
      title: "Maxi Skirts & Dresses",
      description: "Long, flowing pieces perfect for creating elegant and sophisticated looks.",
      season: "Fall 2025",
      category: "silhouette",
      icon: "👗",
    },
  ]

  const categories = [
    { id: "all", label: "All Trends" },
    { id: "aesthetic", label: "Aesthetic" },
    { id: "vintage", label: "Vintage" },
    { id: "sustainable", label: "Sustainable" },
    { id: "colors", label: "Colors" },
    { id: "silhouette", label: "Silhouette" },
  ]

  const filteredTrends = trendsList.filter((trend) => {
    const matchesSearch =
      trend.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || trend.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 text-balance">Fashion Trends</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover the hottest fashion trends and style inspirations curated just for you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search trends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-700 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-amber-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-amber-200 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-4xl">{trend.icon}</span>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {trend.title}
                    </h2>
                    <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full inline-block mt-2">
                      {trend.season}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(trend.id)}
                  className="ml-4 p-2 hover:bg-rose-50 rounded-lg transition-colors text-2xl"
                  aria-label="Add to favorites"
                >
                  {favorites.includes(trend.id) ? "❤️" : "🤍"}
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">{trend.description}</p>
            </div>
          ))}
        </div>

        {filteredTrends.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No trends found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  )
}
