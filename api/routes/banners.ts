import express from 'express';
import mongoose from 'mongoose';
import Banner from '../../src/models/Banner';

const router = express.Router();

type DocLike = {
  toObject?: () => Record<string, unknown>;
} & Record<string, unknown>;

const sanitizeRequired = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const toPublicBanner = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    imageUrl: String(raw.imageUrl || ''),
    createdAt: new Date(String(raw.createdAt)).toISOString(),
  };
};

router.get('/', async (_req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners.map((banner) => toPublicBanner(banner as unknown as DocLike)));
  } catch {
    res.status(500).json({ msg: 'No se pudieron obtener los banners.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const imageUrl = sanitizeRequired(req.body?.imageUrl);
    if (!imageUrl) {
      return res.status(400).json({ msg: 'La imagen es obligatoria.' });
    }

    const count = await Banner.countDocuments();
    if (count >= 3) {
      return res.status(400).json({ msg: 'Solo se permiten hasta 3 banners.' });
    }

    const created = await Banner.create({ imageUrl });
    res.status(201).json(toPublicBanner(created as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo crear el banner.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Banner no encontrado.' });
    }

    res.json({ msg: 'Banner eliminado.' });
  } catch {
    res.status(500).json({ msg: 'No se pudo eliminar el banner.' });
  }
});

export default router;
