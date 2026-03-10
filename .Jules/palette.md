## 2024-05-15 - Icon Buttons Missing ARIA Labels
**Learning:** Widespread pattern across the admin components where `<Button size="icon">` components using Lucide icons lacked `aria-label`s. This causes severe accessibility issues as screen readers announce these buttons as empty or just read the HTML.
**Action:** Adding a mass script to inject relevant `aria-label`s to all icon-only buttons to ensure they have accessible names. Always ensure `aria-label` is included when rendering icon-only `<Button>` components.
