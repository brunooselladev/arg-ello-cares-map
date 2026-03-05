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

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
};

const sanitizeActivities = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((a) => ({
    name: typeof a?.name === 'string' ? a.name.trim() || null : null,
    activity_type: ['principal', 'secundaria'].includes(a?.activity_type) ? a.activity_type : 'principal',
    description: typeof a?.description === 'string' ? a.description.trim() || null : null,
    schedule: typeof a?.schedule === 'string' ? a.schedule.trim() || null : null,
    confirmation: typeof a?.confirmation === 'string' ? a.confirmation.trim() || null : null,
    confirmation_other: typeof a?.confirmation_other === 'string' ? a.confirmation_other.trim() || null : null,
  }));
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
    barrio: raw.barrio ?? null,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    responsible: raw.responsible ?? null,
    organization_types: Array.isArray(raw.organizationTypes) ? raw.organizationTypes : [],
    target_populations: Array.isArray(raw.targetPopulations) ? raw.targetPopulations : [],
    has_internet: raw.hasInternet ?? null,
    has_device: raw.hasDevice ?? null,
    activities: Array.isArray(raw.activities) ? raw.activities : [],
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
      barrio: sanitizeOptional(body?.barrio),
      phone: sanitizeOptional(body?.phone),
      email: sanitizeOptional(body?.email),
      responsible: sanitizeOptional(body?.responsible),
      organizationTypes: sanitizeStringArray(body?.organization_types),
      targetPopulations: sanitizeStringArray(body?.target_populations),
      hasInternet: typeof body?.has_internet === 'boolean' ? body.has_internet : null,
      hasDevice: typeof body?.has_device === 'boolean' ? body.has_device : null,
      activities: sanitizeActivities(body?.activities),
      isActive: typeof body?.is_active === 'boolean' ? body.is_active : true,
    });

    return NextResponse.json(toPublicMapPoint(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo crear el punto.' }, { status: 500 });
  }
}
