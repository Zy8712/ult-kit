// src/app/api/auth/verify-signin/route.js
import { db } from '@/db';
import { users, signInTokens } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { generateJwtToken } from '@/lib/authUtils';
import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'app_session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { message: 'Email and code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Find valid token entry
    const [validTokenEntry] = await db.select()
      .from(signInTokens)
      .where(
        and(
          eq(signInTokens.email, normalizedEmail),
          eq(signInTokens.token, token),
          gt(signInTokens.expiresAt, new Date())
        )
      )
      .orderBy(signInTokens.createdAt)
      .limit(1);

    if (!validTokenEntry) {
      return NextResponse.json(
        { message: 'Invalid or expired sign-in code/link.' },
        { status: 400 }
      );
    }

    // Token is valid, fetch user
    const [user] = await db.select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, validTokenEntry.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found for this token.' },
        { status: 404 }
      );
    }

    // Invalidate the token (delete it)
    await db.delete(signInTokens).where(eq(signInTokens.id, validTokenEntry.id));

    // Generate JWT session token
    const sessionToken = generateJwtToken(user.id, user.email);

    // Create response with cookie
    const response = NextResponse.json(
      { message: 'Sign-in successful!', user },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verify sign-in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle magic link verification via GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required from query parameter.' },
        { status: 400 }
      );
    }

    // Find valid token entry for magic link
    const [validTokenEntry] = await db.select()
      .from(signInTokens)
      .where(
        and(
          eq(signInTokens.token, token),
          gt(signInTokens.expiresAt, new Date())
        )
      )
      .orderBy(signInTokens.createdAt)
      .limit(1);

    if (!validTokenEntry) {
      return NextResponse.json(
        { message: 'Invalid or expired sign-in code/link.' },
        { status: 400 }
      );
    }

    // Token is valid, fetch user
    const [user] = await db.select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, validTokenEntry.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found for this token.' },
        { status: 404 }
      );
    }

    // Invalidate the token (delete it)
    await db.delete(signInTokens).where(eq(signInTokens.id, validTokenEntry.id));

    // Generate JWT session token
    const sessionToken = generateJwtToken(user.id, user.email);

    // Create response with cookie
    const response = NextResponse.json(
      { message: 'Sign-in successful!', user },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Magic link verify error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}