"use client"

import { generateJournalPrompt } from "../../lib/api-client"
import { useState } from "react"
import Image from "next/image"

export default function Journal() {
  const [promptTheme, setPromptTheme] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking")

  const handleGeneratePrompt = async () => {
    if (!promptTheme.trim()) return
    
    try {
      setIsGenerating(true)
      setPromptError(null)
      setBackendStatus("checking")
      
      const result = await generateJournalPrompt(promptTheme)
      setGeneratedPrompt(result.prompt)
      setBackendStatus("online")
    } catch (error) {
      setPromptError(
        "Failed to generate prompt. Make sure FastAPI backend (port 8000) and Ollama are running."
      )
      setBackendStatus("offline")
      console.error("Error generating prompt:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-white">
      {/* Hero Section */}
      <div className="relative h-48 mb-12 overflow-hidden">
        <Image
          src="/elegant-journal-notebook-fashion-sketches.jpg"
          alt="Fashion Journal"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 text-balance">Style Journal</h1>
            <p className="text-lg text-purple-100">AI-Powered Writing Prompts</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Backend Status */}
        <div className="mb-8 flex justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            backendStatus === "online" 
              ? "bg-green-100 text-green-800" 
              : backendStatus === "offline"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              backendStatus === "online" 
                ? "bg-green-500" 
                : backendStatus === "offline"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`} />
            {backendStatus === "online" && "FastAPI Connected"}
            {backendStatus === "offline" && "FastAPI Offline"}
            {backendStatus === "checking" && "Ready to Connect..."}
          </div>
        </div>

        {/* AI Prompt Generator */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-200 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">AI Prompt Generator</h2>
              <p className="text-sm text-slate-600">Generate creative journal prompts using Ollama</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter a theme for your journal prompt:
              </label>
              <input
                type="text"
                placeholder="e.g., 'Inspired by BLACKPINK', 'Minimalist fashion', 'Spring trends'"
                value={promptTheme}
                onChange={(e) => setPromptTheme(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={isGenerating || !promptTheme.trim()}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Prompt
                </>
              )}
            </button>

            {promptError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium mb-2">⚠️ Connection Error</p>
                <p className="text-red-700 text-sm">{promptError}</p>
                <div className="mt-3 text-xs text-red-600 space-y-1">
                  <p>Make sure these are running:</p>
                  <p>• FastAPI: <code className="bg-red-100 px-2 py-1 rounded">uvicorn scripts.api:app --reload</code></p>
                  <p>• Ollama: <code className="bg-red-100 px-2 py-1 rounded">ollama serve</code></p>
                </div>
              </div>
            )}

            {generatedPrompt && (
              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-semibold text-slate-900 text-lg">Your Creative Prompt:</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">{generatedPrompt}</p>
                <div className="mt-4 pt-4 border-t border-purple-100">
                  <p className="text-xs text-slate-500">
                    Generated by Ollama via FastAPI • Theme: "{promptTheme}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Example Themes */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Try These Themes:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "Inspired by BLACKPINK",
              "Minimalist Fashion",
              "Spring Trends 2024",
              "Vintage Style",
              "K-pop Fashion",
              "Sustainable Style",
              "Bold Colors",
              "Natural Beauty",
              "Street Style"
            ].map((theme) => (
              <button
                key={theme}
                onClick={() => setPromptTheme(theme)}
                className="px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-sm font-medium text-left"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Step 11: Frontend to Backend Connection</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                This page demonstrates <strong>POST requests</strong> from Next.js to FastAPI. 
                When you click "Generate Prompt", it sends your theme to the backend, which uses 
                Ollama to create a creative journal prompt and returns it to display here.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-mono text-slate-700 mb-2">
                  <strong>Request Flow:</strong>
                </p>
                <p className="text-xs font-mono text-slate-600">
                  1. User enters theme → 2. POST to /api/generate-journal-prompt → 3. FastAPI calls Ollama → 4. Returns creative prompt → 5. Display result
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
