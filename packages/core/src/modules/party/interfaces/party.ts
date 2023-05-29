import { ItemStash, ResourceStash } from "@models";
import { ActivityID } from "@modules/activity";
import { UnitID } from "@modules/unit";

import { PartyOwner } from "./party-owner";

export type PartyID = string;
export type PartyStash = ItemStash & ResourceStash;

export interface Party {
  id: PartyID;
  activityId?: ActivityID;
  owner: PartyOwner;
  unitIds: UnitID[];
  stash: PartyStash;
}
