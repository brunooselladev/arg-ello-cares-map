import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/models/Banner';
import { connectDB } from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const deleted = await Banner.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ msg: 'Banner no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Banner eliminado.' });
  } catch {
    return NextResponse.json({ msg: 'No se pudo eliminar el banner.' }, { status: 500 });
  }
}
