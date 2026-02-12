import { Schema, model, Document } from 'mongoose';

// --- Interfaces ---
export interface IVolunteer extends Document {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  availability?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const VolunteerSchema = new Schema<IVolunteer>({
  fullName: { 
    type: String, 
    required: [true, 'El nombre completo es obligatorio.'] 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio.'],
    // PodrÃ­amos aÃ±adir validaciÃ³n de email aquÃ­
    match: [/.+@.+\..+/, 'Por favor, introduce un email vÃ¡lido.']
  },
  phone: { 
    type: String 
  },
  message: { 
    type: String 
  },
  availability: {
    type: String
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Solo necesitamos createdAt segÃºn el schema SQL
});


// --- Modelo ---
const Volunteer = model<IVolunteer>('Volunteer', VolunteerSchema);

export default Volunteer;

