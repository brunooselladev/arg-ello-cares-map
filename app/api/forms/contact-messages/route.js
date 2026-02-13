import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    await connectDB();

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages.map((message) => toPublicMessage(message)));
  } catch {
    return NextResponse.json({ msg: 'No se pudieron obtener los mensajes.' }, { status: 500 });
  }
}
