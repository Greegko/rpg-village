import { Command, PartyOwner, WorldCommand, Party, GameState } from '@rpg-village/core';
import { sample } from '../lib';
import { values } from 'ramda';

export class PlayerAI {
  private gameState: GameState;

  execute(gameState: GameState): Command[] {
    this.gameState = gameState;

    const parties = this.getIdlePlayerParties();
    return parties.map(party => this.executeParty(party));
  }

  private getIdlePlayerParties() {
    const playerParties = values(this.gameState.parties).filter(party => party.owner === PartyOwner.Player);
    const activities = values(this.gameState.activities);

    return playerParties.filter(party => !activities.some(activity => activity.state.partyId === party.id));
  }

  private executeParty(party: Party): Command {
    const newLocation = sample(this.getUnexploredLocation());
    return { command: WorldCommand.Explore, args: { partyId: party.id, locationId: newLocation.id } };
  }

  private getUnexploredLocation() {
    return values(this.gameState.world).filter(location => !location.explored);
  }
};
