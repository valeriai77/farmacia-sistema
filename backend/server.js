const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

// ==========================================
// IMPORTAR RUTAS
// ==========================================

const authRoutes = require("./routes/authRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");

// ==========================================
// CREAR APLICACIÓN
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Farmacia funcionando correctamente"
    });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

// Autenticación
app.use("/api/auth", authRoutes);

// Categorías
app.use("/api/categorias", categoriaRoutes);

// Medicamentos
app.use("/api/medicamentos", medicamentoRoutes);

// ==========================================
// MANEJO DE RUTA NO ENCONTRADA
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada"
    });
});

// ==========================================
// CONFIGURACIÓN DEL PUERTO
// ==========================================

const PORT = process.env.PORT || 3000;

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function iniciarServidor() {
    try {


        await sequelize.authenticate();

        console.log("================================");
        console.log("✅ MySQL conectado correctamente");
        console.log("================================");

        await sequelize.sync();

        console.log("✅ Tablas sincronizadas correctamente");

        app.listen(PORT, () => {

            console.log("================================");
            console.log("🚀 SERVIDOR EJECUTÁNDOSE");
            console.log(`🌐 http://localhost:${PORT}`);
            console.log("================================");

        });

    } catch (error) {

        console.error("================================");
        console.error("❌ ERROR AL INICIAR EL SERVIDOR");
        console.error("================================");
        console.error(error.message);

    }
}


iniciarServidor();