import React, { useState, useEffect } from "react";
import { useProducts } from "../components/useProducts";
import axios from "../api/axios"; // 👈 asegúrate de tener tu instancia axios configurada
import cervezaImg from "../assets/colombian-beers.jpg";

export default function HomePage() {
  const [design, setDesign] = useState("hero");
  const { products, getProducts } = useProducts();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  // cargar productos al entrar al catálogo
  useEffect(() => {
    if (design === "catalogo") getProducts();
  }, [design, getProducts]);

  // manejar cantidad en catálogo
  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[productId] ?? 0) + change, 0);
      return { ...prev, [productId]: newQty };
    });
  };

  // agregar al carrito
  const handleAddToCart = (product) => {
    const qty = quantities[product._id] ?? 0;
    if (qty === 0) return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity + qty > product.stock) {
          alert("No hay suficiente stock disponible.");
          return prevCart;
        }
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        if (qty > product.stock) {
          alert("No hay suficiente stock disponible.");
          return prevCart;
        }
        return [...prevCart, { ...product, quantity: qty }];
      }
    });
  };

  // aumentar/disminuir cantidad en carrito
  const handleCartQuantityChange = (productId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ingresar cantidad directamente
  const handleCartQuantityInput = (productId, value) => {
    const newQty = parseInt(value, 10);
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === productId) {
          if (isNaN(newQty) || newQty < 1) return { ...item, quantity: 1 };
          if (newQty > item.stock) {
            alert("No hay suficiente stock disponible.");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // eliminar producto
  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  // calcular total
  const totalGeneral = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🟢 FUNCIÓN DE COMPRA
  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {
      const purchaseData = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        total: totalGeneral,
      };

      const res = await axios.post("/purchase", purchaseData, {
        withCredentials: true, // 👈 si usas cookies/token
      });

      alert(`✅ Compra realizada con éxito: ${res.data.message || "Gracias por tu compra!"}`);
      setCart([]); // vaciar carrito
      setQuantities({});
      setDesign("catalogo"); // volver al catálogo
    } catch (error) {
      console.error(error);
      alert("❌ Error al realizar la compra. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Bodega Premium</h1>
        <nav className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              design === "hero" ? "bg-amber-700 text-white" : "bg-white shadow"
            }`}
            onClick={() => setDesign("hero")}
          >
            Inicio
          </button>
          <button
            className={`px-3 py-1 rounded ${
              design === "catalogo"
                ? "bg-amber-700 text-white"
                : "bg-white shadow"
            }`}
            onClick={() => setDesign("catalogo")}
          >
            Catálogo
          </button>
          <button
            className={`px-3 py-1 rounded ${
              design === "carrito"
                ? "bg-amber-700 text-white"
                : "bg-white shadow"
            }`}
            onClick={() => setDesign("carrito")}
          >
            Carrito ({cart.length})
          </button>
        </nav>
      </header>

      {/* --- MAIN --- */}
      <main className="max-w-6xl mx-auto">
        {/* --- HERO --- */}
        {design === "hero" && (
          <section className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
            <div
              className="h-96 sm:h-[28rem] w-full bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `url(${cervezaImg})`,
              }}
            >
              <div className="bg-black bg-opacity-40 p-6 rounded-xl text-center max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Bienvenido a Bodega Premium
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-6">
                  Descubre los mejores vinos y licores seleccionados
                  especialmente para ti.
                </p>
                <button
                  className="px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg shadow hover:bg-amber-800 transition"
                  onClick={() => setDesign("catalogo")}
                >
                  Ver Catálogo
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- CATÁLOGO --- */}
        {design === "catalogo" && (
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-semibold mb-4">
              Catálogo de productos
            </h2>
            {products.length === 0 ? (
              <p className="text-neutral-500">No hay productos disponibles</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <article
                    key={p._id}
                    className="rounded-lg overflow-hidden border hover:shadow-lg transition"
                  >
                    <div className="h-40 flex items-center justify-center bg-neutral-100">
                      {p.image ? (
                        <img
                          src={`http://localhost:4000/uploads/${p.image}`}
                          alt={p.name}
                          className="h-40 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-neutral-400">Sin imagen</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium">{p.name}</h4>
                      <p className="text-sm text-neutral-500">{p.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-amber-700">
                          ${p.price}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 bg-neutral-200 rounded"
                            onClick={() => handleQuantityChange(p._id, -1)}
                          >
                            -
                          </button>
                          <span>{quantities[p._id] ?? 0}</span>
                          <button
                            className="px-2 bg-neutral-200 rounded"
                            onClick={() => handleQuantityChange(p._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className={`mt-4 w-full text-sm px-3 py-2 rounded transition ${
                          (quantities[p._id] ?? 0) === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-amber-700 text-white hover:bg-amber-800"
                        }`}
                        onClick={() => handleAddToCart(p)}
                        disabled={(quantities[p._id] ?? 0) === 0}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- CARRITO --- */}
        {design === "carrito" && (
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-3xl font-semibold mb-6">Tu carrito</h2>
            {cart.length === 0 ? (
              <p className="text-neutral-500">Tu carrito está vacío</p>
            ) : (
              <>
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between items-center py-3"
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-neutral-500">
                          Precio unitario: ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 bg-neutral-200 rounded"
                            onClick={() =>
                              handleCartQuantityChange(item._id, -1)
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              handleCartQuantityInput(item._id, e.target.value)
                            }
                            className="w-12 text-center border rounded"
                          />
                          <button
                            className="px-2 bg-neutral-200 rounded"
                            onClick={() =>
                              handleCartQuantityChange(item._id, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-amber-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 hover:scale-105 transition transform"
                        >
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* --- TOTAL Y BOTÓN DE COMPRA --- */}
                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total general:</span>
                  <span className="text-xl font-bold text-amber-700">
                    ${totalGeneral.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePurchase}
                  className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Finalizar compra
                </button>
              </>
            )}
          </section>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="max-w-6xl mx-auto mt-10 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Bodega Premium • Disfruta con
        responsabilidad
      </footer>
    </div>
  );
}
