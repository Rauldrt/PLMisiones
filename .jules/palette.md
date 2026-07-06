## 2026-07-06 - Convert Interactive Divs to Buttons
**Learning:** Interactive components built as `<div>`s lack semantic meaning, keyboard navigability, and screen reader announcements. When converting them to `<button>` elements, we must also apply reset styles like `text-left` and apply focus visible classes.
**Action:** Always use semantic `<button>` tags for clickable cards/elements, apply `focus-visible:` styles, and ensure `aria-expanded` and dynamic `aria-label` attributes are used correctly.
