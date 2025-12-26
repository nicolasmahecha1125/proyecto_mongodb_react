import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "../api/orders";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);

  // Cargar pedido
  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
        setAddress(res.data.user.address);
        setItems(res.data.items);
      } catch (error) {
        console.error("Error cargando pedido:", error);
      }
    }
    loadOrder();
  }, [id]);

  // Cambiar cantidad
  const handleQuantityChange = (index, value) => {
    const qty = Number(value);
    if (qty <= 0) return; // Validación

    const updated = [...items];
    updated[index].quantity = qty;
    setItems(updated);
  };

  // Eliminar producto del pedido
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Calcular total
  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("El pedido debe tener al menos un producto.");
      return;
    }

    try {
      const updatedOrder = {
        address,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
      };

      await updateOrder(id, updatedOrder);
      alert("Pedido actualizado correctamente");
      navigate("/mis-compras");
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      alert("Error al actualizar el pedido");
    }
  };

  if (!order)
    return <p className="text-center mt-20 text-gray-800">Cargando pedido...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Editar Pedido</h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Dirección */}
        <div>
          <label className="font-semibold text-lg text-gray-800">📍 Dirección del Cliente</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl mt-2 text-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Productos */}
        <div>
          <h3 className="font-semibold text-xl mb-4 text-gray-800">🛍 Productos del Pedido</h3>

          {items.length === 0 && (
            <p className="text-gray-400 text-center">No hay productos en el pedido</p>
          )}

          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg mb-3 flex justify-between items-center bg-gray-50 text-gray-800"
            >
              <div className="w-1/2">
                <p className="font-medium text-gray-800">{item.product.name}</p>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  className="w-20 p-2 border rounded"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />

                <button
                  type="button"
                  className="text-red-600 font-semibold hover:underline"
                  onClick={() => removeItem(index)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-right text-xl font-bold">
          Total: ${calculateTotal()}
        </div>

        {/* Botón guardar */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 text-lg"
        >
          Guardar Cambios
        </button>

      </form>
    </div>
  );
}

