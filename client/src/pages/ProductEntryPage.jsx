import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import {
  createProductEntry,
  getEntryReceipt,
} from "../api/productEntries";

export default function ProductEntryPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    supplier: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  // Cargar productos
  useEffect(() => {
    async function loadProducts() {
      const res = await getProducts();
      setProducts(res.data);
    }
    loadProducts();
  }, []);

  // Manejar cambios
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Descargar recibo
  const downloadReceipt = async (entryId) => {
    const res = await getEntryReceipt(entryId);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    window.open(url);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productId || !form.quantity || !form.supplier) {
      return alert("Completa todos los campos obligatorios");
    }

    try {
      setLoading(true);

      const res = await createProductEntry({
        ...form,
        quantity: Number(form.quantity),
      });

      alert("Entrada registrada correctamente ✅");

      // Abrir recibo PDF
      downloadReceipt(res.data.entry._id);

      // Reset
      setForm({
        productId: "",
        quantity: "",
        supplier: "",
        note: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar entrada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-white p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          📥 Registrar Entrada de Producto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-black">Producto</label>
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-black"
            >
              <option value="">Selecciona un producto</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-black">Cantidad</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-black"
            />
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-black">Proveedor</label>
            <input
              type="text"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-black"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-sm font-medium text-black">Observación</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-black"
            />
          </div>

          {/* Botón */}
          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Registrando..." : "Registrar entrada"}
          </button>
        </form>
      </div>
    </div>
  );
}
