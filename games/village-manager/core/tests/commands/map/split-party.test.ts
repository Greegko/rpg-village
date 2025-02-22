import { MapCommand } from "@/features/map";
import { createState, test } from "@test/utils";
import { head, without } from "rambda";

test("should split a party into two group", {
  initState: createState(({ party, location }) => [
    location({ id: "location-id", partyIds: ["party-id"] }),
    party({ id: "party-id", unitIds: ["a", "b"] }),
  ]),
  commands: [{ command: MapCommand.SplitParty, args: { partyId: "party-id", unitIds: ["b"] } }],
  expectedState: state => {
    const partyIds = state.mapLocations["location-id"].partyIds;
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
  expectedState: state => {
    const newPartyId = head(without(["party-id"], state.mapLocations["location-id"].partyIds));

    x.false(state.parties["party-id"].unitIds.includes("b"));
    x.true(state.parties[newPartyId].unitIds.includes("b"));
  },
});
