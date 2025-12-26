// 📦 Importaciones necesarias de React
import { createContext, useState, useEffect } from 'react';

// 📡 Funciones que hacen peticiones al backend (auth)
import { 
  registerRequest, 
  loginRequest, 
  verifyTokenRequest, 
  registerAdminRequest 
} from "../api/auth";
import Cookies from 'js-cookie';

//  Creación del contexto de autenticación
const AuthContext = createContext();

//  Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {

  //  Usuario autenticado
  const [user, setUser] = useState(null);

  //  Indica si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  Errores provenientes del backend
  const [errors, setErrors] = useState([]);

  //  Estado de carga mientras se verifica el token
  const [loading, setLoading] = useState(true);

  //  Limpieza automática de errores después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  //  Registro de usuario normal
  const signup = async (userData) => {
    setErrors([]);
    try {
      // Enviar datos al backend
      const res = await registerRequest(userData);

      // Si la respuesta es correcta
      if (res.status === 200) {
        setUser(res.data.user || res.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Error en signup: ", err.response?.data);

      // Manejo de errores del backend
      if (Array.isArray(err.response?.data)) {
        setErrors(err.response.data);
      } else if (typeof err.response?.data?.message === "string") {
        setErrors([err.response.data.message]);
      } else {
        setErrors(["Error desconocido al registrar"]);
      }
    }
  };

  //  Registro de administrador (solo superadmin)
  const signupAdmin = async (userData) => {
    setErrors([]);
    try {
      const res = await registerAdminRequest(userData);

      if (res.status === 200) {
        setUser(res.data.user || res.data);
        setIsAuthenticated(true);
        return true; // ✅ Registro exitoso
      }
    } catch (err) {
      console.error("Error en signupAdmin: ", err.response?.data);

      if (Array.isArray(err.response?.data)) {
        setErrors(err.response.data);
      } else if (typeof err.response?.data?.message === "string") {
        setErrors([err.response.data.message]);
      } else {
        setErrors(["Error desconocido al registrar administrador"]);
      }

      return false; // ❌ Error
    }
  };

  //  Inicio de sesión
  const signin = async (userData) => {
    setErrors([]);
    try {
      const res = await loginRequest(userData);

      // Guardar usuario y marcar autenticado
      setUser(res.data.user || res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error en signin: ", err.response?.data);

      if (Array.isArray(err.response?.data)) {
        setErrors(err.response.data);
      } else if (typeof err.response?.data?.message === "string") {
        setErrors([err.response.data.message]);
      } else {
        setErrors(["Error desconocido al iniciar sesión"]);
      }
    }
  };

  //  Cierre de sesión
  const logout = () => {
    // Elimina el token almacenado en cookies
    Cookies.remove("token");

    // Restablece el estado de autenticación
    setIsAuthenticated(false);
    setUser(null);
  };

  //  Verificación automática del token al cargar la app
  useEffect(() => {
    const checkLogin = async () => {

      // Obtener token de las cookies
      const token = Cookies.get("token");

      // Si no hay token, no está autenticado
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar token con el backend
        const res = await verifyTokenRequest(token);

        if (res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  //  Proveer funciones y estados a toda la aplicación
  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        signupAdmin,
        logout,
        loading,
        user,
        isAuthenticated,
        errors,
        setErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
