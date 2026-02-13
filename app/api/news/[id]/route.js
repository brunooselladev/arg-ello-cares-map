import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
  }

  payload.excerpt = payload.summary ?? undefined;

  return payload;
};

export async function GET(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const doc = await News.findById(params.id);
    if (!doc) {
      return NextResponse.json({ msg: 'Novedad no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(toPublicNews(doc));
  } catch {
    return NextResponse.json({ msg: 'No se pudo obtener la novedad.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const body = await parseJson(request);
    const payload = buildNewsPayload(body, true);

    const updated = await News.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ msg: 'Novedad no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(toPublicNews(updated));
  } catch (error) {
    return NextResponse.json(
      { msg: getErrorMessage(error, 'No se pudo actualizar la novedad.') },
      { status: 400 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const deleted = await News.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ msg: 'Novedad no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Novedad eliminada.' });
  } catch {
    return NextResponse.json({ msg: 'No se pudo eliminar la novedad.' }, { status: 500 });
  }
}
