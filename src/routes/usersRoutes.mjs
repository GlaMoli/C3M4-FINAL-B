import express from 'express';
import {
  createUser,
  loginUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.mjs';
import { verificarToken }  from '../middlewares/authMiddleware.mjs';
import roleMiddleware from '../middlewares/roleMiddleware.mjs';


const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Listar todos los usuarios (solo owner)
router.get('/',verificarToken , roleMiddleware(['owner']), listUsers);

// Obtener un usuario por ID (owner o el mismo usuario)
router.get('/:id', verificarToken, roleMiddleware(['owner', 'standard']), getUserById);

// Actualizar usuario (owner o el mismo usuario)
router.put('/:id', verificarToken, roleMiddleware(['owner', 'standard']), updateUser);

// Eliminar usuario (solo owner)
router.delete("/:id", verificarToken, roleMiddleware(['owner']), deleteUser);

export default router;