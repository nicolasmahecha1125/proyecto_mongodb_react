import PDFDocument from "pdfkit";
import ProductEntry from "../models/productEntry.model.js";

/**
 * =====================================================
 * 🧾 GENERAR RECIBO DE ENTRADA DE PRODUCTO
 * =====================================================
 */
export const generateEntryReceipt = async (req, res) => {
  try {
    const entry = await ProductEntry.findById(req.params.id)
      .populate("product", "name price")
      .populate("createdBy", "username email");

    if (!entry) {
      return res.status(404).json({
        message: "Recibo de entrada no encontrado.",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=entrada_${entry._id}.pdf`
    );

    doc.pipe(res);

    // Encabezado
    doc
      .fontSize(22)
      .text("📥 RECIBO DE ENTRADA DE PRODUCTO", {
        align: "center",
        underline: true,
      });

    doc.moveDown(2);

    // Información general
    doc.fontSize(12);
    doc.text(`Producto: ${entry.product.name}`);
    doc.text(`Cantidad ingresada: ${entry.quantity}`);
    doc.text(`Proveedor: ${entry.supplier}`);
    doc.text(`Registrado por: ${entry.createdBy.username}`);
    doc.text(`Fecha: ${entry.createdAt.toLocaleDateString()}`);

    if (entry.note) {
      doc.moveDown();
      doc.text(`Observaciones: ${entry.note}`);
    }

    doc.moveDown(3);

    // Pie
    doc.fontSize(10).text(
      "Este documento certifica la entrada de producto al inventario.",
      { align: "center", italic: true }
    );

    doc.end();
  } catch (error) {
    console.error("❌ Error al generar recibo de entrada:", error);
    res.status(500).json({
      message: "Error al generar recibo de entrada.",
    });
  }
};
