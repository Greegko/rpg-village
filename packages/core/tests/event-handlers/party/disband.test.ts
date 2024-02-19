import { PartyEvent } from "@features";

import { createState, test } from "../../utils";

test("should cancel active activity", {
  initState: createState(({ party, activity }) => [
    activity({ id: "random-activity-id", startArgs: { partyId: party({ id: "party-id" }) } }),
  ]),
  event: { event: PartyEvent.Disband, args: { partyId: "party-id" } },
  expectedState: (t, x) => x.is(t.activities["random-activity-id"], undefined),
});
