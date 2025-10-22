"use client"

import { useState } from "react"

export default function Journal() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "October 20, 2025",
      title: "Autumn Wardrobe Update",
      content: "Started building my fall capsule wardrobe with neutral tones and layering pieces.",
      mood: "inspired",
      tags: ["capsule", "autumn", "neutral"],
    },
    {
      id: 2,
      date: "October 15, 2025",
      title: "Thrifting Adventure",
      content: "Found amazing vintage pieces at the local thrift store. Sustainable fashion is the way to go!",
      mood: "excited",
      tags: ["vintage", "sustainable", "thrifting"],
    },
    {
      id: 3,
      date: "October 10, 2025",
      title: "Style Inspiration",
      content: "Inspired by minimalist fashion. Decided to declutter my closet and keep only pieces I truly love.",
      mood: "motivated",
      tags: ["minimalist", "declutter", "inspiration"],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "", mood: "inspired", tags: "" })

  const addEntry = () => {
    if (formData.title.trim() && formData.content.trim()) {
      const newEntry = {
        id: Math.max(...entries.map((e) => e.id), 0) + 1,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }
      setEntries([newEntry, ...entries])
      setFormData({ title: "", content: "", mood: "inspired", tags: "" })
      setShowForm(false)
    }
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const moodColors: Record<string, string> = {
    inspired: "bg-amber-100 text-amber-800",
    excited: "bg-rose-100 text-rose-800",
    motivated: "bg-green-100 text-green-800",
    reflective: "bg-blue-100 text-blue-800",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4 text-balance">My Style Journal</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Track your personal style journey and fashion discoveries.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-rose-700 text-white px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <span className="text-xl">➕</span>
            New Entry
          </button>
        </div>

        {/* Add Entry Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-rose-200 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Create New Entry</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Entry title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />

              <textarea
                placeholder="Write your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="inspired">Inspired</option>
                  <option value="excited">Excited</option>
                  <option value="motivated">Motivated</option>
                  <option value="reflective">Reflective</option>
                </select>

                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={addEntry}
                className="w-full bg-rose-700 text-white py-3 rounded-lg hover:bg-rose-800 transition-colors font-medium"
              >
                Save Entry
              </button>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-rose-400 border border-slate-100 hover:border-rose-200 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-rose-700 transition-colors mb-2">
                    {entry.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      {entry.date}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${moodColors[entry.mood]}`}>
                      {entry.mood}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 text-xl"
                  aria-label="Delete entry"
                >
                  ✕
                </button>
              </div>

              <p className="text-slate-600 leading-relaxed mb-4">{entry.content}</p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>🏷️</span>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
