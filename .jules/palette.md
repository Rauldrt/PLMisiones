## 2026-06-17 - Keyboard Accessibility in Radix Triggers
**Learning:** Custom non-component `<button>` elements passed to Radix UI triggers via `asChild` lose native keyboard focus styles and accessible names unless explicitly added, impairing keyboard navigation for users.
**Action:** Always provide explicit `focus-visible:` Tailwind utilities and `aria-label` attributes to custom elements acting as `asChild` triggers for Radix UI components.
