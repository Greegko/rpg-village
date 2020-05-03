import { Command, PartyOwner, WorldCommand, Party, GameState } from '@rpg-village/core';
import { sample } from '../lib';
import { values, filter, map } from 'ramda';
import { idlePartiesSelector } from '../game';

export class PlayerAI {
  private gameState: GameState;

  execute = (gameState: GameState): Command[] => {
    this.gameState = gameState;

    const parties = idlePartiesSelector(gameState);
    const playerParties = filter(party => party.owner === PartyOwner.Player, parties);
    return map(party => this.executeParty(party), values(playerParties));
  }

  private executeParty(party: Party): Command {
    const newLocation = sample(this.getUnexploredLocation());
    return { command: WorldCommand.Explore, args: { partyId: party.id, locationId: newLocation.id } };
  }

  private getUnexploredLocation() {
    return values(this.gameState.world).filter(location => !location.explored);
  }
};
