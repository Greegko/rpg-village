import { test, createState } from "../../../utils";
import { MapLocationType, PortalsCommand } from "../../../../public-api";

test("should party jump to location", {
  initState: createState(({ village, party, location }) => [
    location({ type: MapLocationType.Portal, id: "portal-id" }),
    party({
      id: "party-id",
      locationId: village(),
    }),
  ]),
  commands: [
    {
      command: PortalsCommand.EnterPortal,
      args: { partyId: "party-id", portalLocationId: "portal-id" },
    },
  ],
  expectedState: { parties: { "party-id": { locationId: "portal-id" } } },
});
