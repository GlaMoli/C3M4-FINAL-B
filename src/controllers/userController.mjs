import User from "../models/UserModel.mjs";
import jwt from "jsonwebtoken";
import sendResetEmail from '../services/emailService.mjs'; 
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Crear usuario (registro)
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 🔒 Control de rol:
    // - Si el que crea es owner autenticado → puede asignar cualquier rol
    // - Si no → siempre se fuerza a "standard"
    let finalRole = "standard";
    if (req.user?.role === "owner" && role) {
      finalRole = role;
    }

    const newUser = new User({
      username,
      email,
      password,
      role: finalRole
    });

    await newUser.save();

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: newUser.toJSON()
    });
  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error en el login" });
  }
};

// Listar usuarios con paginado y filtros (solo owner)
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    const filter = { isDeleted: { $ne: true } };
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const totalItems = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate("profiles")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      data: users,
      page: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    });
  } catch (error) {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
};

// Obtener un usuario por ID (owner o el mismo usuario)
export const getUserById = async (req, res) => {
  try {
    const { id: userId, role } = req.user; // viene del token
    const requestedId = req.params.id;

    if (role !== "owner" && userId !== requestedId) {
      return res.status(403).json({ error: "No tienes permiso para ver este usuario" });
    }

    const user = await User.findById(requestedId).populate("profiles");
    if (!user || user.isDeleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// Actualizar usuario (owner o el mismo usuario)
export const updateUser = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const requestedId = req.params.id;

    if (role !== "owner" && userId !== requestedId) {
      return res.status(403).json({ error: "No tienes permiso para actualizar este usuario" });
    }

    const { username, email, role: newRole } = req.body;
    const user = await User.findByIdAndUpdate(
      requestedId,
      { username, email, role: newRole },
      { new: true, runValidators: true }
    );

    if (!user || user.isDeleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Soft delete de usuario borrado logico findByIdAndUpdate(solo owner)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario marcado como eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};



// Funcion para recuperar contraseña de usuario

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        
        await user.save({ validateBeforeSave: false });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${token}`;

        await sendResetEmail(user.email, resetUrl); 

        console.log("Email enviado con éxito a:", user.email);

        res.status(200).json({ 
            message: "Enlace enviado al correo. Revisá tu bandeja de entrada o spam." 
        });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ error: "Error al solicitar recuperación" });
    }
};

// resetPassword
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } 
        });

          if (!user) {
            return res.status(400).json({ 
                error: "El token es inválido o ya venció. Por favor, solicita uno nuevo." 
            });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ 
            message: "¡Perfecto! Tu contraseña ha sido actualizada correctamente." 
        });

    } catch (error) {
        console.error("Error en resetPassword:", error);
        res.status(500).json({ 
            error: "Hubo un error en el servidor al intentar cambiar la contraseña." 
        });
    }
};