// src/pages/lists/[listId].js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // For App Router
import Head from 'next/head';
import Header from '../../components/Layout/Header'; // Adjust path
import { fetchListDetails, removeToolFromList, deleteList, clearCurrentList, clearListsError } from '../../store/slices/listsSlice'; // Adjust path
import Link from 'next/link';

export default function ListDetailPage() {
  const router = useRouter();
  const { listId } = router.query;
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
  const { currentList, status: listStatus, error: listError } = useSelector((state) => state.lists);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && listId) {
      dispatch(fetchListDetails(listId));
    }
    // Clear current list when component unmounts or listId changes
    return () => {
      dispatch(clearCurrentList());
      dispatch(clearListsError());
    };
  }, [isAuthenticated, listId, dispatch]);

  const handleRemoveTool = async (toolId) => {
    setMessage('');
    const result = await dispatch(removeToolFromList({ listId, toolId }));
    if (removeToolFromList.fulfilled.match(result)) {
        setMessage('Tool removed successfully.');
    } else {
        setMessage(listError || 'Failed to remove tool.');
    }
  };

  const handleDeleteList = async () => {
    setMessage('');
    if (window.confirm(`Are you sure you want to delete the list "${currentList?.name}"?`)) {
      const result = await dispatch(deleteList(listId));
      if (deleteList.fulfilled.match(result)) {
        router.push('/dashboard'); // Redirect after successful deletion
      } else {
        setMessage(listError || 'Failed to delete list.');
      }
    }
  };

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading user...</p></div>;
  }
  if (listStatus === 'loading' && !currentList) {
    return <div className="min-h-screen flex items-center justify-center"><Header /><p>Loading list details...</p></div>;
  }
  if (listStatus === 'failed' && !currentList) {
    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <p className="text-red-500">Error: {listError || 'Could not load this list. It might not exist or you may not have permission.'}</p>
                <Link href="/dashboard" legacyBehavior><a className="text-indigo-600 hover:underline">Back to Dashboard</a></Link>
            </main>
        </>
    );
  }
  if (!currentList) { // Fallback if list not found after loading attempt
    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <p className="text-gray-600">List not found.</p>
                <Link href="/dashboard" legacyBehavior><a className="text-indigo-600 hover:underline">Back to Dashboard</a></Link>
            </main>
        </>
    );
  }


  return (
    <>
      <Head>
        <title>{currentList?.name || 'List Details'} - Your App</title>
      </Head>
      <Header />
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

        {message && <p className={`mb-4 text-sm ${listError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

        {currentList.items && currentList.items.length > 0 ? (
          <ul className="space-y-4">
            {currentList.items.map((tool) => (
              <li key={tool.toolId} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.description?.substring(0,150)}...</p>
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">
                    Visit Tool
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveTool(tool.toolId)}
                  className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs"
                  disabled={listStatus === 'loading'}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">This list is empty. Add some tools!</p>
        )}
      </main>
    </>
  );
}