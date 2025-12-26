//  Importaciones de React
import React, { useState, useEffect } from "react";

// Funciones para obtener y actualizar el perfil del usuario
import { updateProfile, getMyProfile } from "../api/auth";

export default function ProfilePage() {

  //  Estado del usuario (datos editables del perfil)
  const [user, setUser] = useState({
    username: "",
    address: "",
  });

  // =====================================================
  //  OBTENER DATOS DEL PERFIL AL CARGAR EL COMPONENTE
  // =====================================================
  useEffect(() => {
    async function fetchUser() {
      try {
        // Llamada al backend para obtener el perfil
        const res = await getMyProfile();

        // Normalizar datos recibidos
        const userData = res.data || {};

        // Guardar datos en el estado
        setUser({
          username: userData.username || "",
          address: userData.address || "",
        });
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    }

    fetchUser();
  }, []);

  // =====================================================
  //  MANEJAR CAMBIOS EN LOS INPUTS
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualiza dinámicamente el campo editado
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  //  ENVIAR FORMULARIO (ACTUALIZAR PERFIL)
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recarga de página

    try {
      // Enviar datos actualizados al backend
      await updateProfile(user);

      // Mensaje de éxito
      alert("Perfil actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  //  Estado de carga simple
  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">

      <h2 className="text-2xl font-semibold mb-4 text-center">
        Editar Perfil
      </h2>

      {/*  Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/*  Nombre de usuario */}
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          className="w-full border p-2 rounded text-black"
        />

        {/*  Dirección */}
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full border p-2 rounded text-black"
        />

        {/*  Guardar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>

      </form>
    </div>
  );
}

