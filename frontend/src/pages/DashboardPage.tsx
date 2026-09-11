import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { syncUser, getCurrentUser } from '../services/auth';

export const DashboardPage: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [appUser, setAppUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!user) return;
        const token = await getToken();
        
        await syncUser(token, {
          email: user.primaryEmailAddress?.emailAddress || '',
          first_name: user.firstName,
          last_name: user.lastName,
          image_url: user.imageUrl,
        });

        const profile = await getCurrentUser(token);
        setAppUser(profile);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize user');
      }
    };

    initializeUser();
  }, [user, getToken]);

  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
  if (!appUser) return <div className="p-8">Syncing profile to database...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
      <h2 className="text-2xl mb-4 font-bold text-gray-900">Welcome, {appUser.first_name || 'User'}!</h2>
      <div className="space-y-3 text-gray-700 text-lg">
        <p><span className="font-semibold text-gray-900 w-24 inline-block">Email:</span> {appUser.email}</p>
        <p><span className="font-semibold text-gray-900 w-24 inline-block">Role:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">{appUser.role}</span></p>
        <p><span className="font-semibold text-gray-900 w-24 inline-block">Clerk ID:</span> <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{appUser.clerk_user_id}</span></p>
        <p><span className="font-semibold text-gray-900 w-24 inline-block">Joined:</span> {new Date(appUser.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
