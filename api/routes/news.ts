import express from 'express';
import mongoose from 'mongoose';
import News, { newsCategories, NewsCategory } from '../../src/models/News';

const router = express.Router();

type AnyRecord = Record<string, unknown>;
type DocLike = {
  toObject?: () => AnyRecord;
} & AnyRecord;

const CATEGORY_TO_LEGACY: Record<NewsCategory, string> = {
  nodos: 'nodos',
  campanas: 'campanas',
  centros: 'centros_escucha',
  comunidad: 'comunidad_practicas',
};

const LEGACY_TO_CATEGORY: Record<string, NewsCategory | null> = {
  nodos: 'nodos',
  campanas: 'campanas',
  centros_escucha: 'centros',
  comunidad_practicas: 'comunidad',
  app_mappa: null,
};

const parsePositiveInt = (value: unknown, fallback: number, max = 100): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const isValidCategory = (value: unknown): value is NewsCategory => {
  return typeof value === 'string' && newsCategories.includes(value as NewsCategory);
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

const sanitizeTags = (value: unknown): string[] | null => {
  if (value === null || value === undefined) return null;
  if (!Array.isArray(value)) return null;

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : null;
};

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const toPublicNews = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const legacySection = typeof raw.section === 'string' ? raw.section : null;
  const category =
    (raw.category as NewsCategory | null | undefined) ??
    (legacySection ? LEGACY_TO_CATEGORY[legacySection] ?? null : null) ??
    'nodos';
  const visible = (raw.visible as boolean | null | undefined) ?? ((raw.isVisible as boolean | null | undefined) ?? true);
  const date = raw.date ?? raw.publishedAt ?? raw.createdAt;
  const summary =
    (raw.summary as string | undefined) ??
    (raw.excerpt as string | undefined) ??
    (raw.content ? String(raw.content).slice(0, 180) : '');

  return {
    id: String(raw._id),
    title: String(raw.title || ''),
    content: String(raw.content || ''),
    summary,
    image: (raw.image as string | null | undefined) ?? (raw.imageUrl as string | null | undefined) ?? null,
    category,
    videoUrl: (raw.videoUrl as string | null | undefined) ?? null,
    date: date ? new Date(String(date)).toISOString() : null,
    author: (raw.author as string | null | undefined) ?? null,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : null,
    visible: Boolean(visible),
    createdAt: raw.createdAt ? new Date(String(raw.createdAt)).toISOString() : null,
    updatedAt: raw.updatedAt ? new Date(String(raw.updatedAt)).toISOString() : null,
  };
};

const buildNewsPayload = (source: AnyRecord, isPatch = false) => {
  const payload: AnyRecord = {};

  const has = (key: string) => Object.prototype.hasOwnProperty.call(source, key);

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
      if (!parsedDate) {
        throw new Error('La fecha no es valida.');
      }
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

const buildFilter = ({ category, includeHidden }: { category?: string; includeHidden: boolean }) => {
  const filter: AnyRecord = {};

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

router.get('/', async (req, res) => {
  try {
    const includeHidden = req.query.includeHidden === 'true';
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 8, 50);

    const filter = buildFilter({
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      includeHidden,
    });

    const total = await News.countDocuments(filter);

    const docs = await News.find(filter)
      .sort({ date: -1, publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const items = docs.map((doc) => toPublicNews(doc as unknown as DocLike));

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error: unknown) {
    res.status(400).json({ msg: getErrorMessage(error, 'No se pudieron obtener las novedades.') });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const doc = await News.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ msg: 'Novedad no encontrada.' });
    }

    res.json(toPublicNews(doc as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo obtener la novedad.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = buildNewsPayload(req.body as AnyRecord);
    const created = await News.create(payload);

    res.status(201).json(toPublicNews(created as unknown as DocLike));
  } catch (error: unknown) {
    res.status(400).json({ msg: getErrorMessage(error, 'No se pudo crear la novedad.') });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const payload = buildNewsPayload(req.body as AnyRecord, true);

    const updated = await News.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Novedad no encontrada.' });
    }

    res.json(toPublicNews(updated as unknown as DocLike));
  } catch (error: unknown) {
    res.status(400).json({ msg: getErrorMessage(error, 'No se pudo actualizar la novedad.') });
  }
});

router.patch('/:id/visibility', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    if (typeof req.body?.visible !== 'boolean') {
      return res.status(400).json({ msg: 'El campo visible debe ser booleano.' });
    }

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { visible: req.body.visible, isVisible: req.body.visible },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Novedad no encontrada.' });
    }

    res.json(toPublicNews(updated as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo actualizar la visibilidad.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Novedad no encontrada.' });
    }

    res.json({ msg: 'Novedad eliminada.' });
  } catch {
    res.status(500).json({ msg: 'No se pudo eliminar la novedad.' });
  }
});

export default router;
