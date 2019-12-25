import { injectable, inject } from 'inversify';
import { Party, PartyID } from './interfaces';
import { merge } from 'ramda';
import { PartyStore } from './party-store';

@injectable()
export class PartyService {
  constructor(
    @inject('PartyStore') private partyStore: PartyStore,
  ) { }

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
