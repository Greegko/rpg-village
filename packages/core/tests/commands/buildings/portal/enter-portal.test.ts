import { PortalCommand } from "@features/buildings/portal";
import { MapLocationType } from "@features/map";

import { createState, test } from "../../../utils";

test("should party jump to location", {
  initState: createState(({ village, party, location }) => [
    location({ type: MapLocationType.Portal, id: "new-location-id" }),
    location({
      id: village({
        locationId: "village-location-id",
        buildings: { portalSummoningStone: { portals: [{ id: "portal-id", connectedLocationId: "new-location-id" }] } },
      }),
      partyIds: [party({ id: "party-id" })],
    }),
  ]),
  commands: [
    {
      command: PortalCommand.EnterPortal,
      args: { partyId: "party-id", portalId: "portal-id" },
    },
  ],
  expectedState: { mapLocations: { "new-location-id": { partyIds: ["party-id"] } } },
});
