import { performance } from 'perf_hooks';

// Mock revalidatePath
let callCount = 0;
function revalidatePath(path: string) {
    callCount++;
}

interface PageHeader {
    path: string;
}

// Generate 100,000 items with 4 unique paths
const paths = ['/noticias', '/referentes', '/afiliacion', '/fiscales'];
const items: PageHeader[] = Array.from({ length: 100000 }, (_, i) => ({
    path: paths[i % paths.length]
}));

// Baseline (O(n))
callCount = 0;
const startBaseline = performance.now();
items.forEach(item => revalidatePath(item.path));
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;
const baselineCalls = callCount;

// Optimized (O(1) relative to N for the revalidation calls)
callCount = 0;
const startOptimized = performance.now();
const uniquePaths = new Set(items.map(item => item.path));
uniquePaths.forEach(path => revalidatePath(path));
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;
const optimizedCalls = callCount;

console.log(`Baseline Time: ${baselineTime.toFixed(2)}ms (Calls: ${baselineCalls})`);
console.log(`Optimized Time: ${optimizedTime.toFixed(2)}ms (Calls: ${optimizedCalls})`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}%`);
