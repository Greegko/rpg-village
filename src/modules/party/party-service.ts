import { injectable, inject } from 'inversify';
import { Party, PartyID } from './interfaces';
import { merge } from 'ramda';
import { PartyStore } from './party-store';
import { MapLocationID } from '../world/interfaces';
import { WithID } from '../../models';
import { filter, propEq, values } from 'ramda';

@injectable()
export class PartyService {
  constructor(
    @inject('PartyStore') private partyStore: PartyStore,
  ) { }

  getPartiesOnLocation(locationId: MapLocationID): WithID<Party>[] {
    const parties = this.partyStore.getState();
    return values(filter(propEq('locationId', locationId), parties));
  }

  getParty(partyId: PartyID): Party {
    return this.partyStore.get(partyId);
  }

  createParty(party: Partial<Party>) {
    this.partyStore.add(merge(party as Party, { stash: { resource: {}, items: [] } }));
  }

  updateParty(partyId: PartyID, party: Partial<Party>) {
    this.partyStore.update(partyId, party);
  }

  removeParty(partyId: PartyID) {
    this.partyStore.remove(partyId);
  }
}
