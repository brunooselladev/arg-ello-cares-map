import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre completo es obligatorio.'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio.'],
      match: [/.+@.+\..+/, 'Por favor, introduce un email valido.'],
    },
    phone: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    availability: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);

export default Volunteer;
