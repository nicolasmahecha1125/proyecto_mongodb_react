import { createContext, useState, useContext } from "react";
import ProductContext from "./ProductContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { products } = useContext(ProductContext);

  //  Agregar producto al carrito
  const addToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === productId);

      // ya existe en carrito
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert("No hay más stock disponible de este producto");
          return prevCart;
        }
      }

      // no existe → agregar con cantidad = 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  //  Quitar un producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  //  Vaciar carrito
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
