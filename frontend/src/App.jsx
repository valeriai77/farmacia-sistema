import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Medicamentos from "./pages/Medicamentos";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";


function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* =========================
                        RUTAS PÚBLICAS
                    ========================== */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* =========================
                        RUTAS PROTEGIDAS
                    ========================== */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/categorias"
                            element={<Categorias />}
                        />

                        <Route
                            path="/medicamentos"
                            element={<Medicamentos />}
                        />

                        <Route
                            path="/usuarios"
                            element={<Usuarios />}
                        />

                    </Route>


                    {/* =========================
                        REDIRECCIÓN PRINCIPAL
                    ========================== */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />


                    {/* =========================
                        404
                    ========================== */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;