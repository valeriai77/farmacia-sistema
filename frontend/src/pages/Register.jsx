import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {

    const navigate = useNavigate();

    const { registrar } = useAuth();

    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmarPassword: ""
    });

    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });

        setError("");
        setExito("");
    };

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setExito("");

        // ================================
        // VALIDACIONES FRONTEND
        // ================================

        if (
            !formulario.nombre ||
            !formulario.email ||
            !formulario.password ||
            !formulario.confirmarPassword
        ) {
            setError(
                "Todos los campos son obligatorios."
            );
            return;
        }

        if (formulario.nombre.length < 3) {
            setError(
                "El nombre debe tener al menos 3 caracteres."
            );
            return;
        }

        if (formulario.password.length < 6) {
            setError(
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        if (
            formulario.password !==
            formulario.confirmarPassword
        ) {
            setError(
                "Las contraseñas no coinciden."
            );
            return;
        }

        setCargando(true);

        try {

            await registrar(
                formulario.nombre,
                formulario.email,
                formulario.password
            );

            setExito(
                "Cuenta creada correctamente. Redirigiendo al inicio de sesión..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.mensaje ||
                "No se pudo crear la cuenta."
            );

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                {/* Encabezado */}

                <div className="text-center mb-8">

                    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">

                        <span className="text-3xl">
                            💊
                        </span>

                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Crear cuenta
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Regístrate en Farmacia
                    </p>

                </div>


                {/* Tarjeta */}

                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Registro
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Completa tus datos para crear una cuenta.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>

                    )}


                    {/* Éxito */}

                    {exito && (

                        <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            {exito}
                        </div>

                    )}


                    <form
                        onSubmit={manejarSubmit}
                        className="space-y-4"
                    >

                        {/* Nombre */}

                        <div>

                            <label
                                htmlFor="nombre"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Nombre completo
                            </label>

                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                placeholder="Tu nombre"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                        </div>


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
                                placeholder="correo@ejemplo.com"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                        </div>


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
                                placeholder="Mínimo 6 caracteres"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                        </div>

                        <div>

                            <label
                                htmlFor="confirmarPassword"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Confirmar contraseña
                            </label>

                            <input
                                id="confirmarPassword"
                                name="confirmarPassword"
                                type="password"
                                value={formulario.confirmarPassword}
                                onChange={manejarCambio}
                                placeholder="Repite tu contraseña"
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
                                ? "Creando cuenta..."
                                : "Crear cuenta"
                            }

                        </button>

                    </form>


                    <div className="mt-6 text-center text-sm text-slate-500">

                        ¿Ya tienes una cuenta?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Iniciar sesión
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;