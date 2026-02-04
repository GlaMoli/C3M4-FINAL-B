import express from 'express';
import {
  obtenerTodasLasPeliculas,
  obtenerPeliculaPorId,
  crearPelicula,
  actualizarPeliculaPorId,
  eliminarPeliculaPorId
} from '../services/moviesService.mjs';
import { listarPeliculasController, obtenerCatalogoPorPerfilController } from '../controllers/movieController.mjs';
import { verificarToken } from '../middlewares/authMiddleware.mjs';
import { obtenerReporteUso } from '../controllers/adminController.js';

const router = express.Router();

// 🔍 Ruta: GET http://localhost:3000/api/movies/test
router.get('/test', (req, res) => {
  res.json({ mensaje: 'La API de películas responde correctamente 🎬' });
});

// ✅ Ruta para el catálogo (la que usa MovieList)
// GET http://localhost:3000/api/movies
router.get('/', listarPeliculasController);

//http://localhost:3000/api/movies/reporte/uso
router.get('/reporte/uso', obtenerReporteUso);

// ✅ GET - Película por ID (la que usa MovieDetail)
// GET http://localhost:3000/api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await obtenerPeliculaPorId(req.params.id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la película' });
  }
});

router.get('/catalogo/:profileId', verificarToken, obtenerCatalogoPorPerfilController);

// ✅ POST - Crear película
// POST http://localhost:3000/api/movies
router.post('/', verificarToken, async (req, res) => {
  try {
    const nueva = await crearPelicula({ ...req.body, addedBy: req.user.id });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la película', detalles: error.message });
  }
});

// ✅ PUT - Actualizar película
// PUT http://localhost:3000/api/movies/:id
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const actualizado = await actualizarPeliculaPorId(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Película no encontrada' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la película', detalles: error.message });
  }
});

// ✅ DELETE - Eliminar película
// DELETE http://localhost:3000/api/movies/:id
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const eliminado = await eliminarPeliculaPorId(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Película no encontrada' });
    res.json({ mensaje: 'Película eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la película' });
  }
});

export default router;