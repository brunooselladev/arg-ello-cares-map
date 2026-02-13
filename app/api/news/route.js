import { NextResponse } from 'next/server';
import News, { newsCategories } from '@/models/News';
import { connectDB } from '@/server/db';
import { parseJson, getErrorMessage } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORY_TO_LEGACY = {
  nodos: 'nodos',
  campanas: 'campanas',
  centros: 'centros_escucha',
  comunidad: 'comunidad_practicas',
};

const LEGACY_TO_CATEGORY = {
  nodos: 'nodos',
  campanas: 'campanas',
  centros_escucha: 'centros',
  comunidad_practicas: 'comunidad',
  app_mappa: null,
};

const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const isValidCategory = (value) => typeof value === 'string' && newsCategories.includes(value);

const sanitizeRequired = (value) => (typeof value === 'string' ? value.trim() : '');
const sanitizeOptional = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const sanitizeTags = (value) => {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) return null;

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : null;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const toPublicNews = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;
  const legacySection = typeof raw.section === 'string' ? raw.section : null;
  const category =
    raw.category ?? (legacySection ? LEGACY_TO_CATEGORY[legacySection] ?? null : null) ?? 'nodos';
  const visible = raw.visible ?? (raw.isVisible ?? true);
  const date = raw.date ?? raw.publishedAt ?? raw.createdAt;
  const summary = raw.summary ?? raw.excerpt ?? (raw.content ? String(raw.content).slice(0, 180) : '');

  return {
    id: String(raw._id),
    title: String(raw.title || ''),
    content: String(raw.content || ''),
    summary,
    image: raw.image ?? raw.imageUrl ?? null,
    category,
    videoUrl: raw.videoUrl ?? null,
    date: date ? new Date(String(date)).toISOString() : null,
    author: raw.author ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : null,
    visible: Boolean(visible),
    createdAt: raw.createdAt ? new Date(String(raw.createdAt)).toISOString() : null,
    updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

const buildNewsPayload = (source, isPatch = false) => {
  const payload = {};
  const has = (key) => Object.prototype.hasOwnProperty.call(source, key);

  if (!isPatch || has('title')) payload.title = sanitizeRequired(source.title);
  if (!isPatch || has('content')) payload.content = sanitizeRequired(source.content);
  if (!isPatch || has('summary')) payload.summary = sanitizeRequired(source.summary);

  if (!isPatch || has('image')) {
    payload.image = sanitizeOptional(source.image);
    payload.imageUrl = payload.image;
  }

  if (!isPatch || has('category')) {
    const category = source.category;
    if (isValidCategory(category)) {
      payload.category = category;
      payload.section = CATEGORY_TO_LEGACY[category];
    } else {
      throw new Error('La categoria es obligatoria y debe ser valida.');
    }
  }

  if (!isPatch || has('videoUrl')) {
    payload.videoUrl = sanitizeOptional(source.videoUrl);
  }

  if (!isPatch || has('date')) {
    if (source.date === null || source.date === undefined || source.date === '') {
      payload.date = null;
      payload.publishedAt = null;
    } else {
      const parsedDate = parseDate(source.date);
      if (!parsedDate) throw new Error('La fecha no es valida.');
      payload.date = parsedDate;
      payload.publishedAt = parsedDate;
    }
  }

  if (!isPatch || has('author')) {
    payload.author = sanitizeOptional(source.author);
  }

  if (!isPatch || has('tags')) {
    payload.tags = sanitizeTags(source.tags);
  }

  if (has('visible')) {
    payload.visible = Boolean(source.visible);
    payload.isVisible = payload.visible;
  } else if (!isPatch) {
    payload.visible = true;
    payload.isVisible = true;
  }

  payload.excerpt = payload.summary ?? undefined;

  if (!isPatch) {
    if (!payload.title) throw new Error('El titulo es obligatorio.');
    if (!payload.content) throw new Error('El contenido es obligatorio.');
    if (!payload.summary) throw new Error('El resumen es obligatorio.');
    if (!payload.category) throw new Error('La categoria es obligatoria.');
  }

  return payload;
};

const buildFilter = ({ category, includeHidden }) => {
  const filter = {};

  if (category) {
    if (!isValidCategory(category)) {
      throw new Error('Categoria invalida.');
    }

    filter.$or = [{ category }, { section: CATEGORY_TO_LEGACY[category] }];
  }

  if (!includeHidden) {
    filter.$and = [
      {
        $or: [{ visible: true }, { visible: { $exists: false } }],
      },
      {
        isVisible: { $ne: false },
      },
    ];
  }

  return filter;
};

export async function GET(request) {
  try {
    await connectDB();

    const search = request.nextUrl.searchParams;
    const includeHidden = search.get('includeHidden') === 'true';
    const page = parsePositiveInt(search.get('page'), 1);
    const limit = parsePositiveInt(search.get('limit'), 8, 50);

    const filter = buildFilter({
      category: search.get('category') || undefined,
      includeHidden,
    });

    const total = await News.countDocuments(filter);

    const docs = await News.find(filter)
      .sort({ date: -1, publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const items = docs.map((doc) => toPublicNews(doc));

    return NextResponse.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return NextResponse.json(
      { msg: getErrorMessage(error, 'No se pudieron obtener las novedades.') },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const payload = buildNewsPayload(body);
    const created = await News.create(payload);

    return NextResponse.json(toPublicNews(created), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { msg: getErrorMessage(error, 'No se pudo crear la novedad.') },
      { status: 400 },
    );
  }
}
