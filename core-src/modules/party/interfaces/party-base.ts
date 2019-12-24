import { PartyOwner } from './party-owner';
import { StashID } from '../../stash/interfaces';
import { UnitID } from '../../unit/interfaces';

export type PartyID = string;
export interface PartyBase {
  owner: PartyOwner;
  unitIds: UnitID[];
  stashId: StashID;
}
