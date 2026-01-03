export default function Header({ design, setDesign, cart }) {
  return (
    <header className="max-w-6xl mx-auto flex justify-between items-center bg-neutral-800/80 px-6 py-4 rounded-xl mb-8">
      <h1 className="text-2xl font-bold text-amber-500">Bodega Premium</h1>

      <nav className="flex gap-2">
        {["hero", "catalogo", "carrito"].map((item) => (
          <button
            key={item}
            onClick={() => setDesign(item)}
            className={`px-4 py-1.5 rounded-full ${
              design === item
                ? "bg-amber-600 text-black"
                : "bg-neutral-700"
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
  );
}
