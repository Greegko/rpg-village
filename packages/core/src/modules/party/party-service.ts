import { injectable, inject } from 'inversify';
import { Party, PartyID, PartyStash } from './interfaces';
import { PartyStore } from './party-store';
import { MapLocationID } from '../world/interfaces';
import { Loot } from '../../models';
import { filter, propEq, values } from 'ramda';
import { Unit, UnitService, isAlive } from '../unit';
import { any, assoc } from 'ramda';
import { addResource } from '../../models/stash';
import { ActivityID } from '../activity';

@injectable()
export class PartyService {
  constructor(
    @inject('PartyStore') private partyStore: PartyStore,
    @inject('UnitService') private unitService: UnitService,
  ) { }

  getPartiesOnLocation(locationId: MapLocationID): Party[] {
    const parties = this.partyStore.getState();
    return values(filter(propEq('locationId', locationId), parties));
  }

  getParty(partyId: PartyID): Party {
    return this.partyStore.get(partyId);
  }

  isPartyAlive(partyId: PartyID): boolean {
    return any(isAlive, this.getPartyUnits(partyId));
  }

  collectLoot(partyId: PartyID, loot: Loot) {
    const partyAliveUnits = this.getPartyUnits(partyId).filter(isAlive);

    partyAliveUnits.forEach(unit => this.unitService.gainXpUnit(unit.id, Math.floor(loot.xp / partyAliveUnits.length)));

    this.partyStore.update(partyId, party => ({ stash: addResource(party.stash, loot.resource) }));
  }

  createParty(party: Omit<Party, 'id'>) {
    this.partyStore.add(party);
  }

  setPartyLocation(partyId: PartyID, locationId: MapLocationID) {
    this.partyStore.update(partyId, assoc('locationId', locationId));
  }

  setPartyActivity(partyId: PartyID, activityId: ActivityID) {
    this.partyStore.update(partyId, assoc('activityId', activityId));
  }

  clearPartyStash(partyId: PartyID): PartyStash {
    const stash = this.getParty(partyId).stash;
    this.partyStore.update(partyId, () => ({ stash: { resource: { gold: 0 }, items: [] } }));

    return stash;
  }

  removeParty(partyId: PartyID) {
    this.partyStore.remove(partyId);
  }

  getPartyUnits(partyId: PartyID): Unit[] {
    return this.getParty(partyId).unitIds.map(unitId => this.unitService.getUnit(unitId));
  }
}
