"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "../../lib/firebase"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

interface MoodItem {
  id: string
  type: "text" | "image"
  content: string
  author: string
  timestamp: any
  color?: string
}

export default function MoodBoardPage() {
  const [items, setItems] = useState<MoodItem[]>([])
  const [newText, setNewText] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#F59E0B")

  const colors = [
    { name: "Amber", value: "#F59E0B" },
    { name: "Rose", value: "#F43F5E" },
    { name: "Purple", value: "#A855F7" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Indigo", value: "#6366F1" },
  ]

  useEffect(() => {
    const q = query(collection(db, "moodBoard"), orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedItems: MoodItem[] = []
        snapshot.forEach((doc) => {
          fetchedItems.push({
            id: doc.id,
            ...doc.data(),
          } as MoodItem)
        })
        setItems(fetchedItems)
        setIsConnected(true)
        console.log("[v0] Real-time update received:", fetchedItems.length, "items")
      },
      (error) => {
        console.error("[v0] Firestore connection error:", error)
        setIsConnected(false)
      },
    )

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newText.trim() || !author.trim()) return

    try {
      await addDoc(collection(db, "moodBoard"), {
        type: "text",
        content: newText,
        author: author,
        color: selectedColor,
        timestamp: serverTimestamp(),
      })
      setNewText("")
      console.log("[v0] Text item added successfully")
    } catch (error) {
      console.error("[v0] Error adding text:", error)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImageUrl.trim() || !author.trim()) return

    try {
      await addDoc(collection(db, "moodBoard"), {
        type: "image",
        content: newImageUrl,
        author: author,
        timestamp: serverTimestamp(),
      })
      setNewImageUrl("")
      console.log("[v0] Image item added successfully")
    } catch (error) {
      console.error("[v0] Error adding image:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-slate-700">
              {isConnected ? "Live Connected" : "Connecting..."}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Community{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Mood Board
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Share your fashion inspiration in real-time. When you add an item, everyone sees it instantly powered by
            Firebase Firestore.
          </p>
        </div>

        {/* Add Items Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Add Text Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span> Add Text Note
            </h2>
            <form onSubmit={handleAddText} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Choose Color</label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === color.value
                          ? "ring-4 ring-offset-2 ring-purple-400 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Note</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Share your fashion thought..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Add Text Note
              </Button>
            </form>
          </Card>

          {/* Add Image Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-pink-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🖼️</span> Add Image
            </h2>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg or use /placeholder.svg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Try: /placeholder.svg?height=400&width=400&query=fashion+inspiration
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                Add Image
              </Button>
            </form>
          </Card>
        </div>

        {/* Mood Board Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">✨</span>
            Live Mood Board ({items.length} items)
          </h2>

          {items.length === 0 ? (
            <Card className="p-12 text-center bg-white/60 backdrop-blur-sm">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg text-slate-600 mb-2">No items yet. Be the first to add something!</p>
              <p className="text-sm text-slate-500">Add a text note or image above to get started</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-white/80 backdrop-blur-sm animate-fade-in"
                >
                  {item.type === "text" ? (
                    <div className="p-6 h-full flex flex-col" style={{ backgroundColor: `${item.color}20` }}>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-slate-900 leading-relaxed mb-4">{item.content}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-slate-900">{item.author}</p>
                          <p className="text-xs text-slate-500">Just now</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={item.content || "/placeholder.svg"}
                          alt={`Posted by ${item.author}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm font-bold text-purple-600">
                            {item.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-white">{item.author}</p>
                            <p className="text-xs text-white/80">Just now</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-3">Step 12: Real-time with Firebase</h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            This mood board uses Firebase Firestore's <code className="bg-white/10 px-2 py-1 rounded">onSnapshot</code>{" "}
            listener to provide real-time updates. When anyone adds an item, it instantly appears on all connected
            screens without refreshing!
          </p>
        </div>
      </div>
    </div>
  )
}
