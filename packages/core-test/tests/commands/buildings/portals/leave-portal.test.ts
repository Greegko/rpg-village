import { MapLocationType, PortalActivity, PortalCommand } from "@rpg-village/core";

import { createState, test } from "../../../utils";

test("should party jump to village", {
  initState: createState(({ village, party, location, map }) => [
    map({ id: "map-id", mapLocationIds: ["portal-id"] }),
    village({ locationId: "village-location" }),
    party({
      id: "party-id",
      locationId: location({ type: MapLocationType.Portal, id: "portal-id" }),
    }),
  ]),
  commands: [
    {
      command: PortalCommand.LeavePortal,
      args: { partyId: "party-id", portalLocationId: "portal-id" },
    },
  ],
  expectedState: { parties: { "party-id": { locationId: "village-location" } } },
});

test("should remove map when the map is finished and party leaves", {
  initState: createState(({ village, party, location, map }) => [
    map({
      id: "portal-map-id",
      mapLocationIds: [location({ type: MapLocationType.Portal, id: "portal-location-id" })],
      mapSize: 1,
    }),
    village({ locationId: "village-location" }),
    party({
      id: "party-id",
      locationId: "portal-location-id",
    }),
  ]),
  commands: [
    {
      command: PortalCommand.LeavePortal,
      args: { partyId: "party-id", portalLocationId: "portal-location-id" },
    },
  ],
  expectedState: (state, t) => t.is(state.maps["portal-map-id"], undefined),
});

test("should start gather portal resource activity when the map is finished and party leaves", {
  initState: createState(({ village, party, location, map }) => [
    map({
      id: "portal-map-id",
      mapLocationIds: [location({ type: MapLocationType.Portal, id: "portal-location-id" })],
      mapSize: 1,
    }),
    village({ locationId: "village-location" }),
    party({
      id: "party-id",
      locationId: "portal-location-id",
    }),
  ]),
  commands: [
    {
      command: PortalCommand.LeavePortal,
      args: { partyId: "party-id", portalLocationId: "portal-location-id" },
    },
  ],
  expectedState: (state, t) => t.withRandomId(state.activities, { name: PortalActivity.GatherResourceFromPortal }),
});
