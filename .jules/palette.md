## 2024-06-27 - Convertir divs interactivos en botones
**Learning:** En Next.js y React, es común usar `<div>` con `onClick` para elementos como las tarjetas del mosaico (`MosaicTile.tsx`). Sin embargo, estos no son accesibles por teclado por defecto, y pierden los roles y semánticas necesarias. Al usar `<button>`, hay que añadir `w-full h-full text-left block` para evitar romper el diseño original.
**Action:** Reemplazar iterativamente los `<div onClick="...">` con `<button type="button" onClick="...">` en componentes interactivos, añadiendo `aria-label` y estilos de foco (`focus-visible`).
