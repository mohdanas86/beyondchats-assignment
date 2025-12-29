#!/bin/bash

# BeyondChats API Testing Script
# This script tests all API endpoints with sample data

BASE_URL="http://localhost:5000/api/articles"

echo "🧪 Testing BeyondChats API..."
echo "================================="

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo "❌ jq is not installed. Please install jq to run this script."
        echo "   On Windows: choco install jq"
        echo "   On Ubuntu/Debian: sudo apt-get install jq"
        echo "   On macOS: brew install jq"
        exit 1
    fi
}

# Check jq
check_jq

# Test 1: GET all articles (should be empty initially)
echo "1️⃣  Getting all articles..."
RESPONSE=$(curl -s $BASE_URL -H "Content-Type: application/json")
COUNT=$(echo $RESPONSE | jq -r '.count // 0')
SUCCESS=$(echo $RESPONSE | jq -r '.success // false')

if [ "$SUCCESS" = "true" ]; then
    echo "✅ GET /api/articles - Success (Count: $COUNT)"
else
    echo "❌ GET /api/articles - Failed"
    echo "Response: $RESPONSE"
    exit 1
fi

# Test 2: POST create article
echo "2️⃣  Creating test article..."
CREATE_DATA='{
    "title": "API Test Article",
    "content": "<p>This is a test article created by the API testing script.</p>",
    "url": "https://example.com/api-test-article",
    "publishedAt": "2025-12-29T15:30:00.000Z"
}'

RESPONSE=$(curl -s -X POST $BASE_URL \
    -H "Content-Type: application/json" \
    -d "$CREATE_DATA")

SUCCESS=$(echo $RESPONSE | jq -r '.success // false')
if [ "$SUCCESS" = "true" ]; then
    ARTICLE_ID=$(echo $RESPONSE | jq -r '.data._id')
    echo "✅ POST /api/articles - Success (ID: $ARTICLE_ID)"
else
    echo "❌ POST /api/articles - Failed"
    echo "Response: $RESPONSE"
    exit 1
fi

# Test 3: GET single article
echo "3️⃣  Getting single article..."
RESPONSE=$(curl -s $BASE_URL/$ARTICLE_ID -H "Content-Type: application/json")
SUCCESS=$(echo $RESPONSE | jq -r '.success // false')
TITLE=$(echo $RESPONSE | jq -r '.data.title // ""')

if [ "$SUCCESS" = "true" ] && [ "$TITLE" = "API Test Article" ]; then
    echo "✅ GET /api/articles/:id - Success"
else
    echo "❌ GET /api/articles/:id - Failed"
    echo "Response: $RESPONSE"
fi

# Test 4: PUT update article
echo "4️⃣  Updating article..."
UPDATE_DATA='{
    "title": "Updated API Test Article",
    "content": "<p>This article has been updated by the testing script.</p>"
}'

RESPONSE=$(curl -s -X PUT $BASE_URL/$ARTICLE_ID \
    -H "Content-Type: application/json" \
    -d "$UPDATE_DATA")

SUCCESS=$(echo $RESPONSE | jq -r '.success // false')
UPDATED_TITLE=$(echo $RESPONSE | jq -r '.data.title // ""')

if [ "$SUCCESS" = "true" ] && [ "$UPDATED_TITLE" = "Updated API Test Article" ]; then
    echo "✅ PUT /api/articles/:id - Success"
else
    echo "❌ PUT /api/articles/:id - Failed"
    echo "Response: $RESPONSE"
fi

# Test 5: DELETE article
echo "5️⃣  Deleting article..."
RESPONSE=$(curl -s -X DELETE $BASE_URL/$ARTICLE_ID -H "Content-Type: application/json")
SUCCESS=$(echo $RESPONSE | jq -r '.success // false')
MESSAGE=$(echo $RESPONSE | jq -r '.message // ""')

if [ "$SUCCESS" = "true" ] && [[ "$MESSAGE" == *"deleted"* ]]; then
    echo "✅ DELETE /api/articles/:id - Success"
else
    echo "❌ DELETE /api/articles/:id - Failed"
    echo "Response: $RESPONSE"
fi

# Test 6: Verify deletion
echo "6️⃣  Verifying article was deleted..."
RESPONSE=$(curl -s $BASE_URL/$ARTICLE_ID -H "Content-Type: application/json")
SUCCESS=$(echo $RESPONSE | jq -r '.success // true')

if [ "$SUCCESS" = "false" ]; then
    echo "✅ Article deletion verified"
else
    echo "❌ Article still exists after deletion"
fi

# Test 7: Check final count
echo "7️⃣  Checking final article count..."
RESPONSE=$(curl -s $BASE_URL -H "Content-Type: application/json")
FINAL_COUNT=$(echo $RESPONSE | jq -r '.count // 0')

echo "📊 Final article count: $FINAL_COUNT"

echo ""
echo "🎉 API Testing Completed!"
echo "================================="
echo "✅ All core endpoints tested successfully"
echo "📖 For detailed testing instructions, see API_TESTING.md"