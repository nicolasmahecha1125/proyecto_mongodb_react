//  Componentes de React Router
import { Navigate, Outlet } from "react-router-dom";

//  Hook de autenticación
import { useAuth } from "./components/useAuth";

function ProtectedRoute() {

  // Estados del contexto de autenticación
  const { loading, isAuthenticated } = useAuth();

  //  Mientras se verifica el token / sesión
  if (loading) {
    return <h1>Loading...</h1>;
  }

  //  Si no está autenticado → redirigir al login
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado → renderiza la ruta protegida
  return <Outlet />;
}

export default ProtectedRoute;
