const express = require("express");

const router = express.Router();

const {
    listarMedicamentos,
    obtenerMedicamento,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
} = require("../controllers/medicamentoController");

const verificarToken = require("../middleware/authMiddleware");
const permitirRoles = require("../middleware/roleMiddleware");


router.get(
    "/",
    verificarToken,
    listarMedicamentos
);

router.get(
    "/:id",
    verificarToken,
    obtenerMedicamento
);


router.post(
    "/",
    verificarToken,
    permitirRoles("administrador", "moderador"),
    crearMedicamento
);


router.put(
    "/:id",
    verificarToken,
    permitirRoles("administrador", "moderador"),
    actualizarMedicamento
);

router.delete(
    "/:id",
    verificarToken,
    permitirRoles("administrador"),
    eliminarMedicamento
);


module.exports = router;