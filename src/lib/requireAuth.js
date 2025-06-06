// lib/requireAuth.js
import { verifyJwtToken } from './authUtils';
import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'app_session';

export function requireAuth(handler) {
  return async (request) => {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyJwtToken(sessionCookie);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Invalid or expired session' }, { status: 401 });
    }

    // Attach user info to request (not natively supported in Web API, so pass to handler manually)
    return handler(request, { user: { id: decoded.userId, email: decoded.email } });
  };
}
