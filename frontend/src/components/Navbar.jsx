import {
    Menu,
    Bell,
    Search
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = ({ abrirSidebar }) => {

    const { usuario } = useAuth();

    return (
        <header className="fixed left-0 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white lg:left-72">

            <div className="flex h-full items-center justify-between px-5 sm:px-8">

                {/* IZQUIERDA */}

                <div className="flex items-center gap-4">

                    <button
                        onClick={abrirSidebar}
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    >
                        <Menu size={23} />
                    </button>

                    <div className="hidden md:block">

                        <p className="text-xs font-medium text-slate-400">
                            Sistema de gestión
                        </p>

                        <h2 className="text-lg font-bold text-slate-800">
                            Panel principal
                        </h2>

                    </div>

                </div>


                {/* DERECHA */}

                <div className="flex items-center gap-3">

                    {/* Buscar */}

                    <button className="hidden rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 sm:block">
                        <Search size={20} />
                    </button>


                    {/* Notificaciones */}

                    <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">

                        <Bell size={20} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

                    </button>


                    {/* Separador */}

                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />


                    {/* Usuario */}

                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-semibold text-slate-800">
                                {usuario?.nombre}
                            </p>

                            <p className="text-xs capitalize text-slate-400">
                                {usuario?.rol}
                            </p>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                            {usuario?.nombre
                                ?.charAt(0)
                                .toUpperCase()
                            }

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
};

export default Navbar;