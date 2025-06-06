// src/components/Auth/SignInForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestSignIn, verifySignIn, clearAuthError, setSignInEmail as setStoreSignInEmail, resetSignInFlow } from '@/lib/authSlice'; // Adjust path
import { useRouter } from 'next/navigation'; // Use from next/navigation for App Router

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    signInEmail, // Email for which code was sent
    isCodeSent,
    signInLoading,
    signInError,
    isAuthenticated
  } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (isAuthenticated) {
      router.push('/dashboard'); // Or your desired redirect path
    }
    // Cleanup on unmount or if flow is reset
    return () => {
        // dispatch(resetSignInFlow()); // Or handle reset more selectively
    };
  }, [isAuthenticated, router, dispatch]);


  const handleRequestCode = async (e) => {
    e.preventDefault();
    setMessage('');
    dispatch(clearAuthError());
    const resultAction = await dispatch(requestSignIn({ email }));
    if (requestSignIn.fulfilled.match(resultAction)) {
      dispatch(setStoreSignInEmail(email)); // Store the email in Redux for the next step
      setMessage(resultAction.payload.message || 'Sign-in code sent. Check your email.');
    } else {
      setMessage(resultAction.payload || 'Failed to send sign-in code.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');
    dispatch(clearAuthError());
    // signInEmail should be the email for which the code was sent (from Redux store)
    const resultAction = await dispatch(verifySignIn({ email: signInEmail, token: code }));
    if (verifySignIn.fulfilled.match(resultAction)) {
      setMessage('Sign-in successful! Redirecting...');
      // Redirection is handled by useEffect or you can do it here
      // router.push('/dashboard');
      dispatch(resetSignInFlow());
    } else {
      setMessage(resultAction.payload || 'Invalid or expired code.');
    }
  };

  if (isCodeSent) {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-4 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Enter Code</h2>
        <p className="text-sm text-center text-gray-600">A sign-in code was sent to <strong>{signInEmail}</strong>.</p>
        {message && <p className={`text-center ${signInError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        {signInError && !message && <p className="text-red-500 text-center">{signInError}</p>}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={signInLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50"
          >
            {signInLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </div>
        <button type="button" onClick={() => dispatch(resetSignInFlow())} className="text-sm text-indigo-600 hover:text-indigo-500 text-center w-full mt-2">
            Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequestCode} className="space-y-4 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Sign In</h2>
      {message && <p className={`text-center ${signInError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      {signInError && !message && <p className="text-red-500 text-center">{signInError}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={signInLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50"
        >
          {signInLoading ? 'Sending Code...' : 'Send Sign-In Code'}
        </button>
      </div>
    </form>
  );
}