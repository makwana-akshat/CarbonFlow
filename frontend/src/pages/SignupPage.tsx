import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const SignupPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <SignUp routing="path" path="/signup" signInUrl="/login" forceRedirectUrl="/dashboard" />
    </div>
  );
};
