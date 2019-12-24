import { injectable, inject } from 'inversify';
import { PartyBase, PartyID } from './interfaces';
import { merge } from 'ramda';
import { StashService } from '../stash';
import { PartyStore } from './party-store';

@injectable()
export class PartyService<Party extends PartyBase = PartyBase> {
  constructor(
    @inject('PartyStore') private partyStore: PartyStore<Party>,
    @inject('StashService') private stashService: StashService
  ){ }

  getParty(partyId: PartyID): Party {
    return this.partyStore.get(partyId);
  }

  createParty(party: Partial<Party>) {
    const stashId = this.stashService.createStash();
    this.partyStore.add(merge(party as Party, { stashId }));
  }

  updateParty(partyId: PartyID, party: Partial<Party>) {
    this.partyStore.update(partyId, party);
  }

  removeParty(partyId: PartyID) {
    this.partyStore.remove(partyId);
  }
}
