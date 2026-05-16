# 📋 DevBoard — Ejercicio en Clase

**Módulo 4, Lección 4 · Web Components**
**Tiempo:** 35 minutos · **Dificultad:** 🔴 Avanzado

---

## 📩 Mensaje del Tech Lead

> De: **Sebastián V.** — Tech Lead @ DevBoard
> Para: equipo de desarrollo
> Asunto: 🚨 Las tarjetas del tablero no renderizan
>
> Gente, necesito ayuda urgente. El cliente acaba de confirmar la demo
> para esta tarde y las tarjetas del tablero están en blanco.
>
> El componente `<kanban-card>` está registrado, el Shadow DOM está listo,
> los lifecycle hooks están conectados — pero el método `render()` está vacío.
> El que lo iba a implementar se fue de vacaciones y no dejó nada.
>
> El trabajo es claro: entrar a `KanbanCard.js`, completar `render()` y
> lograr que las tarjetas muestren su título, el responsable y la prioridad
> con el color correcto. **`app.js` ya está listo, no lo toquen.**
>
> La estructura HTML que el diseñador aprobó está en los comentarios del archivo.
> Les dejo los tickets detallados abajo.
>
> — Seba

---

## 🏢 El Cliente

**DevBoard** es una startup de productividad que quiere competir con Trello y Notion.
Su propuesta: una herramienta de gestión de proyectos que funcione 100% con
Web Components nativos, sin frameworks externos. Llevan seis meses en desarrollo
y esta tarde presentan el MVP a sus primeros inversores.

El tablero ya tiene su estructura base. Lo único que falta son las tarjetas —
el corazón de toda la experiencia.

---

## 🗂️ Archivos del repositorio

| Archivo | Estado | ¿Lo tocas? |
|---|---|---|
| `KanbanCard.js` | ⚠️ Incompleto | ✅ Sí — aquí está tu trabajo |
| `app.js` | ✅ Listo | ❌ No |
| `index.html` | ✅ Listo | ❌ No |

---

## 🎫 Tickets

---

### 🎫 Ticket 1 — Leer los atributos de la tarjeta

**Archivo:** `KanbanCard.js` → método `render()`

Las tarjetas reciben sus datos desde el HTML como atributos:

```html
<kanban-card
    titulo="Diseñar login"
    responsable="Ana Torres"
    prioridad="alta">
</kanban-card>
```

Dentro de `render()`, usa `this.getAttribute("nombre")` para leer cada uno.
Si el atributo no existe, `getAttribute` devuelve `null` — usa `||` para definir
un valor por defecto seguro.

**Criterio de aceptación:** tres variables declaradas (`titulo`, `responsable`, `prioridad`)
con sus valores por defecto funcionando.

---

### 🎫 Ticket 2 — Traducir la prioridad a color y etiqueta

**Archivo:** `KanbanCard.js` → método `render()`

Cada nivel de prioridad tiene su propio color y texto:

| Prioridad | Color | Etiqueta |
|---|---|---|
| `"baja"` | `#3fb950` | `"Baja"` |
| `"media"` | `#d29922` | `"Media"` |
| `"alta"` | `#f85149` | `"Alta"` |

Declara `colorPrioridad` y `etiqueta` con los valores de `"baja"` por defecto,
luego sobreescríbelos con `if` según corresponda.

**Criterio de aceptación:** una tarjeta de prioridad `"alta"` muestra el borde rojo,
una de `"baja"` muestra el borde verde.

---

### 🎫 Ticket 3 — Generar las iniciales del responsable

**Archivo:** `KanbanCard.js` → método `render()`

El avatar muestra las iniciales del nombre en lugar de una foto.
`"Ana Torres"` → `"AT"`, `"Luis Mora"` → `"LM"`.

Pistas:
- `"Ana Torres".split(" ")` → `["Ana", "Torres"]`
- `palabras[0][0]` → primera letra de la primera palabra
- `.toUpperCase()` → convierte a mayúscula
- Verifica que `palabras[1]` exista antes de usarlo (nombres de una sola palabra)

**Criterio de aceptación:** el avatar muestra dos letras en mayúscula correctas
para cualquier nombre de dos palabras.

---

### 🎫 Ticket 4 — Construir el Shadow DOM

**Archivo:** `KanbanCard.js` → método `render()`

Asigna a `this.shadowRoot.innerHTML` un template string con un `<style>` y el HTML
de la tarjeta. Esta es la estructura que aprobó el diseñador:

```
<div class="card">
    <p class="titulo"> ... </p>
    <div class="footer">
        <div class="responsable-grupo">
            <div class="avatar"> iniciales </div>
            <span class="nombre"> responsable </span>
        </div>
        <span class="badge"> etiqueta </span>
    </div>
</div>
```

Reglas de estilo obligatorias:
- `.card` → `border-left: 3px solid ${colorPrioridad}`
- `.badge` → usa `colorPrioridad` para el color de texto o fondo
- El resto de estilos son libres — dale tu toque 🎨

**Criterio de aceptación:** las tarjetas aparecen en el tablero con título,
responsable, badge de prioridad y el color de borde correcto.

---

## 💡 Tips

**Sobre el Shadow DOM:**
Todo el CSS dentro de `this.shadowRoot.innerHTML` está encapsulado.
Puedes usar nombres de clase tan simples como `.card` o `.titulo`
sin riesgo de que colisionen con estilos del resto de la página.
Los estilos de afuera tampoco entran — cada tarjeta es una cápsula sellada.

**Sobre las template strings:**
Puedes mezclar HTML, CSS y variables JavaScript dentro de un mismo
template string usando `${}`. El `<style>` va adentro del mismo string
que el HTML — no hace falta un archivo CSS separado.

**Si el tablero se ve en blanco:**
Abre DevTools → Elements → busca un `<kanban-card>` → expande su
`#shadow-root`. Si está vacío, `render()` aún no está asignando nada
a `this.shadowRoot.innerHTML`.

**Si el color de borde no aparece:**
Verifica que `colorPrioridad` tenga un valor en ese punto del código —
antes de usarlo en el template string, no después.

---

## 🔥 Bonus — El botón de eliminar

Si terminaste los cuatro tickets y el tablero funciona, el cliente tiene un
pedido extra que paga doble: cada tarjeta necesita un botón para eliminarse.

**Lo que debe hacer:**
1. Un botón `×` aparece en la esquina superior derecha al pasar el mouse.
2. Al hacer clic una vez, el botón cambia a `"¿Seguro?"`.
3. Al hacer clic por segunda vez, la tarjeta desaparece del tablero.
4. Si el usuario no confirma en 2 segundos, el botón vuelve al estado original.

**Pistas:**
- El botón va dentro del HTML de `render()`, en la esquina del `.card`.
- Después del `this.shadowRoot.innerHTML = ...` puedes usar
  `this.shadowRoot.querySelector(".btn-eliminar")` para obtener el botón
  y agregarle un `addEventListener("click", ...)`.
- Para eliminar la tarjeta del DOM: `this.remove()`.
- Para el estado de confirmación usa una variable booleana `confirmando`
  y un `setTimeout` de 2000ms para resetearla si el usuario no hace el segundo clic.

---

## ✅ Estado esperado al terminar

- Las tarjetas renderizan en las tres columnas con título, responsable y badge.
- El color del borde izquierdo cambia según la prioridad de cada tarjeta.
- El avatar muestra las iniciales correctas del responsable.
- **Bonus:** las tarjetas se pueden eliminar con doble confirmación.