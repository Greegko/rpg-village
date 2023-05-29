import { ActivityBase, ActivityType } from "@modules/activity";

import { PartyID } from "./party";

export type PartyActivityStartArgs = {
  partyId: PartyID;
  involvedPartyId?: PartyID;
};

export interface PartyActivity<State = unknown, StartingArgs = unknown>
  extends ActivityBase<State, PartyActivityStartArgs & StartingArgs> {
  type: ActivityType.Party;
}

declare module "@modules/activity" {
  enum ActivityType {
    Party = "party",
  }

  interface ActivityValues<State, StartingArgs> {
    PartyActivity: PartyActivity<State, StartingArgs>;
  }
}

(ActivityType as any)["Party"] = "party";
