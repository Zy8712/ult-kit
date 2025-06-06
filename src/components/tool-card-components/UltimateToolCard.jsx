'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // For App Router

// Your existing presentational components
import {
    CardDescription, CardLinks, CardLogo, CardPreview,
    CardQuickDetails, CardTopLabel, /* CardTags, */ CardTitle,
    ToolCardBottomSection, ToolCardTopSection
} from "@/utils/toolCardComponents"; // Ensure this path is correct

// Your CardLikeButtonV2
import CardLikeButtonV2 from './CardLikeButtonV2'; // Assuming it's in the same folder or adjust path

// Redux actions/thunks (adjust paths if you don't use '@/' aliases)
import { toggleLikeTool } from '@/lib/toolsSlice';
import { fetchUserLists, addToolToList, createNewList, clearListsError } from '@/lib/listsSlice';

// A Re-usable Modal Component (define this in a separate file or adapt if you have one)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="relative mx-auto py-5 px-6 border w-full max-w-lg shadow-xl rounded-xl bg-white">
        <div className="text-left">
          <div className="flex justify-between items-center pb-3">
            <h3 className="text-xl leading-6 font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UltimateToolCard({ tool }) {
    const dispatch = useDispatch();
    const router = useRouter();

    // Auth state
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Tools state (for likes)
    const { likedTools = [] } = useSelector((state) => state.tools); // Renamed for clarity
    // Determine if the current tool is liked. Ensure tool and tool.id exist.
    // The tool.id from your DB schema is tool.primary_details.id from the JSON.
    const currentToolId = tool?.id;
    const isToolLiked = isAuthenticated &&
                        currentToolId &&
                        likedTools.some(likedTool => likedTool.toolId === currentToolId);
    // Lists state (for "Add to List" modal)
    const { userLists = [], status: listsStatus, error: listsError } = useSelector((state) => state.lists);

    // Modal local state
    const [showAddToListModal, setShowAddToListModal] = useState(false);
    const [selectedListId, setSelectedListId] = useState('');
    const [newListName, setNewListName] = useState('');
    const [listMessage, setListMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated && showAddToListModal && listsStatus !== 'succeeded' && listsStatus !== 'loading') {
            dispatch(fetchUserLists());
        }
    }, [isAuthenticated, showAddToListModal, listsStatus, dispatch]);

    const handleLikeToggle = () => { // This function will be passed to CardLikeButtonV2
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }
        if (currentToolId) {
            dispatch(toggleLikeTool({ toolId: currentToolId, isLiked: isToolLiked }));
        }
    };

    const openAddToListModal = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }
        if (!currentToolId) return;

        setShowAddToListModal(true);
        setListMessage('');
        setSelectedListId('');
        setNewListName('');
        dispatch(clearListsError());
    };

    const handleAddToolToExistingList = async () => {
        if (!selectedListId) {
            setListMessage('Please select a list.');
            return;
        }
        setListMessage('');
        dispatch(clearListsError());

        const result = await dispatch(addToolToList({ listId: selectedListId, toolId: currentToolId }));
        if (addToolToList.fulfilled.match(result)) {
            setListMessage(`Added '${tool.name}' to list successfully!`);
            setTimeout(() => setShowAddToListModal(false), 1500);
        } else {
            setListMessage(result.payload || listsError || 'Failed to add tool to list.');
        }
    };

    const handleCreateAndAddToList = async () => {
        if (!newListName.trim()) {
            setListMessage('Please enter a name for the new list.');
            return;
        }
        setListMessage('');
        dispatch(clearListsError());

        const newListAction = await dispatch(createNewList({ name: newListName }));
        if (createNewList.fulfilled.match(newListAction)) {
            const newList = newListAction.payload;
            const addResult = await dispatch(addToolToList({ listId: newList.id, toolId: currentToolId }));
            if (addToolToList.fulfilled.match(addResult)) {
                setListMessage(`Created list '${newList.name}' and added '${tool.name}'!`);
                setNewListName('');
                setTimeout(() => setShowAddToListModal(false), 1500);
            } else {
                setListMessage(`List '${newList.name}' created, but failed to add '${tool.name}'. You can try adding it again.`);
            }
        } else {
            setListMessage(newListAction.payload || listsError || 'Failed to create new list.');
        }
    };

    if (!tool || !tool.id) {
        return <div className="w-80 h-80 rounded-2xl bg-gray-200 animate-pulse"></div>; // Placeholder for invalid tool
    }

    return (
        <>
            <div className="relative w-80 h-80 rounded-2xl shadow-white shadow-sm hover:shadow-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-in-out group">
                {/* Passing the whole tool object, your sub-components expect this */}
                <CardTopLabel {...tool} />

                <div className="w-80 h-80 overflow-hidden rounded-2xl">
                    <ToolCardTopSection>
                        <CardPreview {...tool} />
                        <CardLogo {...tool} />
                        <CardLinks {...tool} />
                    </ToolCardTopSection>

                    <ToolCardBottomSection>
                        <CardTitle {...tool} />
                        <CardQuickDetails {...tool} />
                        <CardDescription {...tool} />
                    </ToolCardBottomSection>
                </div>

                {/* Use your CardLikeButtonV2 and pass necessary props */}
                <CardLikeButtonV2
                    isInitiallyLiked={isToolLiked}
                    onToggleLike={handleLikeToggle}
                    isAuthenticated={isAuthenticated}
                />

                {/* Add to List Button - position it as needed */}
                {isAuthenticated && (
                    <button
                        onClick={openAddToListModal}
                        className="absolute bottom-14 right-3 p-2.5 rounded-full bg-white text-gray-400 hover:text-blue-500 shadow hover:shadow-md transition-all duration-200 ease-in-out text-xl z-10" // Adjust positioning
                        title="Add to list"
                    >
                        ➕
                    </button>
                )}
            </div>

            {/* Modal for Adding to List */}
            <Modal isOpen={showAddToListModal} onClose={() => setShowAddToListModal(false)} title={`Add "${tool.name}" to a list`}>
                {listMessage && (
                    <p className={`text-sm mb-4 p-3 rounded-md ${listsError || listMessage.toLowerCase().includes('failed') || listMessage.toLowerCase().includes('issue') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {listMessage}
                    </p>
                )}
                {listsError && !(listMessage.toLowerCase().includes('failed') || listMessage.toLowerCase().includes('issue')) && (
                     <p className="text-sm mb-4 p-3 rounded-md bg-red-50 text-red-700">{listsError}</p>
                )}

                {listsStatus === 'loading' && !userLists.length && <p className="text-sm text-gray-500">Loading your lists...</p>}

                <div className="space-y-5">
                    <div>
                        <label htmlFor="existing-list-select" className="block text-md font-medium text-gray-800 mb-1.5">Add to Existing List</label>
                        {isAuthenticated && userLists.length > 0 ? (
                            <div className="flex items-center space-x-2">
                                <select
                                    id="existing-list-select"
                                    value={selectedListId}
                                    onChange={(e) => setSelectedListId(e.target.value)}
                                    className="block w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">-- Select a list --</option>
                                    {userLists.map((list) => (
                                        <option key={list.id} value={list.id}>{list.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddToolToExistingList}
                                    disabled={listsStatus === 'loading' || !selectedListId}
                                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium whitespace-nowrap disabled:opacity-60"
                                >
                                    Add
                                </button>
                            </div>
                        ) : (
                           isAuthenticated && listsStatus !== 'loading' && <p className="text-sm text-gray-500 italic">You currently have no lists. Try creating one below.</p>
                        )}
                         {!isAuthenticated && <p className="text-sm text-gray-500 italic">Please sign in to see and use your lists.</p>}
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div>
                        <label htmlFor="new-list-name" className="block text-md font-medium text-gray-800 mb-1.5">Or Create New List & Add</label>
                        <div className="flex items-center space-x-2">
                            <input
                                id="new-list-name"
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="Enter new list name"
                                className="block w-full text-sm px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={!isAuthenticated || listsStatus === 'loading'}
                            />
                            <button
                                onClick={handleCreateAndAddToList}
                                disabled={!isAuthenticated || listsStatus === 'loading' || !newListName.trim()}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium whitespace-nowrap disabled:opacity-60"
                            >
                                Create & Add
                            </button>
                        </div>
                         {!isAuthenticated && <p className="text-xs text-gray-500 mt-1 italic">Sign in to create new lists.</p>}
                    </div>
                </div>
            </Modal>
        </>
    );
}