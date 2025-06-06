// src/app/api/lists/[listId]/items/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { lists, listItems, tools } from '@/db/schema';
import { requireAuth } from '@/lib/requireAuth';
import { eq, and } from 'drizzle-orm';

// Helper to check list ownership
async function verifyListOwnership(listId, userId) {
  if (isNaN(parseInt(listId))) return null;
  const [list] = await db
    .select({ id: lists.id, userId: lists.userId })
    .from(lists)
    .where(eq(lists.id, parseInt(listId)))
    .limit(1);
  return list && list.userId === userId ? list : null;
}

// Handler for Adding a Tool to a List
const addToolToListHandler = async (request, params, authContext) => {
  const { listId } = params;
  const userId = authContext.user.id;

  const ownedList = await verifyListOwnership(listId, userId);
  if (!ownedList) {
    return NextResponse.json(
      { message: 'List not found or you do not have permission.' },
      { status: 404 }
    );
  }

  try {
    const { toolId } = await request.json();
    if (!toolId) {
      return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
    }

    const [toolExists] = await db
      .select({ id: tools.id })
      .from(tools)
      .where(eq(tools.id, toolId))
      .limit(1);
    if (!toolExists) {
      return NextResponse.json(
        { message: `Tool with ID ${toolId} does not exist.` },
        { status: 404 }
      );
    }

    const [existingItem] = await db
      .select()
      .from(listItems)
      .where(and(eq(listItems.listId, parseInt(listId)), eq(listItems.toolId, toolId)))
      .limit(1);

    if (existingItem) {
      return NextResponse.json(
        { message: 'Tool already in this list' },
        { status: 409 }
      );
    }

    const [newItem] = await db
      .insert(listItems)
      .values({ listId: parseInt(listId), toolId })
      .returning();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding tool to list:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    if (error.code === '23503') {
      return NextResponse.json(
        { message: 'Tool does not exist or cannot be added.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to add tool to list', error: error.message },
      { status: 500 }
    );
  }
};

// Handler for Removing a Tool from a List
const removeToolFromListHandler = async (request, params, authContext) => {
  const { listId } = params;
  const userId = authContext.user.id;

  const ownedList = await verifyListOwnership(listId, userId);
  if (!ownedList) {
    return NextResponse.json(
      { message: 'List not found or you do not have permission.' },
      { status: 404 }
    );
  }

  try {
    const { toolId } = await request.json();
    if (!toolId) {
      return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
    }

    const result = await db
      .delete(listItems)
      .where(and(eq(listItems.listId, parseInt(listId)), eq(listItems.toolId, toolId)))
      .returning({ deletedToolId: listItems.toolId });

    if (result.length > 0) {
      return NextResponse.json(
        { message: 'Tool removed from list successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Tool not found in this list or already removed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error removing tool from list:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Failed to remove tool from list', error: error.message },
      { status: 500 }
    );
  }
};

// Export wrapped handlers
export const POST = async (request, context) => {
  return requireAuth((req, authContext) => addToolToListHandler(req, context.params, authContext))(request);
};

export const DELETE = async (request, context) => {
  return requireAuth((req, authContext) => removeToolFromListHandler(req, context.params, authContext))(request);
};
