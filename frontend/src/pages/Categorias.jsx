import { useEffect, useMemo, useState } from "react";

import {
    FolderKanban,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Package,
    AlertCircle,
    LoaderCircle
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";


const Categorias = () => {

    const { usuario } = useAuth();

    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const [categorias, setCategorias] = useState([]);

    const [busqueda, setBusqueda] = useState("");

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState("");

    const [mensaje, setMensaje] = useState("");

    const [modalAbierto, setModalAbierto] = useState(false);

    const [editando, setEditando] = useState(null);

    const [guardando, setGuardando] = useState(false);

    const [eliminando, setEliminando] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: ""
    });


    // ======================================================
    // ROLES
    // ======================================================

    const esAdministrador =
        usuario?.rol === "administrador";

    const esModerador =
        usuario?.rol === "moderador";

    const puedeModificar =
        esAdministrador || esModerador;


    // ======================================================
    // CARGAR CATEGORÍAS
    // ======================================================

    const cargarCategorias = async () => {

        try {

            setCargando(true);
            setError("");

            const response =
                await api.get("/categorias");

            const datos =
                response.data?.datos || [];

            setCategorias(
                Array.isArray(datos)
                    ? datos
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudieron cargar las categorías."
            );

        } finally {

            setCargando(false);

        }
    };


    // ======================================================
    // CARGAR AL ENTRAR
    // ======================================================

    useEffect(() => {

        cargarCategorias();

    }, []);


    // ======================================================
    // BUSCAR
    // ======================================================

    const categoriasFiltradas = useMemo(() => {

        const texto =
            busqueda
                .toLowerCase()
                .trim();

        if (!texto) {
            return categorias;
        }

        return categorias.filter((categoria) => {

            const nombre =
                categoria.nombre
                    ?.toLowerCase() || "";

            const descripcion =
                categoria.descripcion
                    ?.toLowerCase() || "";

            return (
                nombre.includes(texto) ||
                descripcion.includes(texto)
            );

        });

    }, [categorias, busqueda]);


    // ======================================================
    // ABRIR NUEVA CATEGORÍA
    // ======================================================

    const abrirNueva = () => {

        setEditando(null);

        setFormulario({
            nombre: "",
            descripcion: ""
        });

        setError("");
        setMensaje("");

        setModalAbierto(true);
    };


    // ======================================================
    // ABRIR EDITAR
    // ======================================================

    const abrirEditar = (categoria) => {

        setEditando(categoria);

        setFormulario({
            nombre: categoria.nombre || "",
            descripcion: categoria.descripcion || ""
        });

        setError("");
        setMensaje("");

        setModalAbierto(true);
    };


    // ======================================================
    // CERRAR MODAL
    // ======================================================

    const cerrarModal = () => {

        if (guardando) {
            return;
        }

        setModalAbierto(false);

        setEditando(null);

        setFormulario({
            nombre: "",
            descripcion: ""
        });

        setError("");
        setMensaje("");
    };


    // ======================================================
    // CAMBIO DEL FORMULARIO
    // ======================================================

    const manejarCambio = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

        setError("");
        setMensaje("");
    };


    // ======================================================
    // GUARDAR
    // ======================================================

    const guardarCategoria = async (e) => {

        e.preventDefault();

        setError("");
        setMensaje("");


        const nombre =
            formulario.nombre.trim();

        const descripcion =
            formulario.descripcion.trim();


        if (!nombre) {

            setError(
                "El nombre de la categoría es obligatorio."
            );

            return;
        }


        try {

            setGuardando(true);


            const datos = {
                nombre,
                descripcion
            };


            if (editando) {

                await api.put(
                    `/categorias/${editando.id}`,
                    datos
                );

                setMensaje(
                    "Categoría actualizada correctamente."
                );

            } else {

                await api.post(
                    "/categorias",
                    datos
                );

                setMensaje(
                    "Categoría creada correctamente."
                );

            }


            await cargarCategorias();


            setTimeout(() => {

                cerrarModal();

            }, 700);


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudo guardar la categoría."
            );

        } finally {

            setGuardando(false);

        }
    };


    // ======================================================
    // ELIMINAR
    // ======================================================

    const eliminarCategoria = async (id) => {

        const confirmar =
            window.confirm(
                "¿Seguro que deseas eliminar esta categoría?"
            );

        if (!confirmar) {
            return;
        }


        try {

            setEliminando(id);

            setError("");


            await api.delete(
                `/categorias/${id}`
            );


            setCategorias((anteriores) =>
                anteriores.filter(
                    (categoria) =>
                        categoria.id !== id
                )
            );


            setMensaje(
                "Categoría eliminada correctamente."
            );


            setTimeout(() => {
                setMensaje("");
            }, 2500);


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudo eliminar la categoría."
            );

        } finally {

            setEliminando(null);

        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc]">


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <Sidebar
                abierto={sidebarAbierto}
                cerrar={() =>
                    setSidebarAbierto(false)
                }
            />


            {/* ==================================================
                NAVBAR
            ================================================== */}

            <Navbar
                abrirSidebar={() =>
                    setSidebarAbierto(true)
                }
            />


            {/* ==================================================
                CONTENIDO
            ================================================== */}

            <main className="pt-20 lg:ml-72">

                <div className="p-5 sm:p-8">


                    {/* ==================================================
                        ENCABEZADO
                    ================================================== */}

                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>

                            <div className="flex items-center gap-2 text-sm font-medium text-violet-600">

                                <FolderKanban size={17} />

                                Organización

                            </div>


                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                                Categorías
                            </h1>


                            <p className="mt-2 text-sm text-slate-500">
                                Organiza los medicamentos por categorías.
                            </p>

                        </div>


                        {puedeModificar && (

                            <button
                                type="button"
                                onClick={abrirNueva}
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                            >

                                <Plus size={18} />

                                Nueva categoría

                            </button>

                        )}

                    </div>


                    {/* ==================================================
                        MENSAJE DE ERROR
                    ================================================== */}

                    {error && !modalAbierto && (

                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ==================================================
                        MENSAJE ÉXITO
                    ================================================== */}

                    {mensaje && !modalAbierto && (

                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

                            {mensaje}

                        </div>

                    )}


                    {/* ==================================================
                        CONTENEDOR
                    ================================================== */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


                        {/* ==================================================
                            BARRA SUPERIOR
                        ================================================== */}

                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">


                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Lista de categorías
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">

                                    {categoriasFiltradas.length}
                                    {" "}
                                    categoría(s)

                                </p>

                            </div>


                            {/* BUSCADOR */}

                            <div className="relative w-full md:w-80">

                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Buscar categoría..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />

                            </div>

                        </div>


                        {/* ==================================================
                            CARGANDO
                        ================================================== */}

                        {cargando ? (

                            <div className="flex min-h-80 items-center justify-center">

                                <div className="flex flex-col items-center gap-3">

                                    <LoaderCircle
                                        size={30}
                                        className="animate-spin text-blue-600"
                                    />

                                    <p className="text-sm text-slate-500">
                                        Cargando categorías...
                                    </p>

                                </div>

                            </div>

                        ) : categoriasFiltradas.length === 0 ? (

                            /* ==================================================
                                SIN RESULTADOS
                            ================================================== */

                            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">

                                    <FolderKanban size={28} />

                                </div>


                                <h3 className="mt-4 font-semibold text-slate-800">
                                    No hay categorías
                                </h3>


                                <p className="mt-1 max-w-sm text-sm text-slate-500">

                                    {busqueda
                                        ? "No encontramos categorías que coincidan con tu búsqueda."
                                        : "Todavía no hay categorías registradas."
                                    }

                                </p>


                                {puedeModificar &&
                                    !busqueda && (

                                        <button
                                            type="button"
                                            onClick={abrirNueva}
                                            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                        >

                                            <Plus size={17} />

                                            Crear categoría

                                        </button>

                                    )}

                            </div>

                        ) : (

                            /* ==================================================
                                TABLA
                            ================================================== */

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[750px] text-left">

                                    <thead className="bg-slate-50">

                                        <tr>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Categoría
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Descripción
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                ID
                                            </th>

                                            {puedeModificar && (

                                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Acciones
                                                </th>

                                            )}

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-100">

                                        {categoriasFiltradas.map(
                                            (categoria) => (

                                                <tr
                                                    key={categoria.id}
                                                    className="transition hover:bg-slate-50"
                                                >


                                                    {/* CATEGORÍA */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                                                <FolderKanban
                                                                    size={20}
                                                                />

                                                            </div>


                                                            <div>

                                                                <p className="font-semibold text-slate-800">
                                                                    {categoria.nombre}
                                                                </p>

                                                                <p className="mt-0.5 text-xs text-slate-400">
                                                                    Categoría de medicamentos
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* DESCRIPCIÓN */}

                                                    <td className="max-w-md px-6 py-5">

                                                        <p className="text-sm text-slate-600">

                                                            {categoria.descripcion ||
                                                                "Sin descripción"}

                                                        </p>

                                                    </td>


                                                    {/* ID */}

                                                    <td className="px-6 py-5">

                                                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">

                                                            #
                                                            {categoria.id}

                                                        </span>

                                                    </td>


                                                    {/* ACCIONES */}

                                                    {puedeModificar && (

                                                        <td className="px-6 py-5">

                                                            <div className="flex justify-end gap-2">


                                                                {/* EDITAR */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        abrirEditar(
                                                                            categoria
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                                    title="Editar"
                                                                >

                                                                    <Pencil
                                                                        size={17}
                                                                    />

                                                                </button>


                                                                {/* ELIMINAR */}

                                                                {esAdministrador && (

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            eliminarCategoria(
                                                                                categoria.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            eliminando ===
                                                                            categoria.id
                                                                        }
                                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                                        title="Eliminar"
                                                                    >

                                                                        {eliminando ===
                                                                        categoria.id ? (

                                                                            <LoaderCircle
                                                                                size={17}
                                                                                className="animate-spin"
                                                                            />

                                                                        ) : (

                                                                            <Trash2
                                                                                size={17}
                                                                            />

                                                                        )}

                                                                    </button>

                                                                )}

                                                            </div>

                                                        </td>

                                                    )}

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>


            {/* ==================================================
                MODAL
            ================================================== */}

            {modalAbierto && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">


                        {/* CABECERA */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                                        <FolderKanban size={18} />

                                    </div>


                                    <h2 className="text-lg font-bold text-slate-900">

                                        {editando
                                            ? "Editar categoría"
                                            : "Nueva categoría"
                                        }

                                    </h2>

                                </div>


                                <p className="mt-1 text-xs text-slate-500">
                                    Completa la información de la categoría.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={cerrarModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORMULARIO */}

                        <form
                            onSubmit={guardarCategoria}
                            className="p-6"
                        >


                            {/* ERROR */}

                            {error && (

                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                                    <AlertCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* ÉXITO */}

                            {mensaje && (

                                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

                                    {mensaje}

                                </div>

                            )}


                            {/* NOMBRE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nombre *
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    placeholder="Ej. Analgésicos"
                                    maxLength={100}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />

                            </div>


                            {/* DESCRIPCIÓN */}

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Descripción
                                </label>

                                <textarea
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarCambio}
                                    rows="4"
                                    placeholder="Describe esta categoría..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />

                            </div>


                            {/* BOTONES */}

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    disabled={guardando}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {guardando && (

                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />

                                    )}


                                    {editando
                                        ? "Guardar cambios"
                                        : "Crear categoría"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};


export default Categorias;