import { MapLocationType } from "@features/map";
import { PortalCommand } from "@modules/village";

import { createState, test } from "../../../utils";

test("should party jump to location", {
  initState: createState(({ village, party, location }) => [
    location({ type: MapLocationType.Portal, id: "portal-id" }),
    location({
      id: village(),
      partyIds: [party({ id: "party-id" })],
    }),
  ]),
  commands: [
    {
      command: PortalCommand.EnterPortal,
      args: { partyId: "party-id", portalLocationId: "portal-id" },
    },
  ],
  expectedState: { mapLocations: { "portal-id": { partyIds: ["party-id"] } } },
});
