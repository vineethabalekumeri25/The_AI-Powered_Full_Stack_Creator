"""
--- Step 8: Asynchronous Tasks (Celery Tasks) ---
This file defines background tasks that can be triggered asynchronously.
Tasks are decorated with @celery_app.task() to register them with Celery.
"""

from celery_app import celery_app
import time
import json
from datetime import datetime

# Import our scraping functions
try:
    from makeup_products_scraper import scrape_makeup_products
    from fashion_news_scraper import scrape_fashion_news
except ImportError:
    print("Warning: Scraper modules not found. Using mock functions.")
    
    def scrape_makeup_products():
        """Mock function for testing"""
        return [
            {"name": "Velvet Lipstick", "price": "$24.99"},
            {"name": "Glow Foundation", "price": "$42.00"}
        ]
    
    def scrape_fashion_news():
        """Mock function for testing"""
        return [
            {"title": "Spring Fashion Trends 2025", "url": "https://example.com/1"},
            {"title": "Sustainable Fashion Guide", "url": "https://example.com/2"}
        ]


@celery_app.task(name='scrape_trends_task')
def scrape_trends_task():
    """
    Background task to scrape fashion trends and makeup products.
    This task runs asynchronously and doesn't block the API.
    
    Returns:
        dict: Results containing scraped data and metadata
    """
    print("[Celery Task] Starting trend scraping task...")
    start_time = time.time()
    
    try:
        # Scrape fashion news headlines
        print("[Celery Task] Scraping fashion news...")
        fashion_news = scrape_fashion_news()
        
        # Scrape makeup products
        print("[Celery Task] Scraping makeup products...")
        makeup_products = scrape_makeup_products()
        
        # Calculate execution time
        execution_time = time.time() - start_time
        
        # Prepare results
        results = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "execution_time_seconds": round(execution_time, 2),
            "data": {
                "fashion_news": fashion_news[:5],  # First 5 headlines
                "makeup_products": makeup_products[:5]  # First 5 products
            },
            "counts": {
                "fashion_news_count": len(fashion_news),
                "makeup_products_count": len(makeup_products)
            }
        }
        
        print(f"[Celery Task] ✓ Task completed in {execution_time:.2f} seconds")
        return results
        
    except Exception as e:
        print(f"[Celery Task] ✗ Error: {str(e)}")
        return {
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }


@celery_app.task(name='scrape_fashion_news_task')
def scrape_fashion_news_task():
    """
    Background task to scrape only fashion news.
    """
    print("[Celery Task] Starting fashion news scraping...")
    
    try:
        news = scrape_fashion_news()
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": news,
            "count": len(news)
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


@celery_app.task(name='scrape_makeup_products_task')
def scrape_makeup_products_task():
    """
    Background task to scrape only makeup products.
    """
    print("[Celery Task] Starting makeup products scraping...")
    
    try:
        products = scrape_makeup_products()
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "data": products,
            "count": len(products)
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# Example: Simple task for testing
@celery_app.task(name='hello_task')
def hello_task(name: str = "World"):
    """
    Simple test task to verify Celery is working.
    """
    print(f"[Celery Task] Hello, {name}!")
    time.sleep(2)  # Simulate some work
    return f"Hello, {name}! Task completed at {datetime.now().isoformat()}"
