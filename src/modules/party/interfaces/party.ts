import { PartyOwner } from './party-owner';
import { UnitID } from '../../unit/interfaces';
import { MapLocationID } from '../../world/interfaces';
import { ItemStash, ResourceStash } from '../../../models/stash';

export type PartyID = string;
export type PartyStash = ItemStash & ResourceStash;

export interface Party {
  id: PartyID;
  owner: PartyOwner;
  unitIds: UnitID[];
  stash: PartyStash;
  locationId: MapLocationID;
}
