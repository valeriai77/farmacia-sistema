const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Medicamento = sequelize.define(
    "Medicamento",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        categoriaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "medicamentos"
    }
);

module.exports = Medicamento;