"use client"

import { generateJournalPrompt } from "../../lib/api-client"
import { useState } from "react"

export default function Journal() {
  const [showPromptGenerator, setShowPromptGenerator] = useState(true)
  const [promptTheme, setPromptTheme] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [promptError, setPromptError] = useState<string | null>(null)

  const handleGeneratePrompt = async () => {
    if (!promptTheme.trim()) return
    
    try {
      setIsGenerating(true)
      setPromptError(null)
      
      const result = await generateJournalPrompt(promptTheme)
      setGeneratedPrompt(result.prompt)
    } catch (error) {
      setPromptError(
        "Failed to generate prompt. Make sure FastAPI backend is running and Ollama is installed."
      )
      console.error("Error generating prompt:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 text-balance">
            AI Journal Prompt Generator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Get creative writing prompts powered by local AI (Step 11: Frontend to Backend)
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Generate AI Prompt</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>
              <input
                type="text"
                placeholder="e.g., 'Inspired by BLACKPINK', 'Summer fashion', 'Minimalist style'"
                value={promptTheme}
                onChange={(e) => setPromptTheme(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={isGenerating || !promptTheme.trim()}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isGenerating ? "Generating with Ollama..." : "✨ Generate Prompt"}
            </button>

            {promptError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">⚠️ {promptError}</p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure: 1) FastAPI is running on port 8000, 2) Ollama is installed and running
                </p>
              </div>
            )}

            {generatedPrompt && (
              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span>✨</span> Generated Journal Prompt:
                </h3>
                <p className="text-slate-700 leading-relaxed text-lg">{generatedPrompt}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            How This Works (Step 11)
          </h3>
          <div className="space-y-3 text-slate-600">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <p><strong>Frontend (Next.js):</strong> User enters a theme and clicks generate</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <p><strong>POST Request:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-sm">fetch('http://localhost:8000/api/generate-journal-prompt')</code></p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <p><strong>Backend (FastAPI):</strong> Receives theme and calls local Ollama</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">4️⃣</span>
              <p><strong>Response:</strong> AI-generated prompt returned to frontend</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
