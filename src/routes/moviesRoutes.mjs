
import express from 'express';
import {
  obtenerTodasLasPeliculasController,
  mostrarFormularioEditarController,
  agregarPeliculaController,
  buscarPeliculasPorAtributoController,
  buscarPeliculasAvanzadoController,
  buscarPeliculaPorTituloController,
  mostrarDashboardController,
  actualizarPeliculaPorIdController,
  eliminarPeliculaPorIdController,
  eliminarPeliculaPorTituloController,
  obtenerCatalogoPorPerfilController ,
  buscarPeliculasPorTituloController,
  filtrarPeliculasPorGeneroController,
  filtrarPeliculasPorAnioController,
  importarPeliculaController
 } from '../controllers/movieController.mjs';

console.log("DEBUG: moviesRoutes cargado");

// Validaciones específicas del modelo
import { validarPelicula } from '../middlewares/validacionesPelicula.mjs';

// Middleware para manejar errores de validación
import { validarResultados } from '../middlewares/validarResultados.mjs';

// Middlewares de autenticación y autorización
import { verificarToken } from '../middlewares/authMiddleware.mjs';
import roleMiddleware from '../middlewares/roleMiddleware.mjs';
//import { listarPeliculasController } from '../controllers/movieController.mjs';


const router = express.Router();
console.log("DEBUG: Router de películas cargado");


//verificarToken

router.get('/add', verificarToken, (req, res) => res.render('addMovie',{ successMessage: null,errorMessage: null}));
router.get('/edit/:id', verificarToken, mostrarFormularioEditarController);
//router.get('/dashboard', verificarToken, obtenerTodasLasPeliculasController);
router.get('/buscar/:atributo/:valor', verificarToken, buscarPeliculasPorAtributoController);
router.get('/buscarAvanzado', verificarToken, buscarPeliculasAvanzadoController); // ✨ filtros avanzados
router.get('/dashboard', verificarToken, mostrarDashboardController);
router.get('/peliculas/titulo/:title', buscarPeliculaPorTituloController);
//router.get('/movies/dashboard', verificarToken, listarPeliculasController);
router.get('/movies/search/titulo', verificarToken, roleMiddleware(['owner','standard','child']), buscarPeliculasPorTituloController);
router.get('/movies/search/genero', verificarToken, roleMiddleware(['owner','standard','child']), filtrarPeliculasPorGeneroController);
router.get('/movies/search/anio', verificarToken, roleMiddleware(['owner','standard','child']), filtrarPeliculasPorAnioController);
router.get('/movies/import', verificarToken, importarPeliculaController);


// Rutas POST con validaciones y manejo de errores (protegidas)
router.post('/agregar', verificarToken, validarPelicula, validarResultados, async (req, res) => {
  try {
      await agregarPeliculaController(req, res);
      res.render('addMovie', { successMessage: 'Película agregada correctamente', errorMessage: null });
  } catch (error) {
    console.error(error);
    res.render('addMovie', {successMessage: null, errorMessage: 'Error al agregar la película' });
  }
});

// Rutas PUT (protegidas)
router.put('/:id', validarPelicula, validarResultados, actualizarPeliculaPorIdController);

// Rutas DELETE (solo admin puede borrar)
router.delete('/movies/:id', verificarToken, roleMiddleware(['owner']), eliminarPeliculaPorIdController);
router.delete('/movies/titulo/:title', verificarToken, roleMiddleware(['owner']), eliminarPeliculaPorTituloController);


export default router;
