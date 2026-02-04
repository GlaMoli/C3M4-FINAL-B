
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del perfil es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre del perfil debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre del perfil no puede superar los 50 caracteres']
  },
  type: {
    type: String,
    enum: ['adult','teen', 'child'], // 🔑 consigna: perfil adulto o niño
    required: [true, 'El tipo de perfil es obligatorio']
  },
  avatar: {
    type: String,
    default: "/avatars/avatar.jpg" // valor por defecto si no se carga ninguno
  },
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Restricción opcional para reforzar control de edad
  ageRestriction: {
    type: Number,
    enum: [0, 13, 18], // 0 = apto todo público, 13 = +13, 18 = +18
    default: 0
  }
}, { timestamps: true });

// Evitar duplicados en watchlist
profileSchema.pre('save', function (next) {
  if (this.watchlist && this.watchlist.length > 0) {
    this.watchlist = [...new Set(this.watchlist.map(id => id.toString()))];
  }
  next();
});

const Profile = mongoose.model('Profile', profileSchema, 'Profiles');

export default Profile;
