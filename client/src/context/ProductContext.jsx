import { createContext, useState } from "react";
import axios from "../api/axios"; 

const ProductContext = createContext();


export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  //  obtener todos los productos
  const getProducts = async () => {
    const res = await axios.get("/catalogo");
    setProducts(res.data);
  };

  //  obtener un producto por ID
  const getProductById = async (id) => {
    const res = await axios.get(`/catalogo/${id}`);
    return res.data;
  };

  //  crear producto con imagen
const createProduct = async (formData) => {
  const res = await axios.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  setProducts([...products, res.data]);
};

  //  actualizar producto
  const updateProduct = async (id, product) => {
    const res = await axios.put(`/products/${id}`, product);
    setProducts(products.map((p) => (p._id === id ? res.data : p)));
  };

  //  eliminar producto
  const deleteProduct = async (id) => {
    await axios.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  //  Proveer funciones y estados a toda la aplicación
  return (
    <ProductContext.Provider
      value={{
        products,
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContext
