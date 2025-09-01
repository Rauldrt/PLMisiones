
# Arquitectura de la Página de Inicio

Este documento detalla la estructura modular de la página de inicio (`src/app/page.tsx` y `src/components/HomepageClient.tsx`), con el objetivo de facilitar futuras gestiones y personalizaciones de la interfaz de usuario.

---

## 1. Banner Principal y Pestañas de Referentes

- **Componente Principal:** `src/components/Banner.tsx`
- **Componentes Secundarios:**
  - `AnimatedBannerBackground.tsx`: Gestiona la transición animada de las imágenes de fondo del carrusel.
  - `BannerContentTabs.tsx`: Muestra las tarjetas de los referentes en un formato de pestañas o carrusel.
  - `ExpandingCandidateCard.tsx`: Tarjeta individual para cada referente que se expande al hacer clic.
  - `NotificationBubble.tsx`: Pequeña burbuja de notificación opcional en la esquina superior.

- **Composición:** Es una sección de alto impacto visual que combina un carrusel de diapositivas (`Carousel`) con títulos, subtítulos y botones de llamada a la acción (CTA). El fondo tiene una animación de zoom y desvanecimiento entre imágenes. En la parte inferior, presenta a los referentes principales del partido en tarjetas interactivas que se expanden para mostrar más información.

- **Funciones:**
  - **Captar la atención:** Presenta los mensajes clave del partido de forma atractiva.
  - **Navegación principal:** Dirige a los usuarios a secciones importantes como "Afiliación" o "Propuestas".
  - **Presentar líderes:** Ofrece un primer vistazo a las figuras clave del partido de manera interactiva.

- **Gestión de Datos:** `src/data/banner.json`, `src/data/referentes.json`, `src/data/notification.json`.

---

## 2. Sección de Organigrama

- **Componente Principal:** `OrganigramaSection` (definido dentro de `src/components/HomepageClient.tsx`).
- **Componentes Secundarios:** `Carousel`, `Card`, `Image` de ShadCN/UI.

- **Composición:** Esta sección muestra la estructura jerárquica del partido. Utiliza un carrusel de botones para listar a los miembros. Al hacer clic en un nombre, una tarjeta central se actualiza para mostrar la foto, el nombre, el cargo y una breve descripción del miembro seleccionado.

- **Funciones:**
  - **Transparencia:** Comunica de forma clara la estructura organizativa del partido.
  - **Informativa:** Permite conocer a las personas que ocupan los cargos clave.

- **Gestión de Datos:** Datos estáticos definidos directamente en el arreglo `organigramaData` dentro de `HomepageClient.tsx`.

---

## 3. Mosaico de Imágenes Dinámico

- **Componente Principal:** `src/components/MosaicTile.tsx`.
- **Composición:** Una grilla (CSS Grid) de "tiles" o mosaicos de diferentes tamaños (`colSpan`, `rowSpan`). Cada tile es un componente independiente que gestiona su propio carrusel de imágenes interno.
- **Funciones:**
  - **Dinamismo Visual:** Cada tile tiene una animación de transición aleatoria (fade, slide, zoom) y un intervalo de cambio de imagen también aleatorio, creando un efecto similar a los "Live Tiles".
  - **Interactividad:** Al hacer clic en un tile, se abre un `Lightbox` a pantalla completa que permite ver todas las imágenes de ese tile en alta resolución.

- **Gestión de Datos:** `src/data/mosaic.json`.

---

## 4. Lightbox de Galería

- **Componente Principal:** Implementado directamente en `src/components/HomepageClient.tsx`.
- **Componentes Secundarios:** `Dialog`, `Carousel` de ShadCN/UI.

- **Composición:** Es una ventana modal que se superpone a la página. Utiliza el componente `Dialog` para el contenedor y el `Carousel` para la navegación de imágenes. Su estado (abierto/cerrado) y contenido se gestionan a través de una variable de estado `lightboxData` en `HomepageClient`.

- **Funciones:**
  - **Visualización:** Permite a los usuarios ver las imágenes del mosaico en un tamaño más grande y sin distracciones.
  - **Navegación:** Facilita el desplazamiento entre las imágenes de una misma galería con botones de "anterior" y "siguiente".

- **Gestión de Datos:** Recibe los datos del mosaico en el que se hizo clic a través del estado `lightboxData`.

---

## 5. Acordeón "Nuestra Identidad"

- **Componente Principal:** `Accordion` de ShadCN/UI.
- **Composición:** Una lista de elementos colapsables. Cada elemento consta de un título (siempre visible) y un contenido que se revela al hacer clic en el título.

- **Funciones:**
  - **Organización de Contenido:** Presenta información clave (misión, visión, valores) de manera compacta y organizada.
  - **Foco de Usuario:** Permite al usuario centrarse en el pilar ideológico que más le interese sin sobrecargarse de texto.

- **Gestión de Datos:** `src/data/accordion.json`.

---

## 6. Sección "Últimas Noticias"

- **Componente Principal:** Renderizado dentro de `src/components/HomepageClient.tsx`.
- **Componentes Secundarios:** `Card`, `Image`, `Button` de ShadCN/UI.

- **Composición:** Una grilla de tarjetas. Cada tarjeta representa un artículo de noticia y contiene una imagen destacada, el título, la fecha de publicación, un breve extracto del contenido y un botón "Leer más" que enlaza a la página completa del artículo.

- **Funciones:**
  - **Actualidad:** Mantiene a los visitantes informados sobre las actividades y comunicados más recientes del partido.
  - **Engagement:** Fomenta la exploración del sitio al dirigir tráfico hacia las páginas de noticias individuales.

- **Gestión de Datos:** `src/data/news.json`. Muestra los 3 artículos más recientes.
