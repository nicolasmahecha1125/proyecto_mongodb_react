export default function Cart({
  cart,
  total,
  onRemove,
  onPurchase,
}) {
  if (cart.length === 0) {
    return (
      <div className="bg-neutral-800 p-8 rounded-xl text-center">
        <h2 className="text-2xl text-amber-500 mb-4">
          Tu carrito está vacío
        </h2>
      </div>
    );
  }

  return (
    <section className="bg-neutral-800 p-8 rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold text-amber-500 mb-6">
        Tu carrito
      </h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-4 py-4 border-b border-neutral-700"
        >
          {/* 🖼️ Imagen */}
          <div className="w-20 h-20 bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={`http://localhost:4000/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-neutral-500 text-xs">
                Sin imagen
              </span>
            )}
          </div>

          {/* 📦 Info */}
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-neutral-400">
              Cantidad: {item.quantity}
            </p>
          </div>

          {/* 💲 Precio + eliminar */}
          <div className="flex items-center gap-4">
            <p className="text-amber-500 font-bold text-lg min-w-[80px] text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => onRemove(item._id)}
              title="Quitar del carrito"
              className="
                p-3
                text-red-500
                text-2xl
                hover:text-red-500
                hover:bg-red-700
                rounded-full
                transition-all
                active:scale-90
              "
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      {/* ✅ TOTAL */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-xl">Total</span>
        <span className="text-2xl font-bold text-amber-500">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* ✅ BOTÓN FINALIZAR */}
      <button
        onClick={onPurchase}
        className="mt-6 w-full py-3 bg-green-600 text-black font-semibold rounded-full hover:bg-green-500 transition"
      >
        Finalizar compra
      </button>
    </section>
  );
}
