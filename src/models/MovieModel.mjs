
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    minlength: [1, 'El título debe tener al menos 1 carácter'],
    maxlength: [150, 'El título no puede superar los 150 caracteres']
  },
  genre: {
    type: [String],
    required: [true, 'Debe incluir al menos un género'],
    validate: {
      validator: arr => arr.length > 0,
      message: 'Debe incluir al menos un género válido'
    }
  },
  director: {
    type: String,
    trim: true,
    minlength: [3, 'El nombre del director debe tener al menos 3 caracteres'],
    maxlength: [90, 'El nombre del director no puede superar los 90 caracteres']
  },
  cast: {
    type: [String],
    default: [],
    validate: {
      validator: arr => arr.every(actor => actor.length >= 2),
      message: 'Cada actor debe tener al menos 2 caracteres'
    }
  },
  releaseYear: {
    type: Number,
    required: [true, 'El año de estreno es obligatorio'],
    validate: {
      validator: function (v) {
        return /^\d{4}$/.test(v.toString()) && v <= new Date().getFullYear();
      },
      message: 'El año debe contener 4 dígitos numéricos y ser válido'
    }
  },
  duration: {
    type: Number,
    min: [60, 'La duración mínima es de 60 minutos'],
    max: [240, 'La duración máxima es de 240 minutos']
  },
  rating: {
    type: Number,
    min: [0, 'La puntuación mínima es 0'],
    max: [10, 'La puntuación máxima es 10']
  },
  classification: {
    type: String,
    required: [true, 'La clasificación por edad es obligatoria'],
    enum: {
      values: ['ATP','+7', '+13', '+16', '+18'],
      message: 'Clasificación inválida. Debe ser ATP, +13, +16 o +18'
    }
  },
  ageRestriction: {
    type: Number,
    enum: [0, 7, 13, 16, 18], // 0 = ATP, 13 = +13, 16 = +16, 18 = +18
    default: 0
  },
  synopsis: {
    type: String,
    trim: true,
    minlength: [10, 'La sinopsis debe tener al menos 10 caracteres'],
    maxlength: [1000, 'La sinopsis no puede superar los 1000 caracteres']
  },
  posterURL: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v),
      message: 'Debe ser una URL válida de imagen'
    }
  },
  trailerURL: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+/i.test(v),
      message: 'Debe ser una URL válida'
    }
  },
  language: {
    type: String,
    default: 'Español',
    minlength: [2, 'El idioma debe tener al menos 2 caracteres'],
    maxlength: [50, 'El idioma no puede superar los 50 caracteres']
  },
  subtitles: {
    type: [String],
    default: [],
    validate: {
      validator: arr => arr.every(lang => lang.length >= 2),
      message: 'Cada subtítulo debe tener al menos 2 caracteres'
    }
  },
  availableLanguages: {
    type: [String],
    default: [],
    validate: {
      validator: arr => arr.every(lang => lang.length >= 2),
      message: 'Cada idioma debe tener al menos 2 caracteres'
    }
  },
  streamUrl: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+/i.test(v),
      message: 'Debe ser una URL válida para streaming'
    }
  },
  downloadUrl: {
    type: String,
    validate: {
      validator: v => /^https?:\/\/.+/i.test(v),
      message: 'Debe ser una URL válida para descarga'
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema, 'Movies');

export default Movie;