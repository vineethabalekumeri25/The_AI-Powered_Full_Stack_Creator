"""
--- Step 11: Connecting Frontend to Backend ---
This file creates a FastAPI application with endpoints for Step 11.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn


try:
    from ollama_client import generate_journal_prompt
    OLLAMA_AVAILABLE = True
except Exception as e:
    print(f"Warning: Ollama client not available: {e}")
    OLLAMA_AVAILABLE = False

# Create FastAPI app
app = FastAPI(
    title="Style Journal API - Step 11",
    description="Backend API for Step 11: Connecting Frontend to Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Response Models ---
class JournalPromptRequest(BaseModel):
    """Request model for journal prompt generation"""
    theme: str
    model: Optional[str] = "llama3.2:1b"


class JournalPromptResponse(BaseModel):
    """Response model for journal prompt generation"""
    theme: str
    prompt: str
    model: str


# --- API Endpoints ---

@app.get("/")
def root():
    """Root endpoint - API welcome message"""
    return {
        "message": "Welcome to Style Journal API - Step 11",
        "version": "1.0.0",
        "endpoints": {
            "GET /api/trends": "Get fashion trends (for Step 11 Task 1: GET request)",
            "POST /api/generate-journal-prompt": "Generate journal prompts (for Step 11 Task 2: POST request)",
            "POST /api/scrape-trends": "Trigger daily trend scraping (for Step 13: Automation with n8n)"
        }
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend is running"""
    return {
        "status": "healthy",
        "message": "FastAPI backend is running",
        "ollama_available": OLLAMA_AVAILABLE
    }


@app.get("/api/trends")
def get_trends():
    """
    Step 11 Task 1: GET Request
    Simple API endpoint returning hardcoded fashion trends.
    The Next.js frontend will fetch this data using useEffect.
    """
    trends = [
        {
            "id": 1,
            "name": "Cottagecore Aesthetic",
            "description": "Romantic, vintage-inspired fashion with floral prints and natural fabrics",
            "season": "Spring 2025",
            "popularity": "High",
            "image": "/fashion-trend-.jpg"
        },
        {
            "id": 2,
            "name": "Sustainable Fashion",
            "description": "Eco-friendly materials and ethical production methods",
            "season": "Year-round",
            "popularity": "Growing",
            "image": "/fashion-runway-trends-colorful-minimalist.jpg"
        },
        {
            "id": 3,
            "name": "Y2K Revival",
            "description": "Early 2000s fashion making a vibrant comeback",
            "season": "Summer 2025",
            "popularity": "Very High",
            "image": "/fashion-trends-runway-minimalist.jpg"
        },
        {
            "id": 4,
            "name": "Minimalist Chic",
            "description": "Clean lines, neutral colors, and timeless pieces",
            "season": "Year-round",
            "popularity": "High",
            "image": "/elegant-fashion-magazine-spread-minimalist-style.jpg"
        },
        {
            "id": 5,
            "name": "Maximalist Glam",
            "description": "Bold colors, patterns, and statement pieces",
            "season": "Fall 2025",
            "popularity": "Medium",
            "image": "/fashion-runway-trends-colorful-minimalist.jpg"
        }
    ]
    return {
        "trends": trends,
        "count": len(trends),
        "message": "Successfully fetched fashion trends"
    }


@app.post("/api/generate-journal-prompt", response_model=JournalPromptResponse)
def create_journal_prompt(request: JournalPromptRequest):
    """
    Step 11 Task 2: POST Request
    Generate creative journal prompts using local Ollama LLM.
    The Next.js frontend will send a POST request with a theme.
    
    Example request body:
    {
        "theme": "Inspired by BLACKPINK",
        "model": "llama3.2:1b"
    }
    """
    if not OLLAMA_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Ollama client not available. Please ensure ollama_client.py exists in the scripts folder."
        )
    
    try:
        # Generate journal prompt using Ollama
        prompt = generate_journal_prompt(request.theme, request.model)
        
        return JournalPromptResponse(
            theme=request.theme,
            prompt=prompt,
            model=request.model
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate journal prompt: {str(e)}"
        )


@app.post("/api/scrape-trends")
def scrape_trends():
    """
    Step 13: n8n Automation Endpoint
    This endpoint is called by n8n workflow to trigger daily trend scraping.
    It simulates a background job that scrapes fashion trends.
    """
    import random
    from datetime import datetime
    
    # Simulate trend scraping (in production, this would scrape real websites)
    trend_sources = [
        "Vogue", "Harper's Bazaar", "Elle", "GQ", "WWD", 
        "Fashionista", "Refinery29", "InStyle"
    ]
    
    trends = []
    for i in range(5):
        trends.append({
            "id": i + 1,
            "source": random.choice(trend_sources),
            "title": f"Fashion Trend {i+1} - {datetime.now().strftime('%Y-%m-%d')}",
            "description": "Auto-scraped trend from n8n workflow automation",
            "scraped_at": datetime.now().isoformat(),
            "popularity_score": random.randint(70, 99)
        })
    
    return {
        "status": "success",
        "message": "Trend scraping completed",
        "trends_found": len(trends),
        "trends": trends,
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/ollama/status")
def ollama_status():
    """Check if Ollama is available and running"""
    return {
        "available": OLLAMA_AVAILABLE,
        "message": "Ollama is available" if OLLAMA_AVAILABLE else "Ollama client not found"
    }


# Run the API server
if __name__ == "__main__":
    print("\n" + "="*50)
    print("  Starting Style Journal API - Step 11")
    print("="*50)
    print(f"\n📡 API running at: http://localhost:8000")
    print(f"📚 API Docs: http://localhost:8000/docs")
    print(f"✅ Health Check: http://localhost:8000/api/health")
    print(f"📊 Trends Endpoint: http://localhost:8000/api/trends")
    print(f"🔄 Scrape Trends Endpoint: http://localhost:8000/api/scrape-trends")
    print("\n" + "="*50 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
