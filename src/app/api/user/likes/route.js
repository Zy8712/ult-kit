// src/app/api/user/likes/route.js
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { likes, tools } from '@/db/schema';
import { requireAuth } from '@/lib/requireAuth';
import { eq, desc } from 'drizzle-orm';

const getUserLikedToolsHandler = async (request, authContext) => {
  const userId = authContext.user.id;
  try {
    const likedToolsData = await db.select({
        // Select all necessary fields from the 'tools' table
        // This assumes your flattened tool schema is in 'tools'
        toolId: tools.id,
        name: tools.name,
        description: tools.description,
        logoUrl: tools.logoUrl,
        officialLink: tools.officialLink,
        // Add all other fields from 'tools' table that UltimateToolCard expects
        // ...
        likedAt: likes.createdAt // also get when it was liked
      })
      .from(likes)
      .innerJoin(tools, eq(likes.toolId, tools.id))
      .where(eq(likes.userId, userId))
      .orderBy(desc(likes.createdAt)); // Or by tool name, etc.

    return NextResponse.json(likedToolsData, { status: 200 });
  } catch (error) {
    console.error('Error fetching liked tools:', error);
    return NextResponse.json({ message: 'Failed to fetch liked tools', error: error.message }, { status: 500 });
  }
};

export const GET = requireAuth(getUserLikedToolsHandler);