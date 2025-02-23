import { expect } from "vitest";

import { EffectType, MiscEffectType } from "@/features/effect";
import { MapEvent } from "@/features/map";

import { createState, test } from "@test/utils";

test("should apply map difficulty to new enemies", {
  event: { event: MapEvent.NewLocation, args: { locationId: "location-id", mapId: "map-id" } },
  initState: createState(({ location, map }) => [
    map({
      id: "map-id",
      difficulty: 10,
      mapLocationIds: [location({ id: "location-id" })],
    }),
  ]),
  expectedState: state => expect(state.units).withRandomId({ hp: 30 }),
});

test("should apply misc map modifiers to new units", {
  event: { event: MapEvent.NewLocation, args: { locationId: "location-id", mapId: "map-id" } },
  initState: createState(({ location, map }) => [
    map({
      id: "map-id",
      difficulty: 1,
      mapLocationIds: [location({ id: "location-id" })],
      modifiers: [{ effectType: MiscEffectType.Hp, type: EffectType.Static, value: 100 }],
    }),
  ]),
  expectedState: state => expect(state.units).withRandomId({ hp: 112 }),
});
