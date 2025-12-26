import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  purchaseProducts
} from "../controllers/product.controller.js";

import { authRequired, adminRequired } from "../middlewares/ValidateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createProductSchema } from "../schemas/product.schema.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// 📦 Todos pueden ver el catálogo
router.get("/catalogo", getProducts);
router.get("/catalogo/:id", getProductById);

// 🛠️ Solo administradores autenticados pueden gestionar productos
router.post(
  "/products",
  authRequired,
  adminRequired,
  upload.single("image"),
  validateSchema(createProductSchema),
  createProduct
);

router.put(
  "/products/:id",
  authRequired,
  adminRequired,
  upload.single("image"),
  updateProduct
);

router.delete("/products/:id", authRequired, adminRequired, deleteProduct);

router.post("/purchase", authRequired, purchaseProducts);

export default router;

