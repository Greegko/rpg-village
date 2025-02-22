import { expect } from "vitest";

import { MapActivity, MapCommand } from "@/features/map";

import { createState, test } from "@test/utils";

test("should start Travel activity", {
  initState: createState(({ location, party }) => [
    location({ partyIds: [party({ id: "party" })] }),
    location({ id: "next-tile", x: 0, y: 1 }),
  ]),
  commands: [{ command: MapCommand.Travel, args: { targetLocationId: "next-tile", partyId: "party" } }],
  expectedState: state =>
    expect(state.activities).withRandomId({
      name: MapActivity.Travel,
      targetId: "party",
      state: { targetLocationId: "next-tile" },
    }),
});

test("should not start Travel activity to same location", {
  initState: createState(({ location, party }) => [location({ id: "random-location", partyIds: [party({ id: "party" })] })]),
  commands: [{ command: MapCommand.Travel, args: { targetLocationId: "random-location", partyId: "party" } }],
  expectedState: state => expect(state.activities).toEqual({}),
});
