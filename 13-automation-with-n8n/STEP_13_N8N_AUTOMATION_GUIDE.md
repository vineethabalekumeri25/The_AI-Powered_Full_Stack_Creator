# Step 13: Automation with n8n

## Overview

This step demonstrates workflow automation using n8n, an open-source automation tool. You'll create a workflow that:
- Runs on a daily schedule (every day at 9:00 AM)
- Calls your FastAPI `/api/scrape-trends` endpoint
- Sends notifications to Discord/Slack when complete

## What You'll Learn

1. Setting up n8n with Docker Compose
2. Creating scheduled workflows with triggers
3. Making HTTP POST requests to your API
4. Sending notifications to external services
5. Building an automated trend scraping engine

---

## Architecture

\`\`\`
Daily Schedule (9:00 AM)
    ↓
n8n Workflow Trigger
    ↓
HTTP POST → FastAPI /api/scrape-trends
    ↓
Scrape Fashion Trends
    ↓
Discord/Slack Notification
    ↓
Success Message
\`\`\`

---

## Prerequisites

- Docker and Docker Compose installed
- FastAPI backend running on `localhost:8000`
- Discord webhook URL (optional, for notifications)
- Basic understanding of workflow automation

---

## Setup Instructions

### Task 1: n8n Setup

#### 1. Start n8n with Docker Compose

\`\`\`bash
cd n8n

# Start n8n container
docker compose up -d

# Check if container is running
docker ps
\`\`\`

You should see the n8n container running:
\`\`\`
CONTAINER ID   IMAGE              PORTS                    NAMES
abc123def456   n8nio/n8n:latest   0.0.0.0:5678->5678/tcp   n8n-style-journal
\`\`\`

#### 2. Access n8n Web Interface

Open your browser and navigate to:
\`\`\`
http://localhost:5678
\`\`\`

**Default credentials:**
- Username: `admin`
- Password: `stylejournal2024`

---

### Task 2: Create the Workflow

#### Option A: Import Pre-built Workflow

1. In n8n, click **"Workflows"** in the sidebar
2. Click **"Import from File"**
3. Select `n8n/workflows/daily-trend-scraper.json`
4. The workflow will be imported with all nodes configured

#### Option B: Build Workflow from Scratch

**Step 1: Add Schedule Trigger**

1. Click **"Add first step"**
2. Search for **"Schedule Trigger"**
3. Configure:
   - **Mode:** Cron Expression
   - **Cron Expression:** `0 9 * * *` (Daily at 9:00 AM)

**Step 2: Add HTTP Request Node**

1. Click the **"+"** button after Schedule Trigger
2. Search for **"HTTP Request"**
3. Configure:
   - **Method:** POST
   - **URL:** `http://host.docker.internal:8000/api/scrape-trends`
   - **Headers:** None required

**Step 3: Add Discord Notification Node**

1. Click the **"+"** button after HTTP Request
2. Search for **"Discord"**
3. Configure:
   - **Webhook URL:** Your Discord webhook URL
   - **Message:** Custom notification message

Example message:
\`\`\`
✅ Daily Fashion Trend Scraping Complete!

📊 Trends Found: {{ $json.trends_found }}
🕐 Timestamp: {{ $json.timestamp }}

The automated trend engine has successfully scraped the latest fashion trends.
\`\`\`

---

### Task 3: Set Up Discord Webhook (Optional)

#### Create Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** → **Integrations** → **Webhooks**
3. Click **"New Webhook"**
4. Name it: `Style Journal Automation`
5. Select the channel where notifications should appear
6. Copy the **Webhook URL**

#### Add Webhook to n8n

1. In the Discord node, paste your webhook URL
2. Customize the notification message
3. Save the workflow

---

### Alternative: Slack Notifications

If you prefer Slack over Discord:

1. Replace the Discord node with a **Slack** node
2. Configure Slack webhook URL
3. Customize message format for Slack

---

## Testing the Workflow

### Manual Test

1. In n8n workflow editor, click **"Execute Workflow"** button
2. Watch each node execute in sequence
3. Check Discord/Slack for notification
4. Verify the FastAPI endpoint was called

### Scheduled Test

1. Activate the workflow by toggling the switch
2. Wait for the scheduled time (9:00 AM)
3. Check logs in n8n → **Executions**
4. Verify notification was sent

### Test from Dashboard

1. Navigate to `http://localhost:3000/automation`
2. Click **"Trigger Manual Scraping"**
3. View scraped trends on the page
4. This tests the same endpoint n8n will call

---

## API Endpoint Details

### POST `/api/scrape-trends`

**Description:** Simulates scraping fashion trends from various sources

**Request:**
\`\`\`bash
curl -X POST http://localhost:8000/api/scrape-trends
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "message": "Trend scraping completed",
  "trends_found": 5,
  "trends": [
    {
      "id": 1,
      "source": "Vogue",
      "title": "Fashion Trend 1 - 2024-01-15",
      "description": "Auto-scraped trend from n8n workflow automation",
      "scraped_at": "2024-01-15T09:00:00",
      "popularity_score": 95
    }
  ],
  "timestamp": "2024-01-15T09:00:00"
}
\`\`\`

---

## n8n Configuration Reference

### Docker Compose Environment Variables

| Variable | Description | Value |
|----------|-------------|-------|
| `GENERIC_TIMEZONE` | Timezone for scheduled tasks | `America/New_York` |
| `N8N_BASIC_AUTH_ACTIVE` | Enable basic authentication | `true` |
| `N8N_BASIC_AUTH_USER` | Login username | `admin` |
| `N8N_BASIC_AUTH_PASSWORD` | Login password | `stylejournal2024` |
| `NODE_ENV` | Node environment | `production` |

### Cron Expression Examples

| Expression | Description |
|------------|-------------|
| `0 9 * * *` | Daily at 9:00 AM |
| `0 */6 * * *` | Every 6 hours |
| `0 9 * * 1` | Every Monday at 9:00 AM |
| `0 0 1 * *` | First day of every month |

---

## Troubleshooting

### Issue: n8n Can't Connect to FastAPI

**Solution:** Use `host.docker.internal` instead of `localhost` in the HTTP Request URL

\`\`\`
✅ http://host.docker.internal:8000/api/scrape-trends
❌ http://localhost:8000/api/scrape-trends
\`\`\`

### Issue: Workflow Not Executing on Schedule

**Solutions:**
1. Ensure workflow is **activated** (toggle switch on)
2. Check timezone settings match your local time
3. Verify cron expression is correct
4. Check n8n logs: `docker logs n8n-style-journal`

### Issue: Discord Notification Not Sending

**Solutions:**
1. Verify webhook URL is correct
2. Check Discord server permissions
3. Test webhook directly with curl:
   \`\`\`bash
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"content":"Test message"}'
   \`\`\`

### Issue: Permission Denied on Docker

**Solution:** Run with sudo or add user to docker group:
\`\`\`bash
sudo usermod -aG docker $USER
# Log out and back in
\`\`\`

---

## Project Structure

\`\`\`
12-real-time-features-and-design/
├── n8n/
│   ├── docker-compose.yml          # n8n container setup
│   ├── workflows/
│   │   └── daily-trend-scraper.json # Pre-built workflow
│   └── local-files/                # Shared files folder
├── scripts/
│   └── api.py                      # FastAPI with /api/scrape-trends
├── app/
│   └── automation/
│       └── page.tsx                # Automation dashboard
└── STEP_13_N8N_AUTOMATION_GUIDE.md
\`\`\`

---

## Next Steps

1. **Customize Scraping Logic:** Modify `/api/scrape-trends` to scrape real websites
2. **Add More Notifications:** Send emails, SMS, or push notifications
3. **Create Multiple Workflows:** Schedule different tasks at different times
4. **Data Storage:** Save scraped trends to a database
5. **Error Handling:** Add error notification workflows

---

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Workflow Templates](https://n8n.io/workflows)
- [Discord Webhooks Guide](https://support.discord.com/hc/en-us/articles/228383668)
- [Cron Expression Generator](https://crontab.guru/)

---

## Summary

You've successfully completed Step 13! You now have:

- ✅ n8n running in Docker
- ✅ Automated daily workflow with schedule trigger
- ✅ HTTP request integration with your FastAPI backend
- ✅ Discord/Slack notifications on completion
- ✅ Dashboard to monitor and manually trigger scraping

This automation engine can be extended to handle real-world scraping, data processing, and notification workflows.
