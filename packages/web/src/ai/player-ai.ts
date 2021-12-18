import { values, filter, map, partition, sum } from "ramda";
import {
  Command,
  PartyOwner,
  WorldCommand,
  Party,
  GameState,
  VillageCommand,
  calculateUnitStrength,
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
    const parties = partiesSelector(gameState);
    const units = unitsSelector(gameState);
    const partyLocation = world[party.locationId];

    if (!partyLocation.explored) {
      return { command: WorldCommand.Explore, args: { partyId: party.id } };
    }

    const partiesOnLocation = values(parties).filter(x => x.locationId === partyLocation.id);

    if (partiesOnLocation.length !== 2) return;

    const [[userParty], [enemyParty]] = partition(
      party => party.owner === PartyOwner.Player,
      values(parties).filter(x => x.locationId === partyLocation.id),
    ) as [[Party], [Party]];

    const userPartyUnits = userParty.unitIds.map(unitId => units[unitId]);
    const enempyPartyUnits = enemyParty.unitIds.map(unitId => units[unitId]);

    console.log(sum(userPartyUnits.map(calculateUnitStrength)), sum(enempyPartyUnits.map(calculateUnitStrength)));

    if (sum(userPartyUnits.map(calculateUnitStrength)) > sum(enempyPartyUnits.map(calculateUnitStrength))) {
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

    const unexploredLocations = values(world).filter(location => !location.explored);
    const newUnexploredLocation = sample(unexploredLocations);

    if (newUnexploredLocation) {
      return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: newUnexploredLocation.id } };
    } else {
      return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
    }
  }
}
