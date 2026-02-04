import dotenv from "dotenv";
import express from 'express';
import cors from "cors";
import helmet from "helmet";              
import ejs from 'ejs';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
import { connectDB } from './src/config/dbConfig.mjs';
import methodOverride from 'method-override';
import profilesRoutes from './src/routes/profilesRoutes.mjs';
import moviesRoutes from './src/routes/moviesRoutes.mjs';
import authRoutes from './src/routes/authRoutes.mjs';
import moviesApiRoutes from './src/routes/moviesApiRoutes.mjs';
import cookieParser from 'cookie-parser';
import usersRoutes from './src/routes/usersRoutes.mjs';
import { guardarMensaje } from './src/controllers/contactoController.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // leer como método DELETE viniendo de un POST
app.use(cookieParser());

// Vistas Estaticas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); 
app.use(express.static(path.resolve('./public')));

// Conexión a MongoDB
connectDB();

// Rutas principales de vistas
app.get('/', (req, res) => {
  res.render('index', { title: 'Pagina Principal' });
});
app.get('/about', (req, res) => {
  res.render('about', { title: 'Acerca de Nosotros' });
});
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contáctanos' });
});

  app.post('/api/contacto', guardarMensaje);

  app.use('/api/movies', moviesApiRoutes); 
  app.use('/', moviesRoutes);

// Rutas de autenticación y películas
app.use('/api/profiles', profilesRoutes);
app.use('/', authRoutes);     
app.use('/movies', moviesRoutes); 
app.use('/api/users', usersRoutes);

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).send({ mensaje: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
