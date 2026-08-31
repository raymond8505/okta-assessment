/**
 * Fisher–Yates shuffle a copy of the array, returns the first min(count, pool.length)
 */
export function shuffle<T>(
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
