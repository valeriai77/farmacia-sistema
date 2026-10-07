import { useEffect, useState } from "react";

import {
    Users,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    ShieldCheck,
    Shield,
    User,
    LoaderCircle
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Usuarios = () => {
    const { usuario } = useAuth();

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "usuario"
    });

    const cargarUsuarios = async () => {
        try {
            setCargando(true);

            const response = await api.get("/auth/usuarios");

            setUsuarios(response.data?.datos || []);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);

            alert(
                error.response?.data?.mensaje ||
                "No se pudieron cargar los usuarios"
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const abrirCrear = () => {
        setModoEdicion(false);
        setUsuarioSeleccionado(null);

        setFormulario({
            nombre: "",
            email: "",
            password: "",
            rol: "usuario"
        });

        setModalAbierto(true);
    };

    const abrirEditar = (user) => {
        setModoEdicion(true);
        setUsuarioSeleccionado(user);

        setFormulario({
            nombre: user.nombre || "",
            email: user.email || "",
            password: "",
            rol: user.rol || "usuario"
        });

        setModalAbierto(true);
    };

    const cerrarModal = () => {
        if (guardando) return;

        setModalAbierto(false);
        setModoEdicion(false);
        setUsuarioSeleccionado(null);

        setFormulario({
            nombre: "",
            email: "",
            password: "",
            rol: "usuario"
        });
    };

    const guardarUsuario = async (e) => {
        e.preventDefault();

        if (!formulario.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        if (!formulario.email.trim()) {
            alert("El correo es obligatorio");
            return;
        }

        if (!modoEdicion && !formulario.password.trim()) {
            alert("La contraseña es obligatoria");
            return;
        }

        try {
            setGuardando(true);

            if (modoEdicion) {
                await api.put(
                    `/auth/usuarios/${usuarioSeleccionado.id}`,
                    {
                        nombre: formulario.nombre,
                        email: formulario.email,
                        rol: formulario.rol,
                        password: formulario.password
                    }
                );

                alert("Usuario actualizado correctamente");
            } else {
                await api.post(
                    "/auth/usuarios",
                    formulario
                );

                alert("Usuario creado correctamente");
            }

            cerrarModal();
            await cargarUsuarios();
        } catch (error) {
            console.error("Error al guardar usuario:", error);

            alert(
                error.response?.data?.mensaje ||
                "No se pudo guardar el usuario"
            );
        } finally {
            setGuardando(false);
        }
    };

    const eliminarUsuario = async (user) => {
        if (user.id === usuario?.id) {
            alert("No puedes eliminar tu propio usuario.");
            return;
        }

        const confirmar = window.confirm(
            `¿Estás seguro de eliminar al usuario "${user.nombre}"?`
        );

        if (!confirmar) return;

        try {
            await api.delete(`/auth/usuarios/${user.id}`);

            alert("Usuario eliminado correctamente");

            await cargarUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);

            alert(
                error.response?.data?.mensaje ||
                "No se pudo eliminar el usuario"
            );
        }
    };

    const usuariosFiltrados = usuarios.filter((user) => {
        const texto = busqueda.toLowerCase().trim();

        return (
            user.nombre?.toLowerCase().includes(texto) ||
            user.email?.toLowerCase().includes(texto) ||
            user.rol?.toLowerCase().includes(texto)
        );
    });

    const obtenerIconoRol = (rol) => {
        if (rol === "administrador") {
            return <ShieldCheck size={15} />;
        }

        if (rol === "moderador") {
            return <Shield size={15} />;
        }

        return <User size={15} />;
    };

    const obtenerEstiloRol = (rol) => {
        if (rol === "administrador") {
            return "bg-purple-50 text-purple-700 border border-purple-100";
        }

        if (rol === "moderador") {
            return "bg-blue-50 text-blue-700 border border-blue-100";
        }

        return "bg-gray-50 text-gray-700 border border-gray-200";
    };

    const obtenerTextoRol = (rol) => {
        if (rol === "administrador") {
            return "Administrador";
        }

        if (rol === "moderador") {
            return "Moderador";
        }

        return "Usuario";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <Navbar />

            <main className="min-w-0 overflow-x-hidden px-4 pb-8 pt-24 sm:px-6 lg:ml-72 lg:px-8">
                <div className="mx-auto w-full max-w-[1600px]">

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <Users size={23} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Usuarios
                                </h1>

                                <p className="mt-0.5 text-sm text-gray-500">
                                    Gestiona los usuarios y sus roles
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={abrirCrear}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Plus size={18} />
                            Nuevo usuario
                        </button>
                    </div>

                    <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Buscar por nombre, correo o rol..."
                                value={busqueda}
                                onChange={(e) =>
                                    setBusqueda(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        {cargando ? (
                            <div className="flex min-h-[320px] items-center justify-center">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <LoaderCircle
                                        size={21}
                                        className="animate-spin"
                                    />
                                    Cargando usuarios...
                                </div>
                            </div>
                        ) : usuariosFiltrados.length === 0 ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                    <Users size={26} />
                                </div>

                                <h3 className="font-semibold text-gray-700">
                                    No se encontraron usuarios
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Intenta con otro término de búsqueda.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[760px] table-auto">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="w-[30%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Usuario
                                            </th>

                                            <th className="w-[30%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Correo
                                            </th>

                                            <th className="w-[20%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Rol
                                            </th>

                                            <th className="w-[20%] px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {usuariosFiltrados.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                                                            {user.nombre
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium text-gray-800">
                                                                {user.nombre}
                                                            </p>

                                                            {user.id === usuario?.id && (
                                                                <span className="text-xs font-medium text-indigo-600">
                                                                    Tú
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="block truncate text-sm text-gray-600">
                                                        {user.email}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${obtenerEstiloRol(
                                                            user.rol
                                                        )}`}
                                                    >
                                                        {obtenerIconoRol(
                                                            user.rol
                                                        )}

                                                        {obtenerTextoRol(
                                                            user.rol
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() =>
                                                                abrirEditar(user)
                                                            }
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                            title="Editar usuario"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                eliminarUsuario(
                                                                    user
                                                                )
                                                            }
                                                            disabled={
                                                                user.id ===
                                                                usuario?.id
                                                            }
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-25"
                                                            title={
                                                                user.id ===
                                                                usuario?.id
                                                                    ? "No puedes eliminarte"
                                                                    : "Eliminar usuario"
                                                            }
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        Mostrando{" "}
                        <span className="font-semibold text-gray-700">
                            {usuariosFiltrados.length}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-gray-700">
                            {usuarios.length}
                        </span>{" "}
                        usuarios
                    </div>
                </div>
            </main>

            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {modoEdicion
                                        ? "Editar usuario"
                                        : "Nuevo usuario"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {modoEdicion
                                        ? "Actualiza los datos del usuario"
                                        : "Registra un nuevo usuario"}
                                </p>
                            </div>

                            <button
                                onClick={cerrarModal}
                                disabled={guardando}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form
                            onSubmit={guardarUsuario}
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre completo
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formulario.email}
                                    onChange={manejarCambio}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formulario.password}
                                    onChange={manejarCambio}
                                    placeholder={
                                        modoEdicion
                                            ? "Dejar vacío para mantenerla"
                                            : "Ingresa una contraseña"
                                    }
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                {modoEdicion && (
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Si no deseas cambiarla, deja este campo vacío.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Rol
                                </label>

                                <select
                                    name="rol"
                                    value={formulario.rol}
                                    onChange={manejarCambio}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="usuario">
                                        Usuario
                                    </option>

                                    <option value="moderador">
                                        Moderador
                                    </option>

                                    <option value="administrador">
                                        Administrador
                                    </option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    disabled={guardando}
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {guardando && (
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                    )}

                                    {modoEdicion
                                        ? "Guardar cambios"
                                        : "Crear usuario"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;