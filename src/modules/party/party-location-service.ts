import { injectable, inject } from 'inversify';
import { PartyStore, PartyID } from '@greegko/rpg-model';
import { Party } from '../../models';
import { filter } from 'ramda'; 
import { MapLocationID } from '../world/interfaces';

@injectable()
export class PartyLocationService {

  constructor(@inject('PartyStore') private partyStore: PartyStore<Party>){ }

  getPartiesOnLocation(locationId: MapLocationID): Party[] {
    return filter(x => x.locationId === locationId, this.partyStore.getState() as any);
  }

  updateLocation(partyId: PartyID, locationId: MapLocationID) {
    this.partyStore.updateParty(partyId, { locationId: locationId });
  }

}
