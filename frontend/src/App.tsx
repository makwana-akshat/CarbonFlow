import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { UserMenu } from './components/auth/UserMenu';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">CarbonFlow Marketplace</Link>
              <nav>
                <SignedOut>
                  <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                    <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors">Sign Up</Link>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                    <UserMenu />
                  </div>
                </SignedIn>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={
                <div className="px-4 py-12 sm:px-0">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center space-y-6">
                    <h2 className="text-4xl font-extrabold text-gray-900">Welcome to CarbonFlow</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                      The premier marketplace connecting CO₂ suppliers with utilization products. 
                      Sign up to access the platform.
                    </p>
                    <SignedOut>
                      <div className="pt-4">
                        <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg shadow-sm transition-all hover:shadow-md">Get Started Now</Link>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              } />
              <Route path="/login/*" element={<LoginPage />} />
              <Route path="/signup/*" element={<SignupPage />} />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <DashboardPage />
                </AuthGuard>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
