import { useForm } from "react-hook-form";
import { useProducts } from "../components/useProducts";
import { useNavigate } from "react-router-dom";

function CreateProductPage() {
  const { register, handleSubmit } = useForm();
  const { createProduct } = useProducts();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("stock", data.stock);

  // 👇 Adjuntar archivo si existe
  if (data.image && data.image[0]) {
    formData.append("image", data.image[0]);
  }

  await createProduct(formData);
  navigate("/catalogo");
});


  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-zinc-900 max-w-md w-full p-6 rounded-md shadow-lg"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold text-white mb-4">Crear Producto</h1>

        {/* Nombre */}
        <label className="text-white">Nombre</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        {/* Descripción */}
        <label className="text-white">Descripción</label>
        <textarea
          rows="3"
          {...register("description")}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        ></textarea>

        {/* Precio */}
        <label className="text-white">Precio</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        {/* Stock */}
        <label className="text-white">Stock</label>
        <input
          type="number"
          {...register("stock", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        {/* Imagen */}
        <label htmlFor="image" className="text-white">
          Imagen
        </label>
        <input
          type="file"
          {...register("image")}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-2 w-full"
        >
          Guardar Producto
        </button>
      </form>
    </div>
  );
}

export default CreateProductPage;
