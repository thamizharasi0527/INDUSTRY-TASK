# Startup Idea Validation Platform

 HEAD
A minimal startup landing page with an Express.js backend that simulates idea validation, competitor analysis, SWOT generation, trend scoring, and AI risk/opportunity outputs.

Project structure

- `frontend/`
  - `index.html` — landing page UI
  - `styles.css` — minimal startup aesthetic styling
  - `script.js` — idea submission and result rendering
- `backend/`
  - `server.js` — Express API with async analysis and caching
  - `package.json` — dependencies and startup scripts

 Run locally

1. Open a terminal in `backend/`.
2. Install dependencies:

```powershell
npm install
```

3. Start the backend:

```powershell
npm start
```

4. Open `frontend/index.html` in your browser.

## API endpoint

- `POST http://localhost:4000/api/analyze`
  - body: `{ "idea": "...", "market": "..." }`

## Notes

- The frontend uses a simple fetch call to the backend API.
- The backend includes in-memory caching and an asynchronous processing delay to simulate realistic validation workflows.

## Problem Statement
Founders often build products without validating demand. This platform analyzes startup ideas and gives market validation insights.

## Features
- Market demand analysis
- Competitor insights
- Audience validation
- Risk assessment

## Tech Stack
Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Node.js
- Express.js

