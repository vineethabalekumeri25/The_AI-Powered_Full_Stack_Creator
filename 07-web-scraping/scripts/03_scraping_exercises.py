"""
Web Scraping Practice Exercises
================================
Complete these exercises to master web scraping for fashion and makeup trends.
"""

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json
import time

# ============================================================================
# EXERCISE 1: Scrape Fashion Headlines
# ============================================================================

def exercise_1_fashion_headlines():
    """
    Exercise: Scrape the top 10 headlines from a fashion news website.
    
    TODO:
    1. Choose a fashion news site (Vogue, Elle, WWD, etc.)
    2. Inspect the HTML structure
    3. Find the right selectors for headlines
    4. Extract and print the headlines
    """
    print("=" * 60)
    print("EXERCISE 1: Fashion Headlines Scraper")
    print("=" * 60)
    
    # Your code here
    url = "https://www.vogue.com/fashion"
    
    # TODO: Complete this function
    print("TODO: Implement headline scraping")
    print("Hint: Use requests.get() and BeautifulSoup")
    print("Hint: Look for <h2>, <h3> tags with article titles")

# ============================================================================
# EXERCISE 2: Scrape Product Details
# ============================================================================

def exercise_2_product_details():
    """
    Exercise: Scrape detailed information about makeup products.
    
    TODO:
    1. Navigate to a product listing page
    2. Extract: name, price, brand, rating, description
    3. Save to a JSON file
    """
    print("\n" + "=" * 60)
    print("EXERCISE 2: Product Details Scraper")
    print("=" * 60)
    
    # Your code here
    print("TODO: Implement product detail scraping")
    print("Hint: Use Playwright for dynamic content")
    print("Hint: Create a dictionary for each product")

# ============================================================================
# EXERCISE 3: Scrape Multiple Pages
# ============================================================================

def exercise_3_pagination():
    """
    Exercise: Scrape products from multiple pages.
    
    TODO:
    1. Start on page 1 of product listings
    2. Scrape all products on the page
    3. Navigate to next page
    4. Repeat for 3 pages
    5. Save all products to one JSON file
    """
    print("\n" + "=" * 60)
    print("EXERCISE 3: Multi-Page Scraper")
    print("=" * 60)
    
    # Your code here
    print("TODO: Implement pagination scraping")
    print("Hint: Look for 'Next' button or page numbers")
    print("Hint: Use a loop to iterate through pages")

# ============================================================================
# EXERCISE 4: Scrape with Filters
# ============================================================================

def exercise_4_filtered_search():
    """
    Exercise: Apply filters and scrape results.
    
    TODO:
    1. Navigate to a makeup website
    2. Apply filters (e.g., "Lipstick", "Under $20", "4+ stars")
    3. Scrape the filtered results
    4. Compare prices across different filters
    """
    print("\n" + "=" * 60)
    print("EXERCISE 4: Filtered Search Scraper")
    print("=" * 60)
    
    # Your code here
    print("TODO: Implement filtered search scraping")
    print("Hint: Use page.click() to interact with filters")
    print("Hint: Wait for results to update after filtering")

# ============================================================================
# EXERCISE 5: Trend Analysis
# ============================================================================

def exercise_5_trend_analysis():
    """
    Exercise: Analyze trends from scraped data.
    
    TODO:
    1. Scrape products from "New Arrivals" section
    2. Count how many products are in each category
    3. Find the average price per category
    4. Identify the most common colors/shades
    5. Print a trend report
    """
    print("\n" + "=" * 60)
    print("EXERCISE 5: Trend Analysis")
    print("=" * 60)
    
    # Your code here
    print("TODO: Implement trend analysis")
    print("Hint: Use dictionaries to count categories")
    print("Hint: Use string methods to extract colors from names")

# ============================================================================
# BONUS: Complete Makeup Scraper
# ============================================================================

def bonus_complete_scraper():
    """
    BONUS Exercise: Build a complete makeup trend scraper.
    
    Requirements:
    1. Scrape from 3 different makeup brands
    2. Extract: name, price, brand, category, colors, rating
    3. Save to structured JSON with metadata
    4. Generate a summary report with:
       - Total products scraped
       - Price ranges by category
       - Most popular brands
       - Trending colors
    """
    print("\n" + "=" * 60)
    print("BONUS: Complete Makeup Trend Scraper")
    print("=" * 60)
    
    brands = [
        "https://www.sephora.com",
        "https://www.ulta.com",
        "https://www.maccosmetics.com"
    ]
    
    # Your code here
    print("TODO: Build a comprehensive scraper")
    print("This is your final project - combine all techniques!")

# ============================================================================
# SOLUTION TEMPLATES
# ============================================================================

def solution_template_static():
    """Template for static scraping solutions."""
    template = """
    # Static Scraping Template
    
    import requests
    from bs4 import BeautifulSoup
    
    url = "YOUR_URL_HERE"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find elements
    items = soup.find_all('div', class_='product')
    
    for item in items:
        name = item.find('h3').get_text(strip=True)
        price = item.find('span', class_='price').get_text(strip=True)
        print(f"{name}: {price}")
    """
    print(template)

def solution_template_dynamic():
    """Template for dynamic scraping solutions."""
    template = """
    # Dynamic Scraping Template
    
    from playwright.sync_api import sync_playwright
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        page.goto("YOUR_URL_HERE")
        page.wait_for_selector('.product')
        
        products = page.query_selector_all('.product')
        
        for product in products:
            name = product.query_selector('h3').inner_text()
            price = product.query_selector('.price').inner_text()
            print(f"{name}: {price}")
        
        browser.close()
    """
    print(template)

# ============================================================================
# Main Execution
# ============================================================================

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════╗
    ║         WEB SCRAPING EXERCISES - FASHION & MAKEUP            ║
    ╚══════════════════════════════════════════════════════════════╝
    
    Complete these exercises in order to build your scraping skills!
    
    📚 Exercises:
    1. Fashion Headlines - Scrape news headlines
    2. Product Details - Extract detailed product info
    3. Pagination - Scrape multiple pages
    4. Filtered Search - Apply filters and scrape
    5. Trend Analysis - Analyze scraped data
    
    🎁 BONUS: Complete Makeup Trend Scraper
    
    💡 Tips:
    • Start with the solution templates below
    • Test on one product first, then scale up
    • Always add error handling
    • Be respectful of websites (add delays)
    
    """)
    
    # Run exercises
    exercise_1_fashion_headlines()
    exercise_2_product_details()
    exercise_3_pagination()
    exercise_4_filtered_search()
    exercise_5_trend_analysis()
    bonus_complete_scraper()
    
    print("\n" + "=" * 60)
    print("SOLUTION TEMPLATES")
    print("=" * 60)
    
    print("\n--- Static Scraping Template ---")
    solution_template_static()
    
    print("\n--- Dynamic Scraping Template ---")
    solution_template_dynamic()
