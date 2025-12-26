import api from "./axios";

// obtener todos los productos
export const getProducts = () => api.get("/catalogo");

// obtener producto por ID
export const getProductById = (id) => api.get(`/catalogo/${id}`);

// crear producto (requiere token)
export const createProduct = (product) => api.post("/products", product);

// actualizar producto (requiere token)
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);

// eliminar producto (requiere token)
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// funcion de compra de productos
export const purchaseRequest = (items) =>
  api.post("/purchase", { items });