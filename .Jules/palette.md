## 2024-05-24 - Completing complex interactive triggers

**Learning:** Buttons with complex inner structures (like notification bubbles with icons, pings, and dynamic text or proposal banners with glow effects) often lack explicit semantic meaning for screen readers and can be difficult to perceive when using keyboard navigation.
**Action:** Always ensure that any `<button>` serving as a trigger, especially those using `asChild` in Radix UI or similar component libraries, explicitly receives an `aria-label` describing its action and standard `focus-visible` utility classes for clear visual indication during keyboard navigation.
