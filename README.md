# 🌾 AgroAI — AI-Powered Agriculture Crop Advisory Assistant

A production-ready, full-stack, mobile-responsive precision agriculture platform designed for farmers, agronomists, and agricultural extension workers. Built with **React 18 + TypeScript + Tailwind CSS** on the frontend, **Node.js + Express.js** on the backend, **PostgreSQL** for persistence, and **Google Gemini AI (`@google/genai`)** for agronomic intelligence.

---

## 🚀 Key Features

### 1. 🌾 9 Specialized Agricultural Advisory Domains
- **Crop Selection & Suitability**: Match cultivars to soil characteristics, water availability, and agro-climatic seasons (Kharif, Rabi, Zaid).
- **Crop Management & Cultivation**: Growth-stage specific canopy care, plant spacing, weed suppression, and physiological monitoring.
- **Precision Irrigation Scheduling**: Moisture requirements, drip/sprinkler scheduling, critical growth checkpoints (e.g. CRI in wheat), and flood drainage.
- **Fertilizer & Plant Nutrition**: Balanced N-P-K split dosages, secondary nutrient management (Calcium, Sulphur), micronutrient chlorosis correction (Zinc, Iron), and organic bio-manures.
- **Integrated Pest & Disease Management (IPM)**: Preliminary symptom analysis, biological bio-controls (Neem oil, *Trichoderma*), sticky traps, threshold monitoring, and chemical safety protocols.
- **Soil Health & Soil Conditioning**: pH correction (lime / gypsum), soil organic carbon (SOC) elevation, compaction alleviation, and salinity mitigation.
- **Weather-Aware Risk Mitigation**: Heat stress alleviation, unseasonal rainfall precautions, lodging prevention, and frost defense buffers.
- **Harvest & Post-Harvest Preservation**: Physiological maturity indicators, safe grain moisture benchmarks (10-12%), hermetic storage, and aflatoxin defense.
- **General Agricultural Intelligence**: Crop rotation science, green manuring (*Sesbania* / Sunn hemp), and intercropping principles.

### 2. 📋 Master Structured Advisory Result Presentation
Every AI-generated advisory is structured for high field usability and zero ambiguity:
- **Executive Summary Banner**: Clear 1-2 sentence core finding.
- **Primary Recommendation & Scientific Agronomic Reasoning**: Explaining what to do and why it works biologically.
- **Interactive Immediate Action Checklist**: Real-time interactive checkboxes allowing farmers to mark actions completed during the first 48 hours.
- **Recommended Agronomic Practices**: Long-term field practices for sustained vigor.
- **Identified Agricultural Risks**: Potential threats if conditions worsen.
- **Preventive Measures for Future Cycles**: Cultural prevention to eliminate recurrence.
- **Operational Safety & Chemical Warnings**: Critical safety warnings against off-label chemical use, requiring protective PPE.
- **Follow-Up Monitoring Schedule**: 3 to 7 days post-treatment observation checkpoints.
- **Extension Officer Consultation Triggers**: Explicit threshold markers indicating when an in-person agronomist or KVK officer inspection is mandatory.
- **Print / PDF Export**: High-contrast, clean printable layout for physical field notes and ledger storage.

### 3. 🛡️ Agricultural Safety Guardrails & Disclaimers
- Strict guardrails preventing lethal or off-label pesticide recommendations without adequate context.
- Pest and disease analyses without laboratory confirmation are explicitly classified as **"Preliminary Possibility"**, recommending physical sample verification.
- Clear statutory notice emphasizing that AI is an advisory decision-support assistant and does not substitute for certified government agronomists.

### 4. 🚜 Farm Profile & Plot Persistence
- Register multiple farm parcels with specific soil types (Black Cotton, Alluvial, Red Sandy Loam, Clay, etc.), irrigation facilities (Drip, Sprinkler, Canal, Rainfed), water sources, and active crops.
- 1-click auto-population of farm parameters when requesting new advisories.

### 5. 📊 Analytics Dashboard & Advisory Archive
- Track total advisories, active crops under care, and domain breakdowns.
- Search, filter by category or saved bookmarks, paginate, and review past advisories.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v7 |
| **Backend** | Node.js, Express.js (REST API, ES Modules) |
| **Database** | PostgreSQL (compatible with local Postgres 14-18, Replit Postgres, Supabase, Neon) |
| **AI Integration** | `@google/genai` (Google Gen AI SDK with `gemini-2.5-flash`), Agronomic Expert Fallback Engine |
| **Validation** | Zod (request body validation, auth validation, and AI response schema validation) |
| **Security** | bcryptjs (12 salt rounds), jsonwebtoken (JWT), Helmet, CORS, Express Rate Limit, Cookie Parser |

---

## 📂 Project Structure

```
├── client/                     # Frontend React + TypeScript application
│   ├── src/
│   │   ├── api/                # API client services (auth, farm, advisory)
│   │   ├── components/
│   │   │   ├── advisory/       # CategorySelector, DynamicAdvisoryForm, AdvisoryCard, AdvisoryResultView
│   │   │   ├── common/         # Badge, Button, Card, Alert, LoadingSkeleton
│   │   │   └── layout/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext (persistent sessions)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, AdvisoryHub, NewAdvisory, Detail, History, Profile, Farm, Settings
│   │   ├── types/              # TypeScript domain types & interfaces
│   │   ├── App.tsx             # Route declarations
│   │   ├── index.css           # Tailwind design tokens & print styles
│   │   └── main.tsx            # React application entry point
│   ├── index.html              # Modern typography, meta tags, and agriculture branding
│   ├── tailwind.config.js      # Agricultural color palette (agri greens, earthy ambers)
│   └── vite.config.ts          # Vite configuration with proxy to backend port 5000
├── server/                     # Backend Node.js / Express application
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool with auto-reconnection
│   ├── controllers/            # authController, profileController, farmController, advisoryController
│   ├── db/
│   │   ├── schema.sql          # PostgreSQL DDL schema with UUIDs, constraints, and indexes
│   │   ├── migrate.js          # Automated database schema migration runner
│   │   └── seed.js             # Demo farmer, plots, and realistic historical advisories
│   ├── middleware/             # authMiddleware, validateMiddleware, errorMiddleware
│   ├── routes/                 # Express API routes (/auth, /profile, /farms, /advisories)
│   ├── services/
│   │   ├── geminiService.js    # Google Gen AI integration with JSON mode & Zod schema validation
│   │   └── agronomyEngine.js   # Expert agronomic intelligence fallback engine
│   ├── validations/            # Zod validation schemas for requests and AI responses
│   └── index.js                # Express entry point, security headers, rate limiters, static serving
├── .env.example                # Environment variables template
├── package.json                # Project orchestration scripts
└── README.md                   # Full platform documentation
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root workspace:

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL Database (Local or Cloud)
DATABASE_URL=postgresql://postgres@127.0.0.1:5432/crop_advisory_db
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=
PGDATABASE=crop_advisory_db

# Security & Session
JWT_SECRET=agri_secure_production_secret_key_2026_x89a3f2
JWT_EXPIRES_IN=7d

# Google Gemini AI Integration
# Optional in dev (falls back to built-in Agronomic Reasoning Engine if not set)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Production Deployment

This app is configured for deployment on Render. The project includes a `render.yaml` file for a Node.js web service and an attached PostgreSQL database.

### Render setup steps

1. Push the project to GitHub.
2. Sign in to Render and choose "New +" → "Web Service".
3. Connect the GitHub repository.
4. Select the branch (`main`).
5. Render will use the existing `render.yaml` configuration automatically.
6. Add the required environment variables in Render if needed:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`
7. Deploy the service.

The app is already configured to run with the built front-end and Express API in production mode.
GEMINI_MODEL=gemini-2.5-flash
```

---

## 🏃 Quick Start Guide

### 1. Install Dependencies
```bash
# Installs backend dependencies
npm install

# Installs frontend dependencies
npm --prefix client install
```

### 2. Run Database Migrations & Seed Demo Data
```bash
# Applies PostgreSQL schema
npm run db:migrate

# Seeds demo farmer (Ramesh Patel), 2 registered farms, and 3 realistic crop advisories
npm run db:seed
```

### 3. Start Development Server
```bash
# Runs both backend server (port 5000) and frontend client (port 5173) concurrently
npm run dev
```

Open your browser at `http://localhost:5173`.

### 4. Demo Login Credentials
- **Email:** `farmer.ramesh@agroai.in`
- **Password:** `farmer1234`
*(Or click "Prefill Demo Farmer Credentials" on the login page)*

---

## 🛡️ API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new farmer account
- `POST /api/auth/login` — Sign in and issue JWT token
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Fetch authenticated farmer profile

### Profile (`/api/profile`)
- `GET /api/profile` — Fetch farmer details and cultivation background
- `PUT /api/profile` — Update location, language preference, and crops

### Farms (`/api/farms`)
- `GET /api/farms` — List all registered farms for user
- `POST /api/farms` — Register a new farm plot
- `GET /api/farms/:id` — Get single farm profile
- `PUT /api/farms/:id` — Update farm soil and irrigation attributes
- `DELETE /api/farms/:id` — Remove farm plot

### Advisories (`/api/advisories`)
- `POST /api/advisories` — Submit farm parameters and generate structured AI advisory
- `GET /api/advisories` — Query past advisories with category, search, and bookmark filters
- `GET /api/advisories/dashboard-stats` — Aggregated metrics for farmer dashboard
- `GET /api/advisories/:id` — Retrieve full advisory plan
- `PATCH /api/advisories/:id/favorite` — Toggle bookmark / saved status
- `DELETE /api/advisories/:id` — Delete advisory report from history

### Health Check (`/api/health`)
- `GET /api/health` — Returns status of backend service, PostgreSQL connection, and active AI engine

---

## 🌾 Built for Sustainable & Precision Agriculture
Developed with best agronomic practices, strict chemical safety guardrails, and responsive mobile-first accessibility.
