import express from 'express';
import mongoose from 'mongoose';
import Volunteer from '../../src/models/Volunteer';
import ContactMessage from '../../src/models/ContactMessage';

const router = express.Router();

type DocLike = {
  toObject?: () => Record<string, unknown>;
} & Record<string, unknown>;

const sanitizeRequired = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const sanitizeOptional = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const toPublicVolunteer = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    full_name: String(raw.fullName || ''),
    email: String(raw.email || ''),
    phone: (raw.phone as string | null | undefined) ?? null,
    message: (raw.message as string | null | undefined) ?? null,
    availability: (raw.availability as string | null | undefined) ?? null,
    created_at: new Date(String(raw.createdAt)).toISOString(),
  };
};

const toPublicMessage = (doc: DocLike) => {
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  return {
    id: String(raw._id),
    name: String(raw.name || ''),
    email: String(raw.email || ''),
    subject: (raw.subject as string | null | undefined) ?? null,
    message: String(raw.message || ''),
    is_read: Boolean(raw.isRead),
    created_at: new Date(String(raw.createdAt)).toISOString(),
  };
};

router.post('/volunteers', async (req, res) => {
  try {
    const fullName = sanitizeRequired(req.body?.full_name);
    const email = sanitizeRequired(req.body?.email);

    if (!fullName || !email) {
      return res.status(400).json({ msg: 'Nombre y email son obligatorios.' });
    }

    const created = await Volunteer.create({
      fullName,
      email,
      phone: sanitizeOptional(req.body?.phone),
      message: sanitizeOptional(req.body?.message),
      availability: sanitizeOptional(req.body?.availability),
    });

    res.status(201).json(toPublicVolunteer(created as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo registrar el voluntario.' });
  }
});

router.get('/volunteers', async (_req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers.map((volunteer) => toPublicVolunteer(volunteer as unknown as DocLike)));
  } catch {
    res.status(500).json({ msg: 'No se pudieron obtener voluntarios.' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const name = sanitizeRequired(req.body?.name);
    const email = sanitizeRequired(req.body?.email);
    const message = sanitizeRequired(req.body?.message);

    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Nombre, email y mensaje son obligatorios.' });
    }

    const created = await ContactMessage.create({
      name,
      email,
      subject: sanitizeOptional(req.body?.subject),
      message,
      isRead: false,
    });

    res.status(201).json(toPublicMessage(created as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo enviar el mensaje.' });
  }
});

router.get('/contact-messages', async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages.map((message) => toPublicMessage(message as unknown as DocLike)));
  } catch {
    res.status(500).json({ msg: 'No se pudieron obtener los mensajes.' });
  }
});

router.patch('/contact-messages/:id/read', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'ID invalido.' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Mensaje no encontrado.' });
    }

    res.json(toPublicMessage(updated as unknown as DocLike));
  } catch {
    res.status(500).json({ msg: 'No se pudo actualizar el mensaje.' });
  }
});

export default router;
