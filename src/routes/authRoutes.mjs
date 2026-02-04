import express from 'express';
import { signupController, loginController } from '../controllers/authController.mjs';

const router = express.Router();


router.post('/signup', signupController);
router.post('/login', loginController);

// Mostrar formularios
router.get('/signup', (req, res) => res.render('signup')); // renderiza signup.ejs
router.get('/login', (req, res) => res.render('login'));   // renderiza login.ejs


export default router;