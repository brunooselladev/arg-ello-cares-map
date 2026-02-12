import express from 'express';
import mongoose from 'mongoose';
import MapPoint, { MapPointType } from '../../src/models/MapPoint';

const router = express.Router();

type DocLike = {
  toObject?: () => Record<string, unknown>;
} & Record<string, unknown>;

const mapPointTypes: MapPointType[] = ['nodo', 'centro_escucha', 'comunidad_practicas'];

const isValidType = (value: unknown): value is MapPointType =>
  typeof value === 'string' && mapPointTypes.includes(value as MapPointType);

const sanitizeRequired = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const sanitizeOptional = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const parseNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toPublicMapPoint = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    name: String(raw.name || ''),
    description: (raw.description as string | null | undefined) ?? null,
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude),
    point_type: String(raw.pointType) as MapPointType,
    address: (raw.address as string | null | undefined) ?? null,
    phone: (raw.phone as string | null | undefined) ?? null,
    email: (raw.email as string | null | undefined) ?? null,
    is_active: Boolean(raw.isActive),
    created_at: new Date(String(raw.createdAt)).toISOString(),
    updated_at: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};

    if (typeof req.query.point_type === 'string' && isValidType(req.query.point_type)) {
      filter.pointType = req.query.point_type;
    }

    if (req.query.only_active === 'true') {
      filter.isActive = true;
    }

    const points = await MapPoint.find(filter).sort({ name: 1 });
    res.json(points.map((point) => toPublicMapPoint(point as unknown as DocLike)));
  } catch {
    res.status(500).json({ msg: 'No se pudieron obtener los puntos del mapa.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const name = sanitizeRequired(req.body?.name);
    const latitude = parseNumber(req.body?.latitude);
    const longitude = parseNumber(req.body?.longitude);
    const pointType = req.body?.point_type;

    if (!name || latitude === null || longitude === null || !isValidType(pointType)) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios para crear el punto.' });
    }

    const created = await MapPoint.create({
      name,
      description: sanitizeOptional(req.body?.description),
      latitude,
      longitude,
      pointType,
      address: sanitizeOptional(req.body?.address),
      phone: sanitizeOptional(req.body?.phone),
      email: sanitizeOptional(req.body?.email),
      isActive: typeof req.body?.is_active === 'boolean' ? req.body.is_active : true,
    });

    res.status(201).json(toPublicMapPoint(created as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo crear el punto.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const update: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
      update.name = sanitizeRequired(req.body.name);
      if (!update.name) {
        return res.status(400).json({ msg: 'El nombre es obligatorio.' });
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
      update.description = sanitizeOptional(req.body.description);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'latitude')) {
      const latitude = parseNumber(req.body.latitude);
      if (latitude === null) return res.status(400).json({ msg: 'Latitud invalida.' });
      update.latitude = latitude;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'longitude')) {
      const longitude = parseNumber(req.body.longitude);
      if (longitude === null) return res.status(400).json({ msg: 'Longitud invalida.' });
      update.longitude = longitude;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'point_type')) {
      if (!isValidType(req.body.point_type)) {
        return res.status(400).json({ msg: 'Tipo de punto invalido.' });
      }
      update.pointType = req.body.point_type;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'address')) {
      update.address = sanitizeOptional(req.body.address);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'phone')) {
      update.phone = sanitizeOptional(req.body.phone);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
      update.email = sanitizeOptional(req.body.email);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'is_active')) {
      update.isActive = Boolean(req.body.is_active);
    }

    const updated = await MapPoint.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Punto no encontrado.' });
    }

    res.json(toPublicMapPoint(updated as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo actualizar el punto.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const deleted = await MapPoint.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Punto no encontrado.' });
    }

    res.json({ msg: 'Punto eliminado.' });
  } catch {
    res.status(500).json({ msg: 'No se pudo eliminar el punto.' });
  }
});

export default router;
