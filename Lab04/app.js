
const form = document.querySelector('#todo-form');
const titleInput = document.querySelector('#todo-title');
const courseInput = document.querySelector('#todo-course');
const dateInput = document.querySelector('#todo-date');
const list = document.querySelector('#todo-list');
const alertas = document.querySelector('#alertas');
const btnTodas = document.querySelector('#btn-todas');
const btnPendientes = document.querySelector('#btn-pendientes');
const btnCompletadas = document.querySelector('#btn-completadas');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {

    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function renderTasks(taskList = tasks) {
    list.innerHTML = '';
    taskList.forEach((task) => {

        const li = document.createElement('li');
        li.className = 'list-group-item task-item';

        if (task.completada) {
            li.classList.add('task-completed');
        }

        li.innerHTML = `
            <div class="task-info">
                <strong>${task.titulo}</strong>

                <span>
                    Curso: ${task.curso}
                </span>

                <span>
                    Fecha de entrega: ${task.fechaEntrega}
                </span>
            </div>

            <div class="task-buttons">
                <button
                    class="btn btn-success btn-sm"
                    onclick="toggleTask(${task.id})">

                    ${task.completada
                        ? 'Marcar pendiente'
                        : 'Completar'}
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteTask(${task.id})">

                    Eliminar
                </button>

            </div>
        `;

        list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const titulo = titleInput.value.trim();
    const curso = courseInput.value.trim();
    const fecha = dateInput.value;

    if (!titulo || !curso || !fecha) {

        alertas.innerHTML = `
            <div class="alert alert-danger">
                Todos los campos son obligatorios.
            </div>
        `;
        return;
    }

    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada <= hoy) {
        alertas.innerHTML = `
            <div class="alert alert-danger">
                La fecha de entrega debe ser posterior
                a la fecha actual.
            </div>
        `;
        return;
    }

    const newTask = {
        id: Date.now(),
        titulo: titulo,
        curso: curso,
        fechaEntrega: fecha,
        completada: false
    };

    tasks.push(newTask);
    saveTasks();
    form.reset();

    alertas.innerHTML = `
        <div class="alert alert-success">
            Tarea agregada correctamente.
        </div>
    `;
    renderTasks();
});

function toggleTask(id) {
    const task = tasks.find((task) => task.id === id);

    if (task) {
        task.completada = !task.completada;
    }
    saveTasks();
    renderTasks();
}

function deleteTask(id) {

    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

btnTodas.addEventListener('click', () => {
    renderTasks(tasks);
});

btnPendientes.addEventListener('click', () => {

    const pendientes = tasks.filter((task) => !task.completada);
    renderTasks(pendientes);
});

btnCompletadas.addEventListener('click', () => {

    const completadas = tasks.filter((task) => task.completada);
    renderTasks(completadas);
});

document.addEventListener(
    'DOMContentLoaded',
    () => {
        renderTasks();
    }
);