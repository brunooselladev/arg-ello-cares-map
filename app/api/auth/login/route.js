import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/server/db';
import { createToken } from '@/server/auth';
import { parseJson, getErrorMessage } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');

export async function POST(request) {
  const body = await parseJson(request);
  const email = sanitizeRequired(body?.email).toLowerCase();
  const password = sanitizeRequired(body?.password);

  if (!email || !password) {
    return NextResponse.json({ msg: 'Email y password son obligatorios.' }, { status: 400 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
    }

    const token = createToken({ id: String(user._id), role: user.role, email: user.email });

    return NextResponse.json({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ msg: getErrorMessage(error, 'Server Error') }, { status: 500 });
  }
}
