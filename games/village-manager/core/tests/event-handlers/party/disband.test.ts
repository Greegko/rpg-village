import { PartyEvent } from "@/features/party";
import { createState, test } from "@test/utils";
import { expect } from "vitest";

test("should cancel active activity", {
  initState: createState(({ party, activity }) => [
    activity({ id: "random-activity-id", startArgs: { partyId: party({ id: "party-id" }) } }),
  ]),
  event: { event: PartyEvent.Disband, args: { partyId: "party-id" } },
  expectedState: state => expect(state.activities["random-activity-id"]).toBeUndefined(),
});
