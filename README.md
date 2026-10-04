# Kalptaru Yog Vidyalaya — Platform Architecture

A production-grade web platform and management system for **Kalptaru Yog Vidyalaya**, built with a dual-root, strictly separated frontend and backend architecture.

---

## 1. Project Architecture

The repository is structured into two completely independent applications:

```text
kalptaru-yog-vidyalaya/
├── frontend/             # React 19 + Vite + TypeScript + Tailwind CSS
├── backend/              # Node.js + Express + TypeScript + Mongoose + Supabase Storage
├── .gitignore            # Multi-tier gitignore (Node, Vite, React, .env, dist, logs)
└── README.md             # Project & architecture documentation
```

### Core Architectural Principles:
* **Separation of Concerns:** Frontend handles UI, client state, routing, and form interactions. Backend handles business logic, database transactions, auth/authorization, security, and file storage metadata.
* **Storage Abstraction:** Media assets are stored in **Supabase Storage** (not Cloudinary). Controllers interface solely through `IStorageService`, keeping the backend decoupled from specific storage vendors.
* **Type Safety & Validation:** End-to-end TypeScript strict typing, runtime environment validation via Zod, and typed API response envelopes.
* **Visual Identity:** Tailored brand colors inspired by the Kalptaru Yog Vidyalaya emblem:
  * Royal Plum (`plum-900: #2A1128`, `plum-800: #3B1838`)
  * Antique Gold (`gold-500: #C5A059`, `gold-400: #D8B26E`)
  * Warm Ivory (`ivory: #FDFBF7`, `ivory-warm: #FAF7F0`)
  * Muted Earthy Brown (`earth-600: #7B4E3D`)
  * Editorial Typography (`Cormorant Garamond` serif + `Plus Jakarta Sans` sans)

---

## 2. Directory Structure

### Backend (`/backend`)
```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts              # Mongoose connection with event listeners & status
│   │   └── env.ts                   # Zod-validated environment configuration
│   ├── controllers/
│   │   └── health.controller.ts     # Health check & system status controller
│   ├── middleware/
│   │   ├── errorHandler.ts          # Centralized error handler (AppError, Zod, Mongoose)
│   │   └── notFoundHandler.ts       # 404 route handler
│   ├── models/
│   │   └── index.ts                 # Database models index
│   ├── routes/
│   │   ├── health.routes.ts         # GET /api/health
│   │   └── index.ts                 # Master API router
│   ├── services/
│   │   └── storage/
│   │       ├── storage.interface.ts # IStorageService contract
│   │       ├── supabase-storage.service.ts # Supabase Storage implementation
│   │       └── index.ts             # Storage service singleton export
│   ├── types/
│   │   └── index.ts                 # Shared backend interfaces
│   ├── utils/
│   │   ├── apiResponse.ts           # Standard ApiResponse envelope
│   │   ├── appError.ts              # Custom AppError with status codes
│   │   └── logger.ts                # Structured console logger
│   ├── validators/
│   │   └── index.ts                 # Zod request validators index
│   ├── app.ts                       # Express application & middleware assembly
│   └── server.ts                    # Server startup & graceful shutdown
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend (`/frontend`)
```text
frontend/
├── src/
│   ├── api/
│   │   └── axios.ts                 # Axios instance with baseURL & interceptors
│   ├── assets/
│   │   └── index.ts                 # Asset references
│   ├── components/
│   │   └── index.ts                 # Reusable UI component library
│   ├── hooks/
│   │   └── index.ts                 # Custom hooks
│   ├── layouts/
│   │   └── index.ts                 # Layout wrappers
│   ├── lib/
│   │   └── queryClient.ts           # TanStack QueryClient instance
│   ├── pages/
│   │   └── index.ts                 # Application views & routes
│   ├── sections/
│   │   └── index.ts                 # Editorial page sections
│   ├── services/
│   │   └── index.ts                 # API consumption services
│   ├── types/
│   │   └── index.ts                 # Frontend interfaces & response types
│   ├── utils/
│   │   └── cn.ts                    # Classnames & Tailwind merge utility
│   ├── App.tsx                      # Foundation verification view
│   ├── index.css                    # Tailwind directives & typography layers
│   ├── main.tsx                     # React DOM entrypoint
│   └── vite-env.d.ts                # Vite environment typings
├── public/
│   └── favicon.svg                  # Kalptaru emblem favicon
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Installation

Run the following commands to install dependencies for both applications:

### 1. Backend Dependencies
```bash
cd backend
npm install
```

### 2. Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 4. Environment Variables

Both directories contain a `.env.example` file. Copy each to a local `.env`:

### Backend Environment (`backend/.env`)
```bash
# Server Port & Mode
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/kalptaru_yog_vidyalaya

# Authentication
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# Supabase Storage (Object Storage )
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key
SUPABASE_STORAGE_BUCKET=kalptaru-media
```

### Frontend Environment (`frontend/.env`)
```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Storage Public URL (Optional direct bucket asset link)
VITE_SUPABASE_STORAGE_URL=https://your-project-id.supabase.co/storage/v1/object/public/kalptaru-media
```

---

## 5. Running the Project

Start the backend and frontend in separate terminal windows:

### Run Backend Server (Port 5000)
```bash
cd backend
npm run dev
```
* Health check endpoint: `http://localhost:5000/api/health`

### Run Frontend Dev Server (Port 5173)
```bash
cd frontend
npm run dev
```
* App URL: `http://localhost:5173`

---

## 6. Type Checking & Production Builds

### Backend
* Type check: `npm run type-check` (in `/backend`)
* Build: `npm run build` (outputs to `/backend/dist`)

### Frontend
* Type check: `npm run type-check` (in `/frontend`)
* Build: `npm run build` (outputs to `/frontend/dist`)
