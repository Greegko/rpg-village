import { UnitID } from '@modules/unit/interfaces';
import { MapLocationID } from '@modules/world/interfaces';
import { ItemStash, ResourceStash } from '@models/stash';
import { ActivityID } from '@modules/activity';
import { PartyOwner } from './party-owner';

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
