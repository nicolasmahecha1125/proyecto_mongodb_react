//  Hook para manejo de formularios
import { useForm } from "react-hook-form";

//  Hook de autenticación
import { useAuth } from "../components/useAuth";

//  Hook de React
import { useEffect } from "react";

//  Navegación y enlaces
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {

  // =====================================================
  //  CONFIGURACIÓN DEL FORMULARIO
  // =====================================================
  const {
    register,               // Registrar inputs
    handleSubmit,           // Manejar submit
    formState: { errors: formErrors }, // Errores del frontend
  } = useForm();

  // =====================================================
  //  CONTEXTO DE AUTENTICACIÓN
  // =====================================================
  const { signup, isAuthenticated, errors, setErrors } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  //  REDIRECCIÓN SI YA ESTÁ AUTENTICADO
  // =====================================================
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // =====================================================
  //  LIMPIEZA AUTOMÁTICA DE ERRORES DEL BACKEND
  // =====================================================
  useEffect(() => {
    if (errors.length > 0) {
      const id = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(id);
    }
  }, [errors, setErrors]);

  // =====================================================
  // REGISTRO DE CLIENTE
  // =====================================================
  const onSubmit = handleSubmit((data) => {
    // Se envían los datos al backend
    signup(data, "cliente");
  });

  // =====================================================
  //  UNIFICACIÓN DE ERRORES
  // - Frontend (React Hook Form)
  // - Backend (API)
  // =====================================================
  const allErrors = [
    ...Object.values(formErrors).map((err) => err.message),
    ...errors,
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

        {/* LISTADO DE ERRORES */}
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

        <h1 className="text-2xl font-bold mb-4 text-center">
          Registro de Cliente
        </h1>

        {/*  FORMULARIO */}
        <form onSubmit={onSubmit}>

          {/*  Username */}
          <input
            type="text"
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Nombre de usuario"
          />

          {/*  Email */}
          <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Correo electrónico"
          />

          {/*  Password */}
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Contraseña"
          />

          {/*  Dirección */}
          <input
            type="text"
            {...register("address", {
              required: "La dirección es obligatoria",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Dirección"
          />

          {/*  Enviar */}
          <button
            type="submit"
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 mt-2 w-full"
          >
            Registrarse
          </button>
        </form>

        {/*  ENLACES */}
        <div className="flex flex-col gap-2 mt-4 text-sm text-center">

          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-sky-500 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>

          <p>
            ¿Eres administrador?{" "}
            <Link
              to="/register/admin"
              className="text-red-400 hover:underline"
            >
              Registrar administrador
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
