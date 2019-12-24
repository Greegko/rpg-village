import { Event } from "../../../models";

export enum GameEvents {
  TurnEvent = 'game.turn',
  FastForward = 'game.fastForward',
  NewGame = 'game.newGame'
}

export interface FastForwardEventArgs { turns: number; };
export interface FastForwardEvent extends Event { event: 'game.fastForward', args: FastForwardEventArgs };
