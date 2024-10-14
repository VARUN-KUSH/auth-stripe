// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
