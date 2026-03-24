## 2024-05-14 - Throttled Scroll Event Listeners for Performance
**Learning:** Directly setting React state inside scroll event listeners without throttling blocks the main thread, leading to noticeable jank during scroll. Next.js/React applications require scroll events to be throttled to the display refresh rate to maintain performance.
**Action:** Always use `requestAnimationFrame` with a boolean tracking flag (e.g., `ticking`) to throttle scroll event handlers, and always pass `{ passive: true }` to the event listener configuration so the browser knows the scroll won't be prevented.

## 2026-03-17 - Cancel `requestAnimationFrame` on Component Unmount
**Learning:** Even when `requestAnimationFrame` is properly used inside `useEffect` for things like scroll listeners, failing to store the animation frame ID and cancelling it with `cancelAnimationFrame` in the cleanup function can lead to memory leaks and errors when the state update fires on an unmounted component.
**Action:** When using `requestAnimationFrame` inside a React `useEffect` for throttling high-frequency events, always store the returned ID and include `window.cancelAnimationFrame(id)` in the returned cleanup function.

## 2024-05-24 - Batch Cache Invalidation with `revalidatePath`
**Learning:** Calling `revalidatePath` inside a loop for individual items (like news articles) creates an O(N) performance bottleneck during cache invalidation, which scales poorly as the number of items grows.
**Action:** Instead of looping over items and calling `revalidatePath` individually, use `revalidatePath(path, 'layout')` to batch-invalidate a path and all its subpaths in a single O(1) operation.

## 2024-05-18 - Scroll-Linked Animations Re-renders
**Learning:** Using `useState` to track window scroll position for parallax backgrounds causes continuous React re-renders, creating severe main thread blocking and layout thrashing.
**Action:** When implementing scroll-based animations, use `useRef` to store DOM elements and update their `style.transform` directly inside a `requestAnimationFrame` loop, bypassing the React render cycle completely.
