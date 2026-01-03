import cervezaImg from "../assets/colombian-beers.jpg";

export default function HeroSection({ onGoCatalog }) {
  return (
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
            Vinos, cervezas y licores seleccionados para paladares exigentes.
          </p>

          <button
            onClick={onGoCatalog}
            className="px-8 py-3 bg-amber-600 text-black rounded-full font-semibold
                       hover:bg-amber-500 hover:scale-105 transition"
          >
            Ver catálogo
          </button>
        </div>
      </div>
    </section>
  );
}
