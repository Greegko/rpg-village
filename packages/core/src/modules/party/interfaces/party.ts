import { PartyOwner } from './party-owner';
import { UnitID } from '../../unit/interfaces';
import { MapLocationID } from '../../world/interfaces';
import { ItemStash, ResourceStash } from '../../../models/stash';
import { ActivityID } from '../../activity';

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
