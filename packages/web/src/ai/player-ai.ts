import { values, filter, map } from "ramda";
import { Command, PartyOwner, WorldCommand, Party, GameState, VillageActivity } from "@rpg-village/core";
import { sample } from "../lib";
import { idlePartiesSelector, worldSelector, partiesSelector, villageSelector, heroUnitsSelector } from "../game";

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
    const partyLocation = world[party.locationId];

    if (!partyLocation.explored) {
      return { command: WorldCommand.Explore, args: { partyId: party.id } };
    }

    const enemyParty = values(parties).find(
      x => x.locationId === partyLocation.id && x.id !== party.id && x.owner === PartyOwner.Enemy,
    );
    if (enemyParty) {
      return { command: WorldCommand.Battle, args: { locationId: partyLocation.id } };
    }
  }

  private handleNextLocationSearch(gameState: GameState, party: Party): Command | undefined {
    const world = worldSelector(gameState);
    const village = villageSelector(gameState);
    const heroes = heroUnitsSelector(gameState);

    if (party.unitIds.some(x => heroes[x].hp < heroes[x].maxhp * 0.1)) {
      if (village.locationId === party.locationId) {
        return { command: VillageActivity.Heal, args: { partyId: party.id } };
      } else {
        return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }
    }

    const unexploredLocations = values(world).filter(location => !location.explored);
    const newLocation = sample(unexploredLocations);
    return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: newLocation.id } };
  }
}
