import ProductCard from "./ProductCard";

export default function Catalog({
  products,
  quantities,
  onQtyChange,
  onAdd,
}) {
  return (
    <section className="bg-neutral-800 p-8 rounded-xl">
      <h2 className="text-3xl text-amber-500 mb-6">Catálogo</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            quantity={quantities[p._id] ?? 0}
            onChangeQty={(c) => onQtyChange(p._id, c)}
            onAdd={() => onAdd(p)}
          />
        ))}
      </div>
    </section>
  );
}
