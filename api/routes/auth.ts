import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
if (JWT_SECRET === 'your_default_jwt_secret') {
    console.warn('Warning: JWT_SECRET is not set in environment variables. Using a default, insecure secret.');
}

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            // For now, let's make the first registered user an admin for testing
            role: (await User.countDocuments({})) === 0 ? 'admin' : 'user',
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                email: user.email,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;