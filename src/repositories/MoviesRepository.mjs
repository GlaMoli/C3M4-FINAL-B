import Movie from '../models/MovieModel.mjs';
import IRepository from './IRepository.mjs';

class MoviesRepository extends IRepository {
  async obtenerPorId(id) {
    return await Movie.findById(id);
  }

  async obtenerTodos(userId) {
    return await Movie.find({ addedBy: userId });
  }

  async buscarPorAtributo(atributo, valor) {
    return await Movie.find({ [atributo]: new RegExp(valor, 'i') });
  }

  async crear(data) {
    const nuevaPelicula = new Movie(data);
    return await nuevaPelicula.save();
  }

  async actualizarPorId(id, data) {
    return await Movie.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminarPorId(id) {
    return await Movie.findByIdAndDelete(id);
  }

  async eliminarPorTitulo(title) {
    return await Movie.findOneAndDelete({ title });
  }

  async obtenerPorTitulo(title) {
    return await Movie.findOne({ title: new RegExp(title, 'i') });
  }

  // 📑 Nuevo método: paginación de películas
  async obtenerPeliculasPaginadas(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Movie.find({ addedBy: userId }).skip(skip).limit(limit),
      Movie.countDocuments({ addedBy: userId })
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}

export default new MoviesRepository();
