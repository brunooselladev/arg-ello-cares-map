import { Schema, model, Document } from 'mongoose';

// --- Enums ---
const newsSections = ['nodos', 'centros_escucha', 'comunidad_practicas', 'app_mappa', 'campanas'] as const;
export type NewsSection = typeof newsSections[number];

// --- Interfaces ---
export interface INews extends Document {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  imageCaption?: string;
  section: NewsSection;
  isVisible: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const NewsSchema = new Schema<INews>({
  title: { 
    type: String, 
    required: [true, 'El título es obligatorio.'] 
  },
  content: { 
    type: String, 
    required: [true, 'El contenido es obligatorio.'] 
  },
  excerpt: { 
    type: String 
  },
  imageUrl: { 
    type: String 
  },
  imageCaption: { 
    type: String 
  },
  section: {
    type: String,
    enum: {
      values: newsSections,
      message: 'La sección "{VALUE}" no es válida.'
    },
    required: [true, 'La sección es obligatoria.']
  },
  isVisible: { 
    type: Boolean, 
    default: true 
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

// --- Índices ---
NewsSchema.index({ section: 1 });
NewsSchema.index({ isVisible: 1 });

// --- Modelo ---
const News = model<INews>('News', NewsSchema);

export default News;
