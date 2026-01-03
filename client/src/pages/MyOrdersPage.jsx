// ===============================
// Importaciones de React
// ===============================
import React, { useEffect, useState } from "react";
// Navegación
import { useNavigate } from "react-router-dom";
// API pedidos
import { getMyOrders, getReceiptPDF, deleteOrder } from "../api/orders";
// Utilidades
import { downloadBlob } from "../utils/fileDownload";
import { openRouteFromCurrentPosition } from "../utils/openRouteFromCurrentPosition";
// Auth
import { useAuth } from "../components/useAuth";

export default function MyOrdersPage() {
  // ===============================
  // ESTADOS
  // ===============================
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ===============================
  // OBTENER PEDIDOS
  // ===============================
  useEffect(() => {
    async function fetchOrders() {
      const res = await getMyOrders();
      setOrders(res.data);
    }
    fetchOrders();
  }, []);

  // ===============================
  // ELIMINAR PEDIDO
  // ===============================
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("¿Estás seguro de eliminar este pedido?")) return;

    await deleteOrder(orderId);
    setOrders(prev => prev.filter(o => o._id !== orderId));
  };

  // ===============================
  // EDITAR PEDIDO
  // ===============================
  const handleEditOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  // ===============================
  // SIN PEDIDOS
  // ===============================
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-black">
        <p className="text-2xl font-semibold mb-3">
          No hay pedidos aún 🛒
        </p>
        <p>
          {user?.role === "cliente"
            ? "¡Empieza a comprar y tus pedidos aparecerán aquí!"
            : "No hay pedidos registrados todavía."}
        </p>
      </div>
    );
  }

  // ===============================
  // VISTA PRINCIPAL
  // ===============================
  return (
    <div className="p-8 bg-gradient-to-b from-gray-950 to-white min-h-screen text-white">

      <h2 className="text-3xl font-bold mb-6 text-center">
        {user?.role === "cliente" ? "🧾 Mis pedidos" : "📦 Pedidos de clientes"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => {

          const cliente = order.user || {};

          return (
            <div
              key={order._id}
              className="bg-gray-100 rounded-2xl shadow-md p-6 border-gray-400 text-black"
            >

              {/* NÚMERO DE PEDIDO */}
              <p className="text-xl mb-2">
                <strong>📦 Pedido Nº:</strong> {order._id.slice(-6)}
              </p>

              {/* CLIENTE */}
              <p className="text-sm"><strong>Cliente:</strong> {cliente.username || "No disponible"}</p>
              <p className="text-sm"><strong>Correo:</strong> {cliente.email || "No disponible"}</p>
              <p className="text-sm"><strong>Dirección:</strong> {cliente.address || "No disponible"}</p>

              {/* PRODUCTOS */}
              <div className="mt-3">
                <p className="font-semibold mb-1 text-xl">🛒 Productos:</p>

                {order.items?.length > 0 ? (
                  <ul className="text-base space-y-1">
                    {order.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between border-b pb-1"
                      >
                        <span>{item.product?.name || "Producto eliminado"}</span>
                        <span className="font-medium">x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">
                    No hay productos en este pedido
                  </p>
                )}
              </div>

              {/* TOTAL */}
              <p className="font-bold text-lg mt-3">
                Total: ${order.total.toLocaleString()}
              </p>

              {/* MAPS */}
              {cliente.address && (
                <button
                  onClick={() => openRouteFromCurrentPosition(cliente.address)}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg mt-3 w-full hover:bg-purple-700"
                >
                  Ver ruta desde mi ubicación
                </button>
              )}

              {/* PDF */}
              <button
                onClick={async () => {
                  const res = await getReceiptPDF(order._id);
                  downloadBlob(res, `recibo_${order._id}.pdf`);
                }}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg mt-2 w-full hover:bg-blue-700"
              >
                Descargar PDF
              </button>

              {/* ADMIN */}
              {(user?.role === "admin" || user?.role === "superadmin") && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditOrder(order._id)}
                    className="flex-1 bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}


