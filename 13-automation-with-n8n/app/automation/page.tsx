"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

interface AutomatedTrend {
  id: number
  source: string
  title: string
  description: string
  scraped_at: string
  popularity_score: number
}

interface ScrapeResponse {
  status: string
  message: string
  trends_found: number
  trends: AutomatedTrend[]
  timestamp: string
}

export default function AutomationPage() {
  const [trends, setTrends] = useState<AutomatedTrend[]>([])
  const [loading, setLoading] = useState(false)
  const [lastRun, setLastRun] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const triggerScraping = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/scrape-trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to scrape trends")
      }

      const data: ScrapeResponse = await response.json()
      setTrends(data.trends)
      setLastRun(data.timestamp)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-100 rounded-full">
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium text-indigo-900">Step 13: n8n Automation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Automated Trend Engine</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            This page demonstrates n8n workflow automation that triggers daily trend scraping and sends notifications to
            Discord/Slack when complete.
          </p>
        </div>

        {/* Automation Info Card */}
        <Card className="bg-white border-2 border-indigo-200 p-8 mb-8 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">n8n Workflow Status</h2>
              <p className="text-slate-600 mb-4">
                The n8n workflow runs daily at 9:00 AM, calls the /api/scrape-trends endpoint, and sends a notification
                when complete.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-sm text-indigo-600 font-medium mb-1">Schedule</div>
                  <div className="text-lg font-bold text-indigo-900">Daily at 9:00 AM</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 font-medium mb-1">Endpoint</div>
                  <div className="text-lg font-bold text-purple-900">POST /api/scrape-trends</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-sm text-pink-600 font-medium mb-1">Notification</div>
                  <div className="text-lg font-bold text-pink-900">Discord/Slack</div>
                </div>
              </div>
              <Button
                onClick={triggerScraping}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                {loading ? "Scraping Trends..." : "🚀 Trigger Manual Scraping"}
              </Button>
            </div>
          </div>

          {lastRun && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>Last Run:</strong> {new Date(lastRun).toLocaleString()}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
        </Card>

        {/* Scraped Trends Display */}
        {trends.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">📊 Scraped Trends ({trends.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend) => (
                <Card
                  key={trend.id}
                  className="bg-white border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">📈</div>
                    <div className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      Score: {trend.popularity_score}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{trend.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{trend.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Source: {trend.source}</span>
                    <span>{new Date(trend.scraped_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* n8n Setup Instructions */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 mt-8 text-white">
          <h2 className="text-2xl font-bold mb-4">⚙️ n8n Setup Instructions</h2>
          <div className="space-y-3 text-slate-300">
            <p>
              <strong className="text-white">1. Start n8n:</strong> Run{" "}
              <code className="bg-slate-700 px-2 py-1 rounded">docker compose up -d</code> in the n8n/ folder
            </p>
            <p>
              <strong className="text-white">2. Access n8n:</strong> Open{" "}
              <code className="bg-slate-700 px-2 py-1 rounded">http://localhost:5678</code>
            </p>
            <p>
              <strong className="text-white">3. Import Workflow:</strong> Import the{" "}
              <code className="bg-slate-700 px-2 py-1 rounded">daily-trend-scraper.json</code> workflow
            </p>
            <p>
              <strong className="text-white">4. Configure Discord:</strong> Add your Discord webhook URL to the
              notification node
            </p>
            <p>
              <strong className="text-white">5. Activate:</strong> Toggle the workflow to active for daily automation
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
