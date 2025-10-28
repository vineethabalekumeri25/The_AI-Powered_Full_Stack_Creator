# Phase 3, Step 5, Task 2 Exercise:
# Create a simple FastAPI API with root and trends endpoints.

from fastapi import FastAPI
from typing import List, Dict

# Create an instance of the FastAPI class
app = FastAPI()

# Task 2: Create a root endpoint that returns a welcome message
@app.get("/")
def read_root():
    """
    Root endpoint that returns a simple welcome message.
    """
    return {"message": "Welcome to the Style Journal API!"}

# Creative Exercise (Trends API):
# Create a GET /api/trends endpoint that returns a hardcoded JSON list
@app.get("/api/trends")
def get_fashion_trends() -> List[Dict[str, str]]:
    """
    Returns a hardcoded list of current fashion trends.
    """
    trends = [
        {"id": "trend-001", "name": "Sustainable Fabrics", "description": "Focus on eco-friendly materials like organic cotton and recycled polyester."},
        {"id": "trend-002", "name": "Bold Colors", "description": "Vibrant hues like emerald green and electric blue are making a statement."},
        {"id": "trend-003", "name": "Retro Revival", "description": "Styles inspired by the 70s and 90s are coming back."},
        {"id": "trend-004", "name": "Comfort Core", "description": "Emphasis on comfortable yet stylish clothing, like elevated loungewear."}
    ]
    return trends

# Optional: Add a simple check to run with uvicorn directly if the script is executed
# This is helpful for quick testing but usually uvicorn command is used.
if __name__ == "__main__":
    import uvicorn
    print("Running FastAPI server...")
    print("Access API docs at http://127.0.0.1:8000/docs")
    print("Access Trends API at http://127.0.0.1:8000/api/trends")
    uvicorn.run(app, host="127.0.0.1", port=8000)
