// src/components/Dashboard/UserLists.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLists, createNewList, clearListsError } from '@/lib/listsSlice'; // Adjust path
import Link from 'next/link';

export default function UserLists() {
  const dispatch = useDispatch();
  const { userLists, status, error } = useSelector((state) => state.lists);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [newListName, setNewListName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchUserLists());
    }
  }, [isAuthenticated, status, dispatch]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) {
      setMessage('List name cannot be empty.');
      return;
    }
    setMessage('');
    dispatch(clearListsError());
    const result = await dispatch(createNewList({ name: newListName }));
    if (createNewList.fulfilled.match(result)) {
      setNewListName('');
      setMessage(`List "${result.payload.name}" created successfully!`);
    } else {
      setMessage(error || 'Failed to create list.');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-gray-600">Please sign in to manage your lists.</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Lists</h2>
      <form onSubmit={handleCreateList} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {status === 'loading' ? 'Creating...' : 'Create List'}
        </button>
      </form>
      {message && <p className={`text-sm mb-3 ${error ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

      {status === 'loading' && userLists.length === 0 && <p>Loading lists...</p>}
      {status === 'failed' && !error && <p className="text-red-500">Error loading lists.</p>}

      {userLists.length === 0 && status !== 'loading' && (
        <p className="text-gray-600">You have no lists yet. Create one above!</p>
      )}

      {userLists.length > 0 && (
        <ul className="space-y-2">
          {userLists.map((list) => (
            <li key={list.id} className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center">
              <Link href={`/lists/${list.id}`} className="text-blue-500 hover:underline">
                {list.name}
              </Link>
            </li>

          ))}
        </ul>
      )}
    </div>
  );
}