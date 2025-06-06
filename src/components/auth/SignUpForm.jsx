// src/components/auth/SignUpForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser, clearAuthError } from '@/lib/authSlice'; // Adjust path if needed

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    dispatch(clearAuthError());
    
    const resultAction = await dispatch(signUpUser({ email, accessCode }));
    
    if (signUpUser.fulfilled.match(resultAction)) {
      setMessage(resultAction.payload.message || 'Sign up successful! Please sign in.');
      setIsSuccess(true); // Set success state
      setEmail('');
      setAccessCode('');
    } else {
      // Error is already in Redux state, but you can set a local message too
      setMessage(resultAction.payload || 'Sign up failed. Please try again.');
      setIsSuccess(false); // Set error state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Create Account</h2>
      
      {/* Use isSuccess state instead of resultAction */}
      {message && (
        <p className={`text-center ${error || !isSuccess ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
      
      {/* Show Redux error if no local message */}
      {error && !message && <p className="text-red-500 text-center">{error}</p>}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
          Special Access Code
        </label>
        <input
          id="accessCode"
          name="accessCode"
          type="password"
          required
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
}