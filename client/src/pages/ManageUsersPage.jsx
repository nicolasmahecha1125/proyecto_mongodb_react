//  Hooks de React
import { useEffect, useState } from "react";

//  Instancia configurada de Axios
import axios from "../api/axios";

//  Hook personalizado de autenticación
import { useAuth } from "../components/useAuth";

//  Navegación entre rutas
import { useNavigate } from "react-router-dom";

function ManageUsersPage() {

  //  Usuario autenticado y estado de autenticación
  const { user, isAuthenticated } = useAuth();

  //  Lista de usuarios
  const [users, setUsers] = useState([]);

  //  Mensajes informativos o de error
  const [message, setMessage] = useState("");

  //  Estado de carga
  const [loading, setLoading] = useState(true);

  // Navegación programática
  const navigate = useNavigate();

  //  PROTECCIÓN DE RUTA
  // - Si no está autenticado → login
  // - Si no es admin o superadmin → home
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "superadmin" && user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  //  OBTENER LISTA DE USUARIOS
  const getUsers = async () => {
    try {
      // Llamada al backend con cookies (token)
      const res = await axios.get("/users", { withCredentials: true });

      // Guardar usuarios en el estado
      setUsers(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setMessage("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  //  ELIMINAR USUARIO (con validación de permisos)
  const handleDelete = async (id, role) => {

    //  Un admin NO puede eliminar a otro admin o superadmin
    if (
      user.role === "admin" &&
      (role === "admin" || role === "superadmin")
    ) {
      return alert("❌ No puedes eliminar a otro administrador o superadmin");
    }

    //  Un superadmin NO puede eliminar su propia cuenta
    if (
      user.role === "superadmin" &&
      user._id === id
    ) {
      return alert("❌ No puedes eliminar tu propia cuenta");
    }

    //  Confirmación del usuario
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        const res = await axios.delete(`users/${id}`, {
          withCredentials: true,
        });

        // Mostrar mensaje del backend
        setMessage(res.data.message || "Usuario eliminado correctamente");

        //  Recargar lista
        getUsers();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        setMessage(
          err.response?.data?.message || "Error al eliminar usuario"
        );
      }
    }
  };

  //  Cargar usuarios al montar el componente
  useEffect(() => {
    getUsers();
  }, []);

  //  Pantalla de carga
  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-lg animate-pulse">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gestión de Usuarios
      </h1>

      {/*  Mensajes */}
      {message && (
        <div className="bg-blue-600 text-white p-2 rounded-md mb-4 text-center">
          {message}
        </div>
      )}

      {/*  Sin usuarios */}
      {users.length === 0 ? (
        <p className="text-center text-gray-400">
          No hay usuarios registrados.
        </p>
      ) : (
        //  Tabla de usuarios
        <table className="w-full border-collapse border border-zinc-700 text-center">
          <thead>
            <tr className="bg-zinc-700">
              <th className="border border-zinc-600 px-4 py-2">Usuario</th>
              <th className="border border-zinc-600 px-4 py-2">Email</th>
              <th className="border border-zinc-600 px-4 py-2">Rol</th>
              <th className="border border-zinc-600 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-zinc-800 transition-colors duration-150"
              >
                <td className="border border-zinc-700 px-4 py-2">
                  {u.username}
                </td>
                <td className="border border-zinc-700 px-4 py-2">
                  {u.email}
                </td>
                <td className="border border-zinc-700 px-4 py-2 capitalize">
                  {u.role}
                </td>

                {/*  Acciones según rol */}
                <td className="border border-zinc-700 px-4 py-2">
                  {(user.role === "superadmin" ||
                    (user.role === "admin" && u.role === "cliente")) && (
                    <button
                      onClick={() => handleDelete(u._id, u.role)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsersPage;

