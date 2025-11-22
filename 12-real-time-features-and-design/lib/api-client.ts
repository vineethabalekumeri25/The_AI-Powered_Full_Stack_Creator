/**
 * Step 11: API Client for FastAPI Backend
 * This module provides functions to interact with the Python FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Trend {
  id: number
  name: string
  description: string
  season: string
  popularity: string
}

export interface JournalEntry {
  title: string
  content: string
  mood: string
  tags: string[]
}

export interface JournalPrompt {
  theme: string
  prompt: string
  model: string
}

/**
 * Task 1: Fetching Data (GET)
 * Fetches fashion trends from the FastAPI backend
 */
export async function fetchTrends(): Promise<Trend[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trends`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trends: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.trends || []
  } catch (error) {
    console.error('Error fetching trends:', error)
    throw error
  }
}

/**
 * Task 2: Sending Data (POST)
 * Sends journal entry data to the FastAPI backend
 */
export async function createJournalEntry(entry: JournalEntry): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create entry: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating journal entry:', error)
    throw error
  }
}

/**
 * Creative Exercise: Generate Journal Prompt
 * Uses Ollama to generate creative prompts
 */
export async function generateJournalPrompt(theme: string): Promise<JournalPrompt> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-journal-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to generate prompt: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error generating journal prompt:', error)
    throw error
  }
}

/**
 * Check if FastAPI backend is running
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    return response.ok
  } catch (error) {
    return false
  }
}
