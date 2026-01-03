import { useState } from "react";
import axios from "../api/axios";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, change) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] ?? 0) + change, 0),
    }));
  };

  const addToCart = (product) => {
    const qty = quantities[product._id] ?? 0;
    if (!qty || qty > product.stock) return;

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      return existing
        ? prev.map((i) =>
            i._id === product._id
              ? { ...i, quantity: i.quantity + qty }
              : i
          )
        : [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const purchase = async () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  try {
    await axios.post(
      "/purchase",
      {
        items: cart.map((i) => ({
          productId: i._id,
          quantity: i.quantity,
        })),
        total,
      },
      { withCredentials: true }
    );

    alert("✅ Compra realizada con éxito");
    setCart([]);
    setQuantities({});
  } catch (error) {
    if (error.response?.status === 401) {
      alert("⚠️ Debes iniciar sesión para realizar una compra");
    } else {
      alert("❌ Error al procesar la compra");
      console.error(error);
    }
  }
};


  return {
    cart,
    quantities,
    total,
    handleQuantityChange,
    addToCart,
    removeFromCart,
    purchase,
  };
}
