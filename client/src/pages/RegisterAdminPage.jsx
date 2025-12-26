//  Hook para manejar formularios y validaciones
import { useForm } from "react-hook-form";

//  Hook personalizado de autenticación
import { useAuth } from "../components/useAuth";

//  Hook de React
import { useEffect } from "react";

//  Navegación y enlaces
import { useNavigate, Link } from "react-router-dom";

function RegisterAdminPage() {

  // =====================================================
  //  CONFIGURACIÓN DEL FORMULARIO
  // =====================================================
  const {
    register,                // Registra los campos del formulario
    handleSubmit,            // Maneja el evento submit
    formState: { errors: formErrors }, // Errores de validación frontend
  } = useForm();

  // =====================================================
  //  CONTEXTO DE AUTENTICACIÓN
  // =====================================================
  const {
    signupAdmin,   // Función para crear un administrador
    isAuthenticated, // Indica si el usuario está logueado
    user,           // Usuario autenticado
    errors,         // Errores provenientes del backend
    setErrors       // Función para limpiar errores
  } = useAuth();

  const navigate = useNavigate();

  // =====================================================
  // CONTROL DE ACCESO (SOLO SUPERADMIN)
  // =====================================================
  useEffect(() => {
    // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
      navigate("/login");
    }
    // Si está autenticado pero NO es superadmin, redirige al inicio
    else if (user?.role !== "superadmin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // =====================================================
  //  LIMPIEZA AUTOMÁTICA DE ERRORES DEL BACKEND
  // =====================================================
  useEffect(() => {
    if (errors.length > 0) {
      // Elimina los errores después de 5 segundos
      const id = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(id);
    }
  }, [errors, setErrors]);

  // =====================================================
  //  ENVÍO DEL FORMULARIO
  // =====================================================
  const onSubmit = handleSubmit(async (data) => {
    // Llamada al backend para crear el administrador
    const success = await signupAdmin(data);

    console.log("¿Administrador creado correctamente?", success);

    // Si la creación fue exitosa, redirige a la gestión de usuarios
    if (success) {
      navigate("/manage-users");
    }
  });

  // =====================================================
  //  UNIFICACIÓN DE ERRORES
  // =====================================================
  const allErrors = [
    // Errores del formulario (frontend)
    ...Object.values(formErrors).map((err) => err.message),
    // Errores del backend
    ...errors,
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

        {/*  BLOQUE DE VISUALIZACIÓN DE ERRORES */}
        {allErrors.length > 0 && (
          <ul className="mb-4">
            {allErrors.map((err, i) => (
              <li
                key={i}
                className="bg-red-500 text-white p-2 rounded-md mb-2"
              >
                {err}
              </li>
            ))}
          </ul>
        )}

        {/*  TÍTULO */}
        <h1 className="text-2xl font-bold mb-4 text-center text-red-400">
          Registro de Administrador
        </h1>

        {/*  FORMULARIO */}
        <form onSubmit={onSubmit}>

          {/* Nombre de usuario */}
          <input
            type="text"
            {...register("username", {
              required: "El nombre es obligatorio",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Nombre de usuario"
          />

          {/*  Correo electrónico */}
          <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Correo electrónico"
          />

          {/*  Contraseña */}
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Contraseña"
          />

          {/*  Botón de envío */}
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mt-2 w-full"
          >
            Crear Administrador
          </button>
        </form>

        {/*  Enlace de navegación */}
        <div className="mt-4 text-center text-sm">
          <Link to="/" className="text-sky-500 hover:underline">
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterAdminPage;


