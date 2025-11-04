# Web Scraping for Fashion & Makeup Trends

This folder contains Python scripts to learn web scraping techniques for fashion and makeup trend analysis.

## 📁 Files

1. **01_static_scraping_fashion.py** - Learn BeautifulSoup for static HTML scraping
2. **02_dynamic_scraping_makeup.py** - Learn Playwright for JavaScript-rendered sites
3. **03_scraping_exercises.py** - Practice exercises to master scraping

## 🚀 Getting Started

### Prerequisites

Install required packages:
\`\`\`bash
pip install requests beautifulsoup4 playwright
playwright install chromium
\`\`\`

### Running the Scripts

Execute scripts from the Code Project interface by clicking the "Run" button, or run them locally:

\`\`\`bash
python scripts/01_static_scraping_fashion.py
python scripts/02_dynamic_scraping_makeup.py
python scripts/03_scraping_exercises.py
\`\`\`

## 📖 Learning Path

### Task 1: Static Scraping (BeautifulSoup)
- **Script**: `01_static_scraping_fashion.py`
- **Learn**: HTTP requests, HTML parsing, CSS selectors
- **Exercise**: Scrape fashion headlines from news sites

### Task 2: Dynamic Scraping (Playwright)
- **Script**: `02_dynamic_scraping_makeup.py`
- **Learn**: Browser automation, JavaScript handling, navigation
- **Exercise**: Scrape makeup products from brand websites

### Task 3: Practice Exercises
- **Script**: `03_scraping_exercises.py`
- **Complete**: 5 exercises + 1 bonus project
- **Build**: A complete makeup trend analysis tool

## 🎯 Key Concepts

### BeautifulSoup Methods
- `soup.find()` - Find first matching element
- `soup.find_all()` - Find all matching elements
- `soup.select()` - Use CSS selectors
- `.get_text()` - Extract text content
- `.get()` - Get attribute values

### Playwright Methods
- `page.goto()` - Navigate to URL
- `page.wait_for_selector()` - Wait for element
- `page.query_selector()` - Find element
- `page.click()` - Click element
- `page.screenshot()` - Take screenshot for debugging

## ⚖️ Legal & Ethical Guidelines

✅ **DO:**
- Check `robots.txt` before scraping
- Read Terms of Service
- Add delays between requests
- Use data responsibly
- Respect rate limits

❌ **DON'T:**
- Overload servers with requests
- Scrape personal/private data
- Ignore copyright restrictions
- Bypass authentication without permission

## 🔍 Debugging Tips

1. **Use screenshots**: `page.screenshot(path="debug.png")`
2. **Print HTML structure**: `print(soup.prettify())`
3. **Check selectors**: Use browser DevTools (F12)
4. **Add logging**: Use `print("[v0] ...")` statements
5. **Start small**: Test on one element before scaling

## 📊 Example Output

After running the scripts, you'll get:
- `makeup_products.json` - Scraped product data
- `makeup_page_screenshot.png` - Visual debugging
- Console output with scraped information

## 🎓 Next Steps

1. Complete all exercises in order
2. Try scraping different websites
3. Build your own trend analysis tool
4. Combine data from multiple sources
5. Create visualizations of trends

## 🆘 Troubleshooting

**Problem**: "No products found"
- **Solution**: Inspect the website's HTML structure and update selectors

**Problem**: "Timeout error"
- **Solution**: Increase timeout or check internet connection

**Problem**: "403 Forbidden"
- **Solution**: Add proper User-Agent headers

**Problem**: "Element not found"
- **Solution**: Add `page.wait_for_selector()` before accessing elements

## 📚 Resources

- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Playwright Documentation](https://playwright.dev/python/)
- [CSS Selectors Reference](https://www.w3schools.com/cssref/css_selectors.php)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

Happy Scraping! 🎨💄
