// src/app/api/tools/[toolId]/like/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db'; // Adjust path to your Drizzle client instance
import { likes, tools } // Assuming 'tools' table is needed for validation or future use
    from '@/db/schema'; // Adjust path to your schema
import { requireAuth } from '@/lib/requireAuth'; // Adjust path to your requireAuth
import { eq, and, sql } from 'drizzle-orm';

// Handler for Liking a Tool
const likeToolHandler = async (request, authContext) => {
  const { toolId } = request.params; // Params from the URL
  const userId = authContext.user.id;

  if (!toolId) {
    return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
  }

  try {
    // Optional: Check if the tool actually exists
    const [toolExists] = await db.select({ id: tools.id }).from(tools).where(eq(tools.id, toolId)).limit(1);
    if (!toolExists) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    // Check if already liked
    const [existingLike] = await db.select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.toolId, toolId)))
      .limit(1);

    if (existingLike) {
      return NextResponse.json({ message: 'Tool already liked', liked: true }, { status: 200 });
    }

    await db.insert(likes).values({ userId, toolId });
    return NextResponse.json({ message: 'Tool liked successfully', liked: true }, { status: 201 });
  } catch (error) {
    console.error('Error liking tool:', error);
    return NextResponse.json({ message: 'Failed to like tool', error: error.message }, { status: 500 });
  }
};

// Handler for Unliking a Tool
const unlikeToolHandler = async (request, authContext) => {
  const { toolId } = request.params;
  const userId = authContext.user.id;

  if (!toolId) {
    return NextResponse.json({ message: 'Tool ID is required' }, { status: 400 });
  }

  try {
    // Optional: Check if the tool actually exists (consistency)
    const [toolExists] = await db.select({ id: tools.id }).from(tools).where(eq(tools.id, toolId)).limit(1);
    if (!toolExists) {
        return NextResponse.json({ message: 'Tool not found' }, { status: 404 });
    }

    const result = await db.delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.toolId, toolId)))
      .returning({ deletedId: likes.toolId }); // Optional: confirm what was deleted

    if (result.length > 0) {
       return NextResponse.json({ message: 'Tool unliked successfully', liked: false }, { status: 200 });
    } else {
       // This means the like didn't exist for this user and tool
       return NextResponse.json({ message: 'Like not found or already unliked', liked: false }, { status: 404 });
    }
  } catch (error) {
    console.error('Error unliking tool:', error);
    return NextResponse.json({ message: 'Failed to unlike tool', error: error.message }, { status: 500 });
  }
};

// Export wrapped handlers
// Note: To get params like [toolId] in App Router, the `params` object is the second argument to the handler
// So, requireAuth might need a slight adjustment if it doesn't pass it, or we access it differently.
// Assuming `request.params` can be populated by a wrapper or middleware if `requireAuth` doesn't pass it.
// A common pattern is `export const POST = async (request, { params }) => { ... }`
// Let's adjust how params are accessed, assuming the standard App Router signature.

export const POST = async (request, { params }) => { // { params } is the second argument for route handlers
    return requireAuth(async (req, authContext) => likeToolHandler({ ...req, params }, authContext))(request);
};

export const DELETE = async (request, { params }) => {
    return requireAuth(async (req, authContext) => unlikeToolHandler({ ...req, params }, authContext))(request);
};