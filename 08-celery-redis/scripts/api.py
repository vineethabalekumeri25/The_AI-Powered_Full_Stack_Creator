"""
--- Step 8: FastAPI wi                                                                                                                                                                                          th Celery Integration ---
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
            "GET /api/trends": "Get hardcoded fashion trends (for testing)"
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


# Run the API server
if __name__ == "__main__":
    print("Starting Style Journal API...")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
