"""
Phase 3 - Step 7: Web Scraping for Trends
Task 1: Static Scraping with requests and BeautifulSoup

This script demonstrates how to scrape fashion news headlines from a website.
We'll use requests to fetch HTML and BeautifulSoup to parse it.
"""

import requests
from bs4 import BeautifulSoup
from typing import List, Dict

def scrape_fashion_headlines(url: str) -> List[Dict[str, str]]:
    """
    Scrapes fashion news headlines from a given URL.
    
    Args:
        url: The URL of the fashion news website
        
    Returns:
        List of dictionaries containing headline data
    """
    print(f"[v0] Fetching content from: {url}")
    
    # Step 1: Send HTTP GET request to fetch the webpage
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    
    # Step 2: Check if request was successful
    if response.status_code != 200:
        print(f"[v0] Error: Failed to fetch page (Status: {response.status_code})")
        return []
    
    print(f"[v0] Successfully fetched page content")
    
    # Step 3: Parse HTML content with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Step 4: Find all headline elements
    # Note: These selectors are examples - adjust based on actual website structure
    headlines = []
    
    # Example 1: Find headlines by class name
    articles = soup.find_all('article', class_='post')
    
    for article in articles[:10]:  # Limit to first 10 headlines
        # Extract headline text
        title_element = article.find('h2') or article.find('h3')
        if title_element:
            title = title_element.get_text(strip=True)
            
            # Extract link if available
            link_element = article.find('a')
            link = link_element['href'] if link_element and link_element.get('href') else ''
            
            # Extract description/excerpt if available
            desc_element = article.find('p', class_='excerpt')
            description = desc_element.get_text(strip=True) if desc_element else ''
            
            headlines.append({
                'title': title,
                'link': link,
                'description': description
            })
    
    print(f"[v0] Found {len(headlines)} headlines")
    return headlines


def scrape_vogue_example():
    """
    Example: Scraping fashion headlines from Vogue
    Note: This is a demonstration - actual selectors may vary
    """
    # Using a demo fashion blog for educational purposes
    url = "https://www.vogue.com/fashion"
    
    try:
        headlines = scrape_fashion_headlines(url)
        
        print("\n--- Fashion News Headlines ---")
        for i, headline in enumerate(headlines, 1):
            print(f"\n{i}. {headline['title']}")
            if headline['description']:
                print(f"   {headline['description'][:100]}...")
            if headline['link']:
                print(f"   Link: {headline['link']}")
                
    except Exception as e:
        print(f"[v0] Error during scraping: {e}")


# --- Educational Examples ---

def example_beautifulsoup_basics():
    """
    Demonstrates basic BeautifulSoup methods for parsing HTML
    """
    html_content = """
    <html>
        <body>
            <div class="fashion-article">
                <h2>Spring 2025 Fashion Trends</h2>
                <p class="author">By Jane Doe</p>
                <p class="content">Discover the hottest trends for spring...</p>
            </div>
            <div class="fashion-article">
                <h2>Sustainable Fashion Guide</h2>
                <p class="author">By John Smith</p>
                <p class="content">Learn about eco-friendly fashion choices...</p>
            </div>
        </body>
    </html>
    """
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    print("\n--- BeautifulSoup Basics ---")
    
    # find() - Returns first matching element
    first_article = soup.find('div', class_='fashion-article')
    print(f"First article title: {first_article.find('h2').text}")
    
    # find_all() - Returns all matching elements
    all_articles = soup.find_all('div', class_='fashion-article')
    print(f"\nTotal articles found: {len(all_articles)}")
    
    # Iterate through all articles
    for article in all_articles:
        title = article.find('h2').text
        author = article.find('p', class_='author').text
        print(f"- {title} ({author})")


if __name__ == "__main__":
    print("=== Phase 3: Web Scraping for Fashion Trends ===\n")
    
    # Run BeautifulSoup basics example
    example_beautifulsoup_basics()
    
    # Note: Uncomment to run live scraping (requires internet connection)
    # scrape_vogue_example()
    
    print("\n✓ Script completed successfully!")
