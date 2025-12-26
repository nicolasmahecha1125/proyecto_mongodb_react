import Product from "../models/product.model.js";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema.js";
import Order from "../models/order.model.js";

/**
 * =====================================================
 * 🆕 CREAR UN NUEVO PRODUCTO
 * - Valida datos con Joi
 * - Convierte price y stock a número
 * - Guarda imagen usando multer (solo filename)
 * =====================================================
 */
export const createProduct = async (req, res) => {
  try {
    // 🔎 Logs de depuración (útil para verificar FormData)
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    // Convertir price y stock a Number para evitar errores
    const bodyData = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    };

    // ✅ Validar datos con esquema Joi
    const { error } = createProductSchema.validate(bodyData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        // Se envían todos los errores de validación
        errors: error.details.map((err) => err.message),
      });
    }

    // Extraer datos validados
    const { name, description, price, stock } = bodyData;

    // Crear instancia del producto
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      // 📸 Guardar solo el nombre del archivo
      image: req.file ? req.file.filename : null,
    });

    // Guardar en la base de datos
    await newProduct.save();

    // Respuesta exitosa
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({
      message: "Error al crear producto",
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * 📦 OBTENER TODOS LOS PRODUCTOS
 * =====================================================
 */
export const getProducts = async (req, res) => {
  try {
    // Buscar todos los productos
    const products = await Product.find();

    // Retornar lista
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener productos",
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * 🔍 OBTENER PRODUCTO POR ID
 * =====================================================
 */
export const getProductById = async (req, res) => {
  try {
    // Buscar producto por ID
    const product = await Product.findById(req.params.id);

    // Si no existe
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Retornar producto
    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener producto",
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * ✏️ ACTUALIZAR PRODUCTO
 * - Valida datos con Joi
 * - Permite actualizar imagen
 * =====================================================
 */
export const updateProduct = async (req, res) => {
  try {
    // Validar datos recibidos
    const { error } = updateProductSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    // Datos a actualizar
    const updateData = { ...req.body };

    // 📸 Si viene una nueva imagen, se reemplaza
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Actualizar producto
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,          // Devuelve el documento actualizado
        runValidators: true // Ejecuta validaciones de Mongoose
      }
    );

    // Si no existe
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Retornar producto actualizado
    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar producto",
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * 🗑️ ELIMINAR PRODUCTO
 * =====================================================
 */
export const deleteProduct = async (req, res) => {
  try {
    // Eliminar producto por ID
    const product = await Product.findByIdAndDelete(req.params.id);

    // Si no existe
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({
      message: "Error al eliminar producto",
      error: err.message,
    });
  }
};

/**
 * =====================================================
 * 🛒 COMPRAR PRODUCTOS / CREAR PEDIDO
 * - Valida stock
 * - Descuenta stock
 * - Crea orden asociada al usuario
 * =====================================================
 */
export const purchaseProducts = async (req, res) => {
  try {
    // Items y total vienen del frontend
    const { items, total } = req.body;
    // items: [{ productId, quantity }]

    // Validar que existan productos
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No hay productos en la compra.",
      });
    }

    // Usuario autenticado (desde JWT)
    const userId = req.user.id;

    // Array para los productos del pedido
    const orderItems = [];

    /**
     * ----------------------------------------------------
     * 1️⃣ VALIDAR PRODUCTOS Y STOCK
     * ----------------------------------------------------
     */
    for (const item of items) {
      const product = await Product.findById(item.productId);

      // Producto inexistente
      if (!product) {
        return res.status(404).json({
          message: `Producto ${item.productId} no encontrado`,
        });
      }

      // Stock insuficiente
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}`,
        });
      }

      // 🔽 Descontar stock
      product.stock -= item.quantity;
      await product.save();

      // Agregar ítem al pedido
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        // Precio REAL del producto (backend manda)
        price: product.price,
      });
    }

    /**
     * ----------------------------------------------------
     * 2️⃣ CREAR ORDEN
     * ----------------------------------------------------
     */
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total, // ⚠️ recomendación: recalcularlo en backend
    });

    // Guardar pedido
    await newOrder.save();

    // Respuesta exitosa
    res.json({
      message: "Compra realizada con éxito ✅",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al procesar la compra",
    });
  }
};

