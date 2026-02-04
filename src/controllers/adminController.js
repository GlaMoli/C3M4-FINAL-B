import Movie from '../models/MovieModel.mjs';
import Profile from '../models/ProfileModel.mjs';

export const obtenerReporteUso = async (req, res) => {
  try {
    // 1. Total de películas en la base de datos
    const totalPeliculas = await Movie.countDocuments();

    // 2. Conteo por género (Usando el campo 'genre')
    const porGenero = await Movie.aggregate([
      {
        $group: {
          _id: "$genre", 
          cantidad: { $sum: 1 }
        }
      },
      { $sort: { cantidad: -1 } }
    ]);

    // 3. Total de películas que los usuarios guardaron en sus listas
    const perfiles = await Profile.find({}, 'watchlist');
    const totalFavoritos = perfiles.reduce((acc, p) => acc + (p.watchlist?.length || 0), 0);

    res.status(200).json({
      totalPeliculas,
      totalFavoritos,
      porGenero
    });
  } catch (error) {
    console.error('Error en reporte:', error);
    res.status(500).json({ mensaje: 'Error al generar el reporte de uso' });
  }
};