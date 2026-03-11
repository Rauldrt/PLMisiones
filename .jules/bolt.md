## 2024-05-24 - Optimization: Concurrent File I/O with Promise.all in Gallery Action
**Issue:** `uploadPublicFilesAction` in `src/actions/gallery.ts` processed file uploads sequentially inside a `for...of` loop with an `await` on each `fs.writeFile`.
**Optimization:** Replaced the sequential `for` loop with `await Promise.all(files.map(async (file) => { ... }))`.
**Learning:** For independent I/O operations (like writing multiple files), `Promise.all` allows them to execute concurrently. Sequential `await` calls in a loop cause blocking, slowing down the overall upload process linearly with the number of files. Concurrency significantly reduces total execution time.
