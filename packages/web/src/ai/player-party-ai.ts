import { filter, partition, sum, values } from "ramda";

import {
  Command,
  GameState,
  MapCommand,
  MapLocation,
  Party,
  PartyOwner,
  VillageCommand,
  calculateUnitStrength,
} from "@rpg-village/core";

import { PartyPreference } from "@web/store/ai";
import {
  heroUnitsSelector,
  mapByPartyIdSelector,
  mapLocationByIdSelector,
  mapLocationsByMapIdSelector,
  mapLocationsByMapLocationIdSelector,
  partiesSelector,
  unitsSelector,
  villageSelector,
} from "@web/store/game";

import { sample } from "../lib";

export class PlayerPartyAI {
  execute(gameState: GameState, party: Party, partyPreference: PartyPreference): Command | undefined {
    if (partyPreference === PartyPreference.Idle) return;

    const village = villageSelector(gameState);
    if (partyPreference === PartyPreference.MoveToVillage) {
      if (village.locationId !== party.locationId) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }

      return this.handleVillageLocation(gameState, party);
    }

    return (this.handleVillageLocation(gameState, party) ||
      this.handleNewLocation(gameState, party) ||
      this.handleNextLocationSearch(gameState, party))!;
  }

  private handleNewLocation(gameState: GameState, party: Party): Command | undefined {
    const partyLocation = mapLocationByIdSelector(gameState, party.locationId);

    if (!partyLocation.explored) {
      return { command: MapCommand.Explore, args: { partyId: party.id } };
    }

    return this.handleBattleCommand(gameState, party);
  }

  private handleBattleCommand(gameState: GameState, party: Party): Command | undefined {
    const partyLocation = mapLocationByIdSelector(gameState, party.locationId);
    const [userParties, enemyParties] = this.getPartiesOnLocation(gameState, partyLocation.id);

    if (userParties.length !== 1 || enemyParties.length !== 1) return;

    if (this.getPartyStrength(gameState, userParties[0]!.id) > this.getPartyStrength(gameState, enemyParties[0]!.id)) {
      return { command: MapCommand.Battle, args: { locationId: partyLocation.id } };
    }
  }

  private handleVillageLocation(gameState: GameState, party: Party): Command | undefined {
    const village = villageSelector(gameState);

    if (party.locationId !== village.locationId) return;

    const heroes = heroUnitsSelector(gameState);
    if (party.unitIds.some(x => heroes[x].hp < heroes[x].maxhp * 0.1)) {
      return { command: VillageCommand.HealParty, args: { partyId: party.id } };
    }
  }

  private handleNextLocationSearch(gameState: GameState, party: Party): Command | undefined {
    const map = mapByPartyIdSelector(gameState, party.id);
    const mapLocations = mapLocationsByMapIdSelector(gameState, map!.id);
    const village = villageSelector(gameState);
    const heroes = heroUnitsSelector(gameState);

    if (party.unitIds.some(x => heroes[x].hp < heroes[x].maxhp * 0.1)) {
      if (village.locationId !== party.locationId) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }
    }

    const partyStrength = this.getPartyStrength(gameState, party.id);

    const unexploredLocations = filter(location => !location.explored, mapLocations);
    const weakerUnitLocations = filter(location => {
      const [, [enemyParty]] = this.getPartiesOnLocation(gameState, location.id);

      if (!enemyParty) return false;

      const enemyPartyStrength = this.getPartyStrength(gameState, enemyParty.id);

      return partyStrength > enemyPartyStrength;
    }, mapLocations);

    const possibleLocations = [...unexploredLocations, ...weakerUnitLocations].filter(location =>
      this.isEnemyOnTheLocation(gameState, location.id),
    );

    const newUnexploredLocation = sample(possibleLocations);

    if (newUnexploredLocation) {
      return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: newUnexploredLocation.id } };
    } else {
      return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
    }
  }

  private getPartiesOnLocation(
    gameState: GameState,
    locationId: string,
  ): [UserParties: Party[], EnemyParties: Party[]] {
    const parties = partiesSelector(gameState);

    return partition(
      party => party.owner === PartyOwner.Player,
      values(parties).filter(x => x.locationId === locationId),
    ) as [Party[], Party[]];
  }

  private getPartyStrength(gameState: GameState, partyId: string) {
    const parties = partiesSelector(gameState);
    const units = unitsSelector(gameState);

    const partyUnits = (parties[partyId] as Party).unitIds.filter(unitId => units[unitId]).map(unitId => units[unitId]);

    return sum(partyUnits.map(calculateUnitStrength));
  }

  private isEnemyOnTheLocation(gameState: GameState, mapLocationId: string): boolean {
    const mapLocations = mapLocationsByMapLocationIdSelector(gameState, mapLocationId);
    const targetLocation = mapLocationByIdSelector(gameState, mapLocationId);

    const neighboursTiles = (values(mapLocations) as MapLocation[]).filter(
      location =>
        Math.abs(location.x - targetLocation.x) <= 1 &&
        location.x !== targetLocation.x &&
        Math.abs(location.y - targetLocation.y) <= 1 &&
        location.y !== targetLocation.y,
    );

    return neighboursTiles.some(location => this.getPartiesOnLocation(gameState, location.id)[1].length === 0);
  }
}
