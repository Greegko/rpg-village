import { PartyEvent } from "@rpg-village/core/features/party";

import { createState, test } from "../../utils";

test("should cancel active activity", {
  initState: createState(({ party, activity }) => [
    activity({ id: "random-activity-id", startArgs: { partyId: party({ id: "party-id" }) } }),
  ]),
  event: { event: PartyEvent.Disband, args: { partyId: "party-id" } },
  expectedState: (t, x) => x.undefined(t.activities["random-activity-id"]),
});
