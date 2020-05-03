import { Command, PartyOwner, WorldCommand, Party, GameState } from '@rpg-village/core';
import { sample } from '../lib';
import { values, filter, map } from 'ramda';
import { idlePartiesSelector, worldSelector, partiesSelector } from '../game';

export class PlayerAI {
  private gameState: GameState;

  execute = (gameState: GameState): Command[] => {
    this.gameState = gameState;

    const parties = idlePartiesSelector(gameState);
    const playerParties = filter(party => party.owner === PartyOwner.Player, parties);
    return map(party => this.executeParty(party), values(playerParties));
  }

  private executeParty(party: Party): Command {
    const world = worldSelector(this.gameState);
    const parties = partiesSelector(this.gameState);
    const partyLocation = world[party.locationId];
    if (!partyLocation.explored) {
      return { command: WorldCommand.Explore, args: { partyId: party.id } };
    }

    const enemyParty = values(parties).find(x => x.locationId === partyLocation.id && x.id !== party.id && x.owner === PartyOwner.Enemy);
    if (enemyParty) {
      return { command: WorldCommand.Battle, args: { locationId: partyLocation.id } }
    }

    if (partyLocation.explored) {
      const newLocation = sample(this.getUnexploredLocation());
      return { command: WorldCommand.Travel, args: { partyId: party.id, targetLocationId: newLocation.id } };
    }
  }

  private getUnexploredLocation() {
    return values(this.gameState.world).filter(location => !location.explored);
  }
};
