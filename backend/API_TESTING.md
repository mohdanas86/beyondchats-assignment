# API Testing Guide

This guide provides comprehensive instructions for testing all API endpoints in the BeyondChats backend.

## Getting Started

### 1. Start the Server

```bash
cd backend
npm start
```

Server will run on `http://localhost:5000`

### 2. Verify Server is Running

```bash
curl http://localhost:5000/api/articles
```

Should return: `[]` (empty array if no articles)

## 📋 API Endpoints Overview

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/articles`     | Get all articles         |
| GET    | `/api/articles/:id` | Get single article by ID |
| POST   | `/api/articles`     | Create new article       |
| PUT    | `/api/articles/:id` | Update article by ID     |
| DELETE | `/api/articles/:id` | Delete article by ID     |

## 🧪 Testing Commands

### 1. Get All Articles

```bash
curl -X GET http://localhost:5000/api/articles \
  -H "Content-Type: application/json"
```

**Expected Response (empty):**

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**Expected Response (with data):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Sample Article 1",
      "content": "<p>Article content...</p>",
      "url": "https://example.com/article1",
      "publishedAt": "2025-12-29T10:00:00.000Z",
      "version": "original",
      "createdAt": "2025-12-29T10:00:00.000Z",
      "updatedAt": "2025-12-29T10:00:00.000Z"
    }
  ]
}
```

### 2. Create a New Article

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "<p>This is a test article content.</p>",
    "url": "https://example.com/test-article",
    "publishedAt": "2025-12-29T12:00:00.000Z"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Test Article",
    "content": "<p>This is a test article content.</p>",
    "url": "https://example.com/test-article",
    "publishedAt": "2025-12-29T12:00:00.000Z",
    "version": "original",
    "createdAt": "2025-12-29T12:00:00.000Z",
    "updatedAt": "2025-12-29T12:00:00.000Z"
  }
}
```

### 3. Get Single Article by ID

```bash
# Replace ARTICLE_ID with the actual ID from the create response
curl -X GET http://localhost:5000/api/articles/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Test Article",
    "content": "<p>This is a test article content.</p>",
    "url": "https://example.com/test-article",
    "publishedAt": "2025-12-29T12:00:00.000Z",
    "version": "original",
    "createdAt": "2025-12-29T12:00:00.000Z",
    "updatedAt": "2025-12-29T12:00:00.000Z"
  }
}
```

### 4. Update an Article

```bash
# Replace ARTICLE_ID with the actual ID
curl -X PUT http://localhost:5000/api/articles/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Article",
    "content": "<p>This is updated content.</p>"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Test Article",
    "content": "<p>This is updated content.</p>",
    "url": "https://example.com/test-article",
    "publishedAt": "2025-12-29T12:00:00.000Z",
    "version": "original",
    "createdAt": "2025-12-29T12:00:00.000Z",
    "updatedAt": "2025-12-29T12:05:00.000Z"
  }
}
```

### 5. Delete an Article

```bash
# Replace ARTICLE_ID with the actual ID
curl -X DELETE http://localhost:5000/api/articles/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

### 6. Test Error Responses

#### Get Non-existent Article

```bash
curl -X GET http://localhost:5000/api/articles/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Article not found"
}
```

#### Create Article with Missing Required Fields

```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Article"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Bad Request",
  "error": "Article validation failed: content: Content is required, url: URL is required, publishedAt: Published date is required"
}
```

#### Update Non-existent Article

```bash
curl -X PUT http://localhost:5000/api/articles/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Article not found"
}
```

#### Delete Non-existent Article

```bash
curl -X DELETE http://localhost:5000/api/articles/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "success": false,
  "message": "Article not found"
}
```

## 🔄 Testing the Scraper

### Run the Scraper

```bash
npm run scrape
```

**Expected Output:**

```
Initializing scraper...
Starting article scraping...
MongoDB connected successfully
Found X articles to scrape
Scraping article: https://beyondchats.com/article-url
Successfully scraped and saved: Article Title
Article scraping completed successfully
Scraper execution completed
```

### Verify Scraped Data

After running the scraper, check if articles were added:

```bash
curl -X GET http://localhost:5000/api/articles \
  -H "Content-Type: application/json"
```

## 🛠️ Using Postman/Insomnia

If you prefer GUI tools:

1. **Import Collection:**

   - Create a new collection called "BeyondChats API"
   - Add requests for each endpoint above

2. **Set Base URL:**

   - `http://localhost:5000`

3. **Headers:**

   - `Content-Type: application/json`

4. **Example Request:**
   - Method: POST
   - URL: `{{base_url}}/api/articles`
   - Body: Raw JSON with article data

## 📊 Data Validation

### Article Schema Requirements:

- `title`: Required, String, max 200 chars
- `content`: Required, String (HTML)
- `url`: Required, String, unique
- `publishedAt`: Required, String (ISO date)
- `version`: Optional, String (default: "original")

### Response Format:

All responses follow this structure:

```json
{
  "success": boolean,
  "data": object|array|null,
  "message": string, // Only on success/error
  "count": number,   // Only on GET all
  "error": string    // Only on error
}
```

## 🚨 Common Issues & Solutions

### Server Not Starting

- Check if MongoDB is running
- Verify `.env` file exists with correct `MONGODB_URI`
- Check for port conflicts (default: 5000)

### Database Connection Errors

- Ensure MongoDB is installed and running
- Check `MONGODB_URI` in `.env` file
- Verify network connectivity for cloud databases

### Scraper Not Finding Articles

- Website structure may have changed
- Check network connectivity
- Update CSS selectors in `scrapeBeyondChats.js`

### CORS Issues (when connecting frontend)

- CORS is enabled by default
- Check browser console for CORS errors
- Ensure frontend is running on different port

## Testing Checklist

- [ ] Server starts successfully
- [ ] GET /api/articles returns empty array initially
- [ ] POST /api/articles creates new article
- [ ] GET /api/articles/:id returns single article
- [ ] PUT /api/articles/:id updates article
- [ ] DELETE /api/articles/:id removes article
- [ ] Error responses work correctly
- [ ] Scraper runs without errors
- [ ] Scraped data appears in API responses

## 🎯 Quick Test Script

Create a `test-api.sh` file:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api/articles"

echo "Testing BeyondChats API..."

# Test GET all (should be empty)
echo "1. Getting all articles..."
curl -s $BASE_URL | jq '.count'

# Test POST
echo "2. Creating article..."
RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"<p>Test</p>","url":"http://test.com","publishedAt":"2025-01-01T00:00:00.000Z"}')

ID=$(echo $RESPONSE | jq -r '.data._id')
echo "Created article with ID: $ID"

# Test GET single
echo "3. Getting single article..."
curl -s $BASE_URL/$ID | jq '.success'

# Test PUT
echo "4. Updating article..."
curl -s -X PUT $BASE_URL/$ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Test"}' | jq '.success'

# Test DELETE
echo "5. Deleting article..."
curl -s -X DELETE $BASE_URL/$ID | jq '.success'

echo "API testing completed!"
```

Run with: `chmod +x test-api.sh && ./test-api.sh`
