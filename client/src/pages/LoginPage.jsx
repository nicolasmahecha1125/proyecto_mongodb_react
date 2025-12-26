import { useForm } from "react-hook-form";
import { useAuth } from "../components/useAuth";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
    const { signin, isAuthenticated, errors, setErrors } = useAuth();
     const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (errors.length > 0) {
        const id = setTimeout(() => setErrors([]), 5000);
        return () => clearTimeout(id);
        }
    }, [errors, setErrors]);

    const onSubmit = handleSubmit((data) => {
        signin(data);
    });

    //  Unificamos errores del frontend (formErrors) y backend (errors)
    const allErrors = [
        ...Object.values(formErrors).map((err) => err.message), // errores react-hook-form
        ...errors, // errores backend
    ];

    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">

              {/* Bloque de errores */}
              {allErrors.length > 0 && (
                <ul className="mb-4">
                  {allErrors.map((err, i) => (
                    <li key={i} className="bg-red-500 text-white p-2 rounded-md mb-2">
                      {err}
                    </li>
                ))}
                </ul>
               )}
               <h1 className="text-2xl font-bold mb-4">Login</h1>

               <form onSubmit={onSubmit}>
                <input
                  type="email"
                  {...register("email", { required: "El email es obligatorio" })}
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                  placeholder="Email"
                />

                <input
                  type="password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                  placeholder="Password"
                />

                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 mt-2"
                >
                 Login
                </button>
               </form>
               <p className="flex gap-x-2 justify-between">
                  ¿No Tienes Cuentas? <Link to="/register"
                  className="text-sky-500">registrate</Link>
               </p>
            </div>
        </div>
    )
}

export default LoginPage
