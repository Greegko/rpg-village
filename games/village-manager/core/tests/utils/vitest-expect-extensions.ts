import { expect } from "vitest";

expect.extend({
  objectHaveElements(received: object, expected: number) {
    const { isNot } = this;

    const objectElements = Object.keys(received).length;

    return {
      pass: objectElements === expected,
      message: () => `Object has${isNot ? " not" : ""} ${objectElements} elements instead of ${expected}`,
    };
  },
  withRandomId(received, expected) {
    const { isNot } = this;

    const keys = Object.keys(received);

    expect(received).objectHaveElements(1);

    const randomID = keys[0];
    expect(received[randomID]).toMatchObject(expected);

    return {
      pass: true,
      message: () => `${received} has ${isNot ? " not" : ""} other elements`,
    };
  },
});
