"""
This file creates a FastAPI application with endpoints that trigger background tasks.
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Import Celery tasks
from tasks import (
    scrape_trends_task,
    scrape_fashion_news_task,
    scrape_makeup_products_task,
    hello_task
)

try:
    from ollama_client import OllamaClient, generate_journal_prompt
    OLLAMA_AVAILABLE = True
except Exception as e:
    print(f"Warning: Ollama client not available: {e}")
    OLLAMA_AVAILABLE = False

try:
    from rag_pipeline import RAGPipeline
    rag_pipeline = RAGPipeline()
    RAG_AVAILABLE = True
except Exception as e:
    print(f"Warning: RAG pipeline not available: {e}")
    RAG_AVAILABLE = False

# Create FastAPI app
app = FastAPI(
    title="Style Journal API",
    description="Backend API for fashion trends and makeup products",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Response Models ---
class TaskResponse(BaseModel):
    """Response model for task submission"""
    task_id: str
    status: str
    message: str


class TaskStatusResponse(BaseModel):
    """Response model for task status check"""
    task_id: str
    status: str
    result: Optional[dict] = None


class RecommendationRequest(BaseModel):
    """Request model for fashion recommendations"""
    query: str
    limit: Optional[int] = 5


class RecommendationResponse(BaseModel):
    """Response model for fashion recommendations"""
    query: str
    retrieved_trends: list
    recommendations: str


class JournalPromptRequest(BaseModel):
    """Request model for journal prompt generation"""
    theme: str
    model: Optional[str] = "llama3"


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
        "message": "Welcome to Style Journal API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/scrape-trends": "Trigger background scraping of all trends",
            "POST /api/scrape-fashion-news": "Trigger background scraping of fashion news",
            "POST /api/scrape-makeup-products": "Trigger background scraping of makeup products",
            "GET /api/task-status/{task_id}": "Check status of a background task",
            "GET /api/trends": "Get hardcoded fashion trends (for testing)",
            "POST /api/recommendations": "Get AI-powered fashion recommendations using RAG",
            "POST /api/generate-journal-prompt": "Generate creative journal prompts using Ollama"
        }
    }


@app.get("/api/trends")
def get_trends():
    """
    Task 2 from Step 5: Simple API endpoint returning hardcoded trends.
    This is a synchronous endpoint that returns immediately.
    """
    trends = [
        {
            "id": 1,
            "name": "Cottagecore Aesthetic",
            "description": "Romantic, vintage-inspired fashion with floral prints",
            "season": "Spring 2025",
            "popularity": "High"
        },
        {
            "id": 2,
            "name": "Sustainable Fashion",
            "description": "Eco-friendly materials and ethical production",
            "season": "Year-round",
            "popularity": "Growing"
        },
        {
            "id": 3,
            "name": "Y2K Revival",
            "description": "Early 2000s fashion making a comeback",
            "season": "Summer 2025",
            "popularity": "Very High"
        },
        {
            "id": 4,
            "name": "Minimalist Chic",
            "description": "Clean lines, neutral colors, timeless pieces",
            "season": "Year-round",
            "popularity": "High"
        },
        {
            "id": 5,
            "name": "Maximalist Glam",
            "description": "Bold colors, patterns, and statement pieces",
            "season": "Fall 2025",
            "popularity": "Medium"
        }
    ]
    return {"trends": trends, "count": len(trends)}


@app.post("/api/scrape-trends", response_model=TaskResponse)
def trigger_scrape_trends():
    """
    Creative Exercise: Trigger background scraping task.
    This endpoint triggers the scraping task asynchronously using Celery.
    The task runs in the background and doesn't block the API response.
    """
    try:
        # Trigger the Celery task using .delay()
        # .delay() is a shortcut for .apply_async()
        task = scrape_trends_task.delay()
        
        return TaskResponse(
            task_id=task.id,
            status="pending",
            message="Scraping task started in background. Use task_id to check status."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start task: {str(e)}")


@app.post("/api/scrape-fashion-news", response_model=TaskResponse)
def trigger_scrape_fashion_news():
    """Trigger background scraping of fashion news only"""
    try:
        task = scrape_fashion_news_task.delay()
        return TaskResponse(
            task_id=task.id,
            status="pending",
            message="Fashion news scraping started in background"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/scrape-makeup-products", response_model=TaskResponse)
def trigger_scrape_makeup_products():
    """Trigger background scraping of makeup products only"""
    try:
        task = scrape_makeup_products_task.delay()
        return TaskResponse(
            task_id=task.id,
            status="pending",
            message="Makeup products scraping started in background"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/task-status/{task_id}", response_model=TaskStatusResponse)
def get_task_status(task_id: str):
    """
    Check the status of a background task.
    Returns: pending, started, success, failure, or retry
    """
    from celery.result import AsyncResult
    
    task_result = AsyncResult(task_id, app=scrape_trends_task.app)
    
    response = TaskStatusResponse(
        task_id=task_id,
        status=task_result.status.lower(),
        result=task_result.result if task_result.ready() else None
    )
    
    return response


@app.post("/api/test-task")
def test_celery():
    """Test endpoint to verify Celery is working"""
    task = hello_task.delay("Style Journal")
    return {
        "message": "Test task triggered",
        "task_id": task.id
    }


@app.post("/api/recommendations", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Step 9: AI Stylist - Get personalized fashion recommendations using RAG
    
    This endpoint uses Retrieval Augmented Generation (RAG) to provide
    AI-powered fashion recommendations based on stored trend embeddings.
    
    How it works:
    1. Creates an embedding of the user's query
    2. Searches for similar fashion trends in the vector database
    3. Uses retrieved trends as context for the LLM
    4. Generates personalized recommendations
    
    Example query: "I want a casual summer outfit for a beach party"
    """
    if not RAG_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="RAG pipeline not available. Please check OpenAI API key and Supabase connection."
        )
    
    try:
        # Run the RAG pipeline
        result = rag_pipeline.get_recommendations(request.query)
        
        return RecommendationResponse(
            query=result["query"],
            retrieved_trends=result["retrieved_trends"],
            recommendations=result["recommendations"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@app.get("/api/recommendations/test")
def test_recommendations():
    """
    Test endpoint for recommendations without requiring a POST request.
    Useful for quick testing in the browser.
    """
    if not RAG_AVAILABLE:
        return {
            "error": "RAG pipeline not available",
            "message": "Please configure OpenAI API key and Supabase connection"
        }
    
    test_query = "I want a minimalist spring outfit for work"
    
    try:
        result = rag_pipeline.get_recommendations(test_query)
        return result
    except Exception as e:
        return {
            "error": str(e),
            "message": "Failed to generate test recommendations"
        }


@app.post("/api/generate-journal-prompt", response_model=JournalPromptResponse)
def create_journal_prompt(request: JournalPromptRequest):
    """
    Step 10: Creative Exercise - Generate Journal Prompt using Ollama
    
    This endpoint uses a local Ollama LLM to generate creative journaling prompts
    based on a given theme. Unlike cloud LLMs, this runs entirely on your machine.
    
    How it works:
    1. Accepts a theme (e.g., "Inspired by BLACKPINK")
    2. Sends a crafted prompt to local Ollama API
    3. Returns a creative journal prompt for style journaling
    
    Example themes:
    - "Inspired by BLACKPINK"
    - "Vintage Hollywood Glam"
    - "Sustainable Fashion Journey"
    - "K-beauty Routine"
    """
    if not OLLAMA_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Ollama not available. Please install Ollama and run 'ollama serve'"
        )
    
    try:
        # Check if Ollama is running
        client = OllamaClient()
        if not client.is_available():
            raise HTTPException(
                status_code=503,
                detail="Ollama is not running. Start it with 'ollama serve' and install a model with 'ollama pull llama3'"
            )
        
        # Generate journal prompt
        prompt = generate_journal_prompt(request.theme, request.model)
        
        return JournalPromptResponse(
            theme=request.theme,
            prompt=prompt,
            model=request.model
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate journal prompt: {str(e)}"
        )


@app.get("/api/ollama/status")
def ollama_status():
    """
    Check if Ollama is running and list available models
    """
    if not OLLAMA_AVAILABLE:
        return {
            "available": False,
            "message": "Ollama client not imported"
        }
    
    try:
        client = OllamaClient()
        if not client.is_available():
            return {
                "available": False,
                "message": "Ollama is not running. Start with 'ollama serve'"
            }
        
        models = client.list_models()
        return {
            "available": True,
            "models": models,
            "message": "Ollama is running"
        }
    except Exception as e:
        return {
            "available": False,
            "error": str(e)
        }

# Run the API server
if __name__ == "__main__":
    print("Starting Style Journal API...")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)