# Style Journal Backend - Python Scripts

This directory contains Python scripts for Phase 3: Python Backend with web scraping and asynchronous tasks.

## 📋 Prerequisites

- Python 3.8 or higher
- Redis server (for Celery background tasks)

## 🚀 Setup Instructions

### 1. Install Python Dependencies

\`\`\`bash
cd scripts
pip install -r requirements.txt
\`\`\`

### 2. Install Playwright Browsers (for dynamic scraping)

\`\`\`bash
playwright install
\`\`\`

### 3. Install and Start Redis

**On macOS (using Homebrew):**
\`\`\`bash
brew install redis
brew services start redis
\`\`\`

**On Ubuntu/Debian:**
\`\`\`bash
sudo apt-get install redis-server
sudo systemctl start redis
\`\`\`

**On Windows:**
Download from: https://redis.io/download
Or use Docker: `docker run -d -p 6379:6379 redis`

**Verify Redis is running:**
\`\`\`bash
redis-cli ping
# Should return: PONG
\`\`\`

## 📚 Phase 3 Learning Path

### Step 5: Python & FastAPI Basics

#### Task 1: Python Fundamentals
Run the example script:
\`\`\`bash
python fashion_news_scraper.py
\`\`\`

#### Task 2: Your First API
Start the FastAPI server:
\`\`\`bash
python api.py
\`\`\`

Visit: http://localhost:8000/docs for interactive API documentation

Test the `/api/trends` endpoint:
\`\`\`bash
curl http://localhost:8000/api/trends
\`\`\`

---

### Step 7: Web Scraping for Trends

#### Task 1: Static Scraping (BeautifulSoup)
\`\`\`bash
python fashion_news_scraper.py
\`\`\`

This script demonstrates:
- Using `requests` to fetch HTML
- Using `BeautifulSoup` to parse HTML
- Using `find()` and `find_all()` methods
- Extracting data from web pages

#### Task 2: Dynamic Scraping (Playwright)
\`\`\`bash
python makeup_products_scraper.py
\`\`\`

This script demonstrates:
- Browser automation with Playwright
- Scraping JavaScript-heavy websites
- Navigating to specific sections
- Extracting product data

---

### Step 8: Asynchronous Tasks (Celery & Redis)

#### Task 1: Setup Celery

**Terminal 1 - Start Celery Worker:**
\`\`\`bash
cd scripts
celery -A celery_app worker --loglevel=info
\`\`\`

You should see:
\`\`\`
[tasks]
  . scrape_trends_task
  . scrape_fashion_news_task
  . scrape_makeup_products_task
  . hello_task
\`\`\`

#### Task 2: Start FastAPI Server

**Terminal 2 - Start API Server:**
\`\`\`bash
python api.py
\`\`\`

Visit: http://localhost:8000/docs

#### Task 3: Trigger Background Tasks

**Test the system:**
\`\`\`bash
# Trigger scraping task
curl -X POST http://localhost:8000/api/scrape-trends

# Response will include a task_id:
# {"task_id":"abc-123","status":"pending","message":"..."}

# Check task status
curl http://localhost:8000/api/task-status/abc-123
\`\`\`

**Or use the interactive docs:**
1. Go to http://localhost:8000/docs
2. Click on `POST /api/scrape-trends`
3. Click "Try it out" → "Execute"
4. Copy the `task_id` from the response
5. Use `GET /api/task-status/{task_id}` to check progress

---

## 🎯 Creative Exercises

### Exercise 1: Fashion News Scraper
Modify `fashion_news_scraper.py` to scrape from your favorite fashion website.

### Exercise 2: Makeup Products Scraper
Update `makeup_products_scraper.py` to scrape from a different makeup brand.

### Exercise 3: Background Trend Hunter
Use the `/api/scrape-trends` endpoint to trigger scraping in the background.

---

## 📁 File Structure

\`\`\`
scripts/
├── README.md                      # This file
├── requirements.txt               # Python dependencies
├── fashion_news_scraper.py        # Step 7, Task 1: Static scraping
├── makeup_products_scraper.py     # Step 7, Task 2: Dynamic scraping
├── celery_app.py                  # Step 8: Celery configuration
├── tasks.py                       # Step 8: Background tasks
└── api.py                         # Step 5 & 8: FastAPI endpoints
\`\`\`

---

## 🔧 Troubleshooting

### Redis Connection Error
\`\`\`
Error: Error 111 connecting to localhost:6379. Connection refused.
\`\`\`
**Solution:** Make sure Redis is running: `redis-cli ping`

### Celery Worker Not Starting
**Solution:** Make sure you're in the `scripts` directory and Redis is running.

### Import Errors
**Solution:** Install all dependencies: `pip install -r requirements.txt`

### Playwright Browser Not Found
**Solution:** Install browsers: `playwright install`

---

## 🎓 Learning Objectives Completed

✅ Python fundamentals (lists, dictionaries, functions)
✅ FastAPI basics (endpoints, path operations, decorators)
✅ Static web scraping (requests, BeautifulSoup)
✅ Dynamic web scraping (Playwright)
✅ Asynchronous tasks (Celery, Redis)
✅ Background job processing
✅ REST API design

---

## 🚀 Next Steps

1. **Connect to Frontend**: Update your Next.js app to call these API endpoints
2. **Add Database**: Store scraped data in Supabase
3. **Deploy**: Deploy the API to a cloud platform
4. **Add Authentication**: Protect API endpoints with auth
5. **Add Scheduling**: Use Celery Beat for periodic scraping

---

## 📖 Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com
- Celery Documentation: https://docs.celeryq.dev
- BeautifulSoup Documentation: https://www.crummy.com/software/BeautifulSoup/
- Playwright Documentation: https://playwright.dev/python/
