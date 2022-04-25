import { test, createState } from "../../../utils";
import { MapLocationType, PortalsCommand } from "../../../../public-api";

test("should party jump to village", {
  initState: createState(({ village, party, location }) => [
    village({ locationId: "village-location" }),
    party({
      id: "party-id",
      locationId: location({ type: MapLocationType.Portal, id: "portal-id" }),
    }),
  ]),
  commands: [
    {
      command: PortalsCommand.LeavePortal,
      args: { partyId: "party-id", portalLocationId: "portal-id" },
    },
  ],
  expectedState: { parties: { "party-id": { locationId: "village-location" } } },
});
