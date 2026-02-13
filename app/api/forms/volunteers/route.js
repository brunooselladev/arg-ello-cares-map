import { NextResponse } from 'next/server';
import Volunteer from '@/models/Volunteer';
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

const toPublicVolunteer = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    full_name: String(raw.fullName || ''),
    email: String(raw.email || ''),
    phone: raw.phone ?? null,
    message: raw.message ?? null,
    availability: raw.availability ?? null,
    created_at: new Date(String(raw.createdAt)).toISOString(),
  };
};

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const fullName = sanitizeRequired(body?.full_name);
    const email = sanitizeRequired(body?.email);

    if (!fullName || !email) {
      return NextResponse.json({ msg: 'Nombre y email son obligatorios.' }, { status: 400 });
    }

    const created = await Volunteer.create({
      fullName,
      email,
      phone: sanitizeOptional(body?.phone),
      message: sanitizeOptional(body?.message),
      availability: sanitizeOptional(body?.availability),
    });

    return NextResponse.json(toPublicVolunteer(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo registrar el voluntario.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return NextResponse.json(volunteers.map((volunteer) => toPublicVolunteer(volunteer)));
  } catch {
    return NextResponse.json({ msg: 'No se pudieron obtener voluntarios.' }, { status: 500 });
  }
}
