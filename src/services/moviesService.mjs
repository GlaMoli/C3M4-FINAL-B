import moviesRepository from '../repositories/MoviesRepository.mjs';

// 🔎 Obtener película por ID
export async function obtenerPeliculaPorId(id) {
  try {
    const peliculaEncontrada = await moviesRepository.obtenerPorId(id);
    console.log("DEBUG [moviesService]: Película encontrada por ID:", peliculaEncontrada);
    return peliculaEncontrada;
  } catch (error) {
    console.error("Error en servicio 'obtenerPeliculaPorId':", error);
    throw error;
  }
}

// 📋 Obtener todas las películas de un usuario
export async function obtenerTodasLasPeliculas(userId) {
  return await moviesRepository.obtenerTodos(userId);
}

// 🔎 Buscar películas por atributo simple
export async function buscarPeliculasPorAtributo(atributo, valor) {
  return await moviesRepository.buscarPorAtributo(atributo, valor);
}

// 🔎 Buscar películas con filtros avanzados
export async function buscarPeliculasAvanzado(filtros) {
  const query = {};
  if (filtros.title) query.title = new RegExp(filtros.title, 'i');
  if (filtros.genre) query.genre = filtros.genre;
  if (filtros.classification) query.classification = filtros.classification;
  if (filtros.minRating) query.rating = { $gte: filtros.minRating };
  if (filtros.maxRating) query.rating = { ...(query.rating || {}), $lte: filtros.maxRating };
  if (filtros.fromYear || filtros.toYear) {
    query.releaseYear = {};
    if (filtros.fromYear) query.releaseYear.$gte = filtros.fromYear;
    if (filtros.toYear) query.releaseYear.$lte = filtros.toYear;
  }
  return await moviesRepository.buscarPorAtributo(query);
}

// 🎬 Crear nueva película
export async function crearPelicula(data) {
  return await moviesRepository.crear(data);
}

// ✏️ Actualizar película por ID
export async function actualizarPeliculaPorId(id, data) {
  return await moviesRepository.actualizarPorId(id, data);
}

// 🗑️ Eliminar película por ID
export async function eliminarPeliculaPorId(id) {
  return await moviesRepository.eliminarPorId(id);
}

// 🗑️ Eliminar película por título
export async function eliminarPeliculaPorTitulo(title) {
  return await moviesRepository.eliminarPorTitulo(title);
}

// 🔎 Buscar película por título exacto
export async function buscarPeliculaPorTitulo(title) {
  return await moviesRepository.obtenerPorTitulo(title);
}

// 📑 Obtener películas paginadas
export async function obtenerPeliculasPaginadas(userId, page = 1, limit = 10) {
  return await moviesRepository.obtenerPeliculasPaginadas(userId, page, limit);
}

// 📊 Calcular totales para dashboard
export function calcularTotalesDashboard(listaDePeliculas) {
  const totalPeliculas = listaDePeliculas.length;
  const promedioDuracion = listaDePeliculas.length > 0
    ? (listaDePeliculas.reduce((sum, p) => sum + (p.duration || 0), 0) / listaDePeliculas.length).toFixed(2)
    : 'N/A';
  const promedioRating = listaDePeliculas.length > 0
    ? (listaDePeliculas.reduce((sum, p) => sum + (p.rating || 0), 0) / listaDePeliculas.length).toFixed(2)
    : 'N/A';

  return { totalPeliculas, promedioDuracion, promedioRating };
}
