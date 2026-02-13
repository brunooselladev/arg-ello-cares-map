import { NextResponse } from 'next/server';
import Banner from '@/models/Banner';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');

const toPublicBanner = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    imageUrl: String(raw.imageUrl || ''),
    createdAt: new Date(String(raw.createdAt)).toISOString(),
  };
};

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return NextResponse.json(banners.map((banner) => toPublicBanner(banner)));
  } catch {
    return NextResponse.json({ msg: 'No se pudieron obtener los banners.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const imageUrl = sanitizeRequired(body?.imageUrl);
    if (!imageUrl) {
      return NextResponse.json({ msg: 'La imagen es obligatoria.' }, { status: 400 });
    }

    const count = await Banner.countDocuments();
    if (count >= 3) {
      return NextResponse.json({ msg: 'Solo se permiten hasta 3 banners.' }, { status: 400 });
    }

    const created = await Banner.create({ imageUrl });
    return NextResponse.json(toPublicBanner(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo crear el banner.' }, { status: 500 });
  }
}
