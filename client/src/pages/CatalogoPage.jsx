import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/products";
import { useNavigate } from "react-router-dom";

function CatalogoPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      setProducts(res.data);
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/products/editar/${id}`);
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-10">
        🛍️ Catálogo de Productos
      </h1>

      {/* Grilla de productos */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-md hover:shadow-xl rounded-2xl transition-all duration-300 flex flex-col border border-gray-100"
          >
            {/* Imagen del producto */}
            <div className="flex justify-center items-center p-4 bg-gray-50">
              {p.image ? (
                <img
                  src={`http://localhost:4000/uploads/${p.image}`}
                  alt={p.name}
                  className="w-28 h-28 object-cover rounded-xl"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                {p.name}
              </h2>
              <p className="text-gray-600 text-sm text-center line-clamp-2">
                {p.description}
              </p>

              <div className="mt-3 text-center">
                <span className="text-purple-600 font-bold text-xl">
                  ${p.price.toLocaleString()}
                </span>
                {/* Stock */}
                <p className="text-gray-500 text-sm mt-1">
                  Stock disponible: <span className="font-medium">{p.stock}</span>
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => handleEdit(p._id)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No hay productos disponibles.
        </div>
      )}
    </div>
  );
}

export default CatalogoPage;


