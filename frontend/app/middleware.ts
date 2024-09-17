import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
 // Check if the 'token' cookie is present
 const token = req.cookies.get('token');

 // If no token, redirect to the login page
 if (!token) {
   return NextResponse.redirect(new URL('/login', req.url));
 }

 // Return a promise to handle the asynchronous fetch request
 return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
   headers: {
     Cookie: `token=${token}`,
   },
 })
   .then((verifyResponse) => {
     // If the token is invalid, redirect to login
     if (!verifyResponse.ok) {
       return NextResponse.redirect(new URL('/login', req.url));
     }

     // If the token is valid, allow the user to continue
     return NextResponse.next();
   })
   .catch((err) => {
     // Handle any errors during the fetch
     console.error('Error verifying token:', err);
     return NextResponse.redirect(new URL('/login', req.url));
   });
}

// Apply the middleware to specific routes
export const config = {
 matcher: ['/', '/dashboard', '/chat/:path*'],
};
