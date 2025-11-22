"""
Phase 3 - Step 7: Web Scraping for Trends
Task 2: Dynamic Scraping with Playwright

This script demonstrates how to scrape makeup products from a website
that loads content dynamically with JavaScript.
"""

from playwright.sync_api import sync_playwright
from typing import List, Dict
import json

def scrape_makeup_products(url: str, max_products: int = 5) -> List[Dict[str, str]]:
    """
    Scrapes makeup product information using Playwright for dynamic content.
    
    Args:
        url: The URL of the makeup brand's website
        max_products: Maximum number of products to scrape
        
    Returns:
        List of dictionaries containing product data
    """
    products = []
    
    print(f"[v0] Launching browser to scrape: {url}")
    
    with sync_playwright() as p:
        # Step 1: Launch browser (headless=False to see the browser in action)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # Step 2: Navigate to the URL
            print(f"[v0] Navigating to {url}")
            page.goto(url, wait_until='networkidle')
            
            # Step 3: Wait for products to load (adjust selector based on actual site)
            print("[v0] Waiting for products to load...")
            page.wait_for_selector('.product-card', timeout=10000)
            
            # Step 4: Extract product information
            print("[v0] Extracting product data...")
            
            # Get all product cards
            product_elements = page.query_selector_all('.product-card')
            
            for i, product in enumerate(product_elements[:max_products]):
                try:
                    # Extract product name
                    name_element = product.query_selector('.product-name, h3, .title')
                    name = name_element.inner_text() if name_element else 'N/A'
                    
                    # Extract price
                    price_element = product.query_selector('.price, .product-price')
                    price = price_element.inner_text() if price_element else 'N/A'
                    
                    # Extract image URL
                    img_element = product.query_selector('img')
                    image_url = img_element.get_attribute('src') if img_element else ''
                    
                    # Extract product link
                    link_element = product.query_selector('a')
                    product_link = link_element.get_attribute('href') if link_element else ''
                    
                    products.append({
                        'name': name.strip(),
                        'price': price.strip(),
                        'image_url': image_url,
                        'link': product_link
                    })
                    
                    print(f"[v0] Scraped product {i+1}: {name}")
                    
                except Exception as e:
                    print(f"[v0] Error extracting product {i+1}: {e}")
                    continue
            
        except Exception as e:
            print(f"[v0] Error during scraping: {e}")
        
        finally:
            # Step 5: Close browser
            browser.close()
    
    print(f"[v0] Successfully scraped {len(products)} products")
    return products


def scrape_sephora_new_arrivals():
    """
    Example: Scraping new makeup arrivals from Sephora
    Note: This is a demonstration - actual selectors may vary
    """
    # Example URL (adjust based on actual website structure)
    url = "https://www.sephora.com/shop/new-makeup"
    
    try:
        products = scrape_makeup_products(url, max_products=5)
        
        print("\n--- New Makeup Arrivals ---")
        for i, product in enumerate(products, 1):
            print(f"\n{i}. {product['name']}")
            print(f"   Price: {product['price']}")
            if product['link']:
                print(f"   Link: {product['link']}")
        
        # Save to JSON file
        with open('makeup_products.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("\n✓ Products saved to makeup_products.json")
        
    except Exception as e:
        print(f"[v0] Error: {e}")
        print("\nNote: Make sure Playwright is installed:")
        print("  pip install playwright")
        print("  playwright install chromium")


def example_playwright_basics():
    """
    Demonstrates basic Playwright operations for web scraping
    """
    print("\n--- Playwright Basics Example ---")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to a page
        page.goto("https://example.com")
        
        # Get page title
        title = page.title()
        print(f"Page title: {title}")
        
        # Find element by selector
        heading = page.query_selector('h1')
        if heading:
            print(f"Main heading: {heading.inner_text()}")
        
        # Take a screenshot (optional)
        # page.screenshot(path='example.png')
        
        browser.close()
    
    print("✓ Playwright basics completed")


# --- Mock Data for Testing (when live scraping isn't available) ---

def get_mock_makeup_products() -> List[Dict[str, str]]:
    """
    Returns mock makeup product data for testing purposes
    """
    return [
        {
            'name': 'Velvet Matte Lipstick - Ruby Red',
            'price': '$24.00',
            'image_url': '/placeholder.svg?height=200&width=200',
            'link': '/products/velvet-matte-lipstick'
        },
        {
            'name': 'Flawless Foundation - Natural Beige',
            'price': '$42.00',
            'image_url': '/placeholder.svg?height=200&width=200',
            'link': '/products/flawless-foundation'
        },
        {
            'name': 'Shimmer Eyeshadow Palette',
            'price': '$38.00',
            'image_url': '/placeholder.svg?height=200&width=200',
            'link': '/products/shimmer-palette'
        },
        {
            'name': 'Volumizing Mascara - Black',
            'price': '$22.00',
            'image_url': '/placeholder.svg?height=200&width=200',
            'link': '/products/volumizing-mascara'
        },
        {
            'name': 'Radiant Blush - Coral Pink',
            'price': '$28.00',
            'image_url': '/placeholder.svg?height=200&width=200',
            'link': '/products/radiant-blush'
        }
    ]


if __name__ == "__main__":
    print("=== Phase 3: Dynamic Web Scraping for Makeup Products ===\n")
    
    # Option 1: Use mock data for testing
    print("Using mock data for demonstration...")
    mock_products = get_mock_makeup_products()
    
    print("\n--- Mock Makeup Products ---")
    for i, product in enumerate(mock_products, 1):
        print(f"\n{i}. {product['name']}")
        print(f"   Price: {product['price']}")
    
    # Save mock data to JSON
    with open('makeup_products.json', 'w', encoding='utf-8') as f:
        json.dump(mock_products, f, indent=2, ensure_ascii=False)
    print("\n✓ Mock products saved to makeup_products.json")
    
    # Option 2: Run Playwright basics (uncomment to test)
    # example_playwright_basics()
    
    # Option 3: Run live scraping (uncomment when ready)
    # Note: Requires Playwright installation and internet connection
    # scrape_sephora_new_arrivals()
    
    print("\n✓ Script completed successfully!")
