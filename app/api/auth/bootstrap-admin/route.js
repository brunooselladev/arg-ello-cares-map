import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/server/db';
import { createToken } from '@/server/auth';
import { getErrorMessage } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const email = 'admin@admin.com';
  const password = 'admin123';

  try {
    await connectDB();

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

    return NextResponse.json({
      msg: 'Usuario admin listo. Credenciales: admin@admin.com / admin123',
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { msg: getErrorMessage(error, 'No se pudo crear/actualizar el admin.') },
      { status: 500 },
    );
  }
}
