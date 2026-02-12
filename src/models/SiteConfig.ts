import { Schema, model, Document } from 'mongoose';

// --- Interfaces ---
export interface ISiteConfig extends Document {
  key: string;
  value?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const SiteConfigSchema = new Schema<ISiteConfig>({
  key: { 
    type: String, 
    required: true,
    unique: true
  },
  value: { 
    type: String 
  },
  description: {
    type: String
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

// --- Índices ---
SiteConfigSchema.index({ key: 1 }, { unique: true });

// --- Modelo ---
const SiteConfig = model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
