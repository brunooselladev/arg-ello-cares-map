import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/server/db';
import { requireAuth } from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const authUser = requireAuth(request);

    if (!authUser?.id) {
      return NextResponse.json({ msg: 'No autorizado.' }, { status: 401 });
    }

    const user = await User.findById(authUser.id).select('_id email role');
    if (!user) {
      return NextResponse.json({ msg: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    const status = typeof error?.status === 'number' ? error.status : 500;
    const message = error instanceof Error ? error.message : 'No se pudo obtener el usuario.';
    return NextResponse.json({ msg: message }, { status });
  }
}
