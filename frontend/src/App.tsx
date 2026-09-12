import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { CarbonFlowShell } from './components/shell/CarbonFlowShell';
import { ArrowRight, ShieldCheck, MapPin, Gauge } from 'lucide-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col font-sans selection:bg-[var(--accent-primary)] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-card)]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto py-3.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
              CF
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[var(--ink)]">CarbonFlow</span>
              <span className="text-[10px] text-[var(--accent-primary)] font-mono ml-2 px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 font-semibold">
                INFRASTRUCTURE
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <SignedOut>
              <Link
                to="/login"
                className="text-xs font-semibold text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-semibold bg-[var(--accent-primary)] text-white px-3.5 py-1.5 rounded-[var(--radius-card)] hover:opacity-95 transition-opacity shadow-sm"
              >
                Create Account
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                className="text-xs font-semibold bg-[var(--ink)] text-white px-4 py-1.5 rounded-[var(--radius-card)] hover:bg-[var(--accent-primary)] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-[12px] font-medium text-[var(--text-secondary-accessible)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-online)] animate-pulse" />
            B2B Industrial CO₂ Infrastructure & Clearing House
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)] leading-tight">
            Geospatial Routing & Clearing for Industrial Carbon Offtake
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary-accessible)] leading-relaxed max-w-2xl">
            Connecting emitters, transport carriers, and utilization offtakers with SCADA-verified telemetry,
            multi-modal route calculation, and instant clearing contracts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <SignedOut>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-6 py-3 rounded-[var(--radius-card)] font-bold text-sm shadow-[var(--shadow-card)] hover:opacity-95 transition-all"
              >
                Access Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-subtle)] px-6 py-3 rounded-[var(--radius-card)] font-bold text-sm hover:bg-[var(--surface-elevated)] transition-all shadow-sm"
              >
                Sign In
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[var(--ink)] text-white px-6 py-3 rounded-[var(--radius-card)] font-bold text-sm shadow-[var(--shadow-card)] hover:bg-[var(--accent-primary)] transition-all"
              >
                Launch CarbonFlow Console
                <ArrowRight className="w-4 h-4" />
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-[var(--border-subtle)]">
          <div className="p-6 bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[15px] text-[var(--ink)]">Full-Bleed Routing Engine</h3>
            <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">
              Real-time Google Maps route planning with live carrier telemetry, corridor hazards, and transport modes.
            </p>
          </div>

          <div className="p-6 bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#34C77B]/10 text-[var(--status-online)] flex items-center justify-center mb-4">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[15px] text-[var(--ink)]">Automated SCADA Telemetry</h3>
            <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">
              Pressure, cryogenic temperature, flow velocity, and purity tracking across all pipeline and ISO rail legs.
            </p>
          </div>

          <div className="p-6 bg-[var(--surface-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[15px] text-[var(--ink)]">Verified Clearing House</h3>
            <p className="text-[13px] text-[var(--text-secondary-accessible)] leading-relaxed">
              Guaranteed offtake matching with ISO 27913 custody transfer compliance and automated clearing.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--paper)] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary-accessible)]">
          <div>© {new Date().getFullYear()} CarbonFlow Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[var(--status-online)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-online)]" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  // If Clerk publishable key is not set, run in resilient Demo Mode without crashing
  if (!clerkPubKey) {
    return (
      <Router>
        <Routes>
          <Route
            path="/app/carbon-impact"
            element={<CarbonFlowShell isDemoMode={true} initialTab="carbon-impact" />}
          />
          <Route path="*" element={<CarbonFlowShell isDemoMode={true} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Clerk Auth Pages */}
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/signup/*" element={<SignupPage />} />

          {/* Protected CarbonFlow Operations Shell */}
          <Route
            path="/dashboard/*"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          {/* Carbon Impact Dedicated Route */}
          <Route
            path="/app/carbon-impact"
            element={
              <AuthGuard>
                <DashboardPage initialTab="carbon-impact" />
              </AuthGuard>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
