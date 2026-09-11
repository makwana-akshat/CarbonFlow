import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <SignIn routing="path" path="/login" signUpUrl="/signup" forceRedirectUrl="/dashboard" />
    </div>
  );
};
