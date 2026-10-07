const express = require("express");

const router = express.Router();

const {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require("../controllers/categoriaController");

const verificarToken = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");


router.get(
    "/",
    verificarToken,
    listarCategorias
);


router.get(
    "/:id",
    verificarToken,
    obtenerCategoria
);



router.post(
    "/",
    verificarToken,
    permitirRoles("administrador", "moderador"),
    crearCategoria
);


router.put(
    "/:id",
    verificarToken,
    permitirRoles("administrador", "moderador"),
    actualizarCategoria
);

router.delete(
    "/:id",
    verificarToken,
    permitirRoles("administrador"),
    eliminarCategoria
);


module.exports = router;