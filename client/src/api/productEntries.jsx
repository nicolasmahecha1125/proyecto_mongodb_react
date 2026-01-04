import axios from "./axios";

// Crear entrada de producto
export const createProductEntry = (data) =>
  axios.post("/product-entries", data);

// Obtener recibo PDF
export const getEntryReceipt = (entryId) =>
  axios.get(`/product-entries/${entryId}/receipt`, {
    responseType: "blob",
  });

export const getProductEntries = () =>
  axios.get("/product-entries");
