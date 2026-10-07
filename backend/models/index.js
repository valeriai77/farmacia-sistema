const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Categoria = require("./Categoria");
const Medicamento = require("./Medicamento");

Categoria.hasMany(Medicamento, {
    foreignKey: "categoriaId",
    as: "medicamentos",
    onDelete: "CASCADE"
});


Medicamento.belongsTo(Categoria, {
    foreignKey: "categoriaId",
    as: "categoria"
});

module.exports = {
    sequelize,
    Usuario,
    Categoria,
    Medicamento
};