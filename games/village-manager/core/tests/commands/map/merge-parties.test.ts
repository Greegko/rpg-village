import { MapCommand } from "@rpg-village/village-manager/features/map";

import { createState, test } from "../../../tests/utils";

test("should merge two parties", {
  initState: createState(({ party, location }) => [
    location({ id: "location-id", partyIds: ["party-id", "other-party-id"] }),
    party({ id: "party-id", unitIds: ["a"] }),
    party({ id: "other-party-id", unitIds: ["b"] }),
  ]),
  commands: [{ command: MapCommand.MergeParties, args: { partyId: "party-id", otherPartyId: "other-party-id" } }],
  expectedState: { mapLocations: { "location-id": { partyIds: ["party-id"] } } },
});
