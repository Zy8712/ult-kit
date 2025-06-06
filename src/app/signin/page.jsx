// src/app/signin/page.jsx
'use client';

import React from 'react';
import SignInForm from '@/components/auth/SignInForm'; // Assuming SignInForm is in src/components/auth/

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h1>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}

// For title, export metadata (if this were a server component or in a layout)
// export const metadata = { title: 'Sign In - Your App Name' };