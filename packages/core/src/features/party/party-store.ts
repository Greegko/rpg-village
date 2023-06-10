import { injectable } from "inversify";
import { assoc } from "rambda";

import { EntityStore } from "@core";

import { ActivityID } from "@features/activity";

import { Party, PartyID } from "./interfaces";

@injectable()
export class PartyStore extends EntityStore<PartyID, Party> {
  clearActivity(partyId: PartyID) {
    this.update(partyId, { activityId: undefined });
  }

  setActivity(partyId: PartyID, activityId: ActivityID) {
    this.update(partyId, assoc("activityId", activityId));
  }
}
