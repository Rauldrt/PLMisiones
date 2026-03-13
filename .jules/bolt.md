## 2024-03-13 - Throttle Scroll Event Listeners
**Learning:** In this codebase, scroll event listeners in React components can cause synchronous state updates that block the main thread and lead to performance degradation if not throttled.
**Action:** Use `requestAnimationFrame` with a `ticking` flag and `{ passive: true }` on `addEventListener` calls to throttle scroll events and prevent unnecessary blocking of the main thread.
