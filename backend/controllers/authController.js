const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const registrar = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            rol
        } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, correo y contraseña son obligatorios"
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: passwordEncriptada,
            rol: rol || "usuario"
        });

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al registrar usuario",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al iniciar sesión",
            error: error.message
        });
    }
};


const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: [
                "id",
                "nombre",
                "email",
                "rol"
            ],
            order: [["id", "ASC"]]
        });

        return res.status(200).json({
            mensaje: "Usuarios obtenidos correctamente",
            datos: usuarios
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al obtener usuarios",
            error: error.message
        });
    }
};


const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: [
                "id",
                "nombre",
                "email",
                "rol"
            ]
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Usuario obtenido correctamente",
            datos: usuario
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al obtener usuario",
            error: error.message
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            rol
        } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, correo y contraseña son obligatorios"
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado"
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: passwordEncriptada,
            rol: rol || "usuario"
        });

        return res.status(201).json({
            mensaje: "Usuario creado correctamente",
            datos: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al crear usuario",
            error: error.message
        });
    }
};


const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            email,
            password,
            rol
        } = req.body;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        if (!nombre || !email || !rol) {
            return res.status(400).json({
                mensaje: "Nombre, correo y rol son obligatorios"
            });
        }

        const usuarioConEmail = await Usuario.findOne({
            where: { email }
        });

        if (
            usuarioConEmail &&
            usuarioConEmail.id !== usuario.id
        ) {
            return res.status(400).json({
                mensaje: "El correo ya está registrado por otro usuario"
            });
        }

        usuario.nombre = nombre;
        usuario.email = email;
        usuario.rol = rol;

        // Solo cambia la contraseña si se escribió una nueva
        if (password && password.trim() !== "") {
            usuario.password = await bcrypt.hash(
                password,
                10
            );
        }

        await usuario.save();

        return res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            datos: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al actualizar usuario",
            error: error.message
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        await usuario.destroy();

        return res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensaje: "Error al eliminar usuario",
            error: error.message
        });
    }
};


module.exports = {
    registrar,
    login,
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};