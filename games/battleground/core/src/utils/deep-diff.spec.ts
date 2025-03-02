import { describe, expect, it } from "vitest";

import { deepDiff } from "./deep-diff";

describe("deepDiff", () => {
  it("should return an empty object if there are no differences", () => {
    const prev = { name: "Alice", age: 25 };
    const current = { name: "Alice", age: 25 };

    expect(deepDiff(prev, current)).toEqual({});
  });

  it("should detect a single value change", () => {
    const prev = { name: "Alice", age: 25 };
    const current = { name: "Alice", age: 26 };

    expect(deepDiff(prev, current)).toEqual({ age: 26 });
  });

  it("should detect multiple changes", () => {
    const prev = { name: "Alice", age: 25, city: "New York" };
    const current = { name: "Bob", age: 30, city: "Los Angeles" };

    expect(deepDiff(prev, current)).toEqual({
      name: "Bob",
      age: 30,
      city: "Los Angeles",
    });
  });

  it("should detect nested object changes", () => {
    const prev = { user: { name: "Alice", age: 25 } };
    const current = { user: { name: "Alice", age: 26 } };

    expect(deepDiff(prev, current)).toEqual({
      user: { age: 26 },
    });
  });

  it("should detect added keys", () => {
    const prev = { name: "Alice" };
    const current = { name: "Alice", age: 25 };

    expect(deepDiff(prev, current)).toEqual({ age: 25 });
  });

  it("should detect removed keys", () => {
    const prev = { name: "Alice", age: 25 };
    const current = { name: "Alice" };

    expect(deepDiff(prev, current)).toEqual({ age: null });
  });

  it("should detect changes in arrays", () => {
    const prev = { hobbies: ["reading", "swimming"] };
    const current = { hobbies: ["reading", "swimming", "cycling"] };

    expect(deepDiff(prev, current)).toEqual({
      hobbies: ["reading", "swimming", "cycling"],
    });
  });

  it("should detect changes in deeply nested objects", () => {
    const prev = {
      user: {
        profile: {
          name: "Alice",
          details: { age: 25, city: "New York" },
        },
      },
    };

    const current = {
      user: {
        profile: {
          name: "Alice",
          details: { age: 26, city: "Los Angeles" },
        },
      },
    };

    expect(deepDiff(prev, current)).toEqual({
      user: {
        profile: {
          details: { age: 26, city: "Los Angeles" },
        },
      },
    });
  });

  it("should return an empty object when both inputs are empty", () => {
    expect(deepDiff({}, {})).toEqual({});
  });

  it("should return all keys if previous object is empty", () => {
    const current = { name: "Alice", age: 25 };

    expect(deepDiff({}, current)).toEqual(current);
  });

  it("should return an empty object if both objects are identical with nested structures", () => {
    const prev = { user: { name: "Alice", address: { city: "NYC" } } };
    const current = { user: { name: "Alice", address: { city: "NYC" } } };

    expect(deepDiff(prev, current)).toEqual({});
  });
});
