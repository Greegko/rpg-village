import { injectable, inject } from 'inversify';
import { PartyStore, PartyID } from '@greegko/rpg-model';
import { Party } from '../../models';
import { filter, propEq } from 'ramda'; 
import { MapLocationID } from '../world/interfaces';

@injectable()
export class PartyLocationService {

  constructor(@inject('PartyStore') private partyStore: PartyStore<Party>){ }

  getPartiesOnLocation(locationId: MapLocationID): Party[] {
    return filter(propEq('locationId', locationId), this.partyStore.getState() as any);
  }

  updateLocation(partyId: PartyID, locationId: MapLocationID): void {
    this.partyStore.updateParty(partyId, { locationId });
  }

}
