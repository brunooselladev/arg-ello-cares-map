import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import News from '@/models/News';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEGACY_TO_CATEGORY = {
  nodos: 'nodos',
  campanas: 'campanas',
  centros_escucha: 'centros',
  comunidad_practicas: 'comunidad',
  app_mappa: null,
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

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const body = await parseJson(request);
    if (typeof body?.visible !== 'boolean') {
      return NextResponse.json({ msg: 'El campo visible debe ser booleano.' }, { status: 400 });
    }

    const updated = await News.findByIdAndUpdate(
      params.id,
      { visible: body.visible, isVisible: body.visible },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json({ msg: 'Novedad no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(toPublicNews(updated));
  } catch {
    return NextResponse.json({ msg: 'No se pudo actualizar la visibilidad.' }, { status: 500 });
  }
}
