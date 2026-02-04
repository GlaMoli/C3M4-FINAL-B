import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

export const Contact = mongoose.model('Contact', contactSchema);