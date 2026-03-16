## 2026-03-16 - Throttling Scroll Event Listeners for Parallax
**Learning:** In this codebase, scroll event listeners used for parallax effects (e.g., AnimatedBannerBackground, PageHeader) were updating React state synchronously, which blocks the main thread.
**Action:** Throttle scroll event listeners using `requestAnimationFrame` and a `ticking` flag, and add `{ passive: true }` when attaching the listener to optimize scrolling performance and avoid blocking.
