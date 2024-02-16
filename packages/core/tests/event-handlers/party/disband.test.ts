import { ActivityType, PartyEvent } from "@features";

import { createState, test } from "../../utils";

test("should cancel active activity", {
  initState: createState(({ party, activity }) => [
    party({ id: "party-id", activityId: activity({ id: "random-activity-id", type: ActivityType.Party }) }),
  ]),
  event: { event: PartyEvent.Disband, args: { partyId: "party-id" } },
  expectedState: (t, x) => x.is(t.activities["random-activity-id"], undefined),
});
