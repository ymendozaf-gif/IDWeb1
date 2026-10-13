
const cursos = require("../data/cursos");

//Get:Obtener todos los cursos y permite filtrar por créditos.
exports.getCursos = (req, res) => {
    let resultado = cursos;

    if (req.query.creditos !== undefined) {
        const creditos = Number(req.query.creditos);

        if (!Number.isInteger(creditos) || creditos <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Los créditos deben ser un entero positivo"
            });
        }

        resultado = cursos.filter(
            curso => curso.creditos === creditos
        );
    }

    res.status(200).json({
        status: "success",
        total: resultado.length,
        data: resultado
    });
};

//Get/id:Obtener un curso por su identificador.
exports.getCursoById = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
        status: "fail",
        message: "El ID debe ser un entero positivo"
        });
    }

    const curso = cursos.find(curso => curso.id === id);

    if (!curso) {
        return res.status(404).json({
            status: "fail",
            message: "Curso no encontrado"
        });
    }

    res.status(200).json({
        status: "success",
        data: curso
    });
};

//POST:Crear un nuevo curso.
exports.createCurso = (req, res) => {
    const { nombre, codigo, creditos } = req.body;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof codigo !== "string" ||
        !codigo.trim() ||
        creditos === undefined ||
        creditos === null ||
        creditos === ""
    ) {
        return res.status(400).json({
            status: "fail",
            message: "Nombre, código y créditos son obligatorios"
        });
    }

    const creditosNumero = Number(creditos);

    if (
        !Number.isInteger(creditosNumero) ||
        creditosNumero <= 0
    ) {
        return res.status(400).json({
            status: "fail",
            message: "Los créditos deben ser un entero positivo"
        });
    }

    const codigoExiste = cursos.some(
        curso => curso.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );

    if (codigoExiste) {
        return res.status(400).json({
            status: "fail",
            message: "El código del curso ya existe"
        });  
    }

    const nuevoId = cursos.length > 0
    ? Math.max(...cursos.map(curso => curso.id)) + 1
    : 1;

    const nuevoCurso = {
        id: nuevoId,
        nombre: nombre.trim(),
        codigo: codigo.trim(),
        creditos: creditosNumero
    };

    cursos.push(nuevoCurso);

    res.status(201).json({
        status: "success",
        message: "Curso creado correctamente",
        data: nuevoCurso
    });
};

// PUT /api/cursos/:id
// Actualizar los datos de un curso existente.
exports.updateCurso = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
        status: "fail",
        message: "El ID debe ser un entero positivo"
    });
    }

    const curso = cursos.find(curso => curso.id === id);

    if (!curso) {
        return res.status(404).json({
        status: "fail",
        message: "Curso no encontrado"
        });
    }

    const { nombre, codigo, creditos } = req.body;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof codigo !== "string" ||
        !codigo.trim() ||
        creditos === undefined ||
        creditos === null ||
        creditos === ""
    ) {
    return res.status(400).json({
        status: "fail",
        message: "Nombre, código y créditos son obligatorios"
        });
    }

    const creditosNumero = Number(creditos);

    if (
        !Number.isInteger(creditosNumero) ||
        creditosNumero <= 0
    ) {
        return res.status(400).json({
        status: "fail",
        message: "Los créditos deben ser un entero positivo"
        });
    }

    const codigoExiste = cursos.some(
        otroCurso =>
        otroCurso.id !== id &&
        otroCurso.codigo.toLowerCase() === codigo.trim().toLowerCase()
    );

    if (codigoExiste) {
        return res.status(400).json({
        status: "fail",
        message: "El código ya pertenece a otro curso"
        });
    }

    curso.nombre = nombre.trim();
    curso.codigo = codigo.trim();
    curso.creditos = creditosNumero;

    res.status(200).json({
        status: "success",
        message: "Curso actualizado correctamente",
        data: curso
    });
};

// DELETE /api/cursos/:id
// Eliminar un curso.
exports.deleteCurso = (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
        status: "fail",
        message: "El ID debe ser un entero positivo"
        });
    }

    const indice = cursos.findIndex(curso => curso.id === id);

    if (indice === -1) {
        return res.status(404).json({
        status: "fail",
        message: "Curso no encontrado"
    });
    }

    const cursoEliminado = cursos.splice(indice, 1)[0];

    res.status(200).json({
        status: "success",
        message: "Curso eliminado correctamente",
        data: cursoEliminado
    });
};