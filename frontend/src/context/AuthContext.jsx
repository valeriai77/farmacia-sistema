import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const usuarioGuardado =
            localStorage.getItem("usuario");

        const token =
            localStorage.getItem("token");

        if (usuarioGuardado && token) {
            setUsuario(JSON.parse(usuarioGuardado));
        }

        setCargando(false);

    }, []);

    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        const {
            token,
            usuario
        } = response.data;

        localStorage.setItem("token", token);

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        setUsuario(usuario);

        return response.data;
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);
    };

    const registrar = async (
        nombre,
        email,
        password
    ) => {

        const response = await api.post(
            "/auth/register",
            {
                nombre,
                email,
                password
            }
        );

        return response.data;
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                registrar,
                cargando
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};