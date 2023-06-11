import { MapLocationType } from "@features/map";
import { PortalActivity, PortalCommand } from "@features/village-buildings";

import { createState, test } from "../../../utils";

test("should party jump to village", {
  initState: createState(({ village, party, location, map }) => [
    map({ id: "map-id", mapLocationIds: ["portal-id"] }),
    village({ locationId: "village-location" }),
    location({
      id: "portal-id",
      type: MapLocationType.Portal,
      partyIds: [party({ id: "party-id" })],
    }),
  ]),
  commands: [{ command: PortalCommand.LeavePortal, args: { partyId: "party-id", portalLocationId: "portal-id" } }],
  expectedState: { mapLocations: { "village-location": { partyIds: ["party-id"] } } },
});

test("should remove map when the map is finished and party leaves", {
  initState: createState(({ village, party, location, map }) => [
    map({
      id: "portal-map-id",
      mapLocationIds: [
        location({ id: "boss-location-id", partyIds: [], type: MapLocationType.Boss }),
        location({ id: "portal-location-id", partyIds: [party({ id: "party-id" })], type: MapLocationType.Portal }),
      ],
      mapSize: 1,
    }),
    village({ locationId: "village-location" }),
  ]),
  commands: [
    { command: PortalCommand.LeavePortal, args: { partyId: "party-id", portalLocationId: "portal-location-id" } },
  ],
  expectedState: (state, t) => t.is(state.maps["portal-map-id"], undefined),
});

test("should start gather portal resource activity when the map is finished and party leaves", {
  initState: createState(({ village, party, location, map }) => [
    map({
      id: "portal-map-id",
      mapLocationIds: [
        location({ type: MapLocationType.Portal, id: "portal-location-id", partyIds: [party({ id: "party-id" })] }),
        location({ type: MapLocationType.Boss, id: "boss-location-id", partyIds: [] }),
      ],
      mapSize: 1,
    }),
    village({ locationId: "village-location" }),
  ]),
  commands: [
    { command: PortalCommand.LeavePortal, args: { partyId: "party-id", portalLocationId: "portal-location-id" } },
  ],
  expectedState: (state, t) => t.withRandomId(state.activities, { name: PortalActivity.GatherResourceFromPortal }),
});
