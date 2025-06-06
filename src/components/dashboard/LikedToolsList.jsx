// src/components/Dashboard/LikedToolsList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikedTools } from '@/lib/toolsSlice'; // Adjust path if this is where your slice is
// import Link from 'next/link'; // Not used in this version for "Visit Tool"

export default function LikedToolsList() {
  const dispatch = useDispatch();
  const { likedTools, likedToolsStatus, error } = useSelector((state) => state.tools);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && likedToolsStatus === 'idle') {
      dispatch(fetchLikedTools());
    }
  }, [isAuthenticated, likedToolsStatus, dispatch]);

  if (!isAuthenticated) {
    return <p className="text-gray-600">Please sign in to see your liked tools.</p>;
  }

  if (likedToolsStatus === 'loading') {
    return <p className="text-gray-600">Loading liked tools...</p>;
  }

  if (likedToolsStatus === 'failed') {
    return <p className="text-red-500">Error loading liked tools: {error}</p>;
  }

  if (!likedTools || likedTools.length === 0) { // Added a check for likedTools being null/undefined too
    return <p className="text-gray-600">You haven&apos;t liked any tools yet.</p>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Liked Tools</h2>
      <ul className="space-y-3">
        {likedTools.map((tool) => (
          // Use tool.toolId for the key, as this is the unique ID of the tool from the API
          <li key={tool.toolId} className="p-3 border rounded-md hover:bg-gray-50">
            <h3 className="font-medium text-gray-800">{tool.name || 'Unnamed Tool'}</h3>
            <p className="text-sm text-gray-500">
              {tool.description ? `${tool.description.substring(0,100)}...` : 'No description.'}
            </p>
            {/* Use tool.officialLink for the href attribute */}
            {tool.officialLink ? (
              <a
                href={tool.officialLink} // <<<< MODIFIED HERE
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline"
              >
                Visit Tool
              </a>
            ) : (
              <span className="text-sm text-gray-400">No link available</span>
            )}
            {/* You could add an "Unlike" button here too, reusing toggleLikeTool.
                Example:
                <button
                  onClick={() => dispatch(toggleLikeTool({ toolId: tool.toolId, isLiked: true }))}
                  className="text-xs text-red-500 hover:text-red-700 ml-2"
                >
                  Unlike
                </button>
            */}
          </li>
        ))}
      </ul>
    </div>
  );
}