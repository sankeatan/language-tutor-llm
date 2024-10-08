import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isStaticAsset } from './lib/utils';

// Helper to set tokens in the response cookies
const setTokensInResponse = (response: NextResponse, newAccessToken: string, newRefreshToken: string) => {
  response.cookies.set('token', newAccessToken, { httpOnly: true, secure: true });
  response.cookies.set('refresh_token', newRefreshToken, { httpOnly: true, secure: true });
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

  // Skip authentication if it's disabled
  if (!enableAuth) {
    console.log('Authentication disabled, skipping auth middleware.');
    return NextResponse.next();
  }

  if (isStaticAsset(pathname)) {
    return NextResponse.next();  // Allow static assets to load normally
  }

  const accessToken = req.cookies.get('token');
  const refreshToken = req.cookies.get('refresh_token');

  console.log('Middleware triggered');
  console.log('Middleware Access Token:', accessToken);
  console.log('Middleware Refresh Token:', refreshToken);

  // If no token, redirect to login
  if (!accessToken) {
    console.log("No access token found, redirecting to login.");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verify the token with the API
  const tokenValidationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  console.log('Token validation response:', tokenValidationResponse.status);

  // If token is valid, continue
  if (tokenValidationResponse.ok) {
    console.log('Token valid, continuing request');
    return NextResponse.next();
  }

  // If access token is invalid or expired, attempt to refresh it using the refresh token
  if (refreshToken) {
    console.log('Attempting to refresh token...');
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    console.log('Refresh token response:', refreshResponse.status);

    // If the refresh token is valid and new tokens are returned
    if (refreshResponse.ok) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
      const response = NextResponse.next();

      // Set the new tokens in cookies
      setTokensInResponse(response, newAccessToken, newRefreshToken);

      return response;
    }
  }

  // If token refresh fails, redirect to login
  console.log("Token refresh failed or no valid refresh token, redirecting to login.");
  return NextResponse.redirect(new URL('/login', req.url));
}

// Apply the middleware to specific routes
export const config = {
  matcher: ['/((?!login|sign-up|_next|static|favicon.ico).*)'],
};
