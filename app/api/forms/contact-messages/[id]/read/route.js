import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ContactMessage from '@/models/ContactMessage';
import { connectDB } from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const toPublicMessage = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    name: String(raw.name || ''),
    email: String(raw.email || ''),
    subject: raw.subject ?? null,
    message: String(raw.message || ''),
    is_read: Boolean(raw.isRead),
    created_at: new Date(String(raw.createdAt)).toISOString(),
  };
};

export async function PATCH(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      params.id,
      { isRead: true },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json({ msg: 'Mensaje no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(toPublicMessage(updated));
  } catch {
    return NextResponse.json({ msg: 'No se pudo actualizar el mensaje.' }, { status: 500 });
  }
}
