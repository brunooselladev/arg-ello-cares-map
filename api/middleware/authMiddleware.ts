import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

export interface TokenUser {
  id: string;
  role: string;
  email: string;
}

interface TokenPayload extends JwtPayload {
  user: TokenUser;
}

export interface AuthRequest extends Request {
  user?: TokenUser;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admin role required.' });
  }
  next();
};
