# BeyondChats – Full Stack Article Management Assignment

This repository contains my submission for the **Full Stack Web Developer Intern assignment at BeyondChats**.

The project demonstrates an end-to-end workflow involving backend scraping, API development, automation with AI, and a lightweight frontend to consume and display the processed data.

---

## Project Overview

The application is implemented in **three phases**:

1. **Backend scraping and APIs**  
   Scrape the five oldest articles from the BeyondChats blog, store them in a database, and expose RESTful CRUD APIs.

2. **Automation and AI enhancement**  
   A Node.js script fetches articles from the APIs, finds related top-ranking articles on Google, analyzes their structure, and uses an LLM (Gemini) to enhance the original content while preserving originality.

3. **Frontend**  
   A simple React application that displays both the original and AI-enhanced versions of articles in a responsive interface.

The focus of this assignment is **backend correctness, automation logic, and clean data flow**, rather than UI complexity.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Axios & Cheerio (scraping)
- Google Gemini API (content enhancement)

### Frontend

- React (Vite)
- Axios
- Basic responsive CSS

---

## High-Level Architecture

```

BeyondChats Blog
↓
Scraper (Node + Cheerio)
↓
MongoDB (Articles)
↓
REST APIs (Express)
↓
Automation Script (Google Search + LLM)
↓
Updated Articles
↓
React Frontend

```

---

## Backend Responsibilities

### Phase 1 – Article Scraping

- Navigate to the **last page** of the BeyondChats blog
- Extract **exactly five oldest articles**
- Scrape:
  - Title
  - Main content
  - URL
  - Published date (if available)
- Store articles in MongoDB with `version = "original"`

### Phase 2 – Automation & AI Processing

- Fetch articles using internal APIs
- Search Google using the article title
- Select the first two relevant blog/article results
- Scrape their main content
- Use Gemini AI to:
  - Improve structure and formatting
  - Match the depth of top-ranking articles
  - Preserve originality (no plagiarism)
- Store enhanced content with `version = "updated"`
- Append reference URLs at the end of the article

---

## API Endpoints

```

GET    /api/articles
GET    /api/articles/:id
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id

```

Each article is versioned (`original` / `updated`) to support comparison in the frontend.

---

## Data Model (Article)

```json
{
  "title": "string",
  "content": "string (HTML / Markdown)",
  "url": "string",
  "publishedAt": "string",
  "version": "original | updated",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## Frontend Overview (Phase 3)

- Fetches data from backend APIs
- Displays a list of articles
- Allows viewing both original and updated versions
- Responsive layout focused on readability

The frontend is intentionally minimal to keep the emphasis on backend and automation logic.

---

## Running the Project Locally

### Prerequisites

- Node.js
- MongoDB
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Run Article Scraper

```bash
npm run scrape
```

### Run AI Enhancement Script

```bash
npm run phase2
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Design Decisions

- Articles are **versioned** instead of overwritten to allow comparison
- Automation logic is implemented as a **standalone script**
- Backend, scraping, and AI logic are kept **cleanly separated**
- Over-engineering and unnecessary abstractions are avoided

---

## Notes for Reviewers

- The project is structured for clarity and maintainability
- The automation pipeline is safe to re-run
- Emphasis is placed on correctness and clean data flow
- The codebase is designed to be easily extensible

---

## License

This project was created solely for the BeyondChats internship assignment.
All code remains the property of the author unless otherwise agreed.
