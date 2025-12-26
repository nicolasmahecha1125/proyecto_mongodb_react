import { Link } from "react-router-dom";
import { useAuth } from "../components/useAuth";

function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuth();

  // ⏳ No mostrar nada mientras se verifica el token
  if (loading) return null;

  return (
    <nav className="bg-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-sky-400 transition-colors"
        >
          Pagina Home
        </Link>

        <ul className="flex items-center gap-x-6">
          {isAuthenticated ? (
            <>
              {/*<li>
                <Link
                  to="/tasks"
                  className="text-white hover:text-sky-400 transition-colors"
                >
                  Tareas de {user?.username}
                </Link>}
              </li>*/}

              {/* ✅ Nuevo enlace: Mis compras */}
              {(user?.role === "admin" || user?.role === "superadmin" || user?.role === "cliente") && (
               <li>
                <Link
                   to="/mis-compras"
                  className="text-white hover:text-sky-400 transition-colors"
                 >
                  {user?.role === "cliente" ? "Mis pedidos" : "Pedidos clientes"}
                </Link>
               </li>
              )}

              {(user?.role === "admin" || user?.role === "superadmin") && (
                <li>
                  <Link
                    to="/add-product"
                    className="text-white hover:text-sky-400 transition-colors"
                  >
                    Crear producto
                  </Link>
                </li>
              )}

              {(user?.role === "admin" || user?.role === "superadmin") && (
                <li>
                  <Link
                    to="/manage-users"
                    className="text-white hover:text-sky-400 transition-colors"
                  >
                    Gestionar usuarios
                  </Link>
                </li>
              )}

              {(user?.role === "admin" || user?.role === "superadmin") && (
                <li>
                  <Link
                    to="/catalogo"
                    className="text-white hover:text-sky-400 transition-colors"
                  >
                    Gestionar productos
                  </Link>
                </li>
              )}

              {user?.role === "superadmin" && (
                <li>
                  <Link
                    to="/register/admin"
                    className="text-red-400 hover:text-red-500 transition-colors font-semibold"
                  >
                    Crear administrador
                  </Link>
                </li>
              )}

              {/*<li>
                <Link
                  to="/add-task"
                  className="text-white hover:text-sky-400 transition-colors"
                >
                  Añadir tarea
                </Link>
              </li>*/}
              <li>
                <Link
                  to="/profile"
                  className="text-white hover:text-sky-400 transition-colors"
                > 
                  Mi perfil
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-white hover:text-sky-400 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
