import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // 1. Intentar leer primero del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.token; // 2. Si no hay header, usar la cookie

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en el archivo .env');
    }

    console.log("DEBUG token recibido:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DEBUG decoded:", decoded);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email // opcional si lo incluiste en el payload
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ mensaje: 'El token ha expirado' });
    }
    return res.status(403).json({ mensaje: 'Token inválido' });
  }
};


const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

export default authMiddleware;



