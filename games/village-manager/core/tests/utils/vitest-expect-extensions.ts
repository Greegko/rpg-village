import { expect } from "vitest";

expect.extend({
  objectHaveKeys(received: object, expected: number) {
    const { isNot } = this;

    return {
      pass: Object.keys(received).length === expected,
      message: () => `${received} does${isNot ? " not" : ""} have ${expected} keys`,
    };
  },
  withRandomId(received, expected) {
    const { isNot } = this;

    const keys = Object.keys(received);

    expect(received).objectHaveKeys(1);

    const randomID = keys[0];
    expect(received[randomID]).toMatchObject(expected);

    return {
      pass: true,
      message: () => `${received} has ${isNot ? " not" : ""} other elements`,
    };
  },
});
