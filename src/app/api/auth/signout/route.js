// src/app/api/auth/signout/route.js
import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'app_session';

export async function POST(request) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );

    // Clear the session cookie
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}