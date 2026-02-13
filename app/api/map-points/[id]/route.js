import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const body = await parseJson(request);
    const update = {};

    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
      update.name = sanitizeRequired(body.name);
      if (!update.name) {
        return NextResponse.json({ msg: 'El nombre es obligatorio.' }, { status: 400 });
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      update.description = sanitizeOptional(body.description);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'latitude')) {
      const latitude = parseNumber(body.latitude);
      if (latitude === null) {
        return NextResponse.json({ msg: 'Latitud invalida.' }, { status: 400 });
      }
      update.latitude = latitude;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'longitude')) {
      const longitude = parseNumber(body.longitude);
      if (longitude === null) {
        return NextResponse.json({ msg: 'Longitud invalida.' }, { status: 400 });
      }
      update.longitude = longitude;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'point_type')) {
      if (!isValidType(body.point_type)) {
        return NextResponse.json({ msg: 'Tipo de punto invalido.' }, { status: 400 });
      }
      update.pointType = body.point_type;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'address')) {
      update.address = sanitizeOptional(body.address);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'phone')) {
      update.phone = sanitizeOptional(body.phone);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'email')) {
      update.email = sanitizeOptional(body.email);
    }

    if (Object.prototype.hasOwnProperty.call(body, 'is_active')) {
      update.isActive = Boolean(body.is_active);
    }

    const updated = await MapPoint.findByIdAndUpdate(params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ msg: 'Punto no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(toPublicMapPoint(updated));
  } catch {
    return NextResponse.json({ msg: 'No se pudo actualizar el punto.' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ msg: 'ID invalido.' }, { status: 400 });
    }

    const deleted = await MapPoint.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ msg: 'Punto no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ msg: 'Punto eliminado.' });
  } catch {
    return NextResponse.json({ msg: 'No se pudo eliminar el punto.' }, { status: 500 });
  }
}
