
const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

// Consultar todos los cursos
router.get("/", cursoController.getCursos);

// Consultar un curso por ID
router.get("/:id", cursoController.getCursoById);

// Crear un curso
router.post("/", cursoController.createCurso);

// Actualizar un curso
router.put("/:id", cursoController.updateCurso);

// Eliminar un curso
router.delete("/:id", cursoController.deleteCurso);

module.exports = router;