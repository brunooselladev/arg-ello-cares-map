import { Schema, model, Document } from 'mongoose';

// --- Interfaces ---
export interface ICampaign extends Document {
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const CampaignSchema = new Schema<ICampaign>({
  title: { 
    type: String, 
    required: [true, 'El título es obligatorio.'] 
  },
  description: { 
    type: String 
  },
  imageUrl: { 
    type: String 
  },
  videoUrl: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

// --- Índices ---
CampaignSchema.index({ isActive: 1 });
CampaignSchema.index({ startDate: 1, endDate: 1 });

// --- Modelo ---
const Campaign = model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;
