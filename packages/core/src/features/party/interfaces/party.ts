import { ActivityID } from "@features/activity";
import { UnitID } from "@features/unit";
import { ItemStash, ResourceStash } from "@models";

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
