## 2026-06-15 - Keyboard Accessibility for Clickable Divs
**Learning:** When using custom `div` elements as interactive triggers (like in `MosaicTile`), keyboard users cannot access them without explicit `role="button"`, `tabIndex={0}`, `onKeyDown` handlers, and `focus-visible` styles. This is a common pattern in the app that excludes keyboard-only navigation.
**Action:** Always ensure any element with an `onClick` handler also has full keyboard support and focus visibility.
