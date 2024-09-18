import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserIdFromToken = (): string | null => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
    if (!token) {
      console.error('No token found in cookies');
      return null;
    }
    try {
      // Decode the token to extract the userId
      const decodedToken: DecodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
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

  export function getTokenFromCookies() {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));
    
    return cookie ? cookie.split('=')[1] : null;
  }