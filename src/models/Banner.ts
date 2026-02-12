import mongoose, { Document, Schema } from 'mongoose';

const sanitizeRequiredString = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export interface IBanner extends Document {
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    imageUrl: {
      type: String,
      required: [true, 'La imagen es obligatoria.'],
      set: sanitizeRequiredString,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'La imagen es obligatoria.',
      },
    },
  },
  {
    timestamps: true,
  },
);

BannerSchema.index({ createdAt: -1 });

const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
