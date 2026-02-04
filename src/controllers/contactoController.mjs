import { Contact } from '../models/ContactModel.mjs'; 

export const guardarMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const nuevoMensaje = new Contact({ nombre, email, mensaje });
    await nuevoMensaje.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
};