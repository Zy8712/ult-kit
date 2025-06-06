// src/app/api/lists/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { lists } from '@/db/schema';
import { requireAuth } from '@/lib/requireAuth';
import { eq, asc } from 'drizzle-orm';

// Handler for Getting User's Lists
const getUserListsHandler = async (request, authContext) => {
  const userId = authContext.user.id;
  try {
    const userLists = await db.select()
      .from(lists)
      .where(eq(lists.userId, userId))
      .orderBy(asc(lists.name));
    return NextResponse.json(userLists, { status: 200 });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ message: 'Failed to fetch lists', error: error.message }, { status: 500 });
  }
};

// Handler for Creating a New List
const createListHandler = async (request, authContext) => {
  const userId = authContext.user.id;
  try {
    const { name } = await request.json(); // Get name from request body
    if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'List name is required' }, { status: 400 });
    }
    const [newList] = await db.insert(lists).values({ userId, name: name.trim() }).returning();
    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error('Error creating list:', error);
    // Handle potential JSON parsing errors if request body is not valid JSON
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create list', error: error.message }, { status: 500 });
  }
};

// Export wrapped handlers
export const GET = requireAuth(getUserListsHandler);
export const POST = requireAuth(createListHandler);