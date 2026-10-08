# ApplyTrack

ApplyTrack is a MERN job application tracker for managing internship and job applications. It has an Express and MongoDB backend plus a React and Vite frontend that uses the real API for persistent application data.

## Features

- Add, view, edit and delete job applications.
- Track company, role, status, applied date, job link and notes.
- Filter applications by status.
- Search applications by company or role with the backend `search` query parameter.
- Dashboard summary cards for Total, Applied, Interview, Offer and Rejected.
- Responsive React dashboard with loading, empty, success and error states.
- Delete confirmation and disabled submit buttons while saving.
- MongoDB persistence through Mongoose. No mock data or localStorage replacement is used.

## Technologies

- Node.js with Express
- MongoDB with Mongoose
- React with Vite
- JavaScript ES modules
- dotenv
- cors
- Plain CSS
- Docker for local MongoDB setup

## Prerequisites

- Node.js 22 or newer. The backend development script uses Node's built-in `--watch` mode.
- npm
- Docker Desktop, if you want to run MongoDB locally with Docker
- PowerShell

## Setup

Run these commands from the project root:

```powershell
cd "C:\Users\aaree\Downloads\applytrack-dev"
```

### 1. Start Local MongoDB With Docker

This starts MongoDB with persistent storage and binds it only to `127.0.0.1` on your machine:

```powershell
docker volume create applytrack_mongo_data
docker run --name applytrack-mongo -d -p 127.0.0.1:27017:27017 -v applytrack_mongo_data:/data/db mongo:7
```

If the container already exists but is stopped, start it again:

```powershell
docker start applytrack-mongo
```

### 2. Create the Backend Environment File

```powershell
Copy-Item .\server\.env.example .\server\.env
```

The local Docker MongoDB command above works with this value from `server/.env.example`:

```powershell
MONGODB_URI=mongodb://127.0.0.1:27017/applytrack
```

Never put `MONGODB_URI` in frontend code.

### 3. Install Dependencies

Install backend dependencies from the project root:

```powershell
npm install
```

Install frontend dependencies:

```powershell
npm install --prefix client
```

## Running the App

Start the backend in one PowerShell terminal:

```powershell
cd "C:\Users\aaree\Downloads\applytrack-dev"
npm run dev
```

The backend development script currently runs:

```powershell
node --watch server/server.js
```

Start the frontend in a second PowerShell terminal:

```powershell
cd "C:\Users\aaree\Downloads\applytrack-dev"
npm run dev --prefix client
```

Open the frontend at:

```powershell
http://localhost:5173
```

The Vite dev server proxies relative `/api` requests to `http://localhost:5000`.

## API Endpoints

Base URL:

```powershell
http://localhost:5000
```

Endpoints:

- `GET /api/health`
- `GET /api/applications`
- `GET /api/applications?search=term`
- `GET /api/applications?status=Applied`
- `GET /api/applications/:id`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`

Application statuses are:

- `Applied`
- `Interview`
- `Offer`
- `Rejected`

## Frontend Production Build

```powershell
npm run build --prefix client
```

The build output is written to `client/dist`, which is ignored by Git.

## Troubleshooting

If the backend or frontend server was stopped, restart each one in its own terminal:

```powershell
npm run dev
npm run dev --prefix client
```

If MongoDB was stopped, restart the Docker container:

```powershell
docker start applytrack-mongo
```

If the backend cannot connect to MongoDB:

- Check that Docker Desktop is running.
- Check that the MongoDB container is running:

```powershell
docker ps
```

- Confirm `server/.env` exists.
- Confirm `MONGODB_URI` is set to:

```powershell
mongodb://127.0.0.1:27017/applytrack
```

- Restart the backend after changing `server/.env`.

If the frontend cannot reach the API:

- Confirm the backend is running at `http://localhost:5000`.
- Confirm the frontend is running at `http://localhost:5173`.
- Use relative `/api` URLs in frontend code so Vite can proxy requests.

## AI Development Experience

Code0 with Codex was used during development. It helped scaffold the backend folder structure, including the Express server, MongoDB connection, Mongoose model, routes, controllers and centralized error handling. It also helped build the React components for the dashboard, summary cards, forms, application list, filters and delete confirmation.

For API integration, Code0 with Codex connected the frontend to the real Express endpoints through relative `/api` URLs and Vite's proxy, while keeping MongoDB credentials out of frontend code. It also debugged the Edit interaction: the Edit button was already updating state and populating the form, but the form could be outside the user's visible area, so the fix made edit mode visibly scroll to and focus the populated form and added an editing banner. The production build was run after that fix, but browser click-through testing still needs to be performed manually.

## Limitations

- There is no authentication or user account system in the inspected backend or frontend source.
- All applications are shared through the same MongoDB collection.
- There is no deployment configuration yet.
- There are no automated unit, integration or end-to-end tests yet.
- Browser testing is still required for final UI verification.
