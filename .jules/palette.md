## 2026-07-04 - Focus Styles in Radix Triggers
**Learning:** When using custom elements like `<button>` inside Radix UI triggers (e.g., `PopoverTrigger`, `DialogTrigger`) with `asChild`, default keyboard focus styles are lost, hindering keyboard accessibility.
**Action:** Manually apply Tailwind CSS focus utilities (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`) and appropriate border-radius classes, along with an `aria-label` if the trigger lacks text content.
