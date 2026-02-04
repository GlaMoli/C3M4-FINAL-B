
class IRepository {
  async obtenerPorId(id) {
    throw new Error("Método 'obtenerPorId()' no implementado");
  }

  async obtenerTodos() {
    throw new Error("Método 'obtenerTodos()' no implementado");
  }

  async buscarPorAtributo(atributo, valor) {
    throw new Error("Método 'buscarPorAtributo()' no implementado");
  }

  async crear(data) {
    throw new Error("Método 'crear()' no implementado");
  }

  async actualizarPorId(id, data) {
    throw new Error("Método 'actualizarPorId()' no implementado");
  }

  async eliminarPorId(id) {
    throw new Error("Método 'eliminarPorId()' no implementado");
  }
}

export default IRepository;
