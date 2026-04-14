## 2024-05-14 - Throttled Scroll Event Listeners for Performance
**Learning:** Directly setting React state inside scroll event listeners without throttling blocks the main thread, leading to noticeable jank during scroll. Next.js/React applications require scroll events to be throttled to the display refresh rate to maintain performance.
**Action:** Always use `requestAnimationFrame` with a boolean tracking flag (e.g., `ticking`) to throttle scroll event handlers, and always pass `{ passive: true }` to the event listener configuration so the browser knows the scroll won't be prevented.

## 2026-03-17 - Cancel `requestAnimationFrame` on Component Unmount
**Learning:** Even when `requestAnimationFrame` is properly used inside `useEffect` for things like scroll listeners, failing to store the animation frame ID and cancelling it with `cancelAnimationFrame` in the cleanup function can lead to memory leaks and errors when the state update fires on an unmounted component.
**Action:** When using `requestAnimationFrame` inside a React `useEffect` for throttling high-frequency events, always store the returned ID and include `window.cancelAnimationFrame(id)` in the returned cleanup function.

## 2024-05-24 - Batch Cache Invalidation with `revalidatePath`
**Learning:** Calling `revalidatePath` inside a loop for individual items (like news articles) creates an O(N) performance bottleneck during cache invalidation, which scales poorly as the number of items grows.
**Action:** Instead of looping over items and calling `revalidatePath` individually, use `revalidatePath(path, 'layout')` to batch-invalidate a path and all its subpaths in a single O(1) operation.

## 2024-11-20 - Use useRef for scroll-based animations (parallax)
**Learning:** Using `useState` inside a `requestAnimationFrame` loop attached to a `scroll` event listener causes continuous React re-renders and layout thrashing. Even though the frame loop throttles the state updates, the component and all its children still re-render on every frame where scrolling occurs, creating significant main thread blocking and jank.
**Action:** When implementing scroll-based parallax or animations, store the DOM elements in a `useRef` and directly manipulate their `style.transform` properties inside the `requestAnimationFrame` callback. This completely bypasses the React render cycle, resulting in significantly smoother 60FPS scroll performance with less memory allocation. Ensure you still capture the animation frame ID and `cancelAnimationFrame` in the cleanup function.

## 2026-04-14 - Deduplicating paths before batch cache invalidation
**Learning:** The previous optimization recommended using `revalidatePath(path, 'layout')` to avoid loops. However, some functions like `savePageHeaders` receive a list of arbitrary, potentially unrelated paths, making a single layout invalidation impossible. A naive loop like `items.forEach(item => revalidatePath(item.path))` creates an O(N) bottleneck, especially when the input array contains duplicate paths for the same page.
**Action:** When dealing with an array of arbitrary paths for invalidation, always deduplicate the paths first using a Set (e.g., `Array.from(new Set(paths)).forEach(...)`) before calling `revalidatePath` to minimize unnecessary cache purges.
