// src/components/navbar-components/AuthStatusLinks.jsx (or wherever you place it)
'use client'; // This component uses client-side hooks

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // For App Router
import { signOutUser } from '@/lib/authSlice'; // Adjust path to your store

export default function AuthStatusLinks() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSignOut = async () => {
        await dispatch(signOutUser());
        router.push('/'); // Redirect to home or sign-in page after sign out
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-x-3">
                <span className="text-sm text-gray-200 hidden md:inline"> {/* Light text for dark navbar */}
                    {user?.email ? user.email.split('@')[0] : 'User'}
                </span>
                <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white hidden sm:block">
                    Dashboard
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-auto h-10 px-4 grid place-items-center rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold font-theme-orbitron text-xs sm:text-sm border-2 border-solid border-transparent hover:border-white"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    // Not authenticated
    return (
        <div className="w-auto h-14 flex items-center text-white font-semibold font-theme-orbitron text-sm gap-x-2">
            <Link href="/signin" className="w-20 sm:w-24 h-10 grid place-items-center rounded-md hover:bg-white hover:bg-opacity-10">
                Sign In {/* Changed from Login to Sign In for consistency */}
            </Link>
            <Link href="/signup" className="w-20 sm:w-24 h-10 grid place-items-center rounded-md bg-gradient-to-tr from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-2 border-solid border-white">
                Sign Up
            </Link>
        </div>
    );
}