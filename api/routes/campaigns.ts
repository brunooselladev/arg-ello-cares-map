import express from 'express';
import mongoose from 'mongoose';
import Campaign from '../../src/models/Campaign';

const router = express.Router();

type DocLike = {
  toObject?: () => Record<string, unknown>;
} & Record<string, unknown>;

const parsePositiveInt = (value: unknown, fallback: number, max = 100): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const sanitizeRequired = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const sanitizeOptional = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const toPublicCampaign = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    title: String(raw.title || ''),
    description: (raw.description as string | null | undefined) ?? null,
    image_url: (raw.imageUrl as string | null | undefined) ?? null,
    video_url: (raw.videoUrl as string | null | undefined) ?? null,
    is_active: Boolean(raw.isActive),
    start_date: raw.startDate ? new Date(String(raw.startDate)).toISOString().slice(0, 10) : null,
    end_date: raw.endDate ? new Date(String(raw.endDate)).toISOString().slice(0, 10) : null,
    created_at: new Date(String(raw.createdAt)).toISOString(),
    updated_at: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};

    if (req.query.only_active === 'true') {
      filter.isActive = true;
    }

    const limit = req.query.limit ? parsePositiveInt(req.query.limit, 20, 100) : null;

    let query = Campaign.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const campaigns = await query;
    res.json(campaigns.map((campaign) => toPublicCampaign(campaign as unknown as DocLike)));
  } catch {
    res.status(500).json({ msg: 'No se pudieron obtener las campanas.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const title = sanitizeRequired(req.body?.title);
    if (!title) {
      return res.status(400).json({ msg: 'El titulo es obligatorio.' });
    }

    const startDate = parseDate(req.body?.start_date);
    const endDate = parseDate(req.body?.end_date);

    if (req.body?.start_date && !startDate) {
      return res.status(400).json({ msg: 'Fecha de inicio invalida.' });
    }

    if (req.body?.end_date && !endDate) {
      return res.status(400).json({ msg: 'Fecha de fin invalida.' });
    }

    const created = await Campaign.create({
      title,
      description: sanitizeOptional(req.body?.description),
      imageUrl: sanitizeOptional(req.body?.image_url),
      videoUrl: sanitizeOptional(req.body?.video_url),
      isActive: typeof req.body?.is_active === 'boolean' ? req.body.is_active : true,
      startDate,
      endDate,
    });

    res.status(201).json(toPublicCampaign(created as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo crear la campana.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const update: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
      update.title = sanitizeRequired(req.body.title);
      if (!update.title) return res.status(400).json({ msg: 'El titulo es obligatorio.' });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
      update.description = sanitizeOptional(req.body.description);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'image_url')) {
      update.imageUrl = sanitizeOptional(req.body.image_url);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'video_url')) {
      update.videoUrl = sanitizeOptional(req.body.video_url);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'is_active')) {
      update.isActive = Boolean(req.body.is_active);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'start_date')) {
      if (!req.body.start_date) {
        update.startDate = null;
      } else {
        const startDate = parseDate(req.body.start_date);
        if (!startDate) return res.status(400).json({ msg: 'Fecha de inicio invalida.' });
        update.startDate = startDate;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'end_date')) {
      if (!req.body.end_date) {
        update.endDate = null;
      } else {
        const endDate = parseDate(req.body.end_date);
        if (!endDate) return res.status(400).json({ msg: 'Fecha de fin invalida.' });
        update.endDate = endDate;
      }
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Campana no encontrada.' });
    }

    res.json(toPublicCampaign(updated as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo actualizar la campana.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Campana no encontrada.' });
    }

    res.json({ msg: 'Campana eliminada.' });
  } catch {
    res.status(500).json({ msg: 'No se pudo eliminar la campana.' });
  }
});

export default router;
