import { injectable } from "inversify";
import { any, evolve, mergeLeft, values, without } from "rambda";

import { EventSystem } from "@core";

import { Stash, StashHandler } from "@features/stash";
import { Unit, UnitID, UnitService, UnitStore, isAlive } from "@features/unit";
import { Loot } from "@models";

import { Party, PartyEvent, PartyID } from "./interfaces";
import { PartyStore } from "./party-store";

@injectable()
export class PartyService {
  constructor(
    private partyStore: PartyStore,
    private unitStore: UnitStore,
    private unitService: UnitService,
    private eventSystem: EventSystem,
  ) {}

  getStash(partyId: PartyID) {
    return new StashHandler({
      get: () => this.partyStore.get(partyId).stash,
      update: stashUpdater => this.partyStore.update(partyId, evolve({ stash: stashUpdater })),
    });
  }

  getPartyForUnitId(unitId: UnitID): Party | undefined {
    return values(this.partyStore.getState()).find(x => x.unitIds.includes(unitId));
  }

  isPartyAlive(partyId: PartyID): boolean {
    return any(isAlive, this.getPartyUnits(partyId));
  }

  gainXp(partyId: PartyID, xp: number) {
    const partyUnits = this.getPartyUnits(partyId);

    partyUnits.forEach(unit => this.unitService.gainXpUnit(unit.id, Math.floor(xp / partyUnits.length)));
  }

  collectLoot(partyId: PartyID, loot: Loot) {
    this.getStash(partyId).addResource(loot.resource);
  }

  createParty(party: Omit<Party, "id">) {
    return this.partyStore.add(party);
  }

  takePartyStash(partyId: PartyID): Stash {
    return this.getStash(partyId).takeStash();
  }

  mergeWithParty(partyId: PartyID, otherPartyId: PartyID) {
    const otherParty = this.partyStore.get(otherPartyId);
    const partyStash = this.getStash(partyId);
    partyStash.addResource(otherParty.stash.resource);
    partyStash.addItems(otherParty.stash.items);

    this.partyStore.update(
      partyId,
      evolve({
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
