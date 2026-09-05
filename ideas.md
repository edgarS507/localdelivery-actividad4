# Ideas de diseño — Evidencias Actividad 4

## Enfoques considerados

### Enfoque 1: Panel editorial de depuración
Una interfaz clara, con composición de paneles, etiquetas de estado y una columna de consola para que las evidencias técnicas sean visibles sin ocultar la experiencia de usuario.

**Probabilidad:** 0.07

### Enfoque 2: App móvil cálida de delivery
Una experiencia centrada en imágenes de comida, tarjetas y acciones rápidas para aproximarse visualmente a una aplicación real de pedidos.

**Probabilidad:** 0.03

### Enfoque 3: Laboratorio monocromático de JavaScript
Un entorno casi blanco y negro que prioriza código, eventos y trazas sobre la presentación de producto.

**Probabilidad:** 0.08

## Enfoque elegido: Panel editorial de depuración

**Design Movement:** Editorial digital suizo aplicado a una consola de producto.

**Core Principles:** La interfaz debe separar claramente experiencia, estado y evidencia; cada evento debe tener una señal visual; la jerarquía tipográfica debe guiar la lectura; y la demostración debe permanecer funcional en pantallas pequeñas.

**Color Philosophy:** Azul cobalto para acciones y estado activo, verde para confirmaciones, ámbar para estados pendientes y un fondo marfil muy claro para evitar una apariencia clínica. La paleta hace visible la relación entre una acción del usuario y el cambio producido.

**Layout Paradigm:** Composición asimétrica de tres zonas: navegación compacta, experiencia principal y panel de trazas. El panel de evidencias permanece a la vista para que la actividad sea demostrable.

**Signature Elements:** Etiquetas `EVENT`, chips de estado con color semántico y una consola de trazas con hora y evento.

**Interaction Philosophy:** Cada interacción debe producir una respuesta inmediata, pequeña y verificable: una tarjeta cambia, un contador se actualiza, un filtro reduce resultados o una traza aparece.

**Animation:** Transiciones breves de opacidad y desplazamiento; ningún movimiento debe ocultar el resultado de una acción. El panel de consola agrega nuevas trazas con una entrada de 160 ms.

**Typography System:** Fraunces para titulares con carácter editorial y DM Sans para interfaz y datos. Los nombres de eventos usan una variante monoespaciada pequeña y mayúsculas.

**Brand Essence:** LocalDelivery convierte negocios del barrio en una experiencia de pedido verificable, clara y rápida. Personalidad: local, directa, confiable.

**Brand Voice:** Los titulares son cercanos y concretos; los CTA describen la acción, no prometen de más; las trazas son técnicas y breves. Ejemplos: “Pide cerca, decide rápido.” y “Evento registrado: producto añadido.”

**Wordmark & Logo:** Isotipo de dos líneas que forman una ruta corta hacia un punto de entrega; se usa como marca compacta en la cabecera.

**Signature Brand Color:** Cobalto `#3157D5`.

## Decisión de implementación

La pantalla incluirá controles visibles para demostrar `click`, `input`, `change`, geolocalización y scroll. La columna de trazas funcionará como evidencia inmediata, mientras que las tarjetas de comercios demostrarán el filtrado y el carrito.
