import { injectable } from "inversify";
import { assoc } from "rambda";

import { EntityStore } from "@core";

import { ActivityID } from "@modules/activity";
import { MapLocationID } from "@modules/map";

import { Party, PartyID } from "./interfaces";

@injectable()
export class PartyStore extends EntityStore<PartyID, Party> {
  setLocation(partyId: PartyID, locationId: MapLocationID) {
    this.update(partyId, assoc("locationId", locationId));
  }

  clearActivity(partyId: PartyID) {
    this.update(partyId, { activityId: undefined });
  }

  setActivity(partyId: PartyID, activityId: ActivityID) {
    this.update(partyId, assoc("activityId", activityId));
  }
}
