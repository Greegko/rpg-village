import { head, without } from "rambda";

import { MapCommand } from "@rpg-village/village-manager/features/map";

import { createState, test } from "../../../tests/utils";

test("should split a party into two group", {
  initState: createState(({ party, location }) => [
    location({ id: "location-id", partyIds: ["party-id"] }),
    party({ id: "party-id", unitIds: ["a", "b"] }),
  ]),
  commands: [{ command: MapCommand.SplitParty, args: { partyId: "party-id", unitIds: ["b"] } }],
  expectedState: (t, x) => {
    const partyIds = t.mapLocations["location-id"].partyIds;
    x.true(partyIds.includes("party-id"));
    x.length(partyIds, 2);
  },
});

test("should move the selected unit ids to a new group", {
  initState: createState(({ party, location }) => [
    location({ id: "location-id", partyIds: ["party-id"] }),
    party({ id: "party-id", unitIds: ["a", "b"] }),
  ]),
  commands: [{ command: MapCommand.SplitParty, args: { partyId: "party-id", unitIds: ["b"] } }],
  expectedState: (t, x) => {
    const newPartyId = head(without(["party-id"], t.mapLocations["location-id"].partyIds));

    x.false(t.parties["party-id"].unitIds.includes("b"));
    x.true(t.parties[newPartyId].unitIds.includes("b"));
  },
});
