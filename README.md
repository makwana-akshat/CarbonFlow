# CarbonFlow: Global Carbon Operations & Clearing Platform

**CarbonFlow** is a comprehensive B2B marketplace, logistics planner, and smart-contract clearinghouse built for the industrial CO₂ economy. It operates as the central nervous system connecting CO₂ **Suppliers** (Biogenic facilities, Direct Air Capture plants, Ammonia producers) with industrial **Buyers** (EOR operators, Precast concrete yards, Sustainable Aviation Fuel refineries) for seamless, end-to-end carbon off-taking.

---

## 🌟 Core Modules & Features

### 1. Dual-Sided Operations Desk
CarbonFlow offers a singular unified platform that dynamically shifts based on your operational persona:
- **Buyer Mode**: Procure CO₂, manage inbound supply recommendations, track delivery manifests, and manage multi-supplier contracts.
- **Supplier Mode**: Manage CO₂ stream listings, review buyer offtake inquiries, track facility output telemetry, and handle outbound logistics.

### 2. The Clearinghouse & Marketplace
- **Supply Listings**: Suppliers map out their specific streams detailing purity tiers (e.g., >95% Pipeline-ready), volume (TPA), and source types.
- **Demand Requirements**: Buyers broadcast their specific technical needs (e.g., max moisture levels, delivery cadence).
- **Matchmaking Engine**: Matches supply with demand based on spatial proximity, purity compatibility, and economic viability.

### 3. Smart Contract Engine
- **Automated Drafting**: When a buyer inquiry is accepted, the system automatically drafts an ISO-14064-2 compliant contract.
- **Immutable Ledger**: Every contract maintains a cryptographic `audit_hash` to ensure data integrity.
- **Versioning & Timelines**: Full support for contract amendments (`v1` → `v2`) and visual chronological tracking of all negotiations and status changes.

### 4. Interactive Logistics & Telemetry (SCADA)
- **Maps**: Real-time interactive routing between capture facilities and injection sites/buyers using Mapbox/Three.js visualizations.
- **Dashboards**: Live telemetry simulating SCADA systems—monitoring compressor temperatures, pipeline pressures, and flow rates.
- **Alerts**: Predictive maintenance alerts and supply-chain warnings.

---

## 🏗️ Technical Architecture

### Frontend Ecosystem
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS + Custom CSS Variables for a highly premium, dark-mode, glassmorphic UI.
- **State Management**: `Zustand` (Global App State), `React Query` (Server State & API Caching).
- **Components**: Modular atomic design (`/components/ui/` for Cards, Toasts, Pagination).

### Backend Ecosystem
- **Core**: Python 3.9+, FastAPI (High-performance async ASGI framework).
- **Data Validation**: Pydantic v2.
- **Database**: Supabase (PostgreSQL) integrated via PostgREST (`supabase-py`).
- **Security**: JWT verification using Clerk's JWKS endpoint.

---

## 📂 Repository Structure

```text
CarbonFlow/
├── backend/                      # Python FastAPI Application
│   ├── app/                      
│   │   ├── api/v1/endpoints/     # FastAPI Route Controllers (users, marketplace, contracts, etc)
│   │   ├── core/                 # Config, Security, JWT Verification
│   │   ├── schemas/              # Pydantic Request/Response Models
│   │   └── services/             # Business Logic & Supabase DB interactions
│   ├── migrations/               # Raw SQL schema definitions & seed files
│   ├── requirements.txt          # Python dependencies
│   └── main.py                   # FastAPI Application Entrypoint
├── frontend/                     # React Vite Application
│   ├── src/
│   │   ├── components/           # UI Components (Dashboards, Maps, Shell, Auth)
│   │   ├── services/             # Fetch API wrappers with Auth Injection
│   │   ├── store/                # Zustand stores
│   │   ├── types/                # TypeScript interfaces
│   │   └── index.css             # Tailwind imports & Design Tokens
│   ├── package.json              
│   └── vite.config.ts            
├── AGENTS.md                     # Directives for AI Agents operating on the codebase
└── README.md                     # This file
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: 3.9 or higher
- **Supabase**: Access to a configured Supabase project.
- **Clerk**: Access to a configured Clerk auth application.

### 1. Environment Setup

**Backend Configuration (`/backend/.env`)**
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLERK_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173,http://localhost:5174
```

**Frontend Configuration (`/frontend/.env`)**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Running the Application

Open two separate terminal instances from the root repository.

**Terminal 1: FastAPI Backend**
```bash
cd backend
python -m venv venv
# Activate the environment:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# The API will be available at http://localhost:8000
```

**Terminal 2: React Frontend**
```bash
cd frontend
npm install
npm run dev
# The UI will be available at http://localhost:5173 (or 5174)
```

---

## 🛡️ License & Compliance
CarbonFlow conforms to digital MRV (Measurement, Reporting, and Verification) standards and ensures data integrity for carbon lifecycle audits.
