# PassCraft — Event Management & AI Analytics Platform

> A microservices-driven, full-stack portfolio platform built by a team of four.
> PassCraft lets users discover events, book tickets, and gives organizers a live AI-powered analytics dashboard.

---

## Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Repository Structure](#-repository-structure)
5. [Team & Ownership](#-team--ownership)
6. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Running with Docker Compose](#running-with-docker-compose)
   - [Running Services Individually](#running-services-individually)
7. [API Reference](#-api-reference)
   - [Node.js Backend](#nodejs-backend-port-5000)
   - [Flask Backend](#flask-backend-port-5001)
8. [Key Features](#-key-features)
9. [Folder Structure Deep Dive](#-folder-structure-deep-dive)
10. [Development Workflow](#-development-workflow)
11. [Environment Variables Reference](#-environment-variables-reference)
12. [Contributing Guidelines](#-contributing-guidelines)

---

## 🎯 Project Overview

**PassCraft** is a high-performance, microservices-driven Smart Event & Ticket Management Platform built as a collaborative portfolio project. It is designed with a fully decoupled architecture that uses two independent backend services, each optimised for its specific domain:

| Service | Responsibility |
|---|---|
| **React Frontend** | Event discovery, ticket booking UI, analytics dashboard |
| **Node.js + Express** | Auth, event CRUD, bookings, JWT issuance |
| **Python + Flask** | NLP sentiment analysis, PDF ticket generation, analytics aggregation |
| **MongoDB** | Shared persistent document store for all services |
| **Docker + Azure** | Containerised local dev and cloud deployment |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18.x |
| Styling | HTML5, CSS3 (Flexbox, Grid, Custom Properties) | — |
| Routing | React Router | v6 |
| Charts | Recharts | 2.x |
| HTTP Client | Axios | 1.x |
| Node Backend | Node.js + Express | 20.x / 4.x |
| ORM/ODM | Mongoose | 8.x |
| Authentication | JSON Web Tokens (JWT) | — |
| Password Hashing | bcryptjs | 2.x |
| Python Backend | Flask | 3.x |
| Python DB Driver | PyMongo | 4.x |
| NLP Engine | VADER Sentiment | 3.x |
| PDF Generation | ReportLab + qrcode | 4.x / 7.x |
| Database | MongoDB (local / Atlas) | 7.x |
| Build Tool | Vite | 5.x |
| Containerisation | Docker + Docker Compose | — |
| Cloud | Microsoft Azure (App Service, Blob Storage) | — |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Browser / Client                   │
│          React SPA  (Vite Dev Server :5173)         │
└───────────────────┬─────────────────────────────────┘
                    │  HTTP / REST (Axios)
          ┌─────────┴──────────┐
          │                    │
          ▼                    ▼
┌──────────────────┐  ┌──────────────────────┐
│  Node.js Backend │  │   Flask Backend       │
│  Express  :5000  │  │   Gunicorn    :5001   │
│                  │  │                       │
│  • Auth (JWT)    │  │  • Sentiment NLP      │
│  • Events CRUD   │  │  • PDF Tickets        │
│  • Bookings      │  │  • Analytics API      │
└────────┬─────────┘  └──────────┬────────────┘
         │                       │
         └──────────┬────────────┘
                    │  PyMongo / Mongoose
                    ▼
          ┌──────────────────┐
          │    MongoDB       │
          │  (Local / Atlas) │
          └──────────────────┘
                    │
          ┌──────────────────┐
          │  Azure Blob      │
          │  Storage         │
          │  (PDF Tickets)   │
          └──────────────────┘
```

All three services run as isolated Docker containers orchestrated by **Docker Compose** locally and deployed to **Azure App Service** in production.

---

## 📁 Repository Structure

```
passcraft-monorepo/
│
├── docker-compose.yml          ← Orchestrates all services locally
├── .gitignore
├── README.md
│
├── frontend/                   ← React SPA (Vite)
│   ├── public/
│   │   └── index.html          ← HTML5 app shell
│   ├── src/
│   │   ├── styles/
│   │   │   ├── global.css      ← Design tokens, utilities
│   │   │   └── dashboard.css   ← Dashboard grid & chart layout
│   │   ├── components/
│   │   │   ├── Navbar.jsx      ← Responsive header + auth nav
│   │   │   └── EventCard.jsx   ← Reusable event card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← JWT state, login/logout/register
│   │   ├── pages/
│   │   │   ├── Home.jsx        ← Event discovery + search/filter
│   │   │   ├── Login.jsx       ← Controlled login form
│   │   │   └── Dashboard.jsx   ← Analytics charts (Recharts)
│   │   ├── App.jsx             ← React Router v6 route tree
│   │   └── main.jsx            ← React 18 createRoot entry point
│   ├── .env.development        ← Vite VITE_* API URL variables
│   ├── Dockerfile              ← Multi-stage: Vite dev → Nginx prod
│   └── package.json
│
├── node-backend/               ← Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           ← Mongoose connection factory
│   │   ├── models/
│   │   │   ├── User.js         ← User schema + bcrypt pre-save
│   │   │   ├── Event.js        ← Event schema + seat init hook
│   │   │   └── Booking.js      ← Booking schema + post-save hook
│   │   ├── middleware/
│   │   │   └── authMiddleware.js ← JWT protect + authorizeRoles
│   │   ├── controllers/
│   │   │   ├── authController.js  ← register / login / getMe
│   │   │   └── eventController.js ← CRUD + booking logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js   ← /api/auth/* endpoints
│   │   │   └── eventRoutes.js  ← /api/events/* endpoints
│   │   └── server.js           ← App config, middleware, listener
│   ├── .env                    ← PORT, MONGO_URI, JWT_SECRET
│   ├── Dockerfile              ← Multi-stage: dev (nodemon) → prod
│   └── package.json
│
└── flask-backend/              ← Flask Analytics Microservice
    ├── app/
    │   ├── __init__.py         ← Application factory (create_app)
    │   ├── config/
    │   │   └── database.py     ← PyMongo singleton client
    │   ├── services/
    │   │   ├── sentiment_analyzer.py ← VADER NLP pipeline
    │   │   └── ticket_generator.py   ← ReportLab PDF + Azure upload
    │   └── routes/
    │       └── analytics.py    ← /api/analytics/* endpoints
    ├── wsgi.py                 ← Gunicorn WSGI entrypoint
    ├── .env                    ← FLASK_ENV, MONGO_URI, Azure creds
    ├── Dockerfile              ← Multi-stage: builder → prod (Gunicorn)
    └── requirements.txt
```

---

## 👥 Team & Ownership

| Member | Role | Files Owned |
|---|---|---|
| **Member 1** | Frontend Developer (UI & Styling) | `index.html`, `global.css`, `dashboard.css`, `Navbar.jsx`, `EventCard.jsx`, `Home.jsx`, `main.jsx`, `package.json`, `.env.development` |
| **Member 2** | Frontend Developer (Auth & State) | `AuthContext.jsx`, `Login.jsx`, `Dashboard.jsx`, `App.jsx` |
| **Member 3** | Backend Developer (Node.js) | `db.js`, `User.js`, `Event.js`, `Booking.js`, `authMiddleware.js`, `authController.js`, `authRoutes.js`, `server.js`, `node-backend/.env`, all `Dockerfile`s, `docker-compose.yml` |
| **Member 4** | Backend Developer (Python/Flask) | `database.py`, `sentiment_analyzer.py`, `ticket_generator.py`, `analytics.py`, `__init__.py`, `wsgi.py`, `flask-backend/.env`, `requirements.txt` |

> **Note:** Member 4 also owns `eventController.js` and `eventRoutes.js` (Events & Bookings domain logic).

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine before starting:

| Tool | Version | Install Link |
|---|---|---|
| **Node.js** | ≥ 20.x | https://nodejs.org |
| **Python** | ≥ 3.11 | https://python.org |
| **Docker Desktop** | Latest | https://www.docker.com/products/docker-desktop |
| **Git** | Latest | https://git-scm.com |
| **MongoDB** | 7.x (local) or Atlas account | https://www.mongodb.com |

### Environment Variables

**Before running any service**, copy the example files and fill in your values:

```bash
# Node.js backend
cp node-backend/.env node-backend/.env.local
# Edit node-backend/.env with your MONGO_URI and JWT_SECRET

# Flask backend
cp flask-backend/.env flask-backend/.env.local
# Edit flask-backend/.env with your MONGO_URI and AZURE credentials

# Frontend (already has safe defaults for local dev)
# Edit frontend/.env.development if your ports differ
```

> ⚠️ **Never commit `.env` files.** They are already listed in `.gitignore`. Share secrets with your team using a secure vault (e.g., Azure Key Vault, 1Password Teams).

---

### Running with Docker Compose

The fastest way to spin up all three services simultaneously:

```bash
# From the repo root:
docker compose up --build
```

| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| Node.js API | http://localhost:5000 |
| Flask API | http://localhost:5001 |
| MongoDB | mongodb://localhost:27017 |

To stop all services:

```bash
docker compose down
```

To rebuild a single service after code changes:

```bash
docker compose up --build node-backend
```

---

### Running Services Individually

If you prefer to run services without Docker during development:

**1. MongoDB** (local instance)
```bash
# Start MongoDB (if installed locally):
mongod --dbpath /data/db
```

**2. Node.js Backend**
```bash
cd node-backend
npm install
npm run dev          # starts on http://localhost:5000 with nodemon
```

**3. Flask Backend**
```bash
cd flask-backend
python -m venv .venv

# Windows:
.venv\Scripts\activate

# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
python wsgi.py       # starts on http://localhost:5001
```

**4. React Frontend**
```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:5173 via Vite
```

---

## 📡 API Reference

### Node.js Backend (Port 5000)

#### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | 🔒 JWT | Get current user profile |

**Request body — `POST /api/auth/register`:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response — `POST /api/auth/login`:**
```json
{
  "_id": "665abc123...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### Events — `/api/events`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List all published events (paginated) |
| `GET` | `/api/events/:id` | Public | Get single event by ID |
| `GET` | `/api/events/my-bookings` | 🔒 JWT | Get current user's bookings |
| `POST` | `/api/events` | 🔒 Organizer/Admin | Create a new event |
| `PUT` | `/api/events/:id` | 🔒 Organizer/Admin | Update an event |
| `DELETE` | `/api/events/:id` | 🔒 Organizer/Admin | Delete an event |
| `POST` | `/api/events/:id/book` | 🔒 JWT | Book tickets for an event |

**Query params — `GET /api/events`:**
```
?category=Music&search=jazz&page=1&limit=12
```

---

### Flask Backend (Port 5001)

#### Analytics — `/api/analytics`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/overview` | Total events, bookings, revenue, avg sentiment |
| `GET` | `/api/analytics/bookings-trend` | 30-day daily booking counts (LineChart data) |
| `GET` | `/api/analytics/sentiment` | Global sentiment distribution (PieChart data) |
| `GET` | `/api/analytics/top-events` | Top 5 events by booking count (BarChart data) |
| `GET` | `/api/analytics/event/:id/sentiment` | Per-event sentiment breakdown |

**Response example — `GET /api/analytics/overview`:**
```json
{
  "totalEvents": 42,
  "totalBookings": 318,
  "totalRevenue": 12540.00,
  "avgSentiment": 74.3
}
```

**Health check (both services):**
```
GET /health  →  { "status": "ok", "service": "node-backend" }
GET /health  →  { "status": "ok", "service": "flask-backend" }
```

---

## ✨ Key Features

- 🎟 **Event Discovery** — Browse, search, and filter events by category with a responsive card grid
- 🔐 **JWT Authentication** — Stateless auth with secure bcrypt password hashing and role-based access control (user / organizer / admin)
- 📊 **AI Analytics Dashboard** — Real-time Recharts visualisations (line, bar, pie) fed by Flask's MongoDB aggregation pipelines
- 🧠 **NLP Sentiment Analysis** — VADER-powered review scoring with positive / neutral / negative classification
- 🧾 **PDF Ticket Generation** — ReportLab-generated branded tickets with embedded QR codes, stored in Azure Blob Storage
- 🐳 **Full Docker Support** — Multi-stage Dockerfiles for dev (hot-reload) and production (Nginx/Gunicorn) for all three services
- ☁️ **Azure Ready** — Blob Storage integration for assets and App Service deployment configuration

---

## 🗂 Folder Structure Deep Dive

### Frontend (`src/`)

```
src/
├── styles/         ← Global CSS design system (tokens, utilities)
├── components/     ← Reusable presentational components (no data fetching)
├── context/        ← Global React state (auth only — keep minimal)
├── pages/          ← Full-page route components (data fetching lives here)
├── App.jsx         ← Route definitions only
└── main.jsx        ← DOM mounting only
```

> **Convention:** Components in `components/` are purely presentational and receive all data as props. All API calls happen inside `pages/`.

### Node Backend (`src/`)

```
src/
├── config/         ← One-time setup (DB connection)
├── models/         ← Mongoose schemas (data shape + hooks)
├── middleware/     ← Request interceptors (auth, validation)
├── controllers/    ← Business logic (one function per operation)
├── routes/         ← URL path → controller mapping (no logic)
└── server.js       ← App bootstrap (no business logic)
```

### Flask Backend (`app/`)

```
app/
├── config/         ← DB client singleton
├── services/       ← Pure Python business logic (NLP, PDF)
├── routes/         ← Flask Blueprints with route handlers
└── __init__.py     ← Application factory (create_app)
```

---

## 🔄 Development Workflow

### Branch Strategy

```
main          ← Production-ready, protected branch
└── develop   ← Integration branch (merge PRs here first)
    ├── feat/member1-event-card
    ├── feat/member2-auth-context
    ├── feat/member3-booking-model
    └── feat/member4-sentiment-api
```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat(auth):     add JWT refresh token endpoint
fix(booking):   correct seat decrement race condition
docs(readme):   add API reference table
style(navbar):  fix mobile hamburger z-index
refactor(db):   extract connection retry logic
test(events):   add integration tests for createBooking
chore(docker):  add .dockerignore for flask-backend
```

### Pull Request Process

1. Create a feature branch from `develop`: `git checkout -b feat/your-feature`
2. Write your code following the instructions in each boilerplate file
3. Ensure your service starts without errors before opening a PR
4. Open a PR targeting `develop` — request review from at least one team member
5. Merge only after approval and no failing checks

---

## 🔑 Environment Variables Reference

### `frontend/.env.development`

| Variable | Example | Description |
|---|---|---|
| `VITE_NODE_API_URL` | `http://localhost:5000` | Node.js backend base URL |
| `VITE_FLASK_API_URL` | `http://localhost:5001` | Flask backend base URL |
| `VITE_APP_NAME` | `PassCraft` | App display name |
| `VITE_APP_ENV` | `development` | Environment identifier |

### `node-backend/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Runtime environment |
| `MONGO_URI` | `mongodb://localhost:27017/passcraft` | MongoDB connection string |
| `JWT_SECRET` | `<64-char hex string>` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allow origin |

### `flask-backend/.env`

| Variable | Example | Description |
|---|---|---|
| `FLASK_APP` | `wsgi.py` | Flask CLI entry point |
| `FLASK_ENV` | `development` | Flask environment |
| `SECRET_KEY` | `<32-char hex string>` | Flask session secret |
| `PORT` | `5001` | Gunicorn/Flask port |
| `MONGO_URI` | `mongodb://localhost:27017/passcraft` | MongoDB connection string |
| `MONGO_DB_NAME` | `passcraft` | Target database name |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allow origin |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpoints...` | Azure Blob Storage credentials |
| `AZURE_BLOB_CONTAINER` | `tickets` | Blob container for PDF tickets |

---

## 🤝 Contributing Guidelines

1. **Read your file's instructions** — every boilerplate file contains a detailed multi-line comment at the top specifying exactly what logic to implement. Read it before writing any code.
2. **Own your domain** — avoid modifying files assigned to another team member without discussion.
3. **No secrets in Git** — never commit `.env` files. Use `.env.example` files with placeholder values.
4. **No logic in entry points** — `server.js`, `wsgi.py`, and `main.jsx` should remain thin bootstrapping files.
5. **Test your service before PR** — run your service independently and verify its health check endpoint responds before opening a pull request.
6. **Document API changes** — if you add or change an endpoint, update the API Reference section in this README.

---

<div align="center">

Built with ❤️ by the PassCraft Team &nbsp;|&nbsp; Portfolio Project &nbsp;|&nbsp; 2026

</div>