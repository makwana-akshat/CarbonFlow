import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-screen bg-[var(--paper)] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold font-mono text-sm animate-pulse shadow-md">
          CF
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-ping" />
          <span>Verifying telemetry session...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Preserve requested path in state for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
