import { injectable, inject } from 'inversify';
import { PartyStore, PartyID, WithID } from "../../../core-src";
import { Party } from '../../models';
import { filter, propEq, values } from 'ramda';
import { MapLocationID } from '../world/interfaces';

@injectable()
export class PartyLocationService {

  constructor(@inject('PartyStore') private partyStore: PartyStore<Party>) { }

  getPartiesOnLocation(locationId: MapLocationID): WithID<Party>[] {
    const parties = this.partyStore.getState();
    return values(filter(propEq('locationId', locationId), parties));
  }

  updateLocation(partyId: PartyID, locationId: MapLocationID): void {
    this.partyStore.update(partyId, { locationId });
  }

}
