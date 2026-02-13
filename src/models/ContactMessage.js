import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio.'],
      match: [/.+@.+\..+/, 'Por favor, introduce un email valido.'],
    },
    subject: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio.'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

ContactMessageSchema.index({ isRead: 1 });

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);

export default ContactMessage;
