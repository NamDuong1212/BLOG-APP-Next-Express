"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to / if user is already authenticated
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; // Show a loading indicator while session status is being checked
  }

  return (
    <div>
      <LoginForm /> {/* Render the login form if not authenticated */}
    </div>
  );
};

export default Login;
