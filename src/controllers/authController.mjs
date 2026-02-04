import User from '../models/UserModel.mjs'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signupController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: "Error de validación", detalles: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }
    console.error("Error en signup:", error);
    res.status(500).json({ mensaje: "Error interno", error: error.message });
  }
};


 // Controlador de login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Resultado bcrypt.compare:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email,role: user.role },
      process.env.JWT_SECRET || "secretoTemporal",
      { expiresIn: "1h" }
    );
    // 👉 Guardar token en cookie HttpOnly
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 1000 // 1 hora
});

// 👉 Redirigir al dashboard
res.redirect('/movies/dashboard');
} catch (error) {
  res.status(500).json({ mensaje: "Error interno", error: error.message });
}
};


