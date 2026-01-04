import Product from "../models/product.model.js";
import ProductEntry from "../models/productEntry.model.js";

/**
 * =====================================================
 * 📥 REGISTRAR ENTRADA DE PRODUCTO
 * - Solo admin / superadmin
 * - Incrementa stock
 * - Guarda historial
 * =====================================================
 */
export const createProductEntry = async (req, res) => {
  try {
    // 🔐 CONTROL DE PERMISOS
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Acceso restringido. Solo administradores pueden registrar entradas.",
      });
    }

    const { productId, quantity, supplier, note } = req.body;

    // 🔎 Validaciones
    if (!productId || !quantity || !supplier) {
      return res.status(400).json({
        message: "Producto, cantidad y proveedor son obligatorios.",
      });
    }

    const parsedQuantity = Number(quantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        message: "La cantidad debe ser un número mayor a 0.",
      });
    }

    // 🔍 Buscar producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado.",
      });
    }

    // 📈 Incrementar stock
    product.stock += parsedQuantity;
    await product.save();

    // 🧾 Crear registro de entrada
    const entry = new ProductEntry({
      product: product._id,
      quantity: parsedQuantity,
      supplier,
      note,
      createdBy: req.user.id,
    });

    await entry.save();

    res.status(201).json({
      message: "Entrada de producto registrada correctamente ✅",
      entry,
    });
  } catch (error) {
    console.error("❌ Error al registrar entrada:", error);
    res.status(500).json({
      message: "Error al registrar entrada de producto.",
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * 📄 OBTENER TODAS LAS ENTRADAS (RECIBOS)
 * - Admin / Superadmin
 * - Incluye producto y usuario
 * =====================================================
 */
export const getProductEntries = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Acceso restringido.",
      });
    }

    const entries = await ProductEntry.find()
      .populate("product", "name price stock")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("❌ Error al obtener entradas:", error);
    res.status(500).json({
      message: "Error al obtener los recibos de entrada.",
    });
  }
};

/**
 * =====================================================
 * 🔍 OBTENER UNA ENTRADA POR ID
 * =====================================================
 */
export const getProductEntryById = async (req, res) => {
  try {
    const entry = await ProductEntry.findById(req.params.id)
      .populate("product", "name price stock")
      .populate("createdBy", "username email");

    if (!entry) {
      return res.status(404).json({
        message: "Recibo de entrada no encontrado.",
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("❌ Error al obtener entrada:", error);
    res.status(500).json({
      message: "Error al obtener el recibo.",
    });
  }
};
