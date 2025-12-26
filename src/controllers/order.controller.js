import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/**
 * =====================================================
 *  OBTENER PEDIDOS
 * - Cliente: solo ve sus propios pedidos
 * - Admin / Superadmin: ve todos los pedidos
 * =====================================================
 */
export const getOrders = async (req, res) => {
  try {
    let orders;

    //  Si el usuario es admin o superadmin
    // puede ver TODOS los pedidos del sistema
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      orders = await Order.find()
        // Trae información básica del usuario
        .populate("user", "username email address")
        // Trae nombre y precio del producto
        .populate("items.product", "name price")
        // Ordena por fecha de creación (más reciente primero)
        .sort({ createdAt: -1 });
    } else {
      //  Si es un cliente normal
      // solo puede ver SUS pedidos
      orders = await Order.find({ user: req.user.id })
        .populate("user", "username email address")
        .populate("items.product", "name price")
        .sort({ createdAt: -1 });
    }

    // Respuesta exitosa con la lista de pedidos
    res.json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

/**
 * =====================================================
 *  OBTENER UN PEDIDO POR ID
 * =====================================================
 */
export const getOrderById = async (req, res) => {
  try {
    // Buscar pedido por ID y poblar relaciones
    const order = await Order.findById(req.params.id)
      .populate("user", "username email address")
      .populate("items.product", "name price");

    // Si no existe el pedido
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Retornar pedido encontrado
    res.json(order);
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};

/**
 * =====================================================
 *  ELIMINAR PEDIDO
 * - Solo admin o superadmin
 * - Devuelve automáticamente el stock al eliminar
 * =====================================================
 */
export const deleteOrder = async (req, res) => {
  try {
    //  Validación de permisos
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Acceso denegado. Solo administradores pueden eliminar pedidos.",
      });
    }

    // Buscar pedido y cargar productos
    const order = await Order.findById(req.params.id).populate("items.product");

    // Si no existe el pedido
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    //  Devolver stock por cada producto del pedido
    for (const item of order.items) {
      const product = item.product;
      if (product) {
        product.stock += item.quantity; // se devuelve la cantidad comprada
        await product.save();
      }
    }

    //  Eliminar pedido de la base de datos
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: `Pedido ${order._id} eliminado y stock devuelto correctamente.`,
    });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error al eliminar pedido." });
  }
};

/**
 * =====================================================
 *  EDITAR PEDIDO
 * - Solo admin o superadmin
 * - Recalcula stock y total automáticamente
 * - Protege el precio (no viene del frontend)
 * =====================================================
 */
export const updateOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    //  Validación de permisos
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Acceso denegado. Solo administradores pueden editar pedidos.",
      });
    }

    // Buscar pedido con usuario y productos
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    // Si el pedido no existe
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    /**
     * ----------------------------------------------------
     * 1 ACTUALIZAR DIRECCIÓN DEL USUARIO (opcional)
     * ----------------------------------------------------
     */
    if (address) {
      if (!order.user) {
        return res.status(500).json({
          message: "Error interno: usuario del pedido no encontrado",
        });
      }

      // Se actualiza la dirección directamente en el usuario
      order.user.address = address;
      await order.user.save();
    }

    /**
     * ----------------------------------------------------
     * 2 VALIDAR ÍTEMS NUEVOS
     * ----------------------------------------------------
     */
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "El pedido debe contener al menos un producto.",
      });
    }

    // Validar estructura de cada item
    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          message: "Cada ítem debe incluir 'product' y 'quantity'.",
        });
      }
    }

    /**
     * ----------------------------------------------------
     * 3 DEVOLVER STOCK DEL PEDIDO ORIGINAL
     * ----------------------------------------------------
     */
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    /**
     * ----------------------------------------------------
     * 4 PROCESAR NUEVOS ÍTEMS
     * - Validar stock
     * - Restar stock
     * - Usar precio real del producto
     * ----------------------------------------------------
     */
    let newItemsArray = [];
    let newTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Producto no encontrado: ${item.product}`,
        });
      }

      // Validar stock disponible
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        });
      }

      // Restar stock
      product.stock -= item.quantity;
      await product.save();

      // Precio seguro desde backend
      const price = product.price;

      newItemsArray.push({
        product: product._id,
        quantity: item.quantity,
        price: price,
      });

      // Calcular total
      newTotal += price * item.quantity;
    }

    /**
     * ----------------------------------------------------
     * 5 ACTUALIZAR PEDIDO
     * ----------------------------------------------------
     */
    order.items = newItemsArray;
    order.total = newTotal;

    /**
     * ----------------------------------------------------
     * 6 GUARDAR PEDIDO FINAL
     * ----------------------------------------------------
     */
    const savedOrder = await order.save();

    res.json({
      message: "Pedido actualizado correctamente.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Error al actualizar pedido:", error);
    res.status(500).json({
      message: "Error al actualizar pedido.",
      error: error.message,
    });
  }
};


