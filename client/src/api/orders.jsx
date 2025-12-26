import api from "./axios";
import { downloadBlob } from "../utils/fileDownload";

// Obtener pedidos del usuario (o todos si es admin o superadmin)
export const getMyOrders = () => api.get("/orders/my");

// Descargar recibo en PDF
export const getReceiptPDF = async (orderId) => {
  try {
    const response = await api.get(`/orders/receipt/${orderId}`, {
      responseType: "blob", // necesario para manejar el archivo binario
    });

    downloadBlob(response.data, `recibo_${orderId}.pdf`);
  } catch (error) {
    console.error("❌ Error al descargar el recibo:", error);
    alert("Hubo un problema al descargar el recibo.");
  }
};

// Eliminar pedido (solo admins o superadmin)
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    alert(response.data.message);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    alert("Hubo un problema al eliminar el pedido.");
  }
};

// actualizar orden (solo admin o superadmin)
export const updateOrder = async (id, data) => {
  return await api.put(`/orders/${id}`, data)
};

// obtener ordenes por cliente
export const getOrderById = async (orderId) => {
  return await api.get(`/orders/${orderId}`);
};