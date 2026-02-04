import express from 'express';
import {
  crearPerfilController,
  obtenerPerfilesPorUsuarioController,
  obtenerPerfilPorIdController,
  actualizarPerfilController,
  eliminarPerfilController,
  gestionarWatchlistController
} from '../controllers/profilesController.mjs';

import { verificarToken } from '../middlewares/authMiddleware.mjs';
import  roleMiddleware  from '../middlewares/roleMiddleware.mjs';

const router = express.Router();
console.log("DEBUG: Router de perfiles cargado");

router.get('/', verificarToken, roleMiddleware(['owner', 'standard']), obtenerPerfilesPorUsuarioController);

router.get('/usuario/:userId', verificarToken, roleMiddleware(['owner', 'standard']), obtenerPerfilesPorUsuarioController);

// Crear perfil (solo owner puede crear perfiles)
router.post('/', verificarToken, roleMiddleware(['owner','standard']), crearPerfilController);

// Obtener un perfil por ID
router.get('/:id', verificarToken, roleMiddleware(['owner', 'standard', 'child']), obtenerPerfilPorIdController);

// Actualizar perfil (owner o standard pueden editar)
router.put('/:id', verificarToken, roleMiddleware(['owner', 'standard']), actualizarPerfilController);

router.patch('/:id/watchlist', verificarToken, gestionarWatchlistController);

// Eliminar perfil (solo owner puede eliminar)
router.delete('/:id', verificarToken, roleMiddleware(['owner']), eliminarPerfilController);

export default router;