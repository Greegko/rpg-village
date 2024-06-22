import { Observable, Subject } from "rxjs";

import { describe, expect, test } from "../../test";
import { createActorFactory } from "./create-actor";

describe("Create Actor", () => {
  test("should execute onEnter callback on new state", () => {
    let value = false;

    const createActor = createActorFactory(() => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => (value = true),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(true);
  });

  test("should switch to new state", () => {
    let value = false;

    const createActor = createActorFactory(({ switchTo }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => switchTo("TestStateChanged"),
        },
        TestStateChanged: {
          onEnter: () => (value = true),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(true);
  });

  test("should switch to new state executed from external", () => {
    let value = false;

    const createActor = createActorFactory(() => ({
      initial: "TestState",
      states: {
        TestState: {},
        TestStateChanged: {
          onEnter: () => (value = true),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    actor.switchTo("TestStateChanged");

    expect(value).toBe(true);
  });

  test("should execute onExit callback on state leave", () => {
    let value = false;

    const createActor = createActorFactory(({ switchTo }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => switchTo("TestStateChanged"),
          onExit: () => (value = true),
        },
        TestStateChanged: {},
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(true);
  });

  test("should listen on events", () => {
    let value = false;

    const createActor = createActorFactory(({ switchTo, emitEvent }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => emitEvent("TestEvent"),
          onEvent: { TestEvent: () => switchTo("TestStateChanged") },
        },
        TestStateChanged: {
          onEnter: () => (value = true),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(true);
  });

  test("should subscribe on eventlistener on event name match", () => {
    let subscribed = false;

    const createActor = createActorFactory(({ switchTo }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEvent: { TestEvent: () => switchTo("TestStateChanged") },
        },
      },
    }));

    const actor = createActor(
      {},
      {},
      {
        TestEvent: () => {
          subscribed = true;
          return new Observable();
        },
      },
      {},
    );

    actor.start();

    expect(subscribed).toBe(true);
  });

  test("should unsubscribe from eventlistener on leave", () => {
    let unsubscribed = false;

    const createActor = createActorFactory(({ switchTo }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => switchTo("TestStateChanged"),
          onEvent: { TestEvent: () => {} },
        },
        TestStateChanged: {},
      },
    }));

    const actor = createActor(
      {},
      {},
      {
        TestEvent: () =>
          ({ subscribe: () => ({ unsubscribe: () => (unsubscribed = true) }) } as unknown as Observable<void>),
      },
      {},
    );

    actor.start();

    expect(unsubscribed).toBe(true);
  });

  test("should execute effect function on event", () => {
    let executedByEvent = false;

    const subject = new Subject();

    const createActor = createActorFactory(() => ({
      initial: "TestState",
      states: {
        TestState: {
          onEvent: { TestEvent: () => (executedByEvent = true) },
        },
      },
    }));

    const actor = createActor(
      {},
      {},
      {
        TestEvent: () => subject as Subject<void>,
      },
      {},
    );

    actor.start();

    subject.next("random-event");

    expect(executedByEvent).toBe(true);
  });

  test("should unsubscribe events on state changes", () => {
    let value = false;

    const createActor = createActorFactory(({ switchTo, emitEvent }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEnter: () => switchTo("TestStateChanged"),
          onEvent: { TestEvent: () => (value = true) },
        },
        TestStateChanged: {
          onEnter: () => emitEvent("TestEvent"),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(false);
  });

  test("should listen on even when on events fired external", () => {
    let value = false;

    const createActor = createActorFactory(({ switchTo }) => ({
      initial: "TestState",
      states: {
        TestState: {
          onEvent: { TestEvent: () => switchTo("TestStateChanged") },
        },
        TestStateChanged: {
          onEnter: () => (value = true),
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    actor.emitEvent("TestEvent");

    expect(value).toBe(true);
  });

  test("should set state recursively in children", () => {
    let value = false;

    const createActor = createActorFactory(() => ({
      initial: "TestState",
      states: {
        TestState: {
          initial: "TestSubState",
          states: {
            TestSubState: {
              onEnter: () => (value = true),
            },
          },
        },
      },
    }));

    const actor = createActor({}, {}, {}, {});

    actor.start();

    expect(value).toBe(true);
  });
});
