import { describe, expect, it } from "vitest";
import { sample } from "./sample";

describe("sample", () => {
  it("returns `count` distinct items drawn from the source", () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const picked = sample(items, 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    for (const item of picked) {
      expect(items).toContain(item);
    }
  });

  it("is deterministic for a fixed RNG sequence", () => {
    const values = [0.99, 0.99, 0.99];
    const rng = () => values.shift() ?? 0;
    // i=0 swaps in "e", i=1 swaps in the displaced "a", i=2 the displaced "b".
    expect(sample(["a", "b", "c", "d", "e"], 3, rng)).toEqual(["e", "a", "b"]);
  });

  it("does not mutate the source array", () => {
    const items = [1, 2, 3, 4, 5];
    sample(items, 3, () => 0.99);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns a full permutation when count meets or exceeds the length", () => {
    const items = [1, 2, 3];
    expect([...sample(items, 3, () => 0.5)].sort()).toEqual(items);
    expect([...sample(items, 99, () => 0.5)].sort()).toEqual(items);
  });

  it("returns an empty array for zero or negative counts", () => {
    expect(sample([1, 2, 3], 0)).toEqual([]);
    expect(sample([1, 2, 3], -1)).toEqual([]);
  });
});
