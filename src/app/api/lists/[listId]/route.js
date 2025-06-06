// src/app/api/lists/[listId]/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { lists, listItems, tools } from '@/db/schema'; // Assuming tools needed for item details
import { requireAuth } from '@/lib/requireAuth';
import { eq, and, desc } from 'drizzle-orm';

// Helper to check list ownership (can be moved to a shared lib if used elsewhere)
async function verifyListOwnership(listId, userId) {
    if (isNaN(parseInt(listId))) return null;
    const [list] = await db.select({ id: lists.id, userId: lists.userId })
        .from(lists)
        .where(eq(lists.id, parseInt(listId)))
        .limit(1);
    if (!list || list.userId !== userId) return null;
    return list;
}

// Handler for Getting List Details (including its items)
const getListDetailsHandler = async (request, authContext) => {
  const { listId } = request.params; // params from the URL
  const userId = authContext.user.id;

  const ownedList = await verifyListOwnership(listId, userId);
  if (!ownedList) {
    return NextResponse.json({ message: 'List not found or you do not have permission.' }, { status: 404 });
  }

  try {
    const [listDetails] = await db.select().from(lists).where(eq(lists.id, parseInt(listId)));
    const items = await db.select({
        // Select specific fields from tools to avoid sending too much data
        toolId: tools.id,
        name: tools.name,
        description: tools.description,
        logoUrl: tools.logoUrl,
        officialLink: tools.officialLink,
        // ... other tool fields you want to display in the list
        addedAt: listItems.addedAt
      })
      .from(listItems)
      .innerJoin(tools, eq(listItems.toolId, tools.id))
      .where(eq(listItems.listId, parseInt(listId)))
      .orderBy(desc(listItems.addedAt)); // Or any other order

    return NextResponse.json({ ...listDetails, items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching list details:', error);
    return NextResponse.json({ message: 'Failed to fetch list details', error: error.message }, { status: 500 });
  }
};

// Handler for Deleting a List
const deleteListHandler = async (request, authContext) => {
  const { listId } = request.params;
  const userId = authContext.user.id;

  const ownedList = await verifyListOwnership(listId, userId);
  if (!ownedList) {
    return NextResponse.json({ message: 'List not found or you do not have permission.' }, { status: 404 });
  }

  try {
    // Drizzle doesn't automatically cascade deletes based on schema `onDelete: 'cascade'` for all drivers/setups.
    // It's safer to delete items first if your DB doesn't enforce it or if Drizzle's cascade isn't triggered.
    // However, if PostgreSQL foreign key `ON DELETE CASCADE` is set up correctly at DB level, this is not strictly needed.
    // await db.delete(listItems).where(eq(listItems.listId, parseInt(listId)));

    await db.delete(lists).where(and(eq(lists.id, parseInt(listId)), eq(lists.userId, userId))); // Extra check for userId
    return NextResponse.json({ message: 'List deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ message: 'Failed to delete list', error: error.message }, { status: 500 });
  }
};

// Export wrapped handlers
export const GET = async (request, { params }) => {
    return requireAuth(async (req, authContext) => getListDetailsHandler({ ...req, params }, authContext))(request);
};
export const DELETE = async (request, { params }) => {
    return requireAuth(async (req, authContext) => deleteListHandler({ ...req, params }, authContext))(request);
};

// You can add PUT for updating list name here if needed
// export const PUT = async (request, { params }) => { ... requireAuth(updateListHandler) ... };