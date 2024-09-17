import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserIdFromToken () {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken: { userId: string } = jwtDecode(token);  // Assumes the JWT includes 'userId'
    return decodedToken.userId;
  }
  return null;
};
