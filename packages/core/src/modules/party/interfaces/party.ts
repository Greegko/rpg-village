import { ItemStash, ResourceStash } from "@models/stash";
import { ActivityID } from "@modules/activity";
import { MapLocationID } from "@modules/map/interfaces";
import { UnitID } from "@modules/unit/interfaces";

import { PartyOwner } from "./party-owner";

export type PartyID = string;
export type PartyStash = ItemStash & ResourceStash;

export interface Party {
  id: PartyID;
  activityId?: ActivityID;
  owner: PartyOwner;
  unitIds: UnitID[];
  stash: PartyStash;
  locationId: MapLocationID;
}
