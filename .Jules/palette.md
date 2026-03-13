## 2024-05-14 - Interactive div accessibility
**Learning:** Adding `onClick` to a `div` or `span` completely breaks keyboard accessibility, making the element invisible to keyboard users and screen readers unless semantic roles and keyboard handlers are manually added.
**Action:** When creating custom interactive elements, always use native `<button>` or `<a>` tags. If a `div` must be used, always add `role="button"`, `tabIndex={0}`, `onKeyDown` (for Enter/Space), and an appropriate `aria-label`.
