import express from "express";
import { authRequired } from "../middlewares/ValidateToken.js";
import {
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// ✅ Obtener pedidos del usuario o todos si es admin/superadmin
router.get("/orders/my", authRequired, getOrders);

// ✅ Obtener un pedido por ID
router.get("/orders/:id", authRequired, getOrderById);

// ✅ Eliminar un pedido (solo admin/superadmin)
router.delete("/orders/:id", authRequired, deleteOrder);

// ✅ Editar un pedido (solo admin/superadmin)
router.put("/orders/:id", authRequired, updateOrder);

export default router;
