import { Router } from "express";
import {
  createProductEntry,
  getProductEntries,
  getProductEntryById,
} from "../controllers/productEntry.controller.js";
import { generateEntryReceipt } from "../controllers/productEntryReceipt.controller.js";
import { authRequired } from "../middlewares/ValidateToken.js";

const router = Router();

/**
 * =====================================================
 * 📥 REGISTRAR ENTRADA DE PRODUCTO
 * POST /api/product-entries
 * =====================================================
 */
router.post("/", authRequired, createProductEntry);

/**
 * =====================================================
 * 📄 LISTAR TODAS LAS ENTRADAS
 * GET /api/product-entries
 * =====================================================
 */
router.get("/", authRequired, getProductEntries);

/**
 * =====================================================
 * 🔍 OBTENER UNA ENTRADA POR ID
 * GET /api/product-entries/:id
 * =====================================================
 */
router.get("/:id", authRequired, getProductEntryById);

/**
 * =====================================================
 * 🧾 GENERAR RECIBO PDF
 * GET /api/product-entries/:id/receipt
 * =====================================================
 */
router.get("/:id/receipt", authRequired, generateEntryReceipt);

export default router;
