"""
Static Web Scraping with BeautifulSoup
======================================
This script demonstrates how to scrape fashion headlines from a news website
using requests and BeautifulSoup for static HTML content.
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_fashion_headlines(url):
    """
    Scrape fashion headlines from a static HTML page.
    
    Args:
        url: The URL of the fashion news website
    """
    print(f"[v0] Fetching content from: {url}")
    
    # Set a user agent to avoid being blocked
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        # Make the HTTP request
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an error for bad status codes
        
        print(f"[v0] Status Code: {response.status_code}")
        print(f"[v0] Content Length: {len(response.content)} bytes\n")
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Example 1: Find all headline tags (common patterns)
        print("=" * 60)
        print("METHOD 1: Finding headlines by common HTML tags")
        print("=" * 60)
        
        headlines = []
        
        # Try multiple common patterns for headlines
        # Pattern 1: h2 tags with class containing 'title' or 'headline'
        for tag in soup.find_all(['h1', 'h2', 'h3'], class_=lambda x: x and ('title' in x.lower() or 'headline' in x.lower())):
            text = tag.get_text(strip=True)
            if text and len(text) > 10:  # Filter out very short text
                headlines.append(text)
        
        # Pattern 2: Article titles
        for article in soup.find_all('article'):
            title_tag = article.find(['h1', 'h2', 'h3'])
            if title_tag:
                text = title_tag.get_text(strip=True)
                if text and text not in headlines:
                    headlines.append(text)
        
        # Display found headlines
        if headlines:
            for i, headline in enumerate(headlines[:10], 1):
                print(f"{i}. {headline}")
        else:
            print("No headlines found with common patterns.")
        
        print("\n" + "=" * 60)
        print("METHOD 2: Finding all links (potential article links)")
        print("=" * 60)
        
        # Find all links that might be articles
        links = soup.find_all('a', href=True)
        article_links = []
        
        for link in links:
            href = link.get('href')
            text = link.get_text(strip=True)
            
            # Filter for likely article links
            if text and len(text) > 20 and len(text) < 200:
                article_links.append({
                    'title': text,
                    'url': href
                })
        
        # Display first 10 article links
        for i, article in enumerate(article_links[:10], 1):
            print(f"{i}. {article['title']}")
            print(f"   URL: {article['url'][:80]}...")
            print()
        
        print("\n" + "=" * 60)
        print("SCRAPING TIPS")
        print("=" * 60)
        print("1. Inspect the website's HTML structure using browser DevTools")
        print("2. Look for unique class names or IDs for the content you want")
        print("3. Use soup.find() for single elements, soup.find_all() for multiple")
        print("4. Always respect robots.txt and terms of service")
        print("5. Add delays between requests to avoid overwhelming servers")
        
        return headlines
        
    except requests.RequestException as e:
        print(f"[v0] Error fetching the page: {e}")
        return []

def scrape_with_specific_selectors():
    """
    Example of scraping with specific CSS selectors.
    This is a template you can customize for specific websites.
    """
    print("\n" + "=" * 60)
    print("TEMPLATE: Scraping with Specific Selectors")
    print("=" * 60)
    
    # Example template code
    template = """
    # After inspecting the target website, use specific selectors:
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find by class name
    headlines = soup.find_all('h2', class_='article-headline')
    
    # Find by ID
    main_story = soup.find('div', id='main-story')
    
    # Find by CSS selector
    articles = soup.select('article.fashion-post')
    
    # Extract data
    for article in articles:
        title = article.find('h2').get_text(strip=True)
        date = article.find('time')['datetime']
        author = article.find('span', class_='author').get_text(strip=True)
        
        print(f"Title: {title}")
        print(f"Date: {date}")
        print(f"Author: {author}")
    """
    
    print(template)

# Example usage with a fashion news website
if __name__ == "__main__":
    print("Fashion Headlines Scraper")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Example: Scraping from Vogue (for educational purposes)
    # Note: Always check robots.txt and terms of service before scraping
    url = "https://www.vogue.com/fashion"
    
    headlines = scrape_fashion_headlines(url)
    
    # Show the template for custom scraping
    scrape_with_specific_selectors()
    
    print("\n" + "=" * 60)
    print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
