// ===================== IMPORTACIONES =====================

// Modelo de usuario (MongoDB / Mongoose)
import User from '../models/user.model.js';

// Librería para encriptar contraseñas
import bcrypt from 'bcryptjs';

// Librería para manejar JWT
import jwt from "jsonwebtoken";

// Función auxiliar para crear tokens de acceso
import { createAccessToken } from '../libs/jwt.js';

// Clave secreta del token
import { TOKEN_SECRET } from '../config.js';


// =========================================================
//  REGISTRO DE USUARIO (CLIENTE)
// =========================================================
export const register = async (req, res) => {
  try {
    console.log("📥 Body recibido en register:", req.body);

    // Extraemos datos del body
    const { email, password, username, role, address } = req.body;

    //  Validación de campos obligatorios
    if (!email || !password || !username || !address) {
      return res
        .status(400)
        .json(["Todos los campos son obligatorios: email, password, username, address"]);
    }

    //  Validación de longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json(["La contraseña debe tener mínimo 6 caracteres"]);
    }

    //  Verificar si el correo ya existe
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json(["El email ya está en uso"]);
    }

    //  Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    //  Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role || "cliente", // Rol por defecto
      address,
    });

    //  Guardar usuario en base de datos
    const userSaved = await newUser.save();

    //  Crear token incluyendo ID y rol
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
    });

    //  Guardar token en cookie segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 📤 Respuesta al cliente
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      address: userSaved.address,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    console.error("❌ Error en register:", error);
    return res.status(500).json({
      error: "Ocurrió un error en el servidor",
      details: error.message,
    });
  }
};


// =========================================================
//  REGISTRO DE ADMINISTRADOR (SOLO SUPERADMIN)
// =========================================================
export const registerAdmin = async (req, res) => {
  try {
    // authRequired + adminRequired ya validaron permisos
    const { email, password, username } = req.body;

    // Validar campos
    if (!email || !password || !username) {
      return res
        .status(400)
        .json(["Todos los campos son obligatorios: email, password, username"]);
    }

    if (password.length < 6) {
      return res.status(400).json(["La contraseña debe tener mínimo 6 caracteres"]);
    }

    // Verificar email duplicado
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json(["El email ya está en uso"]);
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // ⚠️ Rol forzado a "admin"
    const newAdmin = new User({
      username,
      email,
      password: passwordHash,
      role: "admin",
      address: "N/A",
    });

    const adminSaved = await newAdmin.save();

    //  No se inicia sesión automáticamente
    return res.status(201).json({
      id: adminSaved._id,
      username: adminSaved.username,
      email: adminSaved.email,
      role: adminSaved.role,
      createdAt: adminSaved.createdAt,
    });
  } catch (error) {
    console.error("❌ Error en registerAdmin:", error);
    return res.status(500).json({
      error: "Ocurrió un error en el servidor",
      details: error.message,
    });
  }
};


// =========================================================
//  LOGIN
// =========================================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Crear token con datos del usuario
    const token = jwt.sign(
      {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
      },
      TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Guardar token en cookie
    res.cookie("token", token);

    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: userFound._id,
        username: userFound.username,
        role: userFound.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// =========================================================
//  LOGOUT
// =========================================================
export const logout = async (req, res) => {
  // Elimina la cookie del token
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};


// =========================================================
//  PERFIL DE USUARIO
// =========================================================
export const profile = async (req, res) => {
  // req.user viene del middleware authRequired
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    address: userFound.address,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};


// =========================================================
//  VERIFICAR TOKEN
// =========================================================
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token)
    return res.status(401).json({ message: "No Autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err)
      return res.status(401).json({ message: "No Autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({ message: "No Autorizado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      address: userFound.address,
      role: userFound.role,
    });
  });
};


// =========================================================
//  ELIMINAR USUARIO (ADMIN / SUPERADMIN)
// =========================================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    const userToDelete = await User.findById(id);
    if (!userToDelete)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // No eliminarse a sí mismo
    if (userToDelete._id.toString() === requester.id)
      return res
        .status(400)
        .json({ message: "No puedes eliminar tu propia cuenta" });

    // Superadmin: puede eliminar cualquiera
    if (requester.role === "superadmin") {
      await userToDelete.deleteOne();
      return res.json({ message: "Usuario eliminado correctamente (por superadmin)" });
    }

    // Admin: solo clientes
    if (requester.role === "admin") {
      if (userToDelete.role === "cliente") {
        await userToDelete.deleteOne();
        return res.json({ message: "Usuario cliente eliminado correctamente (por admin)" });
      } else {
        return res
          .status(403)
          .json({ message: "Solo puedes eliminar cuentas de clientes" });
      }
    }

    return res
      .status(403)
      .json({ message: "No tienes permisos para eliminar usuarios" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};


// =========================================================
//  OBTENER TODOS LOS USUARIOS
// =========================================================
export const getAllUsers = async (req, res) => {
  try {
    const requester = req.user;

    // Solo admin y superadmin
    if (requester.role !== "superadmin" && requester.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para ver la lista de usuarios" });
    }

    // Campos limitados por seguridad
    const users = await User.find({}, "username email role createdAt");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};
