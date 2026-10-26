class Tarea {

    constructor(id, nombre, completada = false) {
        this.id = id;
        this.nombre = nombre;
        this.completada = completada;
    }

    actualizarEstado() {
        this.completada = !this.completada;
    }

    editarContenido(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {

    constructor() {

        const tareasGuardadas = JSON.parse(
            localStorage.getItem("tareas")
        );

        this.tareas = tareasGuardadas
            ? tareasGuardadas.map(
                  tarea =>
                      new Tarea(
                          tarea.id,
                          tarea.nombre,
                          tarea.completada
                      )
              )
            : [];
    }

    guardar() {

        localStorage.setItem(
            "tareas",
            JSON.stringify(this.tareas)
        );
    }

    agregarTarea(nombre) {

        const nuevaTarea = new Tarea(
            Date.now(),
            nombre
        );

        this.tareas.push(nuevaTarea);

        this.guardar();
    }

    editarTarea(indice, nuevoNombre) {

        this.tareas[indice]
            .editarContenido(nuevoNombre);

        this.guardar();
    }

    eliminarTarea(indice) {

        this.tareas.splice(indice, 1);

        this.guardar();
    }

    cambiarEstado(indice) {

        this.tareas[indice]
            .actualizarEstado();

        this.guardar();
    }
}

const gestor = new GestorDeTareas();

const inputTarea =
    document.getElementById("tareaInput");

const botonAgregar =
    document.getElementById("agregarBtn");

const listaTareas =
    document.getElementById("listaTareas");

const mensaje =
    document.getElementById("mensaje");

const mostrarMensaje = texto => {

    mensaje.textContent = texto;

    setTimeout(() => {
        mensaje.textContent = "";
    }, 3000);
};

const renderizarTareas = () => {

    listaTareas.innerHTML = "";

    gestor.tareas.forEach((tarea, indice) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${
                tarea.completada
                    ? "completa"
                    : ""
            }">
                ${tarea.nombre}
            </span>

            <div class="acciones">

                <button class="estado">
                    ${
                        tarea.completada
                            ? "Pendiente"
                            : "Completar"
                    }
                </button>

                <button class="editar">
                    Editar
                </button>

                <button class="eliminar">
                    Eliminar
                </button>

            </div>
        `;

        li.querySelector(".estado")
            .addEventListener(
                "click",
                () => {

                    gestor.cambiarEstado(
                        indice
                    );

                    renderizarTareas();
                }
            );

        li.querySelector(".editar")
            .addEventListener(
                "click",
                () => {

                    const nuevoNombre =
                        prompt(
                            "Editar tarea:",
                            tarea.nombre
                        );

                    if (
                        nuevoNombre &&
                        nuevoNombre.trim()
                    ) {

                        gestor.editarTarea(
                            indice,
                            nuevoNombre.trim()
                        );

                        renderizarTareas();
                    }
                }
            );

        li.querySelector(".eliminar")
            .addEventListener(
                "click",
                () => {

                    const confirmar =
                        confirm(
                            "¿Deseas eliminar esta tarea?"
                        );

                    if (confirmar) {

                        gestor.eliminarTarea(
                            indice
                        );

                        renderizarTareas();
                    }
                }
            );

        listaTareas.appendChild(li);
    });
};

botonAgregar.addEventListener(
    "click",
    () => {

        const nombre =
            inputTarea.value.trim();

        if (!nombre) {

            mostrarMensaje(
                "La tarea no puede estar vacía."
            );

            return;
        }

        gestor.agregarTarea(nombre);

        inputTarea.value = "";

        renderizarTareas();
    }
);

inputTarea.addEventListener(
    "keypress",
    evento => {

        if (evento.key === "Enter") {

            botonAgregar.click();
        }
    }
);

renderizarTareas();