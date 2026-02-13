import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

export function createToken(user) {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: '5h' });
}

export function getBearerToken(request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function requireAuth(request) {
  const token = getBearerToken(request);
  if (!token) {
    const error = new Error('No token, authorization denied');
    error.status = 401;
    throw error;
  }

  try {
    const decoded = verifyToken(token);
    return decoded.user || null;
  } catch {
    const error = new Error('Token is not valid');
    error.status = 401;
    throw error;
  }
}

export function requireAdmin(request) {
  const user = requireAuth(request);
  if (!user || user.role !== 'admin') {
    const error = new Error('Access denied. Admin role required.');
    error.status = 403;
    throw error;
  }
  return user;
}
