import { useState, useEffect } from "react";
import { useProducts } from "../components/useProducts";
import { useCart } from "../hooks/useCart";

import Header from "../components/Header";
import Catalog from "../components/Catalog";
import HeroSection from "../components/HeroSection";
import Cart from "../components/Cart";

export default function HomePage() {
  const [design, setDesign] = useState("hero");
  const { products, getProducts } = useProducts();
  const cartData = useCart();

  useEffect(() => {
    if (design === "catalogo") getProducts();
  }, [design, getProducts]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <Header design={design} setDesign={setDesign} cart={cartData.cart} />

      {/* HERO */}
      {design === "hero" && (
        <HeroSection onGoCatalog={() => setDesign("catalogo")} />
      )}

      {/* CATÁLOGO */}
      {design === "catalogo" && (
        <Catalog
          products={products}
          quantities={cartData.quantities}
          onQtyChange={cartData.handleQuantityChange}
          onAdd={cartData.addToCart}
        />
      )}

      {/* 🛒 CARRITO */}
      {design === "carrito" && (
        <Cart
          cart={cartData.cart}
          total={cartData.total}
          onRemove={cartData.removeFromCart}
          onPurchase={cartData.purchase}
        />
      )}
    </div>
  );
}
