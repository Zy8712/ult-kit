// src/app/api/auth/request-signin/route.js
import { db } from '@/db';
import { users, signInTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/resend'; // Your Resend client
import { generateVerificationCode, generateSecureToken } from '@/lib/authUtils';
import { NextResponse } from 'next/server';

const TOKEN_EXPIRY_MINUTES = 15; // Code/Token expiry time

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { message: 'No account found with this email. Please sign up first.' },
        { status: 404 }
      );
    }

    const userId = existingUser[0].id;

    // Generate a code (or token for magic link)
    const verificationCode = generateVerificationCode(); // e.g., "123456"
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // Store the code/token in the database
    await db.insert(signInTokens).values({
      email: normalizedEmail,
      userId: userId,
      token: verificationCode,
      expiresAt: expiresAt,
    });

    // Send email using Resend
    const emailHtml = `
      <div>
        <h1>Your Sign-In Code</h1>
        <p>Enter this code to sign in: <strong>${verificationCode}</strong></p>
        <p>This code will expire in ${TOKEN_EXPIRY_MINUTES} minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'verify@onresend.com', // Replace with your verified Resend 'from' address
      to: [normalizedEmail],
      subject: 'Your Sign-In Code for [Your App Name]',
      html: emailHtml,
    });

    return NextResponse.json(
      { message: `Sign-in code sent to ${normalizedEmail}. Check your inbox.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Request sign-in error:', error);
    if (error.name === 'ResendError') {
      console.error('Resend specific error:', error.message, error.data);
    }
    return NextResponse.json(
      { message: 'Internal server error while sending code.' },
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