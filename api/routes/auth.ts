import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../src/models/User';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
if (JWT_SECRET === 'your_default_jwt_secret') {
  console.warn('Warning: JWT_SECRET is not set in environment variables. Using a default, insecure secret.');
}

const sanitizeRequired = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const createToken = (user: { id: string; role: string; email: string }) => {
  const payload = { user };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });
};

router.post('/register', async (req, res) => {
  const email = sanitizeRequired(req.body?.email).toLowerCase();
  const password = sanitizeRequired(req.body?.password);

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email y password son obligatorios.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
      role: (await User.countDocuments({})) === 0 ? 'admin' : 'user',
    });

    await user.save();

    const token = createToken({ id: String(user._id), role: user.role, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error(getErrorMessage(error, 'Unknown error'));
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const email = sanitizeRequired(req.body?.email).toLowerCase();
  const password = sanitizeRequired(req.body?.password);

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email y password son obligatorios.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = createToken({ id: String(user._id), role: user.role, email: user.email });

    res.json({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error(getErrorMessage(error, 'Unknown error'));
    res.status(500).send('Server Error');
  }
});

router.post('/bootstrap-admin', async (_req, res) => {
  const email = 'admin@admin.com';
  const password = 'admin';

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.password = password;
      user.role = 'admin';
      await user.save();
    } else {
      user = await User.create({
        email,
        password,
        role: 'admin',
      });
    }

    const token = createToken({ id: String(user._id), role: user.role, email: user.email });

    res.json({
      msg: 'Usuario admin listo.',
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error(getErrorMessage(error, 'Unknown error'));
    res.status(500).json({ msg: 'No se pudo crear/actualizar el admin.' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: 'No autorizado.' });
    }

    const user = await User.findById(userId).select('_id email role');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado.' });
    }

    res.json({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
  } catch {
    res.status(500).json({ msg: 'No se pudo obtener el usuario.' });
  }
});

export default router;
