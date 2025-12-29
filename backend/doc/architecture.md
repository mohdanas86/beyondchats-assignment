# BeyondChats Backend - Architecture & Workflow

Hey there! This is a simple Node.js backend I built for scraping and managing articles from BeyondChats. Let me walk you through how everything works.

## Project Overview

This is basically a two-phase project:

1. **Phase 1**: Scrape articles from BeyondChats blog and store them
2. **Phase 2**: Use AI to enhance those articles with better writing and citations

## Architecture

### Tech Stack

- **Node.js** with ES modules (no more CommonJS headaches)
- **Express.js** for the API
- **MongoDB** with Mongoose for data storage
- **Puppeteer** for web scraping (handles dynamic content)
- **Google Gemini AI** for content enhancement

### Folder Structure

```
backend/
├── src/
│   ├── config/          # Database connection stuff
│   ├── controllers/     # API logic (CRUD operations)
│   ├── models/          # MongoDB schemas
│   ├── routers/         # API routes
│   ├── scraper/         # Web scraping logic
│   └── scripts/         # Phase 2 processing
├── doc/                 # Documentation (you're reading this!)
├── .env                 # Environment variables
└── app.js              # Main server file
```

## How It All Works

### Phase 1: Article Scraping

The scraper does this in steps:

1. **Load the blogs page** - Goes to beyondchats.com/blogs
2. **Find the last page** - Pagination can be tricky, tries multiple selectors
3. **Get oldest article URLs** - Scrapes the last page to find the 5 oldest posts
4. **Scrape each article** - Visits each URL and extracts title, content, date
5. **Save to database** - Stores everything in MongoDB

**Key Challenge**: Getting the oldest articles means finding the last page of pagination, which changes as new posts are added.

### Phase 2: AI Enhancement

This is where it gets interesting:

1. **Fetch articles** - Gets all articles from the database
2. **Search for references** - Uses curated URLs based on article topics (chatbots, sales, etc.)
3. **Scrape reference content** - Gets content from similar articles online
4. **AI rewriting** - Gemini AI rewrites the original article to match professional style
5. **Add citations** - Includes references at the bottom
6. **Update database** - Saves the enhanced version

**Why this approach?** Instead of just asking AI to "improve" the article, we give it real examples of good writing to learn from.

## Database Schema

Articles have these fields:

- `title` - Article headline
- `content` - The full text
- `url` - Original source URL
- `publishedAt` - When it was published
- `version` - "original" or "enhanced"
- `source` - Where it came from (scraped from BeyondChats)

## API Endpoints

Simple REST API:

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get one article
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

All responses follow the same format:

```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

## Workflow

### Development Setup

1. Clone the repo
2. `npm install` - get all dependencies
3. Copy `.env.example` to `.env` and fill in your keys
4. `npm run scrape` - get some articles
5. `npm run phase2` - enhance them with AI
6. `npm start` - run the API server

### Production Deployment

- Set environment variables (MongoDB URI, Gemini API key)
- Run the scraper first to populate data
- Then run Phase 2 for enhancement
- Start the server

## Challenges I Faced

1. **Pagination Detection**: BeyondChats pagination wasn't straightforward. Had to try multiple selectors and handle different page structures.

2. **Content Extraction**: Articles have different layouts. Used multiple CSS selectors as fallbacks.

3. **Rate Limiting**: Added delays between requests to be respectful to external sites.

4. **AI Prompt Engineering**: Getting Gemini to rewrite articles properly while keeping the original meaning was tricky.

## What I Learned

- Web scraping is messy - always have fallback selectors
- AI works better with concrete examples than vague instructions
- Pagination logic can be complicated
- Error handling is crucial for scraping
- MongoDB is great for this kind of data

## Future Improvements

If I had more time, I'd:

- Add more robust error recovery
- Implement caching for scraped content
- Add content validation before saving
- Create a simple frontend to view articles
- Add more sophisticated search for Phase 2

This was a fun project that covered web scraping, APIs, databases, and AI integration!
