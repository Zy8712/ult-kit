// Assuming this file is src/components/tool-card-components/card-rendering-techniques/ToolCardPagination.jsx
'use client'; // Already a client component, which is good

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UltimateToolCard from '../UltimateToolCard'; // Adjust path if needed
import PaginationControl from '../PaginationControl';   // Adjust path if needed

// Import Redux actions/thunks
import { fetchTools, fetchLikedTools } from '@/lib/toolsSlice'; // Adjust path to your store
import { fetchUserLists } from '@/lib/listsSlice';      // Adjust path to your store

export default function ToolCardPagination() { // Removed data prop
    const dispatch = useDispatch();

    // Get tools data from Redux store
    const { items: tools, status: toolsStatus, error: toolsError } = useSelector((state) => state.tools);
    // Get authentication status to pre-fetch user-specific data
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    useEffect(() => {
        // Fetch all tools if they haven't been fetched yet
        if (toolsStatus === 'idle') {
            dispatch(fetchTools());
        }
        // If authenticated, also pre-fetch liked tools and user lists
        // This helps populate UltimateToolCard's dependent data quickly
        if (isAuthenticated) {
            // Consider adding status checks for these too if you want to avoid redundant fetches
            dispatch(fetchLikedTools());
            dispatch(fetchUserLists());
        }
    }, [toolsStatus, isAuthenticated, dispatch]);

    // Calculate the indices for the items to display on the current page
    // Use 'tools' from Redux store instead of 'data' prop
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = toolsStatus === 'succeeded' ? tools.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = toolsStatus === 'succeeded' ? Math.ceil(tools.length / itemsPerPage) : 0;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (toolsStatus === 'loading') {
        return <p className="w-full text-center text-gray-600 py-10">Loading tools...</p>;
    }

    if (toolsStatus === 'failed') {
        return <p className="w-full text-center text-red-500 py-10">Error loading tools: {toolsError}</p>;
    }

    if (toolsStatus !== 'succeeded' || tools.length === 0) {
        return <p className="w-full text-center text-gray-600 py-10">No tools found.</p>;
    }

    return (
        <>
            {currentItems.map((tool, index) => (
                // Ensure your UltimateToolCard expects the tool structure from the database
                // The key should be tool.id (or tool.primary_details.id if your Redux state keeps that structure)
                <UltimateToolCard tool={tool} key={tool.id || tool.primary_details?.id || index} />
            ))}

            {totalPages > 1 && (
                <div className="w-full mt-8 flex justify-center"> {/* Increased margin and centered */}
                    <PaginationControl
                        setCurrentPage={setCurrentPage}
                        handleNextPage={handleNextPage}
                        handlePrevPage={handlePrevPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </>
    );
}