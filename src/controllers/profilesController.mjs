import Profile from '../models/ProfileModel.mjs';
import User from '../models/UserModel.mjs';

// Crear un perfil asociado a un usuario
export const crearPerfilController = async (req, res) => {
  const { name, type, ageRestriction } = req.body;

  try {
    // El usuario autenticado viene del token (middleware verificarToken)
    const usuario = await User.findById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const nuevoPerfil = new Profile({
      name,
      type,
      ageRestriction,
      avatar: req.body.avatar,
      createdBy: req.user.id
    });

    await nuevoPerfil.save();

    // 🔹 Vincular el perfil al usuario
    usuario.profiles.push(nuevoPerfil._id);
    await usuario.save();

    res.status(201).json({ mensaje: 'Perfil creado exitosamente', perfil: nuevoPerfil });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear perfil', error: error.message });
  }
};

// Obtener todos los perfiles del usuario logueado (vía Token)
export const obtenerPerfilesPorUsuarioController = async (req, res) => {
  try {
    const userId = req.user.id; 
    const perfiles = await Profile.find({ createdBy: userId });
    
    if (!perfiles || perfiles.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron perfiles" });
    }

    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfiles", error: error.message });
  }
};

/*
// Obtener perfiles según rol
export const obtenerPerfilesPorUsuarioController = async (req, res) => {
  const { userId } = req.params;
  try {
    // El usuario que hace la petición
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    let perfiles;
    // 🔹 Si el rol es admin → ve todos los perfiles
    if (usuario.role === "admin") {
      perfiles = await Profile.find();
    } else {
      // 🔹 Si no es admin → ve solo los suyos
      perfiles = await Profile.find({ createdBy: userId });
    }
    if (!perfiles || perfiles.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron perfiles" });
    }
    res.json(perfiles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfiles", error: error.message });
  }
};
*/
// Obtener un perfil por ID
export const obtenerPerfilPorIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const perfil = await Profile.findById(id);
    if (!perfil) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
};

// Actualizar un perfil
export const actualizarPerfilController = async (req, res) => {
  const { id } = req.params;
  const { name, type, ageRestriction, avatar } = req.body;

  try {
    const perfilActualizado = await Profile.findByIdAndUpdate(
      id,
      { name, type, ageRestriction, avatar },
      { new: true }
    );

    if (!perfilActualizado) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }

    res.json({ mensaje: 'Perfil actualizado exitosamente', perfil: perfilActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
  }
};

// Eliminar un perfil
export const eliminarPerfilController = async (req, res) => {
  const { id } = req.params;

  try {
    const perfilEliminado = await Profile.findByIdAndDelete(id);
    if (!perfilEliminado) {
      return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    }

    // 🔹 Quitar referencia del usuario
    await User.updateOne(
      { _id: perfilEliminado.createdBy },
      { $pull: { profiles: perfilEliminado._id } }
    );

    res.json({ mensaje: 'Perfil eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar perfil', error: error.message });
  }
};

// AGREGAR O QUITAR de la Watchlist (Toggle)
export const gestionarWatchlistController = async (req, res) => {
  const { id } = req.params; // ID del Perfil
  const { movieId } = req.body; // ID de la Película

  try {
    const perfil = await Profile.findById(id);
    if (!perfil) return res.status(404).json({ mensaje: 'Perfil no encontrado' });

    // Verificamos si la película ya está en la lista
    const index = perfil.watchlist.indexOf(movieId);

    if (index === -1) {
      // Si no está, la agregamos ($addToSet evita duplicados por seguridad)
      perfil.watchlist.push(movieId);
      await perfil.save();
      return res.status(200).json({ mensaje: 'Película agregada a Mi Lista', watchlist: perfil.watchlist });
    } else {
      // Si ya está, la quitamos (funciona como un botón de ON/OFF)
      perfil.watchlist.splice(index, 1);
      await perfil.save();
      return res.status(200).json({ mensaje: 'Película quitada de Mi Lista', watchlist: perfil.watchlist });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al gestionar la watchlist', error: error.message });
  }
};