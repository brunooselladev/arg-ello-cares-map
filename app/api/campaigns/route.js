import { NextResponse } from 'next/server';
import Campaign from '@/models/Campaign';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');

const sanitizeOptional = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const toPublicCampaign = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    title: String(raw.title || ''),
    description: raw.description ?? null,
    image_url: raw.imageUrl ?? null,
    video_url: raw.videoUrl ?? null,
    is_active: Boolean(raw.isActive),
    start_date: raw.startDate ? new Date(String(raw.startDate)).toISOString().slice(0, 10) : null,
    end_date: raw.endDate ? new Date(String(raw.endDate)).toISOString().slice(0, 10) : null,
    created_at: new Date(String(raw.createdAt)).toISOString(),
    updated_at: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

export async function GET(request) {
  try {
    await connectDB();

    const filter = {};
    const search = request.nextUrl.searchParams;

    if (search.get('only_active') === 'true') {
      filter.isActive = true;
    }

    const limitParam = search.get('limit');
    const limit = limitParam ? parsePositiveInt(limitParam, 20, 100) : null;

    let query = Campaign.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const campaigns = await query;
    return NextResponse.json(campaigns.map((campaign) => toPublicCampaign(campaign)));
  } catch {
    return NextResponse.json({ msg: 'No se pudieron obtener las campanas.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const title = sanitizeRequired(body?.title);
    if (!title) {
      return NextResponse.json({ msg: 'El titulo es obligatorio.' }, { status: 400 });
    }

    const startDate = parseDate(body?.start_date);
    const endDate = parseDate(body?.end_date);

    if (body?.start_date && !startDate) {
      return NextResponse.json({ msg: 'Fecha de inicio invalida.' }, { status: 400 });
    }

    if (body?.end_date && !endDate) {
      return NextResponse.json({ msg: 'Fecha de fin invalida.' }, { status: 400 });
    }

    const created = await Campaign.create({
      title,
      description: sanitizeOptional(body?.description),
      imageUrl: sanitizeOptional(body?.image_url),
      videoUrl: sanitizeOptional(body?.video_url),
      isActive: typeof body?.is_active === 'boolean' ? body.is_active : true,
      startDate,
      endDate,
    });

    return NextResponse.json(toPublicCampaign(created), { status: 201 });
  } catch {
    return NextResponse.json({ msg: 'No se pudo crear la campana.' }, { status: 500 });
  }
}
