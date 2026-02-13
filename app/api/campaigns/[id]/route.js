import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Campaign from '@/models/Campaign';
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

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const body = await parseJson(request);
    const update = {};

    if (Object.prototype.hasOwnProperty.call(body, 'title')) {
      update.title = sanitizeRequired(body.title);
      if (!update.title) return NextResponse.json({ msg: 'El titulo es obligatorio.' }, { status: 400 });
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      update.description = sanitizeOptional(body.description);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'image_url')) {
      update.imageUrl = sanitizeOptional(body.image_url);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'video_url')) {
      update.videoUrl = sanitizeOptional(body.video_url);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'is_active')) {
      update.isActive = Boolean(body.is_active);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'start_date')) {
      if (!body.start_date) {
        update.startDate = null;
      } else {
        const startDate = parseDate(body.start_date);
        if (!startDate) {
          return NextResponse.json({ msg: 'Fecha de inicio invalida.' }, { status: 400 });
        }
        update.startDate = startDate;
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'end_date')) {
      if (!body.end_date) {
        update.endDate = null;
      } else {
        const endDate = parseDate(body.end_date);
        if (!endDate) {
          return NextResponse.json({ msg: 'Fecha de fin invalida.' }, { status: 400 });
        }
        update.endDate = endDate;
      }
    }

    const updated = await Campaign.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ msg: 'Campana no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(toPublicCampaign(updated));
  } catch {
    return NextResponse.json({ msg: 'No se pudo actualizar la campana.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const deleted = await Campaign.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ msg: 'Campana no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Campana eliminada.' });
  } catch {
    return NextResponse.json({ msg: 'No se pudo eliminar la campana.' }, { status: 500 });
  }
}
