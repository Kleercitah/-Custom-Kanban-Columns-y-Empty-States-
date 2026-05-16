class KanbanColumn extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["titulo", "color"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.render();
        }
    }

    render() {
        const titulo = this.getAttribute("titulo") || "Columna";
        const color = this.getAttribute("color") || "#8b949e";

        const tarjetas = this.querySelectorAll("kanban-card");
        const total = tarjetas.length;

        const contenidoCuerpo = total === 0 
            ? `<div class="estado-vacio">
                <span class="icono-vacio">✓</span>
                <p class="titulo-vacio">Todo al día</p>
                <p class="subtitulo-vacio">No hay tareas aquí</p>
               </div>`
            : `<slot></slot>`;

        this.shadowRoot.innerHTML = `
            <style>
                .columna {
                    display: flex;
                    flex-direction: column;
                    background-color: #161b22;
                    border-radius: 6px;
                    width: 300px;
                    min-height: 200px;
                    padding: 12px;
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                }
                .columna-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 8px;
                    margin-bottom: 12px;
                    border-bottom: 2px solid ${color};
                }
                .columna-titulo {
                    font-weight: 600;
                    font-size: 14px;
                    color: #c9d1d9;
                }
                .columna-contador {
                    font-size: 12px;
                    font-weight: 600;
                    background-color: rgba(110, 118, 129, 0.2);
                    padding: 2px 6px;
                    border-radius: 10px;
                    color: ${color};
                }
                .columna-body {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex-grow: 1;
                }
                .estado-vacio {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex-grow: 1;
                    padding: 24px 16px;
                    border: 2px dashed #30363d;
                    border-radius: 6px;
                    text-align: center;
                }
                .icono-vacio {
                    font-size: 18px;
                    color: #58a6ff;
                    margin-bottom: 4px;
                }
                .titulo-vacio {
                    font-size: 13px;
                    font-weight: 500;
                    color: #8b949e;
                    margin: 0;
                }
                .subtitulo-vacio {
                    font-size: 11px;
                    color: #484f58;
                    margin: 2px 0 0 0;
                }
            </style>

            <div class="columna">
                <div class="columna-header">
                    <span class="columna-titulo">${titulo}</span>
                    <span class="columna-contador">${total}</span>
                </div>
                <div class="columna-body">
                    ${contenidoCuerpo}
                </div>
            </div>
        `;
    }
}

customElements.define("kanban-column", KanbanColumn);