import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Middleware is being triggered');
 // Check if the 'token' cookie is present
 const token = req.cookies.get('token');
 console.log("Token received:", token); // Debugging log

 // If no token, redirect to the login page
 if (!token) {
  console.log("No token found, redirecting to login."); // Debugging log
   return NextResponse.redirect(new URL('/login', req.url));
 }

 // Return a promise to handle the asynchronous fetch request
 return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
   headers: {
     Cookie: `token=${token}`,
   },
 })
   .then((verifyResponse) => {
    console.log("Token verification response:", verifyResponse.ok); // Debugging log
     // If the token is invalid, redirect to login
     if (!verifyResponse.ok) {
      console.log("Token is invalid, redirecting to login."); // Debugging log
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
 matcher: ['/:path*'],
};
