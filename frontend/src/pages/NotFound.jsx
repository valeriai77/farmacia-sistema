import { Link } from "react-router-dom";

const NotFound = () => {

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

            <div className="text-center">

                <h1 className="text-7xl font-bold text-blue-600">
                    404
                </h1>

                <h2 className="text-2xl font-bold text-slate-800 mt-4">
                    Página no encontrada
                </h2>

                <p className="text-slate-500 mt-2 mb-6">
                    La página que buscas no existe.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
                >
                    Volver al inicio
                </Link>

            </div>

        </div>
    );
};

export default NotFound;