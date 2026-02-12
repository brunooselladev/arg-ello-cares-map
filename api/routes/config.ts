import express from 'express';
import SiteConfig from '../../src/models/SiteConfig';

const router = express.Router();

type DocLike = {
  toObject?: () => Record<string, unknown>;
} & Record<string, unknown>;

const DEFAULT_PRIMARY_COLOR = '#2d8f78';

const isHexColor = (value: string) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);

const getOrCreateConfig = async () => {
  let config = await SiteConfig.findOne().sort({ createdAt: 1 });

  if (!config) {
    config = await SiteConfig.create({ primaryColor: DEFAULT_PRIMARY_COLOR });
  }

  return config;
};

const toPublicConfig = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(raw._id),
    primaryColor: String(raw.primaryColor || DEFAULT_PRIMARY_COLOR),
    updatedAt: new Date(String(raw.updatedAt)).toISOString(),
  };
};

router.get('/', async (_req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(toPublicConfig(config as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo obtener la configuracion.' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const incoming = typeof req.body?.primaryColor === 'string' ? req.body.primaryColor.trim() : '';
    if (!isHexColor(incoming)) {
      return res.status(400).json({ msg: 'primaryColor debe ser un color hexadecimal valido.' });
    }

    const config = await getOrCreateConfig();
    config.primaryColor = incoming;
    await config.save();

    res.json(toPublicConfig(config as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo actualizar la configuracion.' });
  }
});

export default router;
