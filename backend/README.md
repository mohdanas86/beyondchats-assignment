# BeyondChats Backend API

A Node.js backend API for scraping and managing articles from BeyondChats website, with AI-powered content enhancement.

## Features

- RESTful API for article management
- Web scraping functionality to collect articles from BeyondChats
- AI-powered article enhancement using Google Gemini
- Google search integration for content research
- MongoDB integration with Mongoose
- CORS enabled for frontend integration
- Comprehensive error handling and validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Puppeteer** - Browser automation for scraping
- **Google Generative AI (Gemini)** - AI content enhancement
- **Axios** - HTTP client
- **Cheerio** - HTML parsing

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configurations:
   - `MONGODB_URI` - Your MongoDB connection string
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `PORT` - Server port (optional, defaults to 5000)

## Usage

### Phase 1: Basic Setup

#### Start the Server

```bash
npm start
```

#### Development Mode (with auto-restart)

```bash
npm run dev
```

#### Run the Initial Scraper

```bash
npm run scrape
```

This scrapes up to 5 articles from BeyondChats blogs page and stores them in the database. Uses Puppeteer for reliable scraping of dynamic content.

### Phase 2: AI Content Enhancement

#### Run the Article Enhancement Process

```bash
npm run phase2
```

This process:

1. Fetches all articles from your API
2. Searches Google for similar articles
3. Scrapes content from top 2 results
4. Uses Gemini AI to rewrite articles in similar style
5. Updates articles with enhanced content and citations

#### Prerequisites for Phase 2

- Articles must exist in database (run scraper first)
- Valid `GEMINI_API_KEY` in `.env` (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Internet connection for search and scraping

#### Current Status: ✅ **WORKING**

Phase 2 successfully processes all articles with AI enhancement!

### Testing

#### Run API Tests

```bash
npm test
```

This runs automated tests for all API endpoints.

## API Endpoints

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article by ID
- `POST /api/articles` - Create a new article
- `PUT /api/articles/:id` - Update an article by ID
- `DELETE /api/articles/:id` - Delete an article by ID

### Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "data": {...} | [...],
  "message": "Optional message",
  "count": "Number of items (for GET all)",
  "error": "Error message (if applicable)"
}
```

## Phase 2: AI Enhancement Details

The Phase 2 processor performs the following steps for each article:

1. **Google Search**: Searches for the article title + "blog article"
2. **Content Discovery**: Extracts top 2 relevant blog/article URLs
3. **Content Scraping**: Scrapes main content from discovered articles
4. **AI Rewriting**: Uses Gemini to rewrite the original article matching the style of reference articles
5. **Citation Addition**: Adds references to the bottom of the enhanced article
6. **Database Update**: Updates the article with version "updated"

### AI Prompt Strategy

- Maintains original facts and information
- Improves readability and engagement
- Matches professional writing style of reference articles
- Adds proper formatting and structure
- Includes citations for transparency

## Testing

For comprehensive API testing instructions, including sample requests, expected responses, and error handling examples, see [API_TESTING.md](./API_TESTING.md).

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   └── articleController.js  # Article CRUD operations
│   ├── models/
│   │   └── articals.js        # Article Mongoose schema
│   ├── routers/
│   │   └── articleRoutes.js   # API routes
│   ├── scraper/
│   │   └── scrapeBeyondChats.js  # Web scraping logic
│   └── runScraper.js          # Scraper runner script
├── .env.example               # Environment variables template
├── app.js                     # Main application file
└── package.json               # Dependencies and scripts
```

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)
- `GEMINI_API_KEY` - Google Gemini API key (required for Phase 2)
- `PORT` - Server port (optional, defaults to 5000)
- `API_BASE_URL` - Base URL for API calls (optional, defaults to localhost:5000)

## Error Handling

The API includes comprehensive error handling:

- 400 Bad Request - Validation errors
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server errors

## Contributing

1. Follow ES6+ syntax and module imports
2. Add JSDoc comments for functions
3. Include error handling in all async operations
4. Test API endpoints thoroughly

## License

ISC
