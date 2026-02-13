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

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
    }

    user = new User({
      email,
      password,
      role: (await User.countDocuments({})) === 0 ? 'admin' : 'user',
    });

    await user.save();

    const token = createToken({ id: String(user._id), role: user.role, email: user.email });

    return NextResponse.json(
      {
        token,
        user: {
          id: String(user._id),
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ msg: getErrorMessage(error, 'Server Error') }, { status: 500 });
  }
}
