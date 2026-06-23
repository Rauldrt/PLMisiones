## 2026-06-23 - Fix Non-Semantic Clickable Divs
**Learning:** Interactive UI elements implemented as non-semantic `<div>` elements with `onClick` handlers are completely inaccessible to keyboard users, breaking tab order and Space/Enter activation patterns.
**Action:** Always convert custom interactive `<div>` elements into semantic `<button type="button">` elements, adding `aria-label` where contextually needed and explicit `focus-visible:` utility classes to restore focus rings that custom elements often miss.
