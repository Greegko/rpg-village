import { describe, expect, it } from "vitest";

import { pairwiseDeepDiff } from "./pairwise-deep-diff";

describe("pairwiseDeepDiff", () => {
  it("should return the initial object on the first call", () => {
    const diffTracker = pairwiseDeepDiff<{ name: string; age: number }>();
    const result = diffTracker({ name: "Alice", age: 25 });

    expect(result).toEqual({ name: "Alice", age: 25 });
  });

  it("should return full diff on second call", () => {
    const diffTracker = pairwiseDeepDiff<{ name: string; age: number }>();

    diffTracker({ name: "Alice", age: 25 });
    const result = diffTracker({ name: "Alice", age: 26 });

    expect(result).toEqual({ age: 26 });
  });

  it("should return only changed values on subsequent calls", () => {
    const diffTracker = pairwiseDeepDiff<{ name: string; age: number }>();

    diffTracker({ name: "Alice", age: 25 });
    diffTracker({ name: "Alice", age: 26 });
    const result = diffTracker({ name: "Bob", age: 26 });

    expect(result).toEqual({ name: "Bob" });
  });

  it("should work with nested objects", () => {
    const diffTracker = pairwiseDeepDiff<{ user: { name: string; age: number } }>();

    diffTracker({ user: { name: "Alice", age: 25 } });
    const result = diffTracker({ user: { name: "Alice", age: 26 } });

    expect(result).toEqual({ user: { age: 26 } });
  });

  it("should return null if there are no changes", () => {
    const diffTracker = pairwiseDeepDiff<{ name: string; age: number }>();

    diffTracker({ name: "Alice", age: 25 });
    const result = diffTracker({ name: "Alice", age: 25 });

    expect(result).toEqual({});
  });

  it("should detect removed properties", () => {
    const diffTracker = pairwiseDeepDiff<{ name?: string; age?: number }>();

    diffTracker({ name: "Alice", age: 25 });
    const result = diffTracker({ age: 25 });

    expect(result).toEqual({ name: null });
  });

  it("should detect changes in arrays", () => {
    const diffTracker = pairwiseDeepDiff<{ hobbies: string[] }>();

    diffTracker({ hobbies: ["reading", "swimming"] });
    const result = diffTracker({ hobbies: ["reading", "swimming", "cycling"] });

    expect(result).toEqual({ hobbies: ["reading", "swimming", "cycling"] });
  });

  it("should handle objects with multiple changes", () => {
    const diffTracker = pairwiseDeepDiff<{ name: string; age: number; city?: string }>();

    diffTracker({ name: "Alice", age: 25, city: "New York" });
    const result = diffTracker({ name: "Bob", age: 30 });

    expect(result).toEqual({ name: "Bob", age: 30, city: null });
  });
});
