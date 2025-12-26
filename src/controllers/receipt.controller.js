import PDFDocument from "pdfkit";
import Order from "../models/order.model.js";

/**
 * =====================================================
 * 🧾 GENERAR RECIBO EN PDF PARA UNA ORDEN
 * - Busca la orden en la base de datos
 * - Genera un PDF en tiempo real
 * - Lo envía directamente al navegador
 * =====================================================
 */
export const generateReceipt = async (req, res) => {
  try {
    /**
     * ----------------------------------------------------
     * 1️⃣ BUSCAR LA ORDEN
     * - Se obtiene por ID
     * - Se cargan productos y usuario relacionados
     * ----------------------------------------------------
     */
    const order = await Order.findById(req.params.id)
      // Cargar nombre y precio del producto
      .populate("items.product", "name price")
      // Cargar datos del usuario
      .populate("user", "username email address");

    // Validar existencia de la orden
    if (!order) {
      return res.status(404).json({
        message: "Recibo no encontrado",
      });
    }

    /**
     * ----------------------------------------------------
     * 2️⃣ CONFIGURAR DOCUMENTO PDF
     * ----------------------------------------------------
     */
    const doc = new PDFDocument({ margin: 50 });

    // Indicar al navegador que se enviará un PDF
    res.setHeader("Content-Type", "application/pdf");

    // Mostrar el PDF directamente en el navegador
    res.setHeader(
      "Content-Disposition",
      `inline; filename=recibo_${order._id}.pdf`
    );

    // Enviar el PDF como stream al cliente
    doc.pipe(res);

    /**
     * ----------------------------------------------------
     * 3️⃣ ENCABEZADO DEL RECIBO
     * ----------------------------------------------------
     */
    doc
      .fontSize(22)
      .text("🧾 RECIBO DE COMPRA", {
        align: "center",
        underline: true,
      });

    doc.moveDown(2);

    /**
     * ----------------------------------------------------
     * 4️⃣ INFORMACIÓN DEL CLIENTE
     * ----------------------------------------------------
     */
    doc.fontSize(12).text(`Cliente: ${order.user.username}`);
    doc.text(`Correo: ${order.user.email}`);
    doc.text(`Dirección: ${order.user.address}`);
    doc.text(`Fecha: ${order.createdAt.toLocaleDateString()}`);

    doc.moveDown(2);

    /**
     * ----------------------------------------------------
     * 5️⃣ LISTA DE PRODUCTOS COMPRADOS
     * ----------------------------------------------------
     */
    doc
      .fontSize(14)
      .text("Productos adquiridos:", { underline: true });

    doc.moveDown(0.5);

    // Recorrer cada producto del pedido
    order.items.forEach((item, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${item.product.name} 
        — Cantidad: ${item.quantity} 
        — Precio unitario: $${item.price} 
        — Subtotal: $${item.quantity * item.price}`
      );
    });

    doc.moveDown(2);

    /**
     * ----------------------------------------------------
     * 6️⃣ TOTAL A PAGAR
     * ----------------------------------------------------
     */
    doc
      .fontSize(16)
      .text(`Total a pagar: $${order.total}`, {
        align: "right",
        bold: true,
      });

    doc.moveDown(3);

    /**
     * ----------------------------------------------------
     * 7️⃣ PIE DE PÁGINA
     * ----------------------------------------------------
     */
    doc.fontSize(10).text(
      "Gracias por su compra. Este recibo es un comprobante válido de su transacción.",
      {
        align: "center",
        italic: true,
      }
    );

    /**
     * ----------------------------------------------------
     * 8️⃣ FINALIZAR DOCUMENTO
     * ----------------------------------------------------
     */
    doc.end();
  } catch (error) {
    console.error("❌ Error al generar recibo:", error);
    res.status(500).json({
      message: "Error al generar recibo",
    });
  }
};
