
## 2026-05-18 - Interactive Div Accessibility
**Learning:** Interactive custom components built with `div` or `span` elements using `onClick` handlers completely lose native keyboard support and focus states.
**Action:** Always manually apply `role="button"`, `tabIndex={0}`, an `onKeyDown` handler that supports 'Enter' and ' ' (Space, preventing default scroll), and appropriate Tailwind `focus-visible` utility classes to ensure full keyboard navigation.
