import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { syncUser, getCurrentUser } from '../services/auth';
import { CarbonFlowShell } from '../components/shell/CarbonFlowShell';
import type { TabId } from '../types/dashboard';

export interface DashboardPageProps {
  initialTab?: TabId;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ initialTab = 'overview' }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [appUser, setAppUser] = useState<any>(null);

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
      } catch {
        // Graceful fallback to Clerk user profile if backend is not running
        setAppUser({
          email: user?.primaryEmailAddress?.emailAddress || 'operator@carbonflow.internal',
          first_name: user?.firstName || 'Operator',
          last_name: user?.lastName || '',
          role: 'buyer',
          clerk_user_id: user?.id,
          created_at: new Date().toISOString(),
        });
      }
    };

    initializeUser();
  }, [user, getToken]);

  return (
    <CarbonFlowShell
      initialTab={initialTab}
      appUser={
        appUser || {
          email: user?.primaryEmailAddress?.emailAddress || 'operator@carbonflow.internal',
          first_name: user?.firstName || 'Operator',
          last_name: user?.lastName || '',
          role: 'buyer',
        }
      }
    />
  );
};
