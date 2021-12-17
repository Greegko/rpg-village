import { filter, propEq, values, any, without } from "ramda";
import { injectable } from "inversify";
import { MapLocationID } from "@modules/world";
import { Loot } from "@models/loot";
import { Unit, isAlive, UnitStore, UnitID } from "@modules/unit";
import { addResource } from "@models/stash";
import { ActivityStore } from "@modules/activity";
import { Party, PartyID, PartyStash } from "./interfaces";
import { PartyStore } from "./party-store";

@injectable()
export class PartyService {
  constructor(private partyStore: PartyStore, private unitStore: UnitStore, private activityStore: ActivityStore) {}

  getPartiesOnLocation(locationId: MapLocationID): Party[] {
    const parties = this.partyStore.getState();
    return values(filter(propEq("locationId", locationId), parties));
  }

  isPartyAlive(partyId: PartyID): boolean {
    return any(isAlive, this.getPartyUnits(partyId));
  }

  collectLoot(partyId: PartyID, loot: Loot) {
    const partyUnits = this.getPartyUnits(partyId);

    partyUnits.forEach(unit => this.unitStore.gainXpUnit(unit.id, Math.floor(loot.xp / partyUnits.length)));

    this.partyStore.update(partyId, party => ({
      stash: addResource(party.stash, loot.resource),
    }));
  }

  createParty(party: Omit<Party, "id">) {
    this.partyStore.add(party);
  }

  clearPartyStash(partyId: PartyID): PartyStash {
    const stash = this.partyStore.get(partyId).stash;
    this.partyStore.update(partyId, () => ({
      stash: { resource: { gold: 0 }, items: [] },
    }));

    return stash;
  }

  removeParty(partyId: PartyID) {
    this.removePartyActivity(partyId);
    this.partyStore.remove(partyId);
  }

  getPartyUnits(partyId: PartyID): Unit[] {
    return this.partyStore.get(partyId).unitIds.map(unitId => this.unitStore.get(unitId));
  }

  removeUnitFromParty(partyId: PartyID, unitIds: UnitID[]) {
    this.partyStore.update(partyId, party => ({ unitIds: without(unitIds, party.unitIds) }));
  }

  private removePartyActivity(partyId: PartyID) {
    const activityId = this.partyStore.get(partyId).activityId;

    if (activityId) {
      this.activityStore.remove(activityId);
    }
  }
}
