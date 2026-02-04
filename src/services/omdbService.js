import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Busca películas en OMDb por título, ID o palabra clave.
 * @param {Object} params - Parámetros de búsqueda.
 * @param {string} [params.titulo] - Título exacto de la película.
 * @param {string} [params.imdbID] - ID de IMDb.
 * @param {string} [params.search] - Palabra clave para lista de resultados.
 * @param {string} [params.year] - Año opcional para filtrar.
 * @returns {Promise<Object>} - Datos de la película o lista desde OMDb.
 */
export async function buscarPeliculas({ titulo, imdbID, search, year }) {
  let url;

  if (imdbID) {
    url = `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`;
  } else if (titulo) {
    url = `${BASE_URL}?t=${encodeURIComponent(titulo)}&apikey=${API_KEY}`;
  } else if (search) {
    url = `${BASE_URL}?s=${encodeURIComponent(search)}${year ? `&y=${year}` : ''}&apikey=${API_KEY}`;
  } else {
    throw new Error('Debes proporcionar título, imdbID o término de búsqueda');
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'No se encontró la película en OMDb');
  }

  return data;
}