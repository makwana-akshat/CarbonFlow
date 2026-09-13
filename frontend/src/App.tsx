import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { CarbonFlowShell } from './components/shell/CarbonFlowShell';
import Section01 from './components/landing/section01/Section01';
import Section02 from './components/landing/section02/Section02';
import Section03 from './components/landing/section03/Section03';
import Section04 from './components/landing/section04/Section04';
import Section05 from './components/landing/section05/Section05';
import FinalSection from './components/landing/final/FinalSection';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function LandingPage() {
  return (
    <main className="w-full bg-[#03000a] text-white">
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
      <FinalSection />
    </main>
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
            <Route path="/sign-in/*" element={<Navigate to="/login" replace />} />
            <Route path="/sign-up/*" element={<Navigate to="/signup" replace />} />

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
