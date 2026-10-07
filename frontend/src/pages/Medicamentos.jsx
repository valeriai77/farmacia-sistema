import { useEffect, useMemo, useState } from "react";
import {
    Pill,
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

const Medicamentos = () => {
    const { usuario } = useAuth();

    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const [medicamentos, setMedicamentos] = useState([]);
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
        descripcion: "",
        precio: "",
        stock: "",
        categoriaId: ""
    });

    const esAdministrador = usuario?.rol === "administrador";
    const esModerador = usuario?.rol === "moderador";
    const puedeModificar = esAdministrador || esModerador;

    const cargarMedicamentos = async () => {
        try {
            setCargando(true);
            setError("");

            const response = await api.get("/medicamentos");
            const datos = response.data?.datos || [];

            setMedicamentos(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudieron cargar los medicamentos."
            );
        } finally {
            setCargando(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await api.get("/categorias");
            const datos = response.data?.datos || [];

            setCategorias(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudieron cargar las categorías."
            );
        }
    };

    useEffect(() => {
        cargarMedicamentos();
        cargarCategorias();
    }, []);

    const medicamentosFiltrados = useMemo(() => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) {
            return medicamentos;
        }

        return medicamentos.filter((medicamento) => {
            const nombre =
                medicamento.nombre?.toLowerCase() || "";

            const descripcion =
                medicamento.descripcion?.toLowerCase() || "";

            const categoria =
                medicamento.categoria?.nombre?.toLowerCase() || "";

            return (
                nombre.includes(texto) ||
                descripcion.includes(texto) ||
                categoria.includes(texto)
            );
        });
    }, [medicamentos, busqueda]);

    const abrirNuevo = () => {
        setEditando(null);

        setFormulario({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoriaId: ""
        });

        setError("");
        setMensaje("");
        setModalAbierto(true);
    };

    const abrirEditar = (medicamento) => {
        setEditando(medicamento);

        setFormulario({
            nombre: medicamento.nombre || "",
            descripcion: medicamento.descripcion || "",
            precio: medicamento.precio ?? "",
            stock: medicamento.stock ?? "",
            categoriaId:
                medicamento.categoriaId ??
                medicamento.categoria?.id ??
                ""
        });

        setError("");
        setMensaje("");
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        if (guardando) {
            return;
        }

        setModalAbierto(false);
        setEditando(null);

        setFormulario({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoriaId: ""
        });

        setError("");
        setMensaje("");
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));

        setError("");
        setMensaje("");
    };

    const guardarMedicamento = async (e) => {
        e.preventDefault();

        setError("");
        setMensaje("");

        const nombre = formulario.nombre.trim();
        const descripcion = formulario.descripcion.trim();
        const precio = Number(formulario.precio);
        const stock = Number(formulario.stock);
        const categoriaId = Number(formulario.categoriaId);

        if (!nombre) {
            setError("El nombre del medicamento es obligatorio.");
            return;
        }

        if (
            formulario.precio === "" ||
            Number.isNaN(precio) ||
            precio < 0
        ) {
            setError("Ingresa un precio válido.");
            return;
        }

        if (
            formulario.stock === "" ||
            Number.isNaN(stock) ||
            stock < 0 ||
            !Number.isInteger(stock)
        ) {
            setError("Ingresa un stock válido.");
            return;
        }

        if (
            formulario.categoriaId === "" ||
            Number.isNaN(categoriaId) ||
            categoriaId <= 0
        ) {
            setError("Debes seleccionar una categoría.");
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                nombre,
                descripcion,
                precio,
                stock,
                categoriaId
            };

            if (!editando) {
                await api.post("/medicamentos", datos);

                setMensaje("Medicamento creado correctamente.");
            } else {
                await api.put(
                    `/medicamentos/${editando.id}`,
                    datos
                );

                setMensaje("Medicamento actualizado correctamente.");
            }

            await cargarMedicamentos();

            setTimeout(() => {
                cerrarModal();
            }, 700);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudo guardar el medicamento."
            );
        } finally {
            setGuardando(false);
        }
    };

    const eliminarMedicamento = async (id) => {
        const confirmar = window.confirm(
            "¿Seguro que deseas eliminar este medicamento?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setEliminando(id);
            setError("");

            await api.delete(`/medicamentos/${id}`);

            setMedicamentos((anteriores) =>
                anteriores.filter(
                    (medicamento) => medicamento.id !== id
                )
            );

            setMensaje("Medicamento eliminado correctamente.");

            setTimeout(() => {
                setMensaje("");
            }, 2500);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudo eliminar el medicamento."
            );
        } finally {
            setEliminando(null);
        }
    };

    const obtenerNombreCategoria = (medicamento) => {
        if (medicamento.categoria?.nombre) {
            return medicamento.categoria.nombre;
        }

        const categoria = categorias.find(
            (item) => Number(item.id) === Number(medicamento.categoriaId)
        );

        return categoria?.nombre || "Sin categoría";
    };

    const obtenerEstadoStock = (stock) => {
        const cantidad = Number(stock);

        if (cantidad === 0) {
            return {
                texto: "Sin stock",
                clase: "bg-red-50 text-red-700"
            };
        }

        if (cantidad <= 10) {
            return {
                texto: "Stock bajo",
                clase: "bg-amber-50 text-amber-700"
            };
        }

        return {
            texto: "Disponible",
            clase: "bg-emerald-50 text-emerald-700"
        };
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Sidebar
                abierto={sidebarAbierto}
                cerrar={() => setSidebarAbierto(false)}
            />

            <Navbar
                abrirSidebar={() => setSidebarAbierto(true)}
            />

            <main className="pt-20 lg:ml-72">
                <div className="p-5 sm:p-8">
                    <div className="mx-auto w-full max-w-[1600px]">
                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                    <Pill size={17} />
                                    Inventario
                                </div>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                                    Medicamentos
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Administra los medicamentos registrados en la farmacia.
                                </p>
                            </div>

                            {puedeModificar && (
                                <button
                                    type="button"
                                    onClick={abrirNuevo}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    <Plus size={18} />
                                    Nuevo medicamento
                                </button>
                            )}
                        </div>

                        {error && !modalAbierto && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {mensaje && !modalAbierto && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                                {mensaje}
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Lista de medicamentos
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {medicamentosFiltrados.length} medicamento(s)
                                    </p>
                                </div>

                                <div className="relative w-full md:w-80">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={(e) =>
                                            setBusqueda(e.target.value)
                                        }
                                        placeholder="Buscar medicamento..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>

                            {cargando ? (
                                <div className="flex min-h-80 items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <LoaderCircle
                                            size={30}
                                            className="animate-spin text-blue-600"
                                        />

                                        <p className="text-sm text-slate-500">
                                            Cargando medicamentos...
                                        </p>
                                    </div>
                                </div>
                            ) : medicamentosFiltrados.length === 0 ? (
                                <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <Package size={28} />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No hay medicamentos
                                    </h3>

                                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                                        {busqueda
                                            ? "No encontramos medicamentos que coincidan con tu búsqueda."
                                            : "Todavía no hay medicamentos registrados."
                                        }
                                    </p>

                                    {puedeModificar && !busqueda && (
                                        <button
                                            type="button"
                                            onClick={abrirNuevo}
                                            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            <Plus size={17} />
                                            Agregar medicamento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[1050px] text-left">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Medicamento
                                                </th>

                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Categoría
                                                </th>

                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Precio
                                                </th>

                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Stock
                                                </th>

                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Estado
                                                </th>

                                                {puedeModificar && (
                                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        Acciones
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {medicamentosFiltrados.map(
                                                (medicamento) => {
                                                    const estado =
                                                        obtenerEstadoStock(
                                                            medicamento.stock
                                                        );

                                                    return (
                                                        <tr
                                                            key={medicamento.id}
                                                            className="transition hover:bg-slate-50"
                                                        >
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                        <Pill
                                                                            size={20}
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <p className="font-semibold text-slate-800">
                                                                            {
                                                                                medicamento.nombre
                                                                            }
                                                                        </p>

                                                                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                                                            {medicamento.descripcion ||
                                                                                "Sin descripción"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                                                                    {obtenerNombreCategoria(
                                                                        medicamento
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span className="font-semibold text-slate-800">
                                                                    S/{" "}
                                                                    {Number(
                                                                        medicamento.precio
                                                                    ).toFixed(2)}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span className="font-semibold text-slate-800">
                                                                    {
                                                                        medicamento.stock
                                                                    }
                                                                </span>

                                                                <span className="ml-1 text-xs text-slate-400">
                                                                    unidades
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-5">
                                                                <span
                                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${estado.clase}`}
                                                                >
                                                                    {
                                                                        estado.texto
                                                                    }
                                                                </span>
                                                            </td>

                                                            {puedeModificar && (
                                                                <td className="px-6 py-5">
                                                                    <div className="flex justify-end gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                abrirEditar(
                                                                                    medicamento
                                                                                )
                                                                            }
                                                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                                            title="Editar"
                                                                        >
                                                                            <Pencil
                                                                                size={
                                                                                    17
                                                                                }
                                                                            />
                                                                        </button>

                                                                        {esAdministrador && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    eliminarMedicamento(
                                                                                        medicamento.id
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    eliminando ===
                                                                                    medicamento.id
                                                                                }
                                                                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                                                title="Eliminar"
                                                                            >
                                                                                {eliminando ===
                                                                                medicamento.id ? (
                                                                                    <LoaderCircle
                                                                                        size={
                                                                                            17
                                                                                        }
                                                                                        className="animate-spin"
                                                                                    />
                                                                                ) : (
                                                                                    <Trash2
                                                                                        size={
                                                                                            17
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {modalAbierto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Pill size={18} />
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editando
                                            ? "Editar medicamento"
                                            : "Nuevo medicamento"}
                                    </h2>
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Completa la información del medicamento.
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

                        <form
                            onSubmit={guardarMedicamento}
                            className="p-6"
                        >
                            {error && (
                                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    <AlertCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>{error}</span>
                                </div>
                            )}

                            {mensaje && (
                                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                                    {mensaje}
                                </div>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Nombre *
                                    </label>

                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={manejarCambio}
                                        maxLength={150}
                                        placeholder="Ej. Paracetamol 500mg"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Descripción
                                    </label>

                                    <textarea
                                        name="descripcion"
                                        value={formulario.descripcion}
                                        onChange={manejarCambio}
                                        rows="3"
                                        placeholder="Descripción del medicamento..."
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Precio *
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                            S/
                                        </span>

                                        <input
                                            type="number"
                                            name="precio"
                                            value={formulario.precio}
                                            onChange={manejarCambio}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Stock *
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={formulario.stock}
                                        onChange={manejarCambio}
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Categoría *
                                    </label>

                                    <select
                                        name="categoriaId"
                                        value={formulario.categoriaId}
                                        onChange={manejarCambio}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    >
                                        <option value="">
                                            Seleccionar categoría
                                        </option>

                                        {categorias.map((categoria) => (
                                            <option
                                                key={categoria.id}
                                                value={categoria.id}
                                            >
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    {categorias.length === 0 && (
                                        <p className="mt-2 text-xs text-amber-600">
                                            Primero debes crear al menos una categoría.
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                    disabled={
                                        guardando ||
                                        categorias.length === 0
                                    }
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
                                        : "Crear medicamento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Medicamentos;