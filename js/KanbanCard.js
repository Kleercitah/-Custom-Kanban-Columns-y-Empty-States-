// ============================================================
//  DevBoard — KanbanCard.js
//  M4L4 · LevelUp Code 2026
// ============================================================
//  INSTRUCCIONES:
//  → Este es el único archivo que debes editar hoy.
//  → KanbanColumn.js y app.js ya están listos — no los toques.
//  → Tu misión: completar el método render() de esta tarjeta.
//
//  🎫 TICKET 1 — Leer los atributos de la tarjeta
//  🎫 TICKET 2 — Traducir la prioridad a color y etiqueta
//  🎫 TICKET 3 — Generar las iniciales del responsable
//  🎫 TICKET 4 — Construir el Shadow DOM con estilos y HTML
// ============================================================


class KanbanCard extends HTMLElement {

    constructor() {
        // super() conecta esta clase con el motor del navegador.
        // Sin esta línea el elemento no puede existir en el DOM.
        super();

        // Crear el árbol DOM privado del componente.
        // Lo que definas adentro no se mezcla con el resto de la página.
        this.attachShadow({ mode: "open" });
    }


    // ── Lifecycle hooks (ya implementados ✅) ──────────────────
    //    No los modifiques — solo lee cómo funcionan.

    // Le dice al navegador qué atributos vigilar.
    // Solo los de esta lista disparan attributeChangedCallback.
    static get observedAttributes() {
        return ["titulo", "responsable", "prioridad"];
    }

    // El navegador llama esto cuando el elemento entra al DOM.
    connectedCallback() {
        this.render();
    }

    // El navegador llama esto cuando cambia un atributo observado.
    attributeChangedCallback(name, oldValue, newValue) {
        // La guarda evita que render() corra antes de que
        // el Shadow DOM esté listo durante la construcción inicial.
        if (this.shadowRoot) {
            this.render();
        }
    }


    // ── render() — aquí está tu trabajo ───────────────────────
    render() {

        // ─────────────────────────────────────────────────────
        // 🎫 TICKET 1 — Leer los atributos
        // ─────────────────────────────────────────────────────
        // Los datos de la tarjeta llegan como atributos HTML.
        // Usa this.getAttribute("nombre-del-atributo") para leerlos.
        // Si el atributo no existe, getAttribute devuelve null —
        // usa || para poner un valor por defecto seguro.
        //
        // Atributos que necesitas leer:
        //   "titulo"      → valor por defecto: "Sin título"
        //   "responsable" → valor por defecto: "Sin asignar"
        //   "prioridad"   → valor por defecto: "baja"
        //
        // ✅ El primero ya está como guía — completa los demás:

        let titulo = this.getAttribute("titulo") || "Sin título";
        let responsable = this.getAttribute("responsable") || "Sin asignar";
        let prioridad = this.getAttribute("prioridad") || "baja";
        // TODO: leer "responsable" con valor por defecto "Sin asignar"
        // TODO: leer "prioridad" con valor por defecto "baja"


        // ─────────────────────────────────────────────────────
        // 🎫 TICKET 2 — Traducir la prioridad a color y etiqueta
        // ─────────────────────────────────────────────────────
        // Necesitamos un color y un texto para cada nivel de prioridad.
        // Empieza con los valores de "baja" y luego sobreescríbelos
        // si la prioridad es "media" o "alta".
        //
        //   "baja"  → colorPrioridad: "#3fb950",  etiqueta: "Baja"
        //   "media" → colorPrioridad: "#d29922",  etiqueta: "Media"
        //   "alta"  → colorPrioridad: "#f85149",  etiqueta: "Alta"
        //
        // ✅ El valor inicial ya está — agrega los dos if que faltan:

        let colorPrioridad = "#3fb950";
        let etiqueta       = "Baja";
        if (prioridad === "media") {
            colorPrioridad = "#d29922";
            etiqueta       = "Media";
        }
        if (prioridad === "alta") {
            colorPrioridad = "#f85149";
            etiqueta       = "Alta";
        }
        // TODO: if prioridad === "media" → cambiar colorPrioridad y etiqueta
        // TODO: if prioridad === "alta"  → cambiar colorPrioridad y etiqueta


        // ─────────────────────────────────────────────────────
        // 🎫 TICKET 3 — Generar las iniciales del responsable
        // ─────────────────────────────────────────────────────
        // El avatar muestra las iniciales del nombre (ej: "Ana Torres" → "AT").
        // Pista: responsable.split(" ") divide el nombre en un array de palabras.
        //        palabras[0][0] es la primera letra de la primera palabra.
        //        palabras[1][0] es la primera letra de la segunda palabra.
        //        .toUpperCase() convierte a mayúscula.
        //        Verifica que palabras[1] exista antes de usarlo.

        //
        // TODO: dividir responsable en palabras con split(" ")
        // TODO: construir la variable "iniciales" con la primera letra de cada palabra
        let palabras = responsable.split(" ");
        let iniciales = palabras[0][0].toUpperCase();
        if (palabras[1]) {
            iniciales += palabras[1][0].toUpperCase();
        }


        // ─────────────────────────────────────────────────────
        // 🎫 TICKET 4 — Construir el Shadow DOM
        // ─────────────────────────────────────────────────────
        // Asigna a this.shadowRoot.innerHTML un template string con
        // dos secciones adentro: un bloque <style> y el HTML de la tarjeta.
        //
        // Estructura HTML que debe tener la tarjeta:
        //
        //   <div class="card">
        //       <p class="titulo"> ... </p>
        //       <div class="footer">
        //           <div class="responsable-grupo">
        //               <div class="avatar"> iniciales </div>
        //               <span class="nombre"> responsable </span>
        //           </div>
        //           <span class="badge"> etiqueta </span>
        //       </div>
        //   </div>
        //
        // Estilos mínimos que necesitas definir dentro del <style>:
        //   .card        → border-left: 3px solid ${colorPrioridad}
        //   .badge       → background: ... color: ...
        //   (el resto de estilos los decides tú — dale caña 🎨)
        //
        // TODO: asignar this.shadowRoot.innerHTML con el <style> y el HTML
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border-left: 3px solid ${colorPrioridad};
                    background: #1b132a;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .titulo {
                    font-size: 18px;
                    margin: 0 0 12px 0;
                }
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .responsable-grupo {
                    display: flex;
                    align-items: center;
                }
                .avatar {
                    width: 32px;
                    height: 32px;
                    background-color: #ccc;
                    color: #fff;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    margin-right: 8px;
                }
                .nombre {
                    font-size: 14px;
                }
                .badge {
                    background-color: ${colorPrioridad};
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                }
            </style>
            <div class="card">
                <p class="titulo">${titulo}</p>
                <div class="footer">
                    <div class="responsable-grupo">
                        <div class="avatar">${iniciales}</div>
                        <span class="nombre">${responsable}</span>
                    </div>
                    <span class="badge">${etiqueta}</span>
                </div>
            </div>
        `;

    }

}

customElements.define("kanban-card", KanbanCard);