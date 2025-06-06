// src/app/lists/[listId]/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation'; // useParams to get listId
import Link from 'next/link';
import { fetchListDetails, removeToolFromList, deleteList, clearCurrentList, clearListsError } from '@/lib/listsSlice'; // Adjust path
import PageShiftNavLayout from '@/layouts/PageShiftNavLayout';

export default function ListDetailPage() {
  const router = useRouter();
  const params = useParams(); // Hook to access dynamic route parameters
  const listId = params.listId; // Get listId from the URL

  const dispatch = useDispatch();

  const { isAuthenticated, isLoading: authIsLoading } = useSelector((state) => state.auth);
  const { currentList, status: listStatus, error: listError } = useSelector((state) => state.lists);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated && listId) {
      dispatch(fetchListDetails(listId));
    }
    return () => {
      dispatch(clearCurrentList());
      dispatch(clearListsError());
    };
  }, [isAuthenticated, listId, dispatch]);

  const handleRemoveTool = async (toolId) => {
    // Ensure currentList and currentList.id are valid before proceeding
    if (!currentList || !currentList.id || !toolId) return;
    setMessage('');
    const result = await dispatch(removeToolFromList({ listId: currentList.id, toolId }));
    if (removeToolFromList.fulfilled.match(result)) {
      setMessage('Tool removed successfully.');
    } else {
      setMessage(listError || 'Failed to remove tool.');
    }
  };

  const handleDeleteList = async () => {
    if (!currentList || !currentList.id) return;
    setMessage('');
    if (window.confirm(`Are you sure you want to delete the list "${currentList?.name}"?`)) {
      const result = await dispatch(deleteList(currentList.id)); // Pass currentList.id
      if (deleteList.fulfilled.match(result)) {
        router.push('/dashboard');
      } else {
        setMessage(listError || 'Failed to delete list.');
      }
    }
  };

  if (authIsLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading user...</p></div>;
  }
  // Use listStatus to show loading for the list itself
  if (listStatus === 'loading' && !currentList) { // Initial load of the list
    return <div className="min-h-screen flex items-center justify-center"><p>Loading list details...</p></div>;
  }
  // Handle case where list might not be found or error during fetch AFTER auth check
  if (!currentList && listStatus !== 'loading') {
    return (
      <main className="container mx-auto p-4">
        <p className="text-red-500">{listError || 'List not found or an error occurred.'}</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </main>
    );
  }
  // If currentList is null even after attempting to load (and not loading anymore), it implies an issue.
  if (!currentList) {
    return (
      <main className="container mx-auto p-4">
        <p className="text-gray-600">Could not load list details.</p>
        <Link href="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </main>
    );
  }


  return (
    <PageShiftNavLayout>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{currentList.name}</h1>
          <button
            onClick={handleDeleteList}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            disabled={listStatus === 'loading'}
          >
            Delete List
          </button>
        </div>

        {message && <p className={`mb-4 text-sm ${listError || message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

        {currentList.items && currentList.items.length > 0 ? (
          <ul className="space-y-4">
            {currentList.items.map((tool) => ( // Assuming items have toolId and other tool details
              <li key={tool.toolId || tool.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.description?.substring(0, 150)}...</p>
                  <a href={tool.officialLink || tool.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">
                    Visit Tool
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveTool(tool.toolId || tool.id)}
                  className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs"
                  disabled={listStatus === 'loading'}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">This list is empty. Add some tools from the main page!</p>
        )}
      </main>
    </PageShiftNavLayout>
  );
}