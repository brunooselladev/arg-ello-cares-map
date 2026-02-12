import mongoose, { Document, Schema } from 'mongoose';

const sanitizeColor = (value: unknown): string => {
  if (typeof value !== 'string') return '#2d8f78';
  const color = value.trim();
  if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) return color;
  return '#2d8f78';
};

export interface ISiteConfig extends Document {
  primaryColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    primaryColor: {
      type: String,
      required: [true, 'El color primario es obligatorio.'],
      default: '#2d8f78',
      set: sanitizeColor,
    },
  },
  {
    timestamps: true,
  },
);

const SiteConfig =
  mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
