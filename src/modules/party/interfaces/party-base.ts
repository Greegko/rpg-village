import { PartyOwner } from './party-owner';
import { StashID } from '../../stash/interfaces';
import { UnitID } from '../../unit/interfaces';
import { MapLocationID } from '../../world/interfaces';

export type PartyID = string;

export interface Party {
  owner: PartyOwner;
  unitIds: UnitID[];
  stashId: StashID;
  locationId: MapLocationID;
}
