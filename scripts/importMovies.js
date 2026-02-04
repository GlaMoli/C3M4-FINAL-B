// scripts/importMovies.js
import axios from 'axios';
import mongoose from 'mongoose';
import Movie from '../src/models/MovieModel.mjs';

const API_KEY = 'TU_API_KEY'; // reemplaza con tu clave de TMDb
const BASE_URL = 'https://api.themoviedb.org/3';

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importMovies() {
  try {
    // Obtener películas populares (puedes cambiar a "top_rated", "upcoming", etc.)
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: 'es-ES', page: 1 },
    });

    const movies = response.data.results;

    for (const m of movies) {
      // Detalles completos
      const details = await axios.get(`${BASE_URL}/movie/${m.id}`, {
        params: { api_key: API_KEY, language: 'es-ES' },
      });

      // Créditos (director y cast)
      const credits = await axios.get(`${BASE_URL}/movie/${m.id}/credits`, {
        params: { api_key: API_KEY, language: 'es-ES' },
      });
      const director = credits.data.crew.find(c => c.job === 'Director')?.name || '';
      const cast = credits.data.cast.slice(0, 5).map(c => c.name); // primeros 5 actores

      // Trailer
      const videos = await axios.get(`${BASE_URL}/movie/${m.id}/videos`, {
        params: { api_key: API_KEY, language: 'es-ES' },
      });
      const trailer = videos.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

      // Clasificación por edad (ejemplo: Argentina)
      const releases = await axios.get(`${BASE_URL}/movie/${m.id}/release_dates`, {
        params: { api_key: API_KEY },
      });
      const argentina = releases.data.results.find(r => r.iso_3166_1 === 'AR');
      const cert = argentina?.release_dates[0]?.certification || '';

      let classification = 'ATP';
      let ageRestriction = 0;
      if (/13/.test(cert)) {
        classification = '+13';
        ageRestriction = 13;
      } else if (/16/.test(cert)) {
        classification = '+16';
        ageRestriction = 16;
      } else if (/18/.test(cert)) {
        classification = '+18';
        ageRestriction = 18;
      }

      // Construir objeto según  modelo
      const movieData = {
        title: m.title,
        genre: details.data.genres.map(g => g.name),
        director,
        cast,
        releaseYear: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
        duration: details.data.runtime,
        rating: m.vote_average,
        classification,
        ageRestriction,
        synopsis: m.overview,
        posterURL: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        trailerURL: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        language: details.data.original_language,
        subtitles: [], // opcional
      };

      await Movie.create(movieData);
      console.log(`Guardada: ${movieData.title}`);
    }

    console.log('Importación completa ✅');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error importando películas:', err.message);
    mongoose.disconnect();
  }
}

importMovies();