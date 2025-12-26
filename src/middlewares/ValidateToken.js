import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido o expirado" });
    req.user = user; // ✅ se adjunta el usuario al request
    next();
  });
};

// 🔹 Middleware para solo superadmin
export const superAdminRequired = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  if (req.user.role !== "superadmin")
    return res.status(403).json({ message: "Acceso denegado (solo superadmin)" });
  next();
};

// 🔹 Middleware para admin o superadmin
export const adminRequired = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  if (req.user.role !== "admin" && req.user.role !== "superadmin")
    return res.status(403).json({ message: "Acceso denegado (solo admin/superadmin)" });
  next();
};

