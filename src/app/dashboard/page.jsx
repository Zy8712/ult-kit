// src/app/dashboard/page.jsx
'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // Use from next/navigation for App Router
import LikedToolsList from '@/components/dashboard/LikedToolsList'; // Adjust path
import UserLists from '@/components/dashboard/UserLists'; // Adjust path
import PageShiftNavLayout from '@/layouts/PageShiftNavLayout';

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authIsLoading, user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // If auth state is done loading and user is not authenticated, redirect
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/signin'); // Use replace to prevent back navigation to dashboard
    }
  }, [isAuthenticated, authIsLoading, router]);

  // Show loading state or null while checking auth, before redirect can happen
  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p> {/* Or a proper spinner component */}
      </div>
    );
  }

  // User is authenticated, render the dashboard
  return (
    <PageShiftNavLayout>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome to your Dashboard, {user?.email}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <LikedToolsList />
          </section>
          <section>
            <UserLists />
          </section>
        </div>
      </main>
    </PageShiftNavLayout>
  );
}

// For title, export metadata (if this were a server component or in a layout)
// export const metadata = { title: 'Dashboard - Your App Name' };