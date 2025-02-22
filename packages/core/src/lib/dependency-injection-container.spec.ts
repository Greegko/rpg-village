import { describe, expect, it } from "vitest";

import { createContainer } from "./dependency-injection-container";

describe("Dependency Injection", () => {
  it("should make classes injectable", () => {
    const container = createContainer();

    class A {
      val = 5;
    }

    container.makeInjectable(A);

    expect(container.inject(A).val).toBe(5);
  });

  it("should only create class when injected", () => {
    const container = createContainer();

    let invoked = 0;

    class A {
      constructor() {
        invoked++;
      }

      val = 5;
    }

    container.makeInjectable(A);

    expect(invoked).toBe(0);

    expect(container.inject(A).val).toBe(5);

    expect(invoked).toBe(1);
  });

  it("should override the original target", () => {
    const container = createContainer();

    class A {
      val = 5;
    }

    class B {
      val = 6;
    }

    container.makeInjectable(A, B);

    expect(container.inject(A).val).toBe(6);
  });

  it("should have strong typings for non class tokens", () => {
    const container = createContainer();

    type Config = { id: string };

    const token = container.createInjectableToken<Config>("config");

    container.makeInjectable(token, { id: "test" });

    expect(container.inject(token).id).toBe("test");
  });

  it("should regiter injectable classes", () => {
    const container = createContainer();

    @container.injectable()
    class A {
      val = 5;
    }

    expect(container.inject(A).val).toBe(5);
  });

  it("should allow injections in class properties", () => {
    const container = createContainer();

    @container.injectable()
    class A {
      val = 5;
    }

    @container.injectable()
    class B {
      a = container.inject(A);
    }

    expect(container.inject(B).a.val).toBe(5);
  });

  it("should return the old instance", () => {
    const container = createContainer();

    let called = 5;

    @container.injectable()
    class A {
      val = called++;
    }

    expect(container.inject(A).val).toBe(5);
    expect(container.inject(A).val).toBe(5);
  });

  it("should handle multiple injections", () => {
    const container = createContainer();

    const token = container.createInjectableToken<number>("numbers");

    container.makeInjectable(token, 1, { multi: true });
    container.makeInjectable(token, 2, { multi: true });

    expect(container.inject(token, { multi: true })).toEqual([1, 2]);
  });

  it("should allow callback type", () => {
    const container = createContainer();

    const token = container.createInjectableToken<number>("numbers");

    container.makeInjectable(token, () => 1);

    expect(container.inject(token)).toEqual(1);
  });

  it("should allow to name instances", () => {
    const container = createContainer();

    const token = container.createInjectableToken<number>("numbers");

    container.makeInjectable(token, 1, { name: "first" });
    container.makeInjectable(token, 2, { name: "second" });
    container.makeInjectable(token, 3, { name: "third" });

    expect(container.inject(token, { name: "second" })).toEqual(2);
  });
});
