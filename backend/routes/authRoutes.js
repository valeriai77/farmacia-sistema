const express = require("express");

const router = express.Router();

const {
    registrar,
    login,
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require("../controllers/authController");

const verificarToken = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");


router.post("/register", registrar);

router.post("/login", login);


// =====================================================
// GESTIÓN DE USUARIOS
// SOLO ADMINISTRADORES
// =====================================================

router.get(
    "/usuarios",
    verificarToken,
    permitirRoles("administrador"),
    listarUsuarios
);

router.get(
    "/usuarios/:id",
    verificarToken,
    permitirRoles("administrador"),
    obtenerUsuario
);

router.post(
    "/usuarios",
    verificarToken,
    permitirRoles("administrador"),
    crearUsuario
);

router.put(
    "/usuarios/:id",
    verificarToken,
    permitirRoles("administrador"),
    actualizarUsuario
);

router.delete(
    "/usuarios/:id",
    verificarToken,
    permitirRoles("administrador"),
    eliminarUsuario
);


module.exports = router;