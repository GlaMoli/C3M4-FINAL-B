
// Middleware para verificar roles
const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
     // Si el usuario no tiene un rol válido
    if (!rolesPermitidos.includes(req.user.role)) {
      return res
        .status(403)
        .json({ mensaje: 'No tienes permiso para realizar esta acción' });
    }
    // Si el rol es válido, continúa
    next();
  };
};

export default roleMiddleware;
