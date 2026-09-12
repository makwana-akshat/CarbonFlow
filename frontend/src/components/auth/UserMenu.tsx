import React from 'react';
import { UserButton } from '@clerk/clerk-react';

export const UserMenu: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
