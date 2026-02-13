import { NextResponse } from 'next/server';
import ContactMessage from '@/models/ContactMessage';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');

const sanitizeOptional = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

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

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const name = sanitizeRequired(body?.name);
    const email = sanitizeRequired(body?.email);
    const message = sanitizeRequired(body?.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { msg: 'Nombre, email y mensaje son obligatorios.' },
        { status: 400 },
      );
    }

    const created = await ContactMessage.create({
      name,
      email,
      subject: sanitizeOptional(body?.subject),
      message,
      isRead: false,
    });

    return NextResponse.json(toPublicMessage(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo enviar el mensaje.' }, { status: 500 });
  }
}
