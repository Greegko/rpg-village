import { injectable, inject } from 'inversify';
import { PartyID } from "./interfaces";
import { PartyStore } from "./party-store";
import { WithID } from '../../models';
import { Party } from '../party';
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
