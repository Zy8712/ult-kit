// src/app/api/auth/me/route.js
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyJwtToken } from '@/lib/authUtils';
import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'app_session';

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Create your account to get started.' },
        { status: 401 }
      );
    }

    const decodedToken = verifyJwtToken(sessionToken);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json(
        { message: 'Invalid session token' },
        { status: 401 }
      );
    }

    const [user] = await db.select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, decodedToken.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}