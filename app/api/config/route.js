import { NextResponse } from 'next/server';
import SiteConfig from '@/models/SiteConfig';
import { connectDB } from '@/server/db';
import { parseJson } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_PRIMARY_COLOR = '#2d8f78';

const isHexColor = (value) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);

const getOrCreateConfig = async () => {
  let config = await SiteConfig.findOne().sort({ createdAt: 1 });

  if (!config) {
    config = await SiteConfig.create({ primaryColor: DEFAULT_PRIMARY_COLOR });
  }

  return config;
};

const toPublicConfig = (doc) => {
  const raw = typeof doc?.toObject === 'function' ? doc.toObject() : doc;
  return {
    id: String(raw._id),
    primaryColor: String(raw.primaryColor || DEFAULT_PRIMARY_COLOR),
    updatedAt: new Date(String(raw.updatedAt)).toISOString(),
  };
};

export async function GET() {
  try {
    await connectDB();
    const config = await getOrCreateConfig();
    return NextResponse.json(toPublicConfig(config));
  } catch {
    return NextResponse.json({ msg: 'No se pudo obtener la configuracion.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await parseJson(request);
    const incoming = typeof body?.primaryColor === 'string' ? body.primaryColor.trim() : '';
    if (!isHexColor(incoming)) {
      return NextResponse.json(
        { msg: 'primaryColor debe ser un color hexadecimal valido.' },
        { status: 400 },
      );
    }

    const config = await getOrCreateConfig();
    config.primaryColor = incoming;
    await config.save();

    return NextResponse.json(toPublicConfig(config));
  } catch {
    return NextResponse.json({ msg: 'No se pudo actualizar la configuracion.' }, { status: 500 });
  }
}
