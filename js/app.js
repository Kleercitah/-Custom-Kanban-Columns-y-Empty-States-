// ============================================================
//  DevBoard — app.js
//  Lógica de interacción: Drag & Drop + Creación de tarjetas
// ============================================================
//
//  Este archivo maneja TODO lo que el usuario puede HACER:
//    1. Arrastrar tarjetas entre columnas (Drag & Drop)
//    2. Crear tarjetas nuevas desde el formulario de cada columna
//
//  Separamos esta lógica de los Web Components para que el código
//  sea más fácil de leer y entender por separado.
//
//  Importante: este script se carga DESPUÉS de los componentes,
//  entonces cuando corre, todos los <kanban-column> y <kanban-card>
//  ya están registrados y en el DOM.
// ============================================================


// ──────────────────────────────────────────────────────────────
//  DRAG & DROP
//  Usamos la API nativa de HTML5: draggable + eventos de arrastre
// ──────────────────────────────────────────────────────────────

// Guardamos aquí la tarjeta que el usuario está arrastrando.
// Es una variable "global" dentro de este archivo para que
// todos los manejadores de eventos puedan acceder a ella.
let tarjetaArrastrada = null;

/**
 * Activa el drag & drop en todas las <kanban-card> existentes.
 * Se llama también cada vez que se crea una tarjeta nueva.
 */
function activarDragEnTarjetas() {
    // Seleccionamos todas las tarjetas del tablero
    const tarjetas = document.querySelectorAll("kanban-card");

    tarjetas.forEach(tarjeta => {

        // Evitar registrar los eventos dos veces en la misma tarjeta
        if (tarjeta.dataset.dragActivado) return;
        tarjeta.dataset.dragActivado = "true";

        // El atributo draggable="true" le dice al navegador que este
        // elemento puede ser arrastrado
        tarjeta.setAttribute("draggable", "true");

        // ── dragstart: se dispara cuando el usuario EMPIEZA a arrastrar ──
        tarjeta.addEventListener("dragstart", (evento) => {
            tarjetaArrastrada = tarjeta;

            // Pequeño delay para que el navegador termine de tomar
            // la "foto" del elemento antes de ocultarlo visualmente
            setTimeout(() => {
                tarjeta.classList.add("arrastrando");
            }, 0);
        });

        // ── dragend: se dispara cuando el usuario SUELTA el arrastre ──
        tarjeta.addEventListener("dragend", () => {
            tarjeta.classList.remove("arrastrando");
            tarjetaArrastrada = null;

            // Quitar el estilo de "zona activa" de todas las columnas
            document.querySelectorAll("kanban-column").forEach(col => {
                col.classList.remove("drop-activo");
            });

            // Actualizar el contador de todas las columnas
            actualizarContadores();
        });
    });
}

/**
 * Activa las zonas de "soltar" en todas las <kanban-column>.
 * Se llama una sola vez al inicio porque las columnas no cambian.
 */
function activarDropEnColumnas() {
    const columnas = document.querySelectorAll("kanban-column");

    columnas.forEach(columna => {

        // ── dragover: se dispara continuamente mientras arrastras ENCIMA ──
        // Necesitamos llamar preventDefault() para permitir que se suelte aquí
        columna.addEventListener("dragover", (evento) => {
            evento.preventDefault();
            columna.classList.add("drop-activo");
        });

        // ── dragleave: cuando el cursor sale de esta columna ──
        columna.addEventListener("dragleave", (evento) => {
            // Solo quitamos el estilo si realmente salimos de la columna
            // (no si pasamos a un elemento hijo)
            if (!columna.contains(evento.relatedTarget)) {
                columna.classList.remove("drop-activo");
            }
        });

        // ── drop: cuando el usuario SUELTA la tarjeta aquí ──
        columna.addEventListener("drop", (evento) => {
            evento.preventDefault();
            columna.classList.remove("drop-activo");

            // Solo actuamos si hay una tarjeta siendo arrastrada
            if (!tarjetaArrastrada) return;

            // Insertar la tarjeta ANTES del botón "Agregar tarjeta" para
            // que el botón siempre quede al final de la columna.
            const boton = columna.querySelector(".btn-agregar-tarjeta");
            if (boton) {
                columna.insertBefore(tarjetaArrastrada, boton);
            } else {
                // Si la columna no tiene botón (caso raro), sí usamos appendChild
                columna.appendChild(tarjetaArrastrada);
            }

            // Re-activar el drag en la tarjeta recién movida
            activarDragEnTarjetas();
            actualizarContadores();
        });
    });
}


// ──────────────────────────────────────────────────────────────
//  CONTADOR DE TARJETAS
//  Actualiza el número que aparece en el encabezado de cada columna
// ──────────────────────────────────────────────────────────────

/**
 * Recorre todas las columnas y actualiza su contador interno.
 * Lo hacemos llamando a render() en el componente, que ya recuenta
 * las tarjetas por nosotros.
 */
function actualizarContadores() {
    document.querySelectorAll("kanban-column").forEach(columna => {
        // Re-renderizar dispara el reconteo de tarjetas dentro del componente
        columna.render();
    });
}


// ──────────────────────────────────────────────────────────────
//  CREACIÓN DE TARJETAS NUEVAS
//  Formulario emergente en cada columna
// ──────────────────────────────────────────────────────────────

/**
 * Abre el modal de creación de tarjeta para una columna específica.
 * @param {HTMLElement} columna - El elemento <kanban-column> destino
 */
function abrirFormulario(columna) {
    // Si ya hay un modal abierto, cerrarlo primero
    cerrarFormulario();

    // Crear el overlay oscuro de fondo
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    overlay.addEventListener("click", cerrarFormulario);

    // Crear el modal con el formulario
    const modal = document.createElement("div");
    modal.id = "modal-nueva-tarjeta";
    modal.innerHTML = `
        <h3 class="modal-titulo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva tarjeta
        </h3>

        <label class="modal-label" for="input-titulo">Título de la tarea</label>
        <input
            id="input-titulo"
            class="modal-input"
            type="text"
            placeholder="Ej: Diseñar pantalla de inicio"
            maxlength="80"
        />

        <label class="modal-label" for="input-responsable">Responsable</label>
        <input
            id="input-responsable"
            class="modal-input"
            type="text"
            placeholder="Ej: Ana Torres"
            maxlength="40"
        />

        <label class="modal-label" for="select-prioridad">Prioridad</label>
        <select id="select-prioridad" class="modal-input modal-select">
            <option value="alta">🔴 Alta</option>
            <option value="media" selected>🟡 Media</option>
            <option value="baja">🟢 Baja</option>
        </select>

        <div class="modal-botones">
            <button id="btn-cancelar" class="btn-secundario">Cancelar</button>
            <button id="btn-crear" class="btn-primario">Crear tarjeta</button>
        </div>
    `;

    // Evitar que un clic dentro del modal cierre el overlay
    modal.addEventListener("click", (e) => e.stopPropagation());

    // Agregar al DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Enfocar automáticamente el primer campo
    document.getElementById("input-titulo").focus();

    // Botón cancelar
    document.getElementById("btn-cancelar").addEventListener("click", cerrarFormulario);

    // Botón crear tarjeta
    document.getElementById("btn-crear").addEventListener("click", () => {
        crearTarjeta(columna);
    });

    // También crear con Enter en el último campo
    document.getElementById("input-responsable").addEventListener("keydown", (e) => {
        if (e.key === "Enter") crearTarjeta(columna);
    });

    // Cerrar con Escape
    document.addEventListener("keydown", cerrarConEscape);
}

/**
 * Lee los valores del formulario, valida y crea la <kanban-card>.
 * @param {HTMLElement} columna - La columna donde se insertará la tarjeta
 */
function crearTarjeta(columna) {
    const titulo      = document.getElementById("input-titulo").value.trim();
    const responsable = document.getElementById("input-responsable").value.trim();
    const prioridad   = document.getElementById("select-prioridad").value;

    // Validación mínima: el título es obligatorio
    if (!titulo) {
        const input = document.getElementById("input-titulo");
        input.classList.add("input-error");
        input.placeholder = "⚠ El título es obligatorio";
        input.focus();
        return;
    }

    // Crear el elemento <kanban-card> con sus atributos
    const nuevaTarjeta = document.createElement("kanban-card");
    nuevaTarjeta.setAttribute("titulo",      titulo);
    nuevaTarjeta.setAttribute("responsable", responsable || "Sin asignar");
    nuevaTarjeta.setAttribute("prioridad",   prioridad);

    // Insertar ANTES del botón "Agregar tarjeta" para que siempre quede al final
    const boton = columna.querySelector(".btn-agregar-tarjeta");
    if (boton) {
        columna.insertBefore(nuevaTarjeta, boton);
    } else {
        columna.appendChild(nuevaTarjeta);
    }

    // Activar drag en la nueva tarjeta
    activarDragEnTarjetas();
    actualizarContadores();

    // Cerrar el modal
    cerrarFormulario();
}

/**
 * Cierra y elimina el modal del DOM.
 */
function cerrarFormulario() {
    const overlay = document.getElementById("modal-overlay");
    const modal   = document.getElementById("modal-nueva-tarjeta");
    if (overlay) overlay.remove();
    if (modal)   modal.remove();
    document.removeEventListener("keydown", cerrarConEscape);
}

/**
 * Handler para cerrar el modal con la tecla Escape.
 */
function cerrarConEscape(e) {
    if (e.key === "Escape") cerrarFormulario();
}


// ──────────────────────────────────────────────────────────────
//  BOTONES "AGREGAR TARJETA" EN COLUMNAS
//  Conecta cada botón con el formulario
// ──────────────────────────────────────────────────────────────

/**
 * Busca todos los botones de "agregar tarjeta" y les asigna
 * el evento de clic para abrir el formulario correcto.
 */
function activarBotonesAgregar() {
    const botones = document.querySelectorAll(".btn-agregar-tarjeta");
    botones.forEach(boton => {
        // Cada botón tiene data-columna con el titulo de la columna
        boton.addEventListener("click", () => {
            // Subimos en el DOM hasta encontrar la <kanban-column> padre
            const columna = boton.closest("kanban-column");
            if (columna) abrirFormulario(columna);
        });
    });
}


// ──────────────────────────────────────────────────────────────
//  ESTILOS DE INTERACCIÓN
//  Inyectamos los estilos necesarios para drag & drop y modal
//  directamente desde JS para mantener todo en un solo archivo
// ──────────────────────────────────────────────────────────────

function inyectarEstilos() {
    const estilos = document.createElement("style");
    estilos.textContent = `

        /* ── Tarjeta siendo arrastrada ─────────────────────── */
        kanban-card.arrastrando {
            opacity: 0.35;
            transform: scale(0.97);
        }

        /* ── Columna que recibe el arrastre ─────────────────── */
        kanban-column.drop-activo {
            outline: 2px dashed var(--color-todo, #58a6ff);
            outline-offset: -4px;
            border-radius: 12px;
        }

        /* ── Overlay del modal ──────────────────────────────── */
        #modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            z-index: 100;
            backdrop-filter: blur(2px);
            animation: fadeIn 0.15s ease;
        }

        /* ── Modal de nueva tarjeta ─────────────────────────── */
        #modal-nueva-tarjeta {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1c2128;
            border: 1px solid #30363d;
            border-radius: 14px;
            padding: 28px;
            width: 100%;
            max-width: 420px;
            z-index: 101;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.2s ease;
            font-family: 'Outfit', sans-serif;
        }

        .modal-titulo {
            font-size: 17px;
            font-weight: 700;
            color: #e6edf3;
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .modal-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #8b949e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .modal-input {
            width: 100%;
            background: #0e1117;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 10px 13px;
            color: #e6edf3;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            margin-bottom: 16px;
            outline: none;
            transition: border-color 0.15s;
            box-sizing: border-box;
        }

        .modal-input:focus {
            border-color: #58a6ff;
        }

        .modal-input.input-error {
            border-color: #f85149;
            animation: shake 0.3s ease;
        }

        .modal-select {
            appearance: none;
            cursor: pointer;
        }

        .modal-botones {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 8px;
        }

        .btn-primario, .btn-secundario {
            padding: 9px 20px;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: opacity 0.15s, transform 0.1s;
        }

        .btn-primario {
            background: #238636;
            color: white;
        }

        .btn-primario:hover {
            background: #2ea043;
        }

        .btn-secundario {
            background: transparent;
            border: 1px solid #30363d;
            color: #8b949e;
        }

        .btn-secundario:hover {
            background: #30363d;
            color: #e6edf3;
        }

        /* ── Animaciones ────────────────────────────────────── */
        @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, -46%); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25%       { transform: translateX(-6px); }
            75%       { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(estilos);
}


// ──────────────────────────────────────────────────────────────
//  INICIALIZACIÓN
//  Punto de entrada — se ejecuta cuando el DOM está listo
// ──────────────────────────────────────────────────────────────

/**
 * Función principal que arranca toda la lógica de interacción.
 * Usamos DOMContentLoaded para asegurarnos de que todos los
 * elementos ya existen antes de tocarlos.
 */
document.addEventListener("DOMContentLoaded", () => {
    inyectarEstilos();
    iniciarReloj();
    activarDragEnTarjetas();
    activarDropEnColumnas();
    activarBotonesAgregar();
    activarEliminarTarjetas();
});


// ──────────────────────────────────────────────────────────────
//  ELIMINAR TARJETAS
//  La <kanban-card> lanza un evento personalizado cuando el
//  usuario hace clic en su botón de eliminar.
//  Aquí lo escuchamos y actualizamos los contadores.
// ──────────────────────────────────────────────────────────────

/**
 * Escucha el evento 'tarjeta-eliminada' que dispara KanbanCard
 * cuando el usuario confirma la eliminación.
 * El evento "burbujea" (bubbles: true) desde la tarjeta hasta el documento.
 */
function activarEliminarTarjetas() {
    document.addEventListener("tarjeta-eliminada", () => {
        // La tarjeta ya se eliminó a sí misma del DOM dentro del componente.
        // Solo necesitamos actualizar los contadores de todas las columnas.
        actualizarContadores();
    });
}


// ──────────────────────────────────────────────────────────────
//  RELOJ EN TIEMPO REAL
//  Actualiza el badge del header con la fecha y hora actuales
// ──────────────────────────────────────────────────────────────

/**
 * Formatea la fecha actual en español y la muestra en #reloj-texto.
 * Se llama una vez al cargar y luego cada segundo con setInterval.
 */
function iniciarReloj() {
    const contenedor = document.getElementById("reloj-texto");
    if (!contenedor) return;

    // Opciones de formato para Intl.DateTimeFormat
    // Usamos el locale "es-MX" para español de México
    const opcionesHora = {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true          // formato 12h con am/pm
    };

    const opcionesFecha = {
        weekday: "short",    // "lun."
        day:     "numeric",  // "5"
        month:   "short"     // "may."
    };

    function actualizar() {
        const ahora = new Date();

        // Formatear la parte de la hora (ej: "05:26:08 p. m.")
        const hora  = ahora.toLocaleTimeString("es-MX", opcionesHora);

        // Formatear la parte de la fecha (ej: "lun. 5 de may.")
        const fecha = ahora.toLocaleDateString("es-MX", opcionesFecha);

        // Unir en una sola línea limpia
        contenedor.textContent = `${fecha} · ${hora}`;
    }

    // Mostrar inmediatamente (sin esperar el primer segundo)
    actualizar();

    // Refrescar cada 1000 ms (1 segundo)
    setInterval(actualizar, 1000);
}
