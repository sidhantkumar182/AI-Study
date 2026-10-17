# AI Smart Study Companion — Backend API

This is the production-ready Node.js & Express backend for the **AI Smart Study Companion**.

## Features
- **JWT Authentication**: Secure signup and login with token-based sessions (cookies/headers).
- **PDF Processing**: Automatic text extraction from uploaded PDFs using `pdf-parse`.
- **Google Gemini AI**: Context-aware chat with documents, summaries, automatic flashcards, and quiz generation.
- **Study Planner**: Goal setting, task management, study log tracking, and streak calculations.
- **Analytics Dashboard**: Aggregated study hours, accuracy tracker, and recent activity feeds.
- **Dockerized Setup**: Ready-to-run container environment with MongoDB.

---

## Folder Structure

```text
src/
├── config/             # DB & Gemini initializations
├── controllers/        # Business logic handlers
├── middleware/         # Auth, validation, & error handling
├── models/             # Mongoose schemas (matching frontend types)
├── routes/             # Express API endpoints
├── services/           # Decoupled AI and PDF parsers
├── utils/              # Helper utilities & AI prompts
└── validators/         # Request body validation rules
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation
1. Navigate to the backend folder:
   ```bash
   cd ai-study-companion-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *Make sure to enter your `GEMINI_API_KEY` and `MONGODB_URI`.*

### Running locally
- **Development mode (with nodemon):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

---

## Running with Docker

You can spin up the backend along with MongoDB using Docker Compose:

1. Build and start containers:
   ```bash
   docker compose up --build
   ```
2. Stop the containers:
   ```bash
   docker compose down
   ```

---

## Connecting the Frontend

The backend exposes its API endpoints at `http://localhost:5000/api`. 

To connect the React frontend:
1. Open the frontend project.
2. Update your API client (e.g., Axios or fetch wrappers) to point to `http://localhost:5000/api`.
3. Set `withCredentials: true` in your Axios defaults to ensure JWT HttpOnly cookies are sent with requests.
