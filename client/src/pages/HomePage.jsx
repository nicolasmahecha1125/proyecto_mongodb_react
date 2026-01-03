import React, { useState, useEffect } from "react";
import { useProducts } from "../components/useProducts";
import axios from "../api/axios";
import cervezaImg from "../assets/colombian-beers.jpg";

export default function HomePage() {
  const [design, setDesign] = useState("hero");
  const { products, getProducts } = useProducts();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (design === "catalogo") getProducts();
  }, [design, getProducts]);

  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] ?? 0) + change, 0),
    }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product._id] ?? 0;
    if (qty === 0 || qty > product.stock) return;

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const handleCartQuantityChange = (id, change) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: i.quantity + change } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const totalGeneral = cart.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );

  const handlePurchase = async () => {
    if (!cart.length) return alert("Tu carrito está vacío");

    try {
      await axios.post(
        "/purchase",
        {
          items: cart.map((i) => ({
            productId: i._id,
            quantity: i.quantity,
          })),
          total: totalGeneral,
        },
        { withCredentials: true }
      );

      alert("✅ Compra realizada con éxito");
      setCart([]);
      setQuantities({});
      setDesign("catalogo");
    } catch {
      alert("❌ Error al realizar la compra");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex justify-between items-center bg-neutral-800/80 backdrop-blur px-6 py-4 rounded-xl shadow mb-8">
        <h1 className="text-2xl font-bold text-amber-500 tracking-wide">
          Bodega Premium
        </h1>

        <nav className="flex gap-2">
          {["hero", "catalogo", "carrito"].map((item) => (
            <button
              key={item}
              onClick={() => setDesign(item)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                design === item
                  ? "bg-amber-600 text-black"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            >
              {item === "hero"
                ? "Inicio"
                : item === "catalogo"
                ? "Catálogo"
                : `Carrito (${cart.length})`}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto">
        {/* HERO */}
        {design === "hero" && (
          <section className="rounded-2xl overflow-hidden shadow-xl">
            <div
              className="h-[28rem] bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${cervezaImg})` }}
            >
              <div className="bg-black/70 p-8 rounded-2xl text-center max-w-xl">
                <h2 className="text-5xl font-extrabold text-amber-500 mb-4">
                  Bodega Premium
                </h2>
                <p className="text-neutral-300 mb-6 text-lg">
                  Vinos, cervezas y licores seleccionados para paladares
                  exigentes.
                </p>
                <button
                  onClick={() => setDesign("catalogo")}
                  className="px-8 py-3 bg-amber-600 text-black rounded-full font-semibold hover:bg-amber-500 hover:scale-105 transition"
                >
                  Ver catálogo
                </button>
              </div>
            </div>
          </section>
        )}

        {/* CATALOGO */}
        {design === "catalogo" && (
          <section className="bg-neutral-800 p-8 rounded-xl shadow-xl">
            <h2 className="text-3xl font-semibold mb-6 text-amber-500">
              Catálogo
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <article
                  key={p._id}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
                >
                  <div className="h-44 bg-neutral-800 flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={`http://localhost:4000/uploads/${p.image}`}
                        alt={p.name}
                        className="h-40 object-contain"
                      />
                    ) : (
                      <span className="text-neutral-500">Sin imagen</span>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold">{p.name}</h4>
                    <p className="text-sm text-neutral-400 mb-2">
                      {p.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-amber-500">
                        ${p.price}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuantityChange(p._id, -1)}
                          className="px-2 bg-neutral-700 rounded"
                        >
                          -
                        </button>
                        <span>{quantities[p._id] ?? 0}</span>
                        <button
                          onClick={() => handleQuantityChange(p._id, 1)}
                          className="px-2 bg-neutral-700 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      disabled={(quantities[p._id] ?? 0) === 0}
                      onClick={() => handleAddToCart(p)}
                      className={`mt-4 w-full py-2 rounded-full text-sm font-medium transition ${
                        (quantities[p._id] ?? 0) === 0
                          ? "bg-neutral-700 text-neutral-500"
                          : "bg-amber-600 text-black hover:bg-amber-500"
                      }`}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CARRITO */}
        {design === "carrito" && (
          <section className="bg-neutral-800 p-8 rounded-xl shadow-xl">
            <h2 className="text-3xl font-semibold text-amber-500 mb-6">
              Tu carrito
            </h2>

            {cart.map((i) => (
              <div
                key={i._id}
                className="flex justify-between items-center py-3 border-b border-neutral-700"
              >
                <span>{i.name}</span>
                <span className="text-amber-500 font-semibold">
                  ${i.price * i.quantity}
                </span>
                <button
                  onClick={() => handleRemoveFromCart(i._id)}
                  className="px-3 py-1 bg-red-600 rounded-full text-sm hover:bg-red-500 transition"
                >
                  Quitar
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <span className="text-xl">Total</span>
              <span className="text-2xl font-bold text-amber-500">
                ${totalGeneral.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePurchase}
              className="mt-6 w-full py-3 bg-green-600 text-black font-semibold rounded-full hover:bg-green-500 hover:scale-105 transition"
            >
              Finalizar compra
            </button>
          </section>
        )}
      </main>

      <footer className="text-center mt-10 text-neutral-500 text-sm">
        © {new Date().getFullYear()} Bodega Premium • Disfruta con responsabilidad
      </footer>
    </div>
  );
}
