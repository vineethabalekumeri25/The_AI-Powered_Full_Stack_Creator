"""
Dynamic Web Scraping with Playwright
====================================
This script demonstrates how to scrape makeup products from a brand website
using Playwright to handle JavaScript-rendered content.
"""

from playwright.sync_api import sync_playwright
import time
import json

def scrape_makeup_products(brand_url, max_products=5):
    """
    Scrape makeup products from a brand's website using Playwright.
    
    Args:
        brand_url: The URL of the makeup brand's website
        max_products: Maximum number of products to scrape
    """
    print(f"[v0] Launching browser to scrape: {brand_url}")
    
    with sync_playwright() as p:
        # Launch browser (headless=False to see what's happening)
        browser = p.chromium.launch(headless=False)
        
        # Create a new page
        page = browser.new_page()
        
        # Set viewport size
        page.set_viewport_size({"width": 1920, "height": 1080})
        
        try:
            print("[v0] Navigating to website...")
            page.goto(brand_url, wait_until="networkidle", timeout=30000)
            
            # Wait a bit for dynamic content to load
            time.sleep(2)
            
            print("[v0] Page loaded successfully!")
            print(f"[v0] Page title: {page.title()}")
            
            # Example 1: Scraping Sephora New Arrivals
            print("\n" + "=" * 60)
            print("SCRAPING MAKEUP PRODUCTS")
            print("=" * 60)
            
            products = []
            
            # Common selectors for product listings (adjust based on actual site)
            product_selectors = [
                'div[data-comp="ProductGrid"] div[data-comp="ProductTile"]',
                'div.product-grid div.product-tile',
                'div.product-list article',
                'div[class*="product"]',
            ]
            
            # Try to find products with different selectors
            for selector in product_selectors:
                try:
                    print(f"[v0] Trying selector: {selector}")
                    page.wait_for_selector(selector, timeout=5000)
                    product_elements = page.query_selector_all(selector)
                    
                    if product_elements:
                        print(f"[v0] Found {len(product_elements)} products!")
                        
                        for i, element in enumerate(product_elements[:max_products]):
                            try:
                                # Extract product information
                                # These selectors are examples - adjust for actual website
                                
                                # Try to find product name
                                name_element = element.query_selector('h3, h2, [class*="name"], [class*="title"]')
                                name = name_element.inner_text() if name_element else "Name not found"
                                
                                # Try to find price
                                price_element = element.query_selector('[class*="price"], [data-comp="Price"]')
                                price = price_element.inner_text() if price_element else "Price not found"
                                
                                # Try to find brand
                                brand_element = element.query_selector('[class*="brand"]')
                                brand = brand_element.inner_text() if brand_element else "Brand not found"
                                
                                # Try to find image
                                img_element = element.query_selector('img')
                                image_url = img_element.get_attribute('src') if img_element else None
                                
                                product = {
                                    'name': name.strip(),
                                    'price': price.strip(),
                                    'brand': brand.strip(),
                                    'image_url': image_url
                                }
                                
                                products.append(product)
                                
                                print(f"\n{i + 1}. {product['name']}")
                                print(f"   Brand: {product['brand']}")
                                print(f"   Price: {product['price']}")
                                
                            except Exception as e:
                                print(f"[v0] Error extracting product {i + 1}: {e}")
                                continue
                        
                        break  # Found products, exit loop
                        
                except Exception as e:
                    print(f"[v0] Selector failed: {e}")
                    continue
            
            if not products:
                print("\n[v0] No products found with standard selectors.")
                print("[v0] Let me show you the page structure...")
                
                # Get page content for inspection
                content = page.content()
                print(f"[v0] Page has {len(content)} characters of HTML")
                
                # Take a screenshot for debugging
                page.screenshot(path="scripts/makeup_page_screenshot.png")
                print("[v0] Screenshot saved to: scripts/makeup_page_screenshot.png")
            
            # Save results to JSON
            if products:
                with open('scripts/makeup_products.json', 'w', encoding='utf-8') as f:
                    json.dump(products, f, indent=2, ensure_ascii=False)
                print(f"\n[v0] Saved {len(products)} products to makeup_products.json")
            
            return products
            
        except Exception as e:
            print(f"[v0] Error during scraping: {e}")
            page.screenshot(path="scripts/error_screenshot.png")
            print("[v0] Error screenshot saved to: scripts/error_screenshot.png")
            return []
            
        finally:
            # Keep browser open for a moment to see results
            time.sleep(3)
            browser.close()
            print("\n[v0] Browser closed.")

def scrape_with_navigation():
    """
    Example of navigating to a specific section before scraping.
    """
    print("\n" + "=" * 60)
    print("ADVANCED: Navigation + Scraping")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # Example: Navigate to Sephora and find New Arrivals
            print("[v0] Navigating to Sephora...")
            page.goto("https://www.sephora.com", wait_until="networkidle")
            
            # Wait for page to load
            time.sleep(2)
            
            # Try to find and click "New" or "New Arrivals" link
            print("[v0] Looking for 'New Arrivals' section...")
            
            # Multiple strategies to find the link
            new_arrivals_selectors = [
                'a:has-text("New")',
                'a:has-text("New Arrivals")',
                'a[href*="new"]',
                'nav a:has-text("What\'s New")'
            ]
            
            for selector in new_arrivals_selectors:
                try:
                    element = page.query_selector(selector)
                    if element:
                        print(f"[v0] Found link with selector: {selector}")
                        element.click()
                        page.wait_for_load_state("networkidle")
                        print(f"[v0] Navigated to: {page.url}")
                        break
                except:
                    continue
            
            # Now scrape products from this page
            time.sleep(2)
            
            # Take screenshot of the new page
            page.screenshot(path="scripts/new_arrivals_page.png")
            print("[v0] Screenshot saved: scripts/new_arrivals_page.png")
            
            # Extract products (using similar logic as before)
            print("\n[v0] Scraping products from New Arrivals...")
            
            time.sleep(3)
            
        except Exception as e:
            print(f"[v0] Error: {e}")
        finally:
            browser.close()

def print_scraping_guide():
    """
    Print a comprehensive guide for web scraping.
    """
    guide = """
    
    ╔══════════════════════════════════════════════════════════════╗
    ║           WEB SCRAPING GUIDE FOR MAKEUP/FASHION              ║
    ╚══════════════════════════════════════════════════════════════╝
    
    📋 STEP-BY-STEP PROCESS:
    
    1. INSPECT THE WEBSITE
       • Open browser DevTools (F12)
       • Find the HTML structure of products
       • Note class names, IDs, and data attributes
    
    2. CHOOSE YOUR TOOL
       • Static sites (HTML only) → BeautifulSoup + Requests
       • Dynamic sites (JavaScript) → Playwright or Selenium
    
    3. WRITE THE SCRAPER
       • Navigate to the page
       • Wait for content to load
       • Select elements using CSS selectors
       • Extract text, attributes, and data
    
    4. HANDLE EDGE CASES
       • Add error handling (try/except)
       • Handle missing elements gracefully
       • Add delays to avoid rate limiting
    
    5. STORE THE DATA
       • Save to JSON, CSV, or database
       • Clean and validate data
    
    ⚖️  LEGAL & ETHICAL CONSIDERATIONS:
    
    ✓ Check robots.txt file (website.com/robots.txt)
    ✓ Read Terms of Service
    ✓ Add delays between requests (be respectful)
    ✓ Use data responsibly
    ✓ Don't overload servers
    
    🎯 COMMON SELECTORS FOR MAKEUP SITES:
    
    • Product containers: div.product, article.product-tile
    • Product names: h3.product-name, [data-comp="ProductName"]
    • Prices: span.price, [data-comp="Price"]
    • Images: img.product-image
    • Brands: span.brand-name
    
    🔧 PLAYWRIGHT TIPS:
    
    • page.wait_for_selector() - Wait for element to appear
    • page.click() - Click buttons/links
    • page.fill() - Fill form inputs
    • page.screenshot() - Debug visually
    • page.evaluate() - Run JavaScript on page
    
    📦 POPULAR SITES TO PRACTICE:
    
    • Sephora - https://www.sephora.com
    • Ulta - https://www.ulta.com
    • Vogue - https://www.vogue.com
    • WWD - https://wwd.com
    
    """
    print(guide)

# Main execution
if __name__ == "__main__":
    print_scraping_guide()
    
    print("\n" + "=" * 60)
    print("STARTING MAKEUP SCRAPER")
    print("=" * 60)
    
    # Example: Scrape from Sephora's new arrivals
    # Note: URL might need adjustment based on current site structure
    sephora_url = "https://www.sephora.com/shop/makeup-new-arrivals"
    
    products = scrape_makeup_products(sephora_url, max_products=5)
    
    if products:
        print("\n✅ Successfully scraped products!")
    else:
        print("\n⚠️  No products found. Try adjusting selectors for the specific site.")
        print("💡 Use the navigation example to find the right page first.")
    
    # Uncomment to try the navigation example
    # scrape_with_navigation()
