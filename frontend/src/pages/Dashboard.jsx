import { useState } from "react";

import {
    Pill,
    FolderKanban,
    Package,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Activity,
    Users
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";


const Dashboard = () => {

    const { usuario } = useAuth();

    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const esAdministrador =
        usuario?.rol === "administrador";

    const esModerador =
        usuario?.rol === "moderador";


    return (
        <div className="min-h-screen bg-[#f8fafc]">

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <Sidebar
                abierto={sidebarAbierto}
                cerrar={() => setSidebarAbierto(false)}
            />


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <Navbar
                abrirSidebar={() => setSidebarAbierto(true)}
            />


            {/* ==========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <main className="pt-20 lg:ml-72">

                <div className="p-5 sm:p-8">


                    {/* ==========================================
                        ENCABEZADO
                    ========================================== */}

                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>

                            <p className="text-sm font-medium text-blue-600">
                                Panel de control
                            </p>

                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                                Hola, {usuario?.nombre} 👋
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Aquí tienes un resumen de tu farmacia.
                            </p>

                        </div>


                        {/* Botón para administrador/moderador */}

                        {(esAdministrador || esModerador) && (

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                            >

                                <Plus size={18} />

                                Nuevo medicamento

                            </button>

                        )}

                    </div>


                    {/* ==========================================
                        ESTADÍSTICAS
                    ========================================== */}

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


                        {/* ======================================
                            MEDICAMENTOS
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Medicamentos
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        25
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                    <Pill size={23} />

                                </div>

                            </div>

                            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">

                                <TrendingUp size={14} />

                                Inventario activo

                            </div>

                        </div>


                        {/* ======================================
                            CATEGORÍAS
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Categorías
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        4
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                    <FolderKanban size={23} />

                                </div>

                            </div>

                            <div className="mt-4 text-xs font-medium text-slate-400">
                                Clasificaciones registradas
                            </div>

                        </div>


                        {/* ======================================
                            STOCK
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Stock total
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        215
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                    <Package size={23} />

                                </div>

                            </div>

                            <div className="mt-4 text-xs font-medium text-emerald-600">
                                Inventario disponible
                            </div>

                        </div>


                        {/* ======================================
                            ESTADO
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Estado
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                                        Activo
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                    <Activity size={23} />

                                </div>

                            </div>

                            <div className="mt-4 text-xs font-medium text-slate-400">
                                Sistema operativo
                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        PARTE INFERIOR
                    ========================================== */}

                    <div className="mt-6 grid gap-6 xl:grid-cols-3">


                        {/* ======================================
                            ACTIVIDAD RECIENTE
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Actividad reciente
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Últimos movimientos del sistema.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                >

                                    Ver todo

                                    <ArrowUpRight size={15} />

                                </button>

                            </div>


                            <div className="mt-6 divide-y divide-slate-100">


                                {/* Actividad 1 */}

                                <div className="flex items-center gap-4 py-4">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <Pill size={18} />

                                    </div>

                                    <div className="flex-1">

                                        <p className="text-sm font-semibold text-slate-800">
                                            Paracetamol 500mg
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Medicamento registrado
                                        </p>

                                    </div>

                                    <span className="text-xs text-slate-400">
                                        Hoy
                                    </span>

                                </div>


                                {/* Actividad 2 */}

                                <div className="flex items-center gap-4 py-4">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                        <FolderKanban size={18} />

                                    </div>

                                    <div className="flex-1">

                                        <p className="text-sm font-semibold text-slate-800">
                                            Analgésicos
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Categoría actualizada
                                        </p>

                                    </div>

                                    <span className="text-xs text-slate-400">
                                        Hoy
                                    </span>

                                </div>


                                {/* Actividad 3 */}

                                <div className="flex items-center gap-4 py-4">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                        <Package size={18} />

                                    </div>

                                    <div className="flex-1">

                                        <p className="text-sm font-semibold text-slate-800">
                                            Inventario actualizado
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Stock registrado correctamente
                                        </p>

                                    </div>

                                    <span className="text-xs text-slate-400">
                                        Ayer
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ======================================
                            ACCIONES RÁPIDAS
                        ====================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Acciones rápidas
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Accede rápidamente a las funciones principales.
                            </p>


                            <div className="mt-6 space-y-3">


                                {/* Medicamentos */}

                                <a
                                    href="/medicamentos"
                                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                                >

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                        <Pill size={19} />

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-slate-800">
                                            Medicamentos
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Ver inventario
                                        </p>

                                    </div>

                                </a>


                                {/* Categorías */}

                                {(esAdministrador || esModerador) && (

                                    <a
                                        href="/categorias"
                                        className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-violet-200 hover:bg-violet-50"
                                    >

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                            <FolderKanban size={19} />

                                        </div>

                                        <div>

                                            <p className="text-sm font-semibold text-slate-800">
                                                Categorías
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Administrar categorías
                                            </p>

                                        </div>

                                    </a>

                                )}


                                {/* Usuarios */}

                                {esAdministrador && (

                                    <a
                                        href="/usuarios"
                                        className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                                    >

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                            <Users size={19} />

                                        </div>

                                        <div>

                                            <p className="text-sm font-semibold text-slate-800">
                                                Usuarios
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Gestionar usuarios
                                            </p>

                                        </div>

                                    </a>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};


export default Dashboard;