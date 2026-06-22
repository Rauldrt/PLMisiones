## 2026-06-22 - Custom Button Focus Styles in Radix UI Triggers
**Learning:** When using custom elements (like `<button>`) inside Radix UI components (e.g. `PopoverTrigger`, `DialogTrigger`) via `asChild`, default keyboard focus styles are lost and screen readers might not have an accessible name if the button only contains icons.
**Action:** Always apply explicit Tailwind CSS focus utilities (like `focus-visible:ring-2`) and add an `aria-label` to custom trigger elements to ensure keyboard accessibility and screen reader support.
