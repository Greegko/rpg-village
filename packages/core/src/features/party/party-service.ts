import { injectable } from "inversify";
import { any, evolve, mergeLeft, without } from "rambda";

import { Unit, UnitID, UnitService, UnitStore, isAlive } from "@features/unit";
import { Loot, addResource } from "@models";

import { EventSystem } from "../../core/event";
import { Party, PartyEvent, PartyID, PartyStash } from "./interfaces";
import { PartyStore } from "./party-store";

@injectable()
export class PartyService {
  constructor(
    private partyStore: PartyStore,
    private unitStore: UnitStore,
    private unitService: UnitService,
    private eventSystem: EventSystem,
  ) {}

  isPartyAlive(partyId: PartyID): boolean {
    return any(isAlive, this.getPartyUnits(partyId));
  }

  gainXp(partyId: PartyID, xp: number) {
    const partyUnits = this.getPartyUnits(partyId);

    partyUnits.forEach(unit => this.unitService.gainXpUnit(unit.id, Math.floor(xp / partyUnits.length)));
  }

  collectLoot(partyId: PartyID, loot: Loot) {
    this.partyStore.update(partyId, party => ({
      stash: addResource(party.stash, loot.resource),
    }));
  }

  createParty(party: Omit<Party, "id">) {
    return this.partyStore.add(party);
  }

  clearPartyStash(partyId: PartyID): PartyStash {
    const stash = this.partyStore.get(partyId).stash;
    this.partyStore.update(partyId, () => ({
      stash: { resource: { gold: 0, soul: 0 }, items: [] },
    }));

    return stash;
  }

  mergeWithParty(partyId: PartyID, otherPartyId: PartyID) {
    const otherParty = this.partyStore.get(otherPartyId);
    this.partyStore.update(
      partyId,
      evolve({
        stash: mergeLeft(otherParty.stash),
        unitIds: mergeLeft(otherParty.unitIds),
      }),
    );

    this.disbandParty(otherPartyId);
  }

  disbandParty(partyId: PartyID) {
    this.eventSystem.fire(PartyEvent.Disband, { partyId });
    this.partyStore.remove(partyId);
  }

  getPartyUnits(partyId: PartyID): Unit[] {
    return this.partyStore.get(partyId).unitIds.map(unitId => this.unitStore.get(unitId));
  }

  removeUnitFromParty(partyId: PartyID, unitIds: UnitID[]) {
    this.partyStore.update(partyId, party => ({ unitIds: without(unitIds, party.unitIds) }));
  }
}
