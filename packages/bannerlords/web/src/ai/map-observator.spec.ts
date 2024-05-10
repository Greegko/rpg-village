import { expect, test } from "../test";
import { MapObservator, MapOpservatorEvent } from "./map-observator";

test("emit enter event on entity add", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.on("1", MapOpservatorEvent.EnterSight, target => events.push(["1", target]));
  mapObservator.on("2", MapOpservatorEvent.EnterSight, target => events.push(["2", target]));

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 0, y: 0 }, 5);

  expect(events.length).toBe(2);
});

test("should not emit enter again on move", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 0, y: 0 }, 5);

  mapObservator.on("1", MapOpservatorEvent.EnterSight, target => events.push(["1", target]));

  mapObservator.updateEntity("2", { x: 0, y: 0 });

  expect(events.length).toBe(0);
});

test("should emit exit event on leave", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 0, y: 0 }, 5);

  mapObservator.on("1", MapOpservatorEvent.ExitSight, target => events.push(["1", target]));

  mapObservator.updateEntity("2", { x: 6, y: 0 });

  expect(events).toEqual([["1", "2"]]);
});

test("should not emit exit event after left and move", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 0, y: 0 }, 5);

  mapObservator.on("1", MapOpservatorEvent.ExitSight, target => events.push(["1", target]));

  expect(events.length).toBe(0);

  mapObservator.updateEntity("2", { x: 6, y: 0 });

  expect(events.length).toBe(1);

  mapObservator.updateEntity("2", { x: 7, y: 0 });

  expect(events.length).toBe(1);
});

test("should emit exit event after shrink sight", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 5, y: 0 }, 0);

  mapObservator.on("1", MapOpservatorEvent.ExitSight, target => events.push(["1", target]));

  expect(events.length).toBe(0);

  mapObservator.updateEntity("1", { x: 0, y: 0 }, 3);

  expect(events).toEqual([["1", "2"]]);
});

test("should emit enter event after increase sight", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 3);
  mapObservator.addEntity("2", { x: 5, y: 0 }, 0);

  mapObservator.on("1", MapOpservatorEvent.EnterSight, target => events.push(["1", target]));

  expect(events.length).toBe(0);

  mapObservator.updateEntity("1", { x: 0, y: 0 }, 5);

  expect(events).toEqual([["1", "2"]]);
});

test("should not emit exit event when an entity is removed", () => {
  const mapObservator = new MapObservator();
  const events: [string, string][] = [];

  mapObservator.addEntity("1", { x: 0, y: 0 }, 5);
  mapObservator.addEntity("2", { x: 5, y: 0 }, 0);

  mapObservator.on("1", MapOpservatorEvent.ExitSight, target => events.push(["1", target]));

  mapObservator.removeEntity("2");

  expect(events.length).toBe(0);
});
