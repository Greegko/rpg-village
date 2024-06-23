import { expect, test } from "../utils";
import { MapObservator, MapObservatorEvent, MapObservatorEventType } from "./map-observator";

test("should emit enter event on entity move first time", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 1).subscribe(event => events.push(event));

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  expect(events).toEqual([{ entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter }]);
});

test("should emit enter event on observation start when in the range", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 1).subscribe(event => events.push(event));

  expect(events).toEqual([{ entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter }]);
});

test("should emit move on visible target", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 2).subscribe(event => events.push(event));

  mapObservator.moveEntity("1", { x: 0, y: 1 });

  expect(events).toEqual([
    { entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter },
    { entityId: "1", position: { x: 0, y: 1 }, eventType: MapObservatorEventType.Move },
  ]);
});

test("should emit exit event on leave", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 2).subscribe(event => events.push(event));

  mapObservator.moveEntity("1", { x: 0, y: 3 });

  expect(events).toEqual([
    { entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter },
    { entityId: "1", position: { x: 0, y: 3 }, eventType: MapObservatorEventType.Exit },
  ]);
});

test("should not emit exit event after left and move", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 2).subscribe(event => events.push(event));

  mapObservator.moveEntity("1", { x: 0, y: 3 });
  mapObservator.moveEntity("1", { x: 0, y: 4 });

  expect(events).toEqual([
    { entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter },
    { entityId: "1", position: { x: 0, y: 3 }, eventType: MapObservatorEventType.Exit },
  ]);
});

test("should emit exit event when an entity is removed", () => {
  const mapObservator = new MapObservator();
  const events: MapObservatorEvent[] = [];

  mapObservator.moveEntity("1", { x: 0, y: 0 });

  mapObservator.onEventByPosition({ x: 0, y: 0 }, 2).subscribe(event => events.push(event));

  mapObservator.moveEntity("1", null);

  expect(events).toEqual([
    { entityId: "1", position: { x: 0, y: 0 }, eventType: MapObservatorEventType.Enter },
    { entityId: "1", position: null, eventType: MapObservatorEventType.Exit },
  ]);
});
