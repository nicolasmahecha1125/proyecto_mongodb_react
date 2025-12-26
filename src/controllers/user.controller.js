import User from "../models/user.model.js";

/**
 * =====================================================
 * 👤 ACTUALIZAR PERFIL DEL USUARIO (CLIENTE)
 * - Permite modificar username y/o address
 * - Usa el ID del usuario autenticado (JWT)
 * =====================================================
 */
export const updateProfile = async (req, res) => {
  try {
    /**
     * ----------------------------------------------------
     * 1️⃣ OBTENER ID DEL USUARIO AUTENTICADO
     * ----------------------------------------------------
     * req.user.id proviene del middleware de autenticación
     * (token JWT validado previamente)
     */
    const userId = req.user.id;

    /**
     * ----------------------------------------------------
     * 2️⃣ EXTRAER CAMPOS EDITABLES
     * ----------------------------------------------------
     * Solo se permiten cambios en:
     * - username
     * - address
     */
    const { username, address } = req.body;

    /**
     * ----------------------------------------------------
     * 3️⃣ ACTUALIZAR USUARIO EN BASE DE DATOS
     * ----------------------------------------------------
     * Se usa un update dinámico:
     * - Si username existe → se actualiza
     * - Si address existe → se actualiza
     * - Si no vienen datos → no se sobreescriben
     */
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(username && { username }),
        ...(address && { address }),
      },
      {
        new: true, // Devuelve el usuario ya actualizado
      }
    );

    /**
     * ----------------------------------------------------
     * 4️⃣ RESPUESTA AL CLIENTE
     * ----------------------------------------------------
     */
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error al actualizar el perfil:", error);
    res.status(500).json({
      message: "Error al actualizar el perfil",
    });
  }
};

