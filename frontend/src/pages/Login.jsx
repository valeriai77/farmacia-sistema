import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formulario, setFormulario] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Validación frontend
        if (!formulario.email || !formulario.password) {
            setError(
                "Por favor completa todos los campos."
            );
            return;
        }

        setCargando(true);

        try {

            await login(
                formulario.email,
                formulario.password
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.mensaje ||
                "No se pudo iniciar sesión."
            );

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                {/* Logo / encabezado */}

                <div className="text-center mb-8">

                    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">

                        <span className="text-3xl">
                            💊
                        </span>

                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Farmacia
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Sistema de gestión farmacéutica
                    </p>

                </div>


                {/* Tarjeta */}

                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Iniciar sesión
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Ingresa tus credenciales para continuar.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={manejarSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Correo electrónico
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formulario.email}
                                onChange={manejarCambio}
                                placeholder="admin@farmacia.com"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Contraseña
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formulario.password}
                                onChange={manejarCambio}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                        </div>


                        {/* Botón */}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {cargando
                                ? "Ingresando..."
                                : "Iniciar sesión"
                            }

                        </button>

                    </form>


                    {/* Registro */}

                    <div className="mt-6 text-center text-sm text-slate-500">

                        ¿No tienes una cuenta?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Regístrate
                        </Link>

                    </div>

                </div>


                <p className="text-center text-xs text-slate-500 mt-6">
                    Sistema de gestión de farmacia · FullStack
                </p>

            </div>

        </div>
    );
};

export default Login;