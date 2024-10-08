import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserIdFromToken = (): string | null  => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (!token) {
      console.error('No token found in cookies');
      return '';
    }
    try {
      // Decode the token to extract the userId
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  };

  // List of possible Spanish greetings
const greetings = [
  '¡Hola! ¿Cómo estás?',
  '¡Buenos días! ¿Cómo te sientes hoy?',
  '¡Hola! ¿Cómo te va?',
  '¡Hola! ¿Qué tal tu día?',
  '¡Buenos días! ¿Qué tal?',
  '¡Hola! ¿Cómo está todo?'
];

// Function to get a random greeting
export function getRandomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

  export function getTokenFromCookies(tokenName: 'token' | 'refresh_token'): string {
    if (typeof document !== 'undefined') {  // Check if we are in the browser environment
      const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${tokenName}=`));
  
      return cookie ? cookie.split('=')[1] : '';
    }
  
    return '';  // Return an empty string if running on the server (SSR)
  }

  // Helper to format time nicely (e.g., '2:34 PM', 'Yesterday', etc.)
  export function formatTime(lastUsed: Date) {
    return format(new Date(lastUsed), 'MMM d, yyyy h:mm a');
  };

  // Helper to extract initials from a name
  export function getInitials(name?: string) {
    if (!name || typeof name !== 'string') {
      return '';  // Return empty string if name is undefined or not a string
    }
  
    const [firstName = '', lastName = ''] = name.split(' ');
  
    // If there's no last name, return just the first initial
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }

  // Helper function to determine if the request is for a static asset
export function isStaticAsset (pathname: string) {
  return (
    pathname.startsWith('/_next') || // Next.js assets
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  );
};