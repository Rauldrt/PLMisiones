## 2024-05-14 - Throttled Scroll Event Listeners for Performance
**Learning:** Directly setting React state inside scroll event listeners without throttling blocks the main thread, leading to noticeable jank during scroll. Next.js/React applications require scroll events to be throttled to the display refresh rate to maintain performance.
**Action:** Always use `requestAnimationFrame` with a boolean tracking flag (e.g., `ticking`) to throttle scroll event handlers, and always pass `{ passive: true }` to the event listener configuration so the browser knows the scroll won't be prevented.

## 2026-03-17 - Cancel `requestAnimationFrame` on Component Unmount
**Learning:** Even when `requestAnimationFrame` is properly used inside `useEffect` for things like scroll listeners, failing to store the animation frame ID and cancelling it with `cancelAnimationFrame` in the cleanup function can lead to memory leaks and errors when the state update fires on an unmounted component.
**Action:** When using `requestAnimationFrame` inside a React `useEffect` for throttling high-frequency events, always store the returned ID and include `window.cancelAnimationFrame(id)` in the returned cleanup function.

## 2024-05-18 - Batch Invalidation of Next.js Cache
**Learning:** Calling `revalidatePath` inside a `.forEach` loop over an array of items (like article slugs or dynamic paths) is extremely inefficient for cache invalidation. Next.js has to individually look up and clear each path, which blocks the execution of the Server Action, causing performance issues.
**Action:** Use `revalidatePath(path, 'layout')` to batch-invalidate a path and all of its subpaths in a single operation. For example, instead of iterating over every article slug to invalidate `/noticias/${slug}`, a single call to `revalidatePath('/noticias', 'layout')` handles all news pages much more efficiently.
