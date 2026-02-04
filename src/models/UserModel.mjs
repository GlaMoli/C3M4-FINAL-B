
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // 🛠️ Librería nativa de Node para generar tokens seguros

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre de usuario no puede superar los 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['owner', 'standard', 'child'], // 🔑 roles según consigna
    default: 'standard'
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  // 🔑 CAMPOS PARA RECUPERACIÓN DE CONTRASEÑA
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// 🔒 Hook para encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🛠️ MÉTODO PARA GENERAR TOKEN DE RECUPERACIÓN
userSchema.methods.generateResetToken = function() {
  // Genera un string aleatorio de 20 caracteres (hexadecimal)
  const token = crypto.randomBytes(20).toString('hex');

  // Guardamos el token en el usuario (encriptado para más seguridad, opcional)
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  // El token expira en 1 hora (3600000 milisegundos)
  this.resetPasswordExpires = Date.now() + 3600000;

  return token; // Retornamos el token sin encriptar para enviarlo por mail
};

// Método para ocultar la contraseña al devolver el usuario como JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model('User', userSchema, 'Users');

export default User;
