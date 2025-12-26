//  Hooks de React
import { useEffect, useState } from "react";

//  Hooks de React Router
import { useParams, useNavigate } from "react-router-dom";

//  Funciones para consumir la API de productos
import { getProductById, updateProduct } from "../api/products";

export default function EditProductPage() {

  //  Obtener el ID del producto desde la URL
  const { id } = useParams();

  //  Navegación programática
  const navigate = useNavigate();

  //  Estado del producto a editar
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  //  Estado para la nueva imagen (opcional)
  const [image, setImage] = useState(null);

  //  Cargar los datos del producto cuando el componente se monta
  // o cuando cambia el ID del producto
  useEffect(() => {
    async function loadProduct() {
      try {
        // Llamada al backend para obtener el producto por ID
        const res = await getProductById(id);

        // Guardar los datos en el estado
        setProduct(res.data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
      }
    }

    loadProduct();
  }, [id]);

  //  Envío del formulario de edición
  const handleSubmit = async (e) => {
    e.preventDefault(); // ❌ Evita recargar la página

    //  FormData permite enviar texto + archivos
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);

    //  Solo se envía imagen si el usuario selecciona una nueva
    if (image) formData.append("image", image);

    try {
      //  Actualizar producto en el backend
      await updateProduct(id, formData);

      //  Mensaje de éxito
      alert("Producto actualizado correctamente.");

      //  Redirigir al catálogo
      navigate("/catalogo");
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      alert("Error al actualizar el producto.");
    }
  };

  return (
    //  Contenedor principal
    <div className="flex justify-center items-center min-h-screen bg-gray-50">

      {/*  Formulario de edición */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ✏️ Editar Producto
        </h2>

        {/*  Nombre */}
        <label className="text-black block mb-2 font-semibold">Nombre</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          className="text-black w-full p-2 border rounded mb-4"
          required
        />

        {/*  Descripción */}
        <label className="text-black block mb-2 font-semibold">
          Descripción
        </label>
        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          className="text-black w-full p-2 border rounded mb-4"
          rows="3"
        ></textarea>

        {/*  Precio */}
        <label className="text-black block mb-2 font-semibold">Precio</label>
        <input
          type="number"
          step="0.01"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          className="text-black w-full p-2 border rounded mb-4"
          required
        />

        {/*  Stock */}
        <label className="text-black block mb-2 font-semibold">Stock</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({ ...product, stock: e.target.value })
          }
          className="text-black w-full p-2 border rounded mb-4"
          required
        />

        {/*  Imagen */}
        <label className="block mb-2 font-semibold">Imagen</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded mb-6"
        />

        {/*  Botón guardar */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

