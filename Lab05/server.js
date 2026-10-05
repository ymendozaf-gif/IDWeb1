const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

function obtenerContentType(filePath) {
    const extension = path.extname(filePath);

    if (extension === '.html') {
        return 'text/html; charset=utf-8';
    }

    if (extension === '.css') {
        return 'text/css; charset=utf-8';
    }

    if (extension === '.js') {
        return 'text/javascript; charset=utf-8';
    }

    if (extension === '.json') {
        return 'application/json; charset=utf-8';
    }

    return 'text/plain; charset=utf-8';
}

const server = http.createServer((req, res) => {

    console.log(`Petición recibida: ${req.method} ${req.url}`);

    //GET-api-estudiantes
    if (req.url === '/api/estudiantes' && req.method === 'GET') {

        const filePath = path.join(
            __dirname,
            'data',
            'estudiantes.json'
        );

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8'
                });

                res.end(JSON.stringify({
                    message: 'Error al leer los estudiantes'
                }));

                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });

            res.end(data);
        });

        return;
    }

    //POST-api-estudiantes
    if (req.url === '/api/estudiantes' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            try {
                const nuevoEstudiante = JSON.parse(body);

                const filePath = path.join(
                    __dirname,
                    'data',
                    'estudiantes.json'
                );

                fs.readFile(filePath, 'utf8', (err, data) => {

                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });

                        res.end(JSON.stringify({
                            message: 'Error al leer los estudiantes'
                        }));

                        return;
                    }

                    let estudiantes = JSON.parse(data);

                    estudiantes.push(nuevoEstudiante);

                    fs.writeFile(
                        filePath,
                        JSON.stringify(estudiantes, null, 4),
                        'utf8',
                        err => {

                            if (err) {
                                res.writeHead(500, {
                                    'Content-Type': 'application/json; charset=utf-8'
                                });

                                res.end(JSON.stringify({
                                    message: 'Error al guardar el estudiante'
                                }));

                                return;
                            }

                            res.writeHead(201, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });

                            res.end(JSON.stringify(nuevoEstudiante));
                        }
                    );
                });

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json; charset=utf-8'
                });

                res.end(JSON.stringify({
                    message: 'JSON inválido'
                }));
            }
        });

        return;
    }

    //Archivos estáticos
    if (req.method === 'GET') {

        let requestedFile = req.url;

        if (requestedFile === '/') {
            requestedFile = '/index.html';
        }

        const filePath = path.join(
            __dirname,
            'public',
            requestedFile
        );

        fs.readFile(filePath, (err, content) => {

            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'application/json; charset=utf-8'
                });

                res.end(JSON.stringify({
                    message: 'Archivo no encontrado'
                }));

                return;
            }

            res.writeHead(200, {
                'Content-Type': obtenerContentType(filePath)
            });

            res.end(content);
        });

        return;
    }

    //Si alguien solicita algo inexistente
    res.writeHead(404, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    res.end(JSON.stringify({
        message: 'Recurso no encontrado'
    }));
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});