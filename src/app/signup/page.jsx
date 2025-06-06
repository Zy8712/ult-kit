// src/app/signup/page.jsx
'use client'; // This page uses client-side components and potentially hooks if SignUpForm does

import React from 'react';
import SignUpForm from '@/components/auth/SignUpForm'; // Assuming SignUpForm is in src/components/auth/
import Head from 'next/head'; // next/head is not used in App Router for <title>. Use Metadata API in layout.js or page.js.

// For App Router, metadata is handled differently.
// You can export a metadata object or generateMetadata function.
// Since this is a client component primarily for rendering the form,
// we might set the title in the nearest layout.js or keep it simple here for now.
// For a simple title, you can use the document.title directly in a useEffect,
// but the Metadata API is preferred for SEO.

export default function SignUpPage() {
  // If you need to set document.title directly in a client component:
  // useEffect(() => {
  //   document.title = "Sign Up - Your App Name";
  // }, []);

  return (
    <>
      {/*
        For App Router, <Head> from next/head is not used.
        Instead, export a 'metadata' object or 'generateMetadata' function
        from your page.js or layout.js file for SEO and titles.
        Example (if this were a Server Component or for a parent layout.js):
        export const metadata = { title: 'Sign Up - Your App Name' };
      */}
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h1>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <SignUpForm />
        </div>
      </div>
    </>
  );
}