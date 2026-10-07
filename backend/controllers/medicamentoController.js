const { Medicamento, Categoria } = require("../models");


const listarMedicamentos = async (req, res) => {
    try {
        const medicamentos = await Medicamento.findAll({
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id", "nombre"]
                }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json({
            mensaje: "Medicamentos obtenidos correctamente",
            datos: medicamentos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener los medicamentos",
            error: error.message
        });
    }
};


const obtenerMedicamento = async (req, res) => {
    try {
        const { id } = req.params;

        const medicamento = await Medicamento.findByPk(id, {
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id", "nombre"]
                }
            ]
        });

        if (!medicamento) {
            return res.status(404).json({
                mensaje: "Medicamento no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Medicamento encontrado",
            datos: medicamento
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener el medicamento",
            error: error.message
        });
    }
};


const crearMedicamento = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoriaId
        } = req.body;

 
        if (
            !nombre ||
            precio === undefined ||
            stock === undefined ||
            !categoriaId
        ) {
            return res.status(400).json({
                mensaje: "Nombre, precio, stock y categoría son obligatorios"
            });
        }

        const categoria = await Categoria.findByPk(categoriaId);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "La categoría indicada no existe"
            });
        }

        const medicamento = await Medicamento.create({
            nombre,
            descripcion,
            precio,
            stock,
            categoriaId
        });

        const medicamentoCreado = await Medicamento.findByPk(
            medicamento.id,
            {
                include: [
                    {
                        model: Categoria,
                        as: "categoria",
                        attributes: ["id", "nombre"]
                    }
                ]
            }
        );

        res.status(201).json({
            mensaje: "Medicamento creado correctamente",
            datos: medicamentoCreado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el medicamento",
            error: error.message
        });
    }
};


const actualizarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoriaId
        } = req.body;

        const medicamento = await Medicamento.findByPk(id);

        if (!medicamento) {
            return res.status(404).json({
                mensaje: "Medicamento no encontrado"
            });
        }

        // Verificar categoría
        const categoria = await Categoria.findByPk(categoriaId);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "La categoría indicada no existe"
            });
        }

        await medicamento.update({
            nombre,
            descripcion,
            precio,
            stock,
            categoriaId
        });

        const medicamentoActualizado =
            await Medicamento.findByPk(id, {
                include: [
                    {
                        model: Categoria,
                        as: "categoria",
                        attributes: ["id", "nombre"]
                    }
                ]
            });

        res.status(200).json({
            mensaje: "Medicamento actualizado correctamente",
            datos: medicamentoActualizado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar el medicamento",
            error: error.message
        });
    }
};


const eliminarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;

        const medicamento = await Medicamento.findByPk(id);

        if (!medicamento) {
            return res.status(404).json({
                mensaje: "Medicamento no encontrado"
            });
        }

        await medicamento.destroy();

        res.status(200).json({
            mensaje: "Medicamento eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar el medicamento",
            error: error.message
        });
    }
};


module.exports = {
    listarMedicamentos,
    obtenerMedicamento,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento
};