# BeyondChats Backend - Development Workflow

This document explains the step-by-step process for working with this project, from setup to deployment.

## Quick Start

If you're in a hurry:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key

# 3. Run the scraper
npm run scrape

# 4. Enhance articles with AI
npm run phase2

# 5. Start the server
npm start
```

## Detailed Workflow

### 1. Environment Setup

First, you need to set up your development environment:

**MongoDB Setup:**

- Get a MongoDB Atlas account (free tier works)
- Create a cluster
- Get your connection string
- Add it to `.env` as `MONGODB_URI`

**Gemini AI Setup:**

- Go to Google AI Studio
- Create an API key
- Add it to `.env` as `GEMINI_API_KEY`

**Environment File:**

```bash
cp .env.example .env
# Edit the .env file with your actual values
```

### 2. Phase 1: Article Scraping

The scraping process has a few steps:

```bash
npm run scrape
```

**What happens:**

1. Launches a headless browser
2. Goes to beyondchats.com/blogs
3. Finds the pagination (last page)
4. Extracts URLs of the 5 oldest articles
5. Visits each article page
6. Scrapes title, content, and metadata
7. Saves to MongoDB

**Expected output:**

```
Starting article scraping...
Step 1: Loading blogs listing page...
Step 2: Finding pagination and navigating to last page...
Found last page: /blogs/page/5
Step 3: Extracting 5 oldest article URLs...
Found 5 articles to scrape
Step 4: Scraping individual articles...
Article 1: "Which AI Chatbot Is Right for Your Business in 2025?"
Article 2: "From 0 to Sales Hero: How Sales Chatbots Increase Conversions"
...
Scraping completed! 5 articles saved.
```

### 3. Phase 2: AI Enhancement

Once you have articles, enhance them:

```bash
npm run phase2
```

**What happens:**

1. Fetches all articles from database
2. For each article:
   - Searches for similar content online
   - Scrapes reference articles
   - Uses Gemini AI to rewrite professionally
   - Adds citations
   - Updates the database

**Expected output:**

```
Starting Phase 2: Article Enhancement Process
Connected to database
Found 5 articles to process

Processing article: "Which AI Chatbot Is Right for Your Business in 2025?"
   Found 2 reference articles
   Successfully scraped 2 articles
   Rewriting article with AI...
   Updating article in database...
   Article successfully updated!

Phase 2 processing completed!
```

### 4. API Testing

Start the server and test the API:

```bash
npm start
```

**Test endpoints:**

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get specific article
curl http://localhost:5000/api/articles/[ID]

# Create new article
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

### 5. Development Mode

For development with auto-restart:

```bash
npm run dev
```

This uses Node's `--watch` flag to restart on file changes.

## Troubleshooting

### Scraper Issues

**"No articles found"**

- Check if beyondchats.com/blogs is accessible
- Pagination might have changed - check the selectors

**"Browser launch failed"**

- Make sure you have enough RAM
- Try running with `headless: false` temporarily

### Phase 2 Issues

**"Gemini API error"**

- Check your API key in .env
- Make sure you have credits/quota

**"No reference articles found"**

- The search URLs might be outdated
- Check internet connection

### Database Issues

**"Connection failed"**

- Verify MongoDB URI in .env
- Check network connectivity
- Make sure MongoDB Atlas IP whitelist includes your IP

## File Structure Reference

```
backend/
├── src/
│   ├── config/db.js           # Database connection
│   ├── controllers/
│   │   └── articleController.js  # CRUD operations
│   ├── models/articals.js     # Article schema
│   ├── routers/articleRoutes.js  # API routes
│   ├── scraper/scrapeBeyondChats.js  # Scraping logic
│   └── scripts/phase2Processor.js    # AI enhancement
├── doc/
│   ├── architecture.md        # This file
│   └── workflow.md           # You're reading it
├── .env                       # Environment vars
├── app.js                     # Server setup
└── package.json              # Dependencies
```

## Common Tasks

### Adding New Articles Manually

```javascript
// Via API
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "content": "Article content...",
    "url": "https://example.com",
    "publishedAt": "2024-01-01"
  }'
```

### Checking Article Count

```bash
# Via API
curl http://localhost:5000/api/articles | jq '.count'

# Via MongoDB shell
mongosh "your-connection-string"
use beyondchats
db.articles.countDocuments()
```

### Resetting Data

```javascript
// Clear all articles
curl -X DELETE http://localhost:5000/api/articles/[ID]
// Repeat for each article
```

## Performance Notes

- Scraping takes 30-60 seconds per article
- Phase 2 takes 2-3 minutes per article (due to AI processing)
- API responses are typically <100ms
- Database queries are optimized with indexes

## Deployment Checklist

- [ ] Environment variables set
- [ ] MongoDB accessible
- [ ] Gemini API key valid
- [ ] All dependencies installed
- [ ] Scraper tested
- [ ] Phase 2 tested
- [ ] API endpoints working
- [ ] Error handling verified
