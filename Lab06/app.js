
const express = require("express");
const cursoRoutes = require("./routes/cursoRoutes");

const app = express();
const PORT = 3000;

//Middleware incorporado para interpretar JSON
app.use(express.json());

//Middleware personalizado de auditoría
app.use((req, res, next) => {
    const inicio = Date.now();

    //Registrar la solicitud cuando termine la respuesta
    res.on("finish", () => {
        const tiempoRespuesta = Date.now() - inicio;

        console.log(
        `[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl} - ` +
        `${res.statusCode} - ${tiempoRespuesta} ms`
        );
    });

    next();
});

//Rutas
app.use("/api/cursos", cursoRoutes);

app.get("/api/prueba-error", (req, res, next) => {
    next(new Error("Error de prueba"));
});

// Ruta para direcciones no definidas
app.use((req, res) => {
    res.status(404).json({
        status: "fail",
        message: "Ruta no encontrada"
    });
});

//Middleware del manejo de errores
app.use((err, req, res, next) => {
    console.error("Error del servidor:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        status: "error",
        message: "Error interno del servidor"
    });
});

//Iniciar el server
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});