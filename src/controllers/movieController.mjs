import {
  obtenerTodasLasPeliculas,
  obtenerPeliculaPorId,
  crearPelicula,
  actualizarPeliculaPorId,
  eliminarPeliculaPorId,
  eliminarPeliculaPorTitulo,
  buscarPeliculasPorAtributo,
  buscarPeliculasAvanzado,
  obtenerPeliculasPaginadas,
  buscarPeliculaPorTitulo,
  calcularTotalesDashboard,
  } from '../services/moviesService.mjs';

import { renderizarPelicula, renderizarListaPeliculas } from '../views/responseView.mjs';
import Profile from '../models/ProfileModel.mjs';
import Movie from '../models/MovieModel.mjs';
import { buscarPeliculas } from '../services/omdbService.js';

// GET - Renderizar dashboard con todas las películas del usuario
export async function obtenerTodasLasPeliculasController(req, res) {
  try {
    console.log("DEBUG req.user:", req.user); // <-- aquí  llega del token

    const peliculas = await obtenerTodasLasPeliculas(req.user.id);
    const totales = calcularTotalesDashboard(peliculas);
    res.render('dashboard', { listaDePeliculas: peliculas, totales });
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
    res.status(500).send("Error interno del servidor.");
  }
}

// GET - Buscar película por título 
export async function buscarPeliculaPorTituloController(req, res) {
  try {
    const { title } = req.params;
    const pelicula = await buscarPeliculaPorTitulo(title);
    if (!pelicula) {
      return res.status(404).send({ mensaje: 'Película no encontrada con ese título' });
    }
    res.status(200).json(renderizarPelicula(pelicula));
  } catch (error) {
    console.error('Error al buscar película por título:', error);
    res.status(500).send({ mensaje: 'Error al buscar película por título', error: error.message });
  }
}

// GET - Obtener película por ID
export async function obtenerPeliculaPorIdController(req, res) {
  try {
    const { id } = req.params;
    const pelicula = await obtenerPeliculaPorId(id);
    if (!pelicula) return res.status(404).send({ mensaje: 'Película no encontrada' });
    res.status(200).json(renderizarPelicula(pelicula));
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al obtener la película', error: error.message });
  }
}

// GET - Buscar películas por atributo simple
export async function buscarPeliculasPorAtributoController(req, res) {
  try {
    const { atributo, valor } = req.params;
    const peliculas = await buscarPeliculasPorAtributo(atributo, valor);
    if (peliculas.length === 0) return res.status(404).send({ mensaje: 'No se encontraron películas con ese atributo' });
    res.status(200).json(renderizarListaPeliculas(peliculas));
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar las películas', error: error.message });
  }
}

// GET - Buscar películas con filtros avanzados ✨
export async function buscarPeliculasAvanzadoController(req, res) {
  try {
    const filtros = req.query;
    const peliculas = await buscarPeliculasAvanzado(filtros);
    if (peliculas.length === 0) return res.status(404).send({ mensaje: 'No se encontraron películas con esos filtros' });
    res.status(200).json(renderizarListaPeliculas(peliculas));
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al buscar películas', error: error.message });
  }
}


// POST - Crear nueva película (API)
export async function crearPeliculaController(req, res) {
  try {
    const nuevaPelicula = await crearPelicula({ ...req.body, addedBy: req.user.id });
    res.status(201).json(renderizarPelicula(nuevaPelicula));
  } catch (error) {
    res.status(500).send({ mensaje: 'Error al crear la película', error: error.message });
  }
}

// POST - Agregar película desde formulario
export const agregarPeliculaController = async (req, res) => {
  try {
    await crearPelicula({ ...req.body, addedBy: req.user.id });
    res.redirect('/movies/dashboard');
  } catch (error) {
    console.error('Error al agregar película:', error);
    res.status(500).send('Hubo un error al agregar la película: ' + error.message);
  }
};

// PUT - Actualizar película por ID
export async function actualizarPeliculaPorIdController(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await actualizarPeliculaPorId(id, req.body);
    if (!actualizado) return res.status(404).send({ mensaje: 'Película no encontrada' });
    res.redirect('/movies/dashboard');
  } catch (error) {
    console.error('Error al actualizar la película:', error);
    res.status(400).send({ mensaje: 'Error al actualizar la película', error: error.message });
  }
}

// DELETE - Eliminar película por ID
export async function eliminarPeliculaPorIdController(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await eliminarPeliculaPorId(id);
    if (!eliminado) return res.status(404).send({ mensaje: 'Película no encontrada' });
    res.redirect('/movies/dashboard');
  } catch (error) {
    console.error('Error al eliminar la película por ID:', error);
    res.status(400).send({ mensaje: 'Error al eliminar la película', error: error.message });
  }
}

// DELETE - Eliminar película por título
export async function eliminarPeliculaPorTituloController(req, res) {
  try {
    const { title } = req.params;
    const eliminado = await eliminarPeliculaPorTitulo(title);
    if (!eliminado) return res.status(404).send({ mensaje: 'Película no encontrada con ese título' });
    res.redirect('/movies/dashboard');
  } catch (error) {
    console.error('Error al eliminar la película por título:', error);
    res.status(400).send({ mensaje: 'Error al eliminar la película por título', error: error.message });
  }
}

// GET - Mostrar formulario de edición
export async function mostrarFormularioEditarController(req, res) {
  try {
    console.log("ID recibido:", req.params.id);
    const pelicula = await Movie.findById(req.params.id);
    if (!pelicula) {
      return res.status(404).render('dashboard', { mensaje: "Película no encontrada" });
    }
    res.render('editMovie', { movie: pelicula });
  } catch (error) {
    console.error("Error en findById:", error);
    res.status(400).render('dashboard', { mensaje: "ID inválido o error en la petición" });
  }
}

// GET - Catálogo filtrado según perfil (control de edad)
export const obtenerCatalogoPorPerfilController = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { title, genero, anio } = req.query; 
    const perfil = await Profile.findById(profileId);
    if (!perfil) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }
    let query = {};
    if (perfil.type === 'child') {
      query = {
        $or: [
          { classification: 'ATP' },
          { ageRestriction: 0 },
          { ageRestriction: { $lte: 7 } }
        ]
      };
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (genero) {
      query.genre = { $regex: genero, $options: 'i' }; 
    }
    if (anio) {
      query.releaseYear = Number(anio);
    }
    const peliculas = await Movie.find(query).lean();
    res.status(200).json(peliculas);
  } catch (error) {
    console.error('Error al obtener catálogo por perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener catálogo' });
  }
};


export const listarPeliculasController = async (req, res) => {
  try {
    // parámetros de query: ?page=2&limit=10&title=Inception&genero=Acción&anio=2010
    const page = parseInt(req.query.page) || 1;      // página actual
    const limit = parseInt(req.query.limit) || 10;   // cantidad por página
    const skip = (page - 1) * limit;

    // filtros dinámicos
    const { title, genero, anio } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" }; // búsqueda parcial por título
    }
    if (genero) {
      query.genre = { $regex: genero, $options: "i" }; // búsqueda parcial por género
    }
    if (anio) {
      query.releaseYear = Number(anio); // búsqueda exacta por año
    }

    // consulta con filtros + paginación
    const peliculas = await Movie.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(query);

    res.json({
      peliculas,
      paginaActual: page,
      totalPaginas: Math.ceil(total / limit),
      totalPeliculas: total,
    });
  } catch (error) {
    console.error("Error al listar películas:", error);
    res.status(500).json({ mensaje: "Error al listar películas" });
  }
};

export const buscarPeliculasPorTituloController = async (req, res) => {
  try {
    const { titulo } = req.query;
    if (!titulo) {
      return res.status(400).json({ mensaje: 'Debe proporcionar un título para buscar' });
    }

    const peliculas = await Movie.find({
      titulo: { $regex: titulo, $options: 'i' } // búsqueda insensible a mayúsculas/minúsculas
    });

    res.json({ peliculas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar películas por título' });
  }
};


export const filtrarPeliculasPorGeneroController = async (req, res) => {
  try {
    const { genero } = req.query;
    if (!genero) {
      return res.status(400).json({ mensaje: 'Debe proporcionar un género para filtrar' });
    }

    const peliculas = await Movie.find({
      genero: { $regex: genero, $options: 'i' }
    });

    res.json({ peliculas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar películas por género' });
  }
};

export const filtrarPeliculasPorAnioController = async (req, res) => {
  try {
    const { anio } = req.query;
    if (!anio) {
      return res.status(400).json({ mensaje: 'Debe proporcionar un año para filtrar' });
    }

    const peliculas = await Movie.find({ año: anio });

    res.json({ peliculas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar películas por año' });
  }
};

export const mostrarDashboardController = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const result = await obtenerPeliculasPaginadas(
      req.user.id,
      Number(page),
      Number(limit)
    );

    res.render('dashboard', {
      listaDePeliculas: result.items,
      paginaActual: Number(page),
      totalPaginas: result.totalPages,
      totalPeliculas: result.total
    });
  } catch (error) {
    res.status(500).render('error', {
      mensaje: 'Error al obtener películas paginadas',
      error: error.message
    });
  }
};

// Funcion para buscar e importar peliculas de api externa 
export async function importarPeliculaController(req, res) {
  try {
    const { titulo, imdbID, search, year } = req.query;
    const data = await buscarPeliculas({ titulo, imdbID, search, year });

    // Caso 1: resultado único (por título o ID)
    if (data.Title) {
      const pelicula = new Movie({
        title: data.Title && data.Title !== 'N/A' ? data.Title : 'Título desconocido',
        releaseYear: /^\d{4}$/.test(data.Year) ? Number(data.Year) : new Date().getFullYear(),
        genre: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(',').map(g => g.trim()) : ['Sin género'],
        director: data.Director && data.Director !== 'N/A' ? data.Director : 'Desconocido',
        cast: data.Actors && data.Actors !== 'N/A' ? data.Actors.split(',').map(a => a.trim()) : [],
        duration: data.Runtime && data.Runtime !== 'N/A' ? parseInt(data.Runtime) : undefined,
        rating: data.imdbRating && data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : undefined,
        classification: mapClassification(data.Rated),
        ageRestriction: mapAgeRestriction(data.Rated),
        synopsis: data.Plot && data.Plot !== 'N/A' ? data.Plot : 'Sin sinopsis disponible',
        posterURL: data.Poster && data.Poster !== 'N/A' ? data.Poster : undefined,
        trailerURL: undefined,
        language: data.Language && data.Language !== 'N/A' ? data.Language : 'Español',
        subtitles: [],
        availableLanguages: data.Language && data.Language !== 'N/A' 
        ? data.Language.split(',').map(l => l.trim())
        : [],
        streamUrl: undefined,
        downloadUrl: undefined,
        addedBy: req.user.id
      });
      await pelicula.save();
      return res.json({ mensaje: 'Película importada y guardada', pelicula });
    }

    // Caso 2: lista de resultados (por search)
    if (data.Search) {
      // Ordenar por rating (requiere pedir detalles de cada ID)
      const peliculasDetalladas = await Promise.all(
        data.Search.map(async (item) => {
          const detalle = await buscarPeliculas({ imdbID: item.imdbID });
          return {
            title: detalle.Title,
            year: detalle.Year,
            rating: detalle.imdbRating !== 'N/A' ? parseFloat(detalle.imdbRating) : 0,
            poster: detalle.Poster
          };
        })
      );

      // Ordenar descendente por rating
      peliculasDetalladas.sort((a, b) => b.rating - a.rating);

      return res.json({ mensaje: 'Resultados de búsqueda', peliculas: peliculasDetalladas });
    }

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al importar/buscar película', error: error.message });
  }
}

// Funciones auxiliares
function mapClassification(rated) {
  switch (rated) {
    case 'G': return 'ATP';
    case 'PG': return '+13';
    case 'PG-13': return '+13';
    case 'R': return '+16';
    case 'NC-17': return '+18';
    default: return 'ATP';
  }
}

function mapAgeRestriction(rated) {
  switch (rated) {
    case 'G': return 0;
    case 'PG': return 13;
    case 'PG-13': return 13;
    case 'R': return 16;
    case 'NC-17': return 18;
    default: return 0;
  }
}

