import { NextResponse } from 'next/server';
import MapPoint, { mapPointTypes } from '@/models/MapPoint';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const isValidType = (value) => typeof value === 'string' && mapPointTypes.includes(value);

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');

const sanitizeOptional = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toPublicMapPoint = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    name: String(raw.name || ''),
    description: raw.description ?? null,
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    point_type: String(raw.pointType),
    address: raw.address ?? null,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    is_active: Boolean(raw.isActive),
    created_at: new Date(String(raw.createdAt)).toISOString(),
    updated_at: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

export async function GET(request) {
  try {
    await connectDB();

    const filter = {};
    const search = request.nextUrl.searchParams;
    const pointType = search.get('point_type');

    if (pointType && isValidType(pointType)) {
      filter.pointType = pointType;
    }

    if (search.get('only_active') === 'true') {
      filter.isActive = true;
    }

    const points = await MapPoint.find(filter).sort({ name: 1 });
    return NextResponse.json(points.map((point) => toPublicMapPoint(point)));
  } catch {
    return NextResponse.json({ msg: 'No se pudieron obtener los puntos del mapa.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const name = sanitizeRequired(body?.name);
    const latitude = parseNumber(body?.latitude);
    const longitude = parseNumber(body?.longitude);
    const pointType = body?.point_type;

    if (!name || latitude === null || longitude === null || !isValidType(pointType)) {
      return NextResponse.json(
        { msg: 'Faltan campos obligatorios para crear el punto.' },
        { status: 400 },
      );
    }

    const created = await MapPoint.create({
      name,
      description: sanitizeOptional(body?.description),
      latitude,
      longitude,
      pointType,
      address: sanitizeOptional(body?.address),
      phone: sanitizeOptional(body?.phone),
      email: sanitizeOptional(body?.email),
      isActive: typeof body?.is_active === 'boolean' ? body.is_active : true,
    });

    return NextResponse.json(toPublicMapPoint(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo crear el punto.' }, { status: 500 });
  }
}
