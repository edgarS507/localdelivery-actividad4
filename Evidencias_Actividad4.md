# Evidencias de la Actividad N.° 4

## Programación del lado del cliente y jQuery

**Proyecto integrador:** LocalDelivery  
**Estudiante:** Edgar Abrego  
**Docente:** MBA. Carlos V. Bruce Abbott  
**Fecha:** 29 de agosto de 2026

## 1. Resumen de la demostración

La evidencia se presenta como una aplicación cliente-side funcional. La pantalla integra una navegación semántica, un listado de comercios, un buscador, un filtro de envío gratis, un carrito local, una acción de geolocalización y una consola de trazas. La columna **Evidencias** hace visible el estado de la aplicación y registra los eventos ejecutados.

La interfaz se implementó con React para la composición visual, JavaScript para el estado y el DOM, y jQuery 3.6.0 para la preparación de selectores, el evento `ready` y la escucha del evento `scroll`. El resultado es demostrable en el navegador sin servidor de datos ni base de datos.

## 2. Evidencia E01 — Vinculación e integración de scripts

**Archivo:** `client/index.html`.

El documento raíz declara `lang="es"`, usa metadatos HTML5 y carga jQuery 3.6.0 antes del módulo de la aplicación.

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script type="module" src="/src/main.tsx"></script>
```

**Resultado observable:** en el panel de consola de la aplicación aparece la traza `jQuery READY — Selectores .js-evidence-card preparados.`. Esto demuestra que la librería fue cargada y utilizada durante la inicialización.

## 3. Evidencia E02 — Estructura semántica y directorios

La interfaz utiliza `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`. La estructura del proyecto conserva separación entre presentación y comportamiento:

```text
client/
├── index.html
└── src/
    ├── pages/Home.tsx       # Interfaz y eventos del cliente
    └── index.css            # Presentación visual
```

El listado de comercios se representa como artículos reutilizables. El panel de trazas cumple la función complementaria de `aside` y el pie identifica la actividad académica.

## 4. Evidencia E03 — Evento click y carrito

**Acción:** pulsar **Añadir** en una tarjeta.

**Implementación:** el controlador `handleAdd` agrega un objeto al arreglo local `cart`, recalcula el total y registra una traza.

```tsx
const next = [...cart, { name: restaurant.name, price: Number(restaurant.price.replace("$", "")) }];
setCart(next);
addLog("click", `[Carrito] Producto agregado: ${restaurant.name}`, "green");
```

**Resultado esperado:** el contador del estado global cambia de `0 items` a `1 item`, el total deja de ser `$0.00` y la consola muestra el evento `click` con el nombre del comercio.

## 5. Evidencia E04 — Evento input y filtrado

**Acción:** escribir `pizza` en el campo de búsqueda.

**Implementación:** el evento `onChange` actualiza `query`, filtra el arreglo de comercios y registra una traza `input`.

```tsx
const handleSearch = (value: string) => {
  setQuery(value);
  addLog("input", `Query: "${value || "(vacía)"}" · filtrado en caliente.`, "blue");
};
```

**Resultado esperado:** se conserva únicamente la tarjeta de Pizzería Bella Vista, cambia el contador de resultados y aparece la consulta en la consola.

## 6. Evidencia E05 — Evento change y filtro de preferencia

**Acción:** activar **Solo envío gratis**.

**Implementación:** el checkbox actualiza `freeOnly` y vuelve a evaluar la colección de restaurantes.

```tsx
const handleFree = (checked: boolean) => {
  setFreeOnly(checked);
  addLog("change", `Solo envío gratis: ${checked ? "true" : "false"}.`, "amber");
};
```

**Resultado esperado:** se ocultan los comercios que no tienen envío gratis y la consola muestra el evento `change` en color ámbar.

## 7. Evidencia E06 — Geolocalización del lado del cliente

**Acción:** la cabecera dispone del estado GPS y la función `handleGPS` invoca `navigator.geolocation.getCurrentPosition()`.

**Resultado posible:** si el navegador permite la ubicación, se muestran latitud y longitud aproximadas; si el navegador no concede permisos o está ejecutándose en un entorno sin geolocalización, se registra `GPS ERROR`. Ambos caminos están controlados y son visibles en la interfaz.

La diferencia entre éxito y error no representa un fallo de la actividad: depende de los permisos del navegador y del contexto seguro de ejecución.

## 8. Evidencia E07 — Evento scroll y jQuery

La aplicación registra el evento `scroll.localdelivery` sobre `window` mediante jQuery. Al desplazarse, se registra una traza de resumen flotante.

```tsx
$(window).on("scroll.localdelivery", onScroll);
return () => $(window).off("scroll.localdelivery", onScroll);
```

**Resultado observable:** el panel de evidencias muestra entradas `scroll` cuando la página se desplaza. En la vista móvil, la consola queda debajo del contenido y continúa siendo visible.

## 9. Evidencia E08 — Estado global y depuración

La sección **Estado global** muestra en tiempo real:

| Variable | Valor inicial | Cambio demostrado |
|---|---:|---|
| `carrito` | `0 items` | Aumenta con cada acción `click`. |
| `total` | `$0.00` | Se recalcula recorriendo los productos. |
| `preferencias` | `todas` | Cambia a `envío gratis` con `change`. |
| `ubicacionGPS` | `GPS: No activo` | Se actualiza en éxito o error de la API. |

## 10. Evidencia E09 — Estructuras de control

La lógica incorpora una condición combinada para el filtrado, un recorrido de la colección con `filter` y una reducción de precios con `reduce`. Estas estructuras reemplazan la necesidad de datos externos y permiten observar el resultado directamente en el cliente.

```tsx
const filtered = restaurants.filter((restaurant) => {
  const matches = `${restaurant.name} ${restaurant.category}`
    .toLowerCase().includes(query.toLowerCase());
  return matches && (!freeOnly || restaurant.free);
});

const total = cart.reduce((sum, item) => sum + item.price, 0);
```

## 11. Tabla de verificación final

| Evidencia | Acción de prueba | Resultado verificable | Estado |
|---|---|---|---|
| E01 | Cargar la página | Traza `jQuery READY` | Verificada |
| E02 | Revisar la pantalla | Regiones semánticas visibles | Verificada |
| E03 | Pulsar Añadir | Carrito y total actualizados | Verificada |
| E04 | Escribir en Buscar | Tarjetas filtradas | Verificada |
| E05 | Activar checkbox | Se muestran solo comercios gratuitos | Verificada |
| E06 | Activar GPS | Mensaje de éxito o error controlado | Verificada |
| E07 | Desplazar la página | Trazas `scroll` | Verificada |
| E08 | Revisar panel lateral | Estado global legible | Verificada |

## 12. Archivos que constituyen la evidencia

`client/index.html` demuestra la vinculación de scripts. `client/src/pages/Home.tsx` contiene la lógica del lado del cliente, el estado, los eventos y las trazas. `client/src/index.css` contiene la presentación. `ideas.md` registra la decisión de diseño. Este documento explica las pruebas y resultados.

## Referencias

[1]: https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction "MDN Web Docs: Introducción al DOM"
[2]: https://developer.mozilla.org/es/docs/Web/API/Window/scroll_event "MDN Web Docs: evento scroll"
[3]: https://developer.mozilla.org/es/docs/Web/API/Geolocation/getCurrentPosition "MDN Web Docs: getCurrentPosition"
[4]: https://jquery.com/ "jQuery — documentación oficial"
