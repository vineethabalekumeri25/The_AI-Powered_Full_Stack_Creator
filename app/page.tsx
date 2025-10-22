"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-100 rounded-full">
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium text-amber-900">Your Fashion Companion</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 text-balance leading-tight">
            Discover Your Style
          </h1>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Track fashion trends, document your personal style journey, and express your unique fashion sense with our
            elegant style journal.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/trends" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl">
                📈
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Fashion Trends</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Stay updated with the latest fashion trends and style inspirations from around the world.
              </p>
              <span className="inline-flex items-center text-amber-700 font-medium group-hover:gap-2 transition-all">
                Explore Trends →
              </span>
            </div>
          </Link>

          <Link href="/journal" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl">
                📖
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">My Journal</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Document your personal style journey and keep track of your fashion choices and inspirations.
              </p>
              <span className="inline-flex items-center text-rose-700 font-medium group-hover:gap-2 transition-all">
                View Journal →
              </span>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-700 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-2xl">❤️</div>
              <h2 className="text-2xl font-semibold text-white mb-3">Favorites</h2>
              <p className="text-slate-300 leading-relaxed">
                Save your favorite trends and journal entries for quick access and inspiration.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-3xl font-bold text-amber-700 mb-2">12+</div>
            <p className="text-slate-600 text-sm">Trending Styles</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-3xl font-bold text-rose-700 mb-2">25+</div>
            <p className="text-slate-600 text-sm">Journal Entries</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="text-3xl font-bold text-slate-700 mb-2">100%</div>
            <p className="text-slate-600 text-sm">Your Style</p>
          </div>
        </div>
      </div>
    </main>
  )
}
