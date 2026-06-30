## 2024-05-24 - Custom Triggers in Radix UI Components
**Learning:** When using custom elements like `<button>` inside Radix UI triggers (e.g., `PopoverTrigger`, `DialogTrigger`) with `asChild`, default keyboard focus styles are lost. Also, they must explicitly have `type="button"` and `aria-label` for full accessibility.
**Action:** Manually apply Tailwind CSS focus utilities (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`) and semantic attributes to custom trigger elements.
