import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the 'token' cookie is present
  const token = req.cookies.get('token');

  // If no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If token exists, allow the user to continue
  return NextResponse.next();
}

// Apply the middleware to specific routes
export const config = {
  matcher: ['/', '/dashboard', '/chat/:path*'], // Add routes you want to protect
};
