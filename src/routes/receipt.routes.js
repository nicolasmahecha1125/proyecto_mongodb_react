import express from "express";
import { generateReceipt } from "../controllers/receipt.controller.js";
import { authRequired } from "../middlewares/ValidateToken.js";

const router = express.Router();

// 🧾 Generar recibo PDF de una orden específica
router.get("/orders/receipt/:id", authRequired, generateReceipt);

export default router;
