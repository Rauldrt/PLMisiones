## 2024-05-17 - Redundant ARIA attributes on Radix UI triggers
**Learning:** Found an icon-only button without an accessible name that's used as a `SheetTrigger` in `src/components/AdminSidebar.tsx`. However, looking closer, Radix UI `SheetTrigger` adds `aria-controls` and `aria-expanded` automatically. While it needs an accessible name (added via `span.sr-only`), I shouldn't add custom `aria-label` or `aria-controls` to the trigger element itself if it conflicts with Radix UI's built-in management or overrides internal text.
**Action:** Always prefer `span.sr-only` inside the button for accessible names on Radix UI triggers to avoid conflict, and never manually add `aria-expanded` or `aria-controls` to them.

## 2024-05-17 - Redundant ARIA attributes on PopoverTrigger
**Learning:** Found an icon-only button used as a `PopoverTrigger` in `src/components/Header.tsx`. Radix UI `PopoverTrigger` already manages `aria-expanded` and `aria-controls`. Manually adding these attributes to the trigger element causes redundancy or conflicts. Also, screen readers read the accessible name differently depending on where `aria-expanded` is placed when done manually vs automatically.
**Action:** Do not manually add `aria-expanded` or `aria-controls` to Radix UI trigger elements like `PopoverTrigger`. Rely on the primitive to manage them.

## 2024-05-17 - Avoid Committing Build Artifacts
**Learning:** Found that running commands like `pnpm build` or `pnpm install` can generate build artifacts (e.g., `pnpm-lock.yaml`, `public/sw.js`, `public/workbox-*.js`) that pollute the repository. I should be careful to only stage and commit the source code files I intentionally modified.
**Action:** Always verify `git status` and specifically only stage the intended changed source files before submitting.

## 2024-05-17 - Custom State and ARIA expanded
**Learning:** While Radix UI `PopoverTrigger` manages `aria-expanded` internally, if the component relies on an external, controlled React state (like `isMobileMenuOpen`) and visually changes its internal icons based on that state, the custom state variable's `aria-expanded` shouldn't be blindly removed without fully verifying it's actually completely redundant or ensuring that the trigger element retains a proper accessible name (e.g. `aria-label` or `.sr-only`). The button in `Header.tsx` did not have an `aria-label` and relied on a visual icon change.
**Action:** Do not remove `aria-expanded` from trigger elements that rely on external state variables to manage visual icons without verifying. Always ensure icon-only buttons have an `aria-label` or `.sr-only` text.

## 2024-05-17 - Context in "Read more" links
**Learning:** Generic links like "Leer más" (Read more) lack context for screen reader users when navigated out of flow.
**Action:** Always include a visually hidden description using `<span className="sr-only">` within the link to provide context based on the content it leads to (e.g., "Leer más sobre [Título del Artículo]").
