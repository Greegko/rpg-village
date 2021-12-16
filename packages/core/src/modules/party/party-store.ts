import { assoc } from "ramda";
import { injectable } from "inversify";
import { EntityStore } from "@core/store";
import { ActivityID } from "@modules/activity";
import { MapLocationID } from "@modules/world";
import { Party, PartyID } from "./interfaces";

@injectable()
export class PartyStore extends EntityStore<Party> {
  setLocation(partyId: PartyID, locationId: MapLocationID) {
    this.update(partyId, assoc("locationId", locationId));
  }

  setActivity(partyId: PartyID, activityId: ActivityID | undefined) {
    this.update(partyId, assoc("activityId", activityId));
  }
}
