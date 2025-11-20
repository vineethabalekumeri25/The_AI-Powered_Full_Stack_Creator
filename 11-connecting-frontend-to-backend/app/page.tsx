"use client"

import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-rose-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-100 rounded-full">
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium text-amber-900">Your Fashion Companion</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance leading-tight">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">Unique Style</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Track fashion trends, document your personal style journey, and express your unique fashion sense with our
            elegant AI-powered style journal.
          </p>
          
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/elegant-fashion-magazine-spread-minimalist-style.jpg"
              alt="Fashion trends hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/trends" className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-300 h-full">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="/fashion-trends-runway-minimalist.jpg"
                  alt="Fashion trends"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-3xl">📈</div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Fashion Trends</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Stay updated with the latest fashion trends from FastAPI backend with live data integration.
                </p>
                <span className="inline-flex items-center text-amber-700 font-medium text-sm group-hover:gap-2 transition-all">
                  Explore Trends <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </Link>

          <Link href="/journal" className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-rose-300 h-full">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src="/elegant-journal-notebook-fashion-sketches.jpg"
                  alt="Style journal"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-3xl">📖</div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">My Journal</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Document your personal style journey with AI-powered prompts from Ollama integration.
                </p>
                <span className="inline-flex items-center text-rose-700 font-medium text-sm group-hover:gap-2 transition-all">
                  View Journal <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full group">
            <div className="relative h-40 overflow-hidden">
              <Image
                src="/ai-artificial-intelligence-fashion-technology.jpg"
                alt="AI features"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 text-3xl">✨</div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">AI Powered</h2>
              <p className="text-white/90 text-sm leading-relaxed">
                Generate creative journal prompts with local Ollama LLM and get personalized fashion recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-12">
          <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
              FastAPI
            </div>
            <p className="text-slate-600 text-sm font-medium">Backend Integration</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-rose-200 shadow-sm">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">
              Ollama
            </div>
            <p className="text-slate-600 text-sm font-medium">Local LLM AI</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
              Next.js
            </div>
            <p className="text-slate-600 text-sm font-medium">Modern Frontend</p>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-3">Step 11: Frontend-Backend Connection</h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            This app demonstrates connecting a Next.js frontend to a FastAPI backend using <code className="bg-white/10 px-2 py-1 rounded">fetch</code> API, 
            <code className="bg-white/10 px-2 py-1 rounded mx-1">useEffect</code> hooks for GET requests, and form submissions for POST requests.
          </p>
        </div>
      </div>
    </main>
  )
}
