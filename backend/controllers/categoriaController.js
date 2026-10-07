const { Categoria } = require("../models");

const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            order: [["id", "ASC"]]
        });

        res.status(200).json({
            mensaje: "Categorías obtenidas correctamente",
            datos: categorias
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las categorías",
            error: error.message
        });
    }
};

const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Categoría encontrada",
            datos: categoria
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener la categoría",
            error: error.message
        });
    }
};


const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        const categoriaExistente = await Categoria.findOne({
            where: { nombre }
        });

        if (categoriaExistente) {
            return res.status(400).json({
                mensaje: "La categoría ya existe"
            });
        }

        const categoria = await Categoria.create({
            nombre,
            descripcion
        });

        res.status(201).json({
            mensaje: "Categoría creada correctamente",
            datos: categoria
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la categoría",
            error: error.message
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        if (!nombre) {
            return res.status(400).json({
                mensaje: "El nombre de la categoría es obligatorio"
            });
        }

        await categoria.update({
            nombre,
            descripcion
        });

        res.status(200).json({
            mensaje: "Categoría actualizada correctamente",
            datos: categoria
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar la categoría",
            error: error.message
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByPk(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        await categoria.destroy();

        res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar la categoría",
            error: error.message
        });
    }
};


module.exports = {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};