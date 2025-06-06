// src/app/api/auth/signup/route.js
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, accessCode } = body;

    if (!email || !accessCode) {
      return NextResponse.json(
        { message: 'Email and access code are required' },
        { status: 400 }
      );
    }

    // Validate access code
    if (accessCode !== process.env.SIGNUP_ACCESS_CODE) {
      return NextResponse.json(
        { message: 'Invalid access code' },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await db.insert(users).values({
      email: email.toLowerCase(),
    }).returning({ id: users.id, email: users.email });

    return NextResponse.json(
      { 
        message: 'Account created successfully! Please sign in.', 
        user: newUser[0] 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}