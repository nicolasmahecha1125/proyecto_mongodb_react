import { Router } from "express";
import { updateProfile } from "../controllers/user.controller.js";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  registerAdmin,
  deleteUser,
  getAllUsers,
} from "../controllers/auth.controller.js";

import {
  authRequired,
  adminRequired,
  superAdminRequired,
} from "../middlewares/ValidateToken.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

// Registro normal (clientes)
router.post("/register", validateSchema(registerSchema), register);

// Login y logout
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/profile", authRequired, profile);

// ✅ actualizar perfiles
router.put("/profile", authRequired, updateProfile);

// ✅ Solo el SUPERADMIN puede crear administradores
router.post("/register/admin", authRequired, superAdminRequired, registerAdmin);

// ✅ Obtener todos los usuarios (solo admin/superadmin)
router.get("/users", authRequired, adminRequired, getAllUsers);

// ✅ Eliminar usuarios (solo admin/superadmin)
router.delete("/users/:id", authRequired, adminRequired, deleteUser);

export default router;
