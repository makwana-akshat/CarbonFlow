import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
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
                to="/app/dashboard"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary-accessible)] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            Decarbonization Logistics & Clearing Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.1]">
            Standardized Infrastructure for the Indian Carbon Economy.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary-accessible)] max-w-2xl leading-relaxed">
            Connect industrial CO₂ emitters with utilization offtakers. Real-time GIS routing, automated SCADA telemetry clearing, ISO-audited bilateral smart contracts, and verified emission mitigation accounts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <SignedOut>
              <Link
                to="/signup"
                className="bg-[var(--accent-primary)] text-white px-5 py-2.5 rounded-[var(--radius-card)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm flex items-center gap-2"
              >
                Launch CarbonFlow
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="bg-[var(--surface-card)] text-[var(--ink)] border border-[var(--border-subtle)] px-5 py-2.5 rounded-[var(--radius-card)] text-sm font-semibold hover:bg-[var(--surface-muted)] transition-all shadow-2xs"
              >
                Operator Login
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/app/dashboard"
                className="bg-[var(--accent-primary)] text-white px-5 py-2.5 rounded-[var(--radius-card)] text-sm font-semibold hover:opacity-95 transition-all shadow-sm flex items-center gap-2"
              >
                Access Operating Console
                <ArrowRight className="w-4 h-4" />
              </Link>
            </SignedIn>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 pt-12 border-t border-[var(--border-subtle)]">
          <div className="p-5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] text-[var(--ink)] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--ink)]">Pipeline & Multi-Modal Routing</h3>
            <p className="text-xs text-[var(--text-secondary-accessible)] leading-relaxed">
              Automated route optimization across dedicated pipeline trunks, ISO rail cryogenic tankers, and port terminals with live telemetry.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] text-[var(--ink)] flex items-center justify-center mb-3">
              <Gauge className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--ink)]">SCADA & Purity Validation</h3>
            <p className="text-xs text-[var(--text-secondary-accessible)] leading-relaxed">
              Continuous metrology streams verifying purity grades (99.8% DAC to 96% industrial off-gas) against contract thresholds in real time.
            </p>
          </div>

          <div className="p-5 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] text-[var(--ink)] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--ink)]">Audited Offtake Contracts</h3>
            <p className="text-xs text-[var(--text-secondary-accessible)] leading-relaxed">
              Immutable SHA-256 state tracking, automated settlement manifests, and complete MRV compliance under Indian carbon market guidelines.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-6 bg-[var(--surface-card)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--text-secondary-accessible)]">
          <div className="flex items-center gap-2">
            <span>© 2026 CarbonFlow Infrastructure Platform</span>
            <span>•</span>
            <span>ISO 14064 MRV Certified</span>
          </div>
          <div className="flex gap-4">
            <Link to="/app/logistics" className="hover:text-[var(--ink)]">Logistics</Link>
            <Link to="/app/carbon-impact" className="hover:text-[var(--ink)]">Impact</Link>
            <Link to="/app/alerts" className="hover:text-[var(--ink)]">SCADA Alerts</Link>
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
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Protected App Routes */}
            <Route path="/app/*" element={<CarbonFlowShell isDemoMode={true} />} />
            {/* Backward-compatible redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Clerk Auth Pages */}
            <Route path="/login/*" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignupPage />} />

            {/* Canonical Operations Routes (Unified under /app/*) */}
            <Route
              path="/app/*"
              element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              }
            />

            {/* Backward compatibility redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
