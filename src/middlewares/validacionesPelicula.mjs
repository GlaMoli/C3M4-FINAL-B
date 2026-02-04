
import { body } from 'express-validator';

export const validarPelicula = [
  // 🎬 Título de la película
  body('title')
    .trim()
    .notEmpty().withMessage('El título de la película es obligatorio.')
    .isLength({ min: 1, max: 150 }).withMessage('Debe tener entre 1 y 150 caracteres.'),

  // 🎭 Género
  body('genre')
    .trim()
    .notEmpty().withMessage('El género es obligatorio.')
    .isLength({ min: 3, max: 50 }).withMessage('Debe tener entre 3 y 50 caracteres.'),

  // 🎬 Director
  body('director')
    .trim()
    .notEmpty().withMessage('El director es obligatorio.')
    .isLength({ min: 3, max: 90 }).withMessage('Debe tener entre 3 y 90 caracteres.'),

  // 👥 Reparto (cast) - lista de nombres
  body('cast')
    .customSanitizer(value => {
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return Array.isArray(value) ? value : [];
    })
    .isArray().withMessage('El reparto debe ser un array de nombres.')
    .notEmpty().withMessage('Debe incluir al menos un actor en el reparto.'),

  // 📅 Año de estreno
  body('releaseYear')
    .notEmpty().withMessage('El año de estreno es obligatorio.')
    .isInt({ min: 1888, max: new Date().getFullYear() + 1 })
    .withMessage('Debe ser un año válido (1888 en adelante).'),

  // ⏱️ Duración en minutos
  body('duration')
    .notEmpty().withMessage('La duración es obligatoria.')
    .isInt({ min: 1 }).withMessage('Debe ser un número positivo en minutos.'),

  // ⭐ Rating
  body('rating')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 10 }).withMessage('El rating debe estar entre 0 y 10.'),

  // 🔞 Clasificación por edad
  body('classification')
    .notEmpty().withMessage('La clasificación es obligatoria.')
    .isIn(['ATP', '+13', '+16', '+18']).withMessage('Clasificación inválida.'),

  // 📖 Sinopsis
  body('synopsis')
    .trim()
    .notEmpty().withMessage('La sinopsis es obligatoria.')
    .isLength({ min: 10, max: 1000 }).withMessage('Debe tener entre 10 y 1000 caracteres.'),

  // 🖼️ Poster URL
  body('posterURL')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Debe ser una URL válida.'),

  // 🎞️ Trailer URL
  body('trailerURL')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Debe ser una URL válida.'),

  // 🌐 Idioma
  body('language')
    .trim()
    .notEmpty().withMessage('El idioma es obligatorio.')
    .isLength({ min: 2, max: 50 }).withMessage('Debe tener entre 2 y 50 caracteres.'),

  // 💬 Subtítulos
  body('subtitles')
    .customSanitizer(value => {
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return Array.isArray(value) ? value : [];
    })
    .isArray().withMessage('Los subtítulos deben ser un array de idiomas.')
];
