import { Schema, model, Document } from 'mongoose';

// --- Interfaces ---
export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const ContactMessageSchema = new Schema<IContactMessage>({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio.'] 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio.'],
    match: [/.+@.+\..+/, 'Por favor, introduce un email vÃ¡lido.']
  },
  subject: {
    type: String
  },
  message: { 
    type: String, 
    required: [true, 'El mensaje es obligatorio.'] 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
}, {
  timestamps: true // Esto aÃ±ade createdAt y updatedAt automÃ¡ticamente
});

// --- Ãndices ---
ContactMessageSchema.index({ isRead: 1 });

// --- Modelo ---
const ContactMessage = model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;

