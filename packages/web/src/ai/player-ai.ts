import { values, filter, map, partition, sum } from "ramda";
import {
  Command,
  PartyOwner,
  WorldCommand,
  Party,
  GameState,
  VillageCommand,
  calculateUnitStrength,
  MapLocation,
} from "@rpg-village/core";
import { sample } from "../lib";
import {
  idlePartiesSelector,
  worldSelector,
  partiesSelector,
  villageSelector,
  heroUnitsSelector,
  unitsSelector,
} from "../game";

export class PlayerAI {
  execute = (gameState: GameState): Command[] => {
    const parties = idlePartiesSelector(gameState);
    const playerParties = filter(party => party.owner === PartyOwner.Player, parties);
    return map(party => this.executeParty(gameState, party), values(playerParties));
  };

  private executeParty(gameState: GameState, party: Party): Command {
    return (this.handleNewLocation(gameState, party) || this.handleNextLocationSearch(gameState, party))!;
  }

  private handleNewLocation(gameState: GameState, party: Party): Command | undefined {
    const world = worldSelector(gameState);
    const partyLocation = world[party.locationId];

    if (!partyLocation.explored) {
      return { command: WorldCommand.Explore, args: { partyId: party.id } };
    }

    const [userParties, enemyParties] = this.getPartiesOnLocation(gameState, partyLocation.id);

    if (userParties.length !== 1 || enemyParties.length !== 1) return;

    if (this.getPartyStrength(gameState, userParties[0]!.id) > this.getPartyStrength(gameState, enemyParties[0]!.id)) {
      return { command: WorldCommand.Battle, args: { locationId: partyLocation.id } };
    }
  }

  private handleNextLocationSearch(gameState: GameState, party: Party): Command | undefined {
    const world = worldSelector(gameState);
    const village = villageSelector(gameState);
    const heroes = heroUnitsSelector(gameState);

    if (party.unitIds.some(x => heroes[x].hp < heroes[x].maxhp * 0.1)) {
      if (village.locationId === party.locationId) {
        return { command: VillageCommand.HealParty, args: { partyId: party.id } };
      } else {
        return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }
    }

    const partyStrength = this.getPartyStrength(gameState, party.id);

    const unexploredLocations = values(world).filter(location => !location.explored) as MapLocation[];
    const weakerUnitLocations = values(world).filter(location => {
      const [, [enemyParty]] = this.getPartiesOnLocation(gameState, location.id);

      if (!enemyParty) return false;

      const enemyPartyStrength = this.getPartyStrength(gameState, enemyParty.id);

      return partyStrength > enemyPartyStrength;
    }) as MapLocation[];

    const possibleLocations = [...unexploredLocations, ...weakerUnitLocations].filter(location =>
      this.isLocationAccessible(gameState, location.id),
    );

    const newUnexploredLocation = sample(possibleLocations);

    if (newUnexploredLocation) {
      return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: newUnexploredLocation.id } };
    } else {
      return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
    }
  }

  private getPartiesOnLocation(gameState: GameState, locationId: string): [Party[], Party[]] {
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

  private isLocationAccessible(gameState: GameState, locationId: string): boolean {
    const locations = worldSelector(gameState);
    const targetLocation = locations[locationId] as MapLocation;

    const neighboursTiles = (values(locations) as MapLocation[]).filter(
      location =>
        Math.abs(location.x - targetLocation.x) <= 1 &&
        location.x !== targetLocation.x &&
        Math.abs(location.y - targetLocation.y) <= 1 &&
        location.y !== targetLocation.y,
    );

    return neighboursTiles.some(location => this.getPartiesOnLocation(gameState, location.id)[1].length === 0);
  }
}
