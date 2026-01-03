export default function ProductCard({
  product,
  quantity,
  onChangeQty,
  onAdd,
}) {
  return (
    <article className="bg-neutral-900 border rounded-xl overflow-hidden">
      <div className="h-44 flex items-center justify-center">
        {product.image ? (
          <img
            src={`http://localhost:4000/uploads/${product.image}`}
            alt={product.name}
            className="h-40 object-contain"
          />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold">{product.name}</h4>
        <p className="text-sm text-neutral-400">{product.description}</p>

        <div className="flex justify-between mt-2">
          <span className="text-amber-500 font-bold">${product.price}</span>

          <div className="flex gap-2">
            <button onClick={() => onChangeQty(-1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => onChangeQty(1)}>+</button>
          </div>
        </div>

        <button
            disabled={!quantity}
            onClick={onAdd}
            className={`mt-4 w-full py-2 rounded-full font-semibold transition-all${quantity? "bg-amber-600 hover:bg-amber-600 text-white cursor-pointer"
            : "bg-amber-600 text-black/50 cursor-not-allowed"}`}>
                Agregar al carrito
        </button>


      </div>
    </article>
  );
}
