import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Pill,
    FolderKanban,
    Users,
    LogOut,
    X
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Sidebar = ({ abierto, cerrar }) => {
    const { usuario, logout } = useAuth();

    const esAdministrador = usuario?.rol === "administrador";
    const esModerador = usuario?.rol === "moderador";

    const enlaces = [
        {
            nombre: "Dashboard",
            ruta: "/dashboard",
            icono: LayoutDashboard,
            visible: true
        },
        {
            nombre: "Medicamentos",
            ruta: "/medicamentos",
            icono: Pill,
            visible: true
        },
        {
            nombre: "Categorías",
            ruta: "/categorias",
            icono: FolderKanban,
            visible: esAdministrador || esModerador
        },
        {
            nombre: "Usuarios",
            ruta: "/usuarios",
            icono: Users,
            visible: esAdministrador
        }
    ];

    const manejarLogout = () => {
        logout();
    };

    return (
        <>
            {abierto && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
                    onClick={cerrar}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-72 flex-col
                    bg-[#0f172a] text-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        abierto
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <Pill
                                size={23}
                                strokeWidth={2.5}
                            />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold">
                                Farmacia
                            </h1>

                            <p className="text-xs text-slate-400">
                                Sistema de gestión
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={cerrar}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b border-slate-800 px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                            {usuario?.nombre
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                {usuario?.nombre}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                {usuario?.email}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold capitalize text-blue-400">
                            {usuario?.rol}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Menú principal
                    </p>

                    <nav className="space-y-1.5">
                        {enlaces
                            .filter((enlace) => enlace.visible)
                            .map((enlace) => {
                                const Icono = enlace.icono;

                                return (
                                    <NavLink
                                        key={enlace.ruta}
                                        to={enlace.ruta}
                                        onClick={cerrar}
                                        className={({ isActive }) =>
                                            `
                                            flex items-center gap-3
                                            rounded-xl px-4 py-3
                                            text-sm font-medium
                                            transition-all duration-200
                                            ${
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            }
                                            `
                                        }
                                    >
                                        <Icono size={19} />
                                        {enlace.nombre}
                                    </NavLink>
                                );
                            })}
                    </nav>
                </div>

                <div className="border-t border-slate-800 p-4">
                    <button
                        onClick={manejarLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut size={19} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;