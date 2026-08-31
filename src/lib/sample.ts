/**
 * Picks `count` distinct items uniformly at random, in random order.
 *
 * @remarks
 * Runs the first `count` steps of a Fisher–Yates shuffle on a copy, so the
 * source array is never mutated. A `count` at or above `items.length` returns
 * a full permutation; zero or negative returns an empty array.
 *
 * @param random - `Math.random`-compatible (float in [0, 1)); injectable so
 *   callers can make selection deterministic in tests
 */
export function sample<T>(
  items: readonly T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  const pool = [...items];
  const picks = Math.max(0, Math.min(count, pool.length));
  for (let i = 0; i < picks; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, picks);
}
