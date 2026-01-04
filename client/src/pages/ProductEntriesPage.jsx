import { useEffect, useState } from "react";
import {
  getProductEntries,
  getEntryReceipt,
} from "../api/productEntries";

export default function ProductEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      try {
        const res = await getProductEntries();
        setEntries(res.data);
      } catch (error) {
        console.error("Error al cargar entradas:", error);
        alert("No se pudieron cargar las entradas");
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, []);

  const openReceipt = async (entryId) => {
    const res = await getEntryReceipt(entryId);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando entradas...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-white p-8">
      <h1 className="text-3xl font-bold text-center text-white mb-10">
        📋 Historial de Entradas de Inventario
      </h1>

      <div className="max-w-6xl mx-auto bg-black rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-left">Proveedor</th>
              <th className="p-3 text-center">Registrado por</th>
              <th className="p-3 text-center">Fecha</th>
              <th className="p-3 text-center">Recibo</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-500">
                <td className="p-3">{e.product.name}</td>
                <td className="p-3 text-center">{e.quantity}</td>
                <td className="p-3">{e.supplier}</td>
                <td className="p-3 text-center">{e.createdBy.username}</td>
                <td className="p-3 text-center">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openReceipt(e._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                  >
                    🧾 Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {entries.length === 0 && (
          <p className="text-center p-6 text-gray-500">
            No hay entradas registradas.
          </p>
        )}
      </div>
    </div>
  );
}
